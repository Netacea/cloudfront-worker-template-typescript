import {
  Cloudfront as NetaceaCloudfront,
} from '@netacea/cloudfront'
import {
  type CloudFrontRequest,
  type Callback,
  type CloudFrontRequestEvent,
  type CloudFrontResultResponse,
  type Context,
  type Handler,
} from 'aws-lambda'
import {getNetaceaConfig} from './Utils.js'

const worker = new NetaceaCloudfront(getNetaceaConfig())

export const handler: Handler = async (
  event: CloudFrontRequestEvent,
  context: Context,
  callback: Callback<CloudFrontRequest | CloudFrontResultResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false

  const netaceaResponse = await worker.handleRequest(event)

  if (netaceaResponse.respondWith !== undefined) {
    callback(null, netaceaResponse.respondWith)
    return
  }

  callback(null, event.Records[0].cf.request)
}
