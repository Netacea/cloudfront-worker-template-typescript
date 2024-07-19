import * as NetaceaConfig from './NetaceaConfig.json'
import {
  Cloudfront as NetaceaCloudfront,
  type CloudfrontConstructorArgs
} from '@netacea/cloudfront'
import {
  type Callback,
  type CloudFrontResponse,
  type CloudFrontResponseEvent,
  type Context,
  type Handler,
} from 'aws-lambda'

const worker = new NetaceaCloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false
  // Your code here
  // These should be ran at the very end of the ViewerResponse, just before calling the callback.
  if (Number(event.Records[0].cf.response.status) < 400) {
    worker.addNetaceaCookiesToResponse(event)
    void worker.ingest(event)
  }

  callback(null, event.Records[0].cf.response)
}
