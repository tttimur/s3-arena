const micro = require('micro')
const middleware = require('./')
const getIP = require('internal-ip')

const start = async () => {
  const server = micro(middleware)
  const port = 3000
  await server.listen(port)
  const ip = await getIP.v4()

  console.log(`listening ${ip}:${port} from dev`)
}

start()