const S3 = require('aws-sdk/clients/s3')
const { promisify } = require('util') 
const multer = require('multer')
const rp = require('request-promise')
const micro = require('micro')

require('now-env')

const config = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.AWS_BUCKET,
  Region: process.env.AWS_REGION,
  arenaChannel: process.env.ARENA_CHANNEL,
  arenaAccess: process.env.ARENA_ACCESS_TOKEN
}

const prepareFileForUpload = async (req, res) => {
  const upload = multer()
  let file

  try {
    const uploadPromise = promisify(upload.any())
    await uploadPromise(req, res)

    if (!req.files) throw 'file is empty.'
    file = req.files[0]

  } catch (err) {
    // support for only 1 file for now
    console.log('file is empty or couldnt be processed')
    micro.send(res, 500, 'File is empty OR couldnt be processed')
    return false
  }

  return file
}

const uploadToS3 = async (res, file) => {
  const d = new Date().getTime()
  const s3ObjectParams = {
    Bucket: config.Bucket,
    Key: d + file.originalname,
    ACL: 'public-read',
    ContentType: file.mimetype,
    Body: file.buffer
  }

  let s3Url

  try {
    const uploadPromise = async () => {
      return new S3().putObject(s3ObjectParams).promise().then(data => {
        return 'uploaded'
      })
    }
    const r = await uploadPromise()
    console.log('uploaded to s3 successfully')
    s3Url = encodeURI(`https://s3.${config.Region}.amazonaws.com/${config.Bucket}/${d}${file.originalname}`)

  } catch (err) {
    console.log(err)
    micro.send(res, 500, err)
    return false
  }

  return s3Url
}

const uploadToArena = async (res, url) => {
  let arenaUrl
  
  try {
    const arenaPromise = await rp.post(`https://api.are.na/v2/channels/${config.arenaChannel}/blocks?access_token=${config.arenaAccess}`, 
    { form: { source: url } })

    const arenaJSONRes = JSON.parse(arenaPromise)
    return `https://are.na/block/${arenaJSONRes.id}`

  } catch (err) {
    console.log(err)
    micro.send(res, 500, err)
    return false
  }
}



module.exports = async (req, res) => {
  let file
  let s3Url
  let arenaUrl

  try {
    file = await prepareFileForUpload(req, res)

    if (file) {
      s3Url = await uploadToS3(res, file)
      console.log(s3Url, ' s3 url')
    }

    if (s3Url) {
      arenaUrl = await uploadToArena(res, s3Url)
      micro.send(res, 200, arenaUrl)
      console.log(arenaUrl, ' arena url')
    }

  } catch (err) {
    console.log(err)
  }
}
