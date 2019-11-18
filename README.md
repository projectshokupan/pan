# pan
A prototype for Shokupan, a blog designed for art. Development in this repository is finished, and pull requests will not be merged. Expect bugs.

## Overview
```
pan: Client.
otpw2: Authentication.
post: Handles creating and deleting posts.
gallery: Handles creating and posting to galleries.
cdn: Handles uploading images, as well as serving them.
```

## Running
### Prerequisites
* A desktop environment with [Node.js v12.12.0](https://nodejs.org/en/) or higher installed.
* A MongoDB instance.
* Two [JsonBox](https://jsonbox.io) box keys. Custom hosts are not supported.
* An [AWS S3](https://aws.amazon.com/s3/) access key and secret.
* [Yarn.](https://yarnpkg.com/en/)

### Setup
Go to each module and do the following,
* Copy `.env.example` to `.env` and configure.
* Copy `api.js.example` to `api.js` and configure.
	* If you are running the site locally, the defaults should work.
* *For the otpw2 module,* run `yarn install`.
* *For all other modules,* run `npm install`.

### Starting
Start each server. These must be run (roughly) in order.
* *otpw2:* run `npm start`
* *cdn:* run `npm start`
* *post:* run `npm start`
* *gallery:* run `npm start`
* *chan:* run `npm run dev`

The client should be running on port 5000 [(here)](http://localhost:5000)

### Production
If you want to deploy the app or use it in production,
* *If the servers are being run at different URLs (like, as microservices,)* 
	* Configure all  `api.js`  files to the locations that will be used in production.
	* Set the environment variable  `PORT` to `80`.
* Configure `otpw2/api.js` to the client URL that will be used in production.
* Set the environment variable `ENV` to `production`.

## Legal
[Licensed under BSD 3-Clause.](https://github.com/projectshokupan/pan/blob/master/LICENSE) [tldr.](https://www.tldrlegal.com/l/bsd3)
	
