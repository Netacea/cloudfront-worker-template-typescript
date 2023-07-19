import type {Context, Callback} from 'aws-lambda'
import Cloudfront from '@netacea/cloudfront'
import type {types as NetaceaTypes} from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'

const worker = new Cloudfront(NetaceaConfig as NetaceaTypes.CloudfrontConstructorArgs)

export const handler = async (event: NetaceaTypes.CloudfrontEvent, context: Context, callback: Callback): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false
  // Your code here

  // These should be ran at the very end of the ViewerResponse, just before calling the callback.
  const status = event.Records[0].cf.response?.status
  if (status !== undefined && Number.parseInt(status, 10) < 400) {
    worker.addNetaceaCookiesToResponse(event)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.ingest(event)
  }

  callback(null, event.Records[0].cf.response)
}
