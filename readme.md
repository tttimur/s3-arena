# S3-Arena server for Shortcuts

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Server to upload an image to an S3 bucket then source the S3 url to create an Are.na block.

## Prerequisits

To setup this server you will need

- [ ] AWS_ACCESS_KEY_ID ([Amazon Web Services Access Key ID](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)) 
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] AWS_REGION (Amazon Web Services S3 Bucket Region)
- [ ] AWS_BUCKET (Amazon Web Services S3 Bucket Name)
- [ ] ARENA_CHANNEL (Are.na Channel, eg: "timur-9kkz4_ts-5i")
- [ ] ARENA_ACCESS_TOKEN ([Are.na access token](https://dev.are.na/oauth/applications))

## Server Installation

0. `npm install` 
1. Rename the file `.now.sh` to `now.sh` and populate the env variables with appropriate info
2. Deploy 2 cloud

## Shortcut Flow

0. [Download Shortcuts app](https://itunes.apple.com/us/app/shortcuts/id915249334?mt=8)
1. Select Photos
2. URL: `https://your-server.net`
3. Get Content of URL
  * Advanced
  * Method: POST
  * Request Body: Form
  * Fields
    * (File) Key: Body
    * (Variable) Photos
4. Show Web Page

![Shortcut 1](https://github.com/tttimur/s3-arena/blob/master/images/0.PNG)

![Shortcut 2](https://github.com/tttimur/s3-arena/blob/master/images/1.PNG)

## License

MIT, see [LICENSE.md](http://github.com/tttimur/s3-arena/blob/master/LICENSE.md) for details.