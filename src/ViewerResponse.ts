import Cloudfront, {CloudfrontConstructorArgs} from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'
const worker = new Cloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler = async (event: any, context: any, callback: any): Promise<void> => {
  // Your code here

  // These should be ran at the very end of the ViewerResponse, just before calling the callback.
  worker.addNetaceaCookiesToResponse(event)
  worker.ingest(event)
  return callback(null, event.Records[0].cf.response)
}