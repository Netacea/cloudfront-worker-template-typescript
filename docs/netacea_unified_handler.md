# Netacea Unified Handler

This document contains instructions on how to deploy the Netacea CloudFront
integration using a single lambda definition that handles three event types.

This is an alternative to using individual Viewer Request, Viewer Response,
and Origin Response handlers.

Using the Unified handler is preferred when using Kinesis ingest,
as Kinesis ingest can be performed in the background while other tasks
are handled by the lambda.

## Deployment

The Unified Handler can be deployed in the same way as any of the three
individual lambdas would be, as documented in the
[Installation and Configuration](https://docs.netacea.com/netacea-plugin-information/cloudfront/installation-and-configuration)
section.

However, the Handler should be specified as `NetaceaUnified.handler`
(rather than, for example, ViewerRequest.handler).

Finally, these three triggers should specify the Unified Handler lambda:

- Viewer Request (Include body)
- Viewer Response
- Origin Response
