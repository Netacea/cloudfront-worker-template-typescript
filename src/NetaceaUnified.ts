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
} from '@netacea/cloudfront'
import { getNetaceaConfig, getEventType } from './Utils.js'

const worker = new NetaceaCloudfront(getNetaceaConfig())

export const handler: Handler = async (
  event: CloudFrontRequestEvent,
  context: Context,
  callback: Callback<CloudFrontRequest | CloudFrontResultResponse>,
): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false

  const eventType = getEventType(event)

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
  const netaceaResponse = await worker.handleRequest(event)

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
    await worker.handleResponse(event)
  }

  callback(null, event.Records[0].cf.response)
}

export const viewerResponseHandler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => {
  if (Number(event.Records[0].cf.response.status) < 400) {
    await worker.handleResponse(event)
  }

  callback(null, event.Records[0].cf.response)
}
