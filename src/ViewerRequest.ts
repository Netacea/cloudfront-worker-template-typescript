import * as config from './NetaceaConfig.json'
import {
  Cloudfront as NetaceaCloudfront,
  type CloudfrontConstructorArgs
} from '@netacea/cloudfront'
import {
  type CloudFrontRequest,
  type Callback,
  type CloudFrontRequestEvent,
  type CloudFrontResultResponse,
  type Context,
  type Handler,
} from 'aws-lambda'

const worker = new NetaceaCloudfront(config as CloudfrontConstructorArgs)

export const handler: Handler = async (
  event: CloudFrontRequestEvent,
  context: Context,
  callback: Callback<CloudFrontRequest | CloudFrontResultResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false
  const netaceaResponse = await worker.run(event)
  if (netaceaResponse.respondWith !== undefined) {
    callback(null, netaceaResponse.respondWith)
    return
  }

  callback(null, event.Records[0].cf.request)
}
