import type {Context, Callback} from 'aws-lambda'
import Cloudfront from '@netacea/cloudfront'
import type {types as NetaceaTypes} from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'

const worker = new Cloudfront(NetaceaConfig as NetaceaTypes.CloudfrontConstructorArgs)

export const handler = async (event: NetaceaTypes.CloudfrontEvent, context: Context, callback: Callback): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false
  // Netacea's worker needs to be run first
  const netaceaResponse = await worker.run(event)
  const {request, response} = netaceaResponse.Records[0].cf
  if (response !== undefined) {
    callback(null, response)
    return
  }

  // Your code here
  callback(null, request)
}
