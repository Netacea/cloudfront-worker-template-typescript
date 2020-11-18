import Cloudfront, { CloudfrontConstructorArgs } from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'
const worker = new Cloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler = async (event: any, context: any, callback: any): Promise<any> => {
  const netaceaResponse = await worker.run(event)
  const { request, response } = netaceaResponse.Records[0].cf
  if (response !== undefined) {
    return callback(null, response)
  }
  return callback(null, request)
}
