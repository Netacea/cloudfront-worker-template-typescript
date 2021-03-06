import Cloudfront, {CloudfrontConstructorArgs} from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'
const worker = new Cloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler = async (event: any, context: any, callback: any): Promise<void> => {
  // Your code here

  // These should be ran at the very end of the OriginResponse, just before calling the callback.
  if (event.Records[0].cf.response.status >= 400) {
    worker.addNetaceaCookiesToResponse(event)
    worker.ingest(event)
  }

  return callback(null, event.Records[0].cf.response)
}
