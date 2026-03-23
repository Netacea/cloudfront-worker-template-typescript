import {type CloudfrontConstructorArgs} from '@netacea/cloudfront'
import type {CloudFrontRequestEvent, CloudFrontResponseEvent} from 'aws-lambda'
import * as NetaceaConfig from './NetaceaConfig.json'

type EventType = 'origin-request' | 'origin-response' | 'viewer-request' | 'viewer-response'
type CloudFrontEvent = CloudFrontRequestEvent | CloudFrontResponseEvent

export function getNetaceaConfig(): CloudfrontConstructorArgs {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return NetaceaConfig as CloudfrontConstructorArgs
}

export function getEventType(event: CloudFrontEvent): EventType {
  const eventTypeString = event.Records[0]?.cf.config.eventType?.toLowerCase()

  const validEventTypes = [
    'origin-request',
    'origin-response',
    'viewer-request',
    'viewer-response',
  ]

  if (eventTypeString && validEventTypes.includes(eventTypeString)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return eventTypeString as EventType
  }

  throw new Error(`Invalid or missing event type: ${eventTypeString}`)
}
