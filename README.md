# Netacea Cloudfront Worker Template

![Netacea Header](https://assets.ntcacdn.net/header.jpg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A simple Cloudfront worker with Netacea built in.

## 💡 Getting Started

Install required dependencies:

```bash
npm ci
```

- Insert your Netacea API and Secret key into `./src/NetaceaConfig.json`.
- Ensure you are logged into AWS CLI and that you have permission to deploy lambdas, create cloud watch log streams and modify existing cloudfront distributions

## ‼ Important

It's critical that you put have the following snippet inside each of your workers:

```javascript
  context.callbackWaitsForEmptyEventLoop = false
```

## 💻 Developing

If you need to extend or enhance the functionality of the Cloudfront Worker, the documentation can be found [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html).
Code extensions should be made in `./src/ViewerRequest.ts` and `./src/ViewerResponse.ts`.
Please ensure that as a minimum your `ViewerRequest.ts` handler contains:

```javascript
  const netaceaResponse = await worker.run(event)
  const { request, response } = netaceaResponse.Records[0].cf
  if (response !== undefined) {
    return callback(null, response)
  }
```

and your `ViewerResponse.ts` handler contains:

```javascript
  worker.addNetaceaCookiesToResponse(event)
  worker.ingest(event)
```

and your `OriginResponse.ts` handler contains:

```javascript
  worker.addNetaceaCookiesToResponse(event)
  worker.ingest(event)
```

## ❗ Issues

If you run into issues with this specific project, please feel free to file an issue [here](https://github.com/Netacea/cloudfront-worker-template-typescript/issues).
