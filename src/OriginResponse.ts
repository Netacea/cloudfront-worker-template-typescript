import {
  Cloudfront as NetaceaCloudfront,
  type CloudfrontConstructorArgs,
} from '@netacea/cloudfront'
import {
  type Callback,
  type CloudFrontResponse,
  type CloudFrontResponseEvent,
  type Context,
  type Handler,
} from 'aws-lambda'
import * as NetaceaConfig from './NetaceaConfig.json'

const worker = new NetaceaCloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false

  if (Number(event.Records[0].cf.response.status) >= 400) {
    await worker.handleResponse(event)
  }

  callback(null, event.Records[0].cf.response)
}
