/**
 * This file provides an example of how to use a single lambda definition
 * to handle multiple event types in AWS CloudFront.
 * Please see docs/netacea_unified_handler.md for more information.
 */
import {
  type CloudFrontResponse,
  type CloudFrontResponseEvent,
  type Callback,
  type CloudFrontRequest,
  type CloudFrontRequestEvent,
  type CloudFrontResultResponse,
  type Context,
  type Handler,
} from 'aws-lambda'
import {
  Cloudfront as NetaceaCloudfront,
  type CloudfrontConstructorArgs,
} from '@netacea/cloudfront'
import * as NetaceaConfig from './NetaceaConfig.json'

type EventType = 'origin-request' | 'origin-response' | 'viewer-request' | 'viewer-response'

const worker = new NetaceaCloudfront(NetaceaConfig as CloudfrontConstructorArgs)

export const handler: Handler = async (
  event: CloudFrontRequestEvent,
  context: Context,
  callback: Callback<CloudFrontRequest | CloudFrontResultResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false

  const eventType = event.Records[0]?.cf.config.eventType?.toLowerCase() as EventType

  if (eventType === 'viewer-request' || eventType === 'origin-request') {
    return viewerRequestHandler(event, context, callback)
  }

  if (eventType === 'origin-response') {
    return originResponseHandler(event, context, callback)
  }

  if (eventType === 'viewer-response') {
    return viewerResponseHandler(event, context, callback)
  }
}

export const viewerRequestHandler: Handler = async (
  event: CloudFrontRequestEvent,
  context: Context,
  callback: Callback<CloudFrontRequest | CloudFrontResultResponse>,
): Promise<void> => {
  const netaceaResponse = await worker.run(event)

  if (netaceaResponse.respondWith !== undefined) {
    callback(null, netaceaResponse.respondWith)
    return
  }

  callback(null, event.Records[0].cf.request)
}

export const originResponseHandler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => {
  if (Number(event.Records[0].cf.response.status) >= 400) {
    worker.addNetaceaCookiesToResponse(event)
    void worker.ingest(event)
  }

  callback(null, event.Records[0].cf.response)
}

export const viewerResponseHandler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => {
  if (Number(event.Records[0].cf.response.status) < 400) {
    worker.addNetaceaCookiesToResponse(event)
    void worker.ingest(event)
  }

  callback(null, event.Records[0].cf.response)
}
