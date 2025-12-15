# ⬆ Netacea CloudFront v6 to v7 Upgrade Guide

This template has been updated to support the **v7** release of `@netacea/cloudfront`.
This version introduces changes to the interface,
requiring updates to how the module is used.

This guide walks you through the required changes and best practices when using v7.

You can install v7 using `npm install --save @netacea/cloudfront@7`.

## What's Changed?

### 1. New Request Handler Method

Requests should now be processed by the `handleRequest` method on the
Netacea worker. This is named to be consistent with the
new `handleResponse` method - see below.

**Before (v6):**
```ts
const netaceaResponse = await worker.run(event)
```

**After (v7):**
```ts
const netaceaResponse = await worker.handleRequest(event)
```

### 2. New Response Handler Method

Responses should now be processed by the `handleResponse` method on the
Netacea worker. This new method is asynchronous and therefore must be waited.
This updated interface allows the worker to use asynchronous APIs,
such as the encryption methods available in NodeJs, during the response handler
phase - which was not possible with the old interface.

**Before (v6):**
```ts
worker.addNetaceaCookiesToResponse(event)
void worker.ingest(event)
```

**After (v7):**
```ts
await worker.handleResponse(event)
```
