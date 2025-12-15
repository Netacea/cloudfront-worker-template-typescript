# Netacea Cloudfront Worker Template

![Netacea Header](https://assets.ntcacdn.net/header.jpg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A simple Cloudfront worker with Netacea built in.

## 💡 Getting Started

Please use NodeJs 22 for both development and production deployments.

Install required dependencies:

```bash
npm ci
```

- Insert your Netacea API and Secret key into `./src/NetaceaConfig.json`.
- Ensure you are logged into AWS CLI and that you have permission to deploy lambdas, create cloud watch log streams and modify existing cloudfront distributions

## ⬆️ Upgrading

If you're upgrading from a previous version of the Netacea CloudFront Worker Template,
most of the time you should be able to upgrade by running `npm install --save @netacea/cloudfront@latest`.

If you are upgrading from v5 to v6, then please see the
[v5 to v6 upgrade guide.](./docs/upgrading_v5_to_v6.md)

For an upgrade from v6 to v7, see the
[v6 to v7 upgrade guide.](./docs/upgrading_v6_to_v7.md)


## 💻 Developing

If you need to extend or enhance the functionality of the Cloudfront Worker, the documentation can be found [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html).
Code extensions should be made in `./src/ViewerRequest.ts` and `./src/ViewerResponse.ts`.
Please ensure that as a minimum your `ViewerRequest.ts` handler contains:

```javascript
  context.callbackWaitsForEmptyEventLoop = false
  const netaceaResponse = await worker.run(event)
  if (netaceaResponse.respondWith !== undefined) {
    callback(null, netaceaResponse.respondWith)
    return
  }
```

and your `ViewerResponse.ts` handler contains:

```javascript
  worker.addNetaceaCookiesToResponse(event)
  void worker.ingest(event)
```

and your `OriginResponse.ts` handler contains:

```javascript
  worker.addNetaceaCookiesToResponse(event)
  void worker.ingest(event)
```

### ‼ Important

It's critical you include the following snippet inside each of your workers:

```javascript
  context.callbackWaitsForEmptyEventLoop = false
```

If this snippet is not used then requests to your website could incur additional latency.

## ❗ Issues

If you run into issues with this specific project, please feel free to file an issue [here](https://github.com/Netacea/cloudfront-worker-template-typescript/issues).
