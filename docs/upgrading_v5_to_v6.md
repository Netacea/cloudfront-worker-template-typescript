# ⬆ Netacea CloudFront v5 to v6 Upgrade Guide

This template has been updated to support the **v6** release of `@netacea/cloudfront`.
This version introduces changes to the interface,
requiring updates to how the module is imported, instantiated, and integrated with Lambda handlers.

This guide walks you through the required changes and best practices when using v6.

You can install v6 using `npm install --save @netacea/cloudfront@6`.

## What's Changed?

### 1. Named Import for `Cloudfront` Class

**Before (v5):**
```ts
import Cloudfront from '@netacea/cloudfront'
```

**After (v6):**
```ts
import { Cloudfront as NetaceaCloudfront } from '@netacea/cloudfront'
```

This change aligns with a shift to named exports in the new version.
`NetaceaCloudfront` is used as the import name to avoid confusion with
any official AWS CloudFront types.

---

### 2. Updated Type Imports

**Before:**
```ts
import type { types as NetaceaTypes } from '@netacea/cloudfront'
```

**After:**
```ts
import type { CloudfrontConstructorArgs } from '@netacea/cloudfront'
```

This makes type usage more granular and tree-shakeable.

---

### 3. New Class Instantiation

**Before:**
```ts
const worker = new Cloudfront(NetaceaConfig as NetaceaTypes.CloudfrontConstructorArgs)
```

**After:**
```ts
const worker = new NetaceaCloudfront(NetaceaConfig as CloudfrontConstructorArgs)
```

---

### 4. Updated Lambda Handler Types

All handler functions now use specific AWS Lambda types for clarity and compatibility with the AWS SDK.

#### ✅ Example: `OriginResponse.ts`

**Before:**
```ts
export const handler = async (event: NetaceaTypes.CloudfrontEvent, context: Context, callback: Callback): Promise<void> => { ... }
```

**After:**
```ts
export const handler: Handler = async (
  event: CloudFrontResponseEvent,
  context: Context,
  callback: Callback<CloudFrontResponse>,
): Promise<void> => { ... }
```

Similar updates apply to `ViewerRequest.ts` and `ViewerResponse.ts`.

---

### 5. Cleaned Up Promise Handling

The previous version used floating promises with a linter ignore:

```ts
// eslint-disable-next-line @typescript-eslint/no-floating-promises
worker.ingest(event)
```

**Now properly handled as:**
```ts
void worker.ingest(event)
```

---

### 6. Updated Response Flow in ViewerRequest

You should now use `respondWith` to check for blocking decisions:

```ts
const netaceaResponse = await worker.run(event)

if (netaceaResponse.respondWith !== undefined) {
  callback(null, netaceaResponse.respondWith)
  return
}
```

## ✅ Summary of Required Actions

| File | Key Changes |
|------|-------------|
| `OriginResponse.ts` | Named import, typed handler, `CloudFrontResponseEvent` |
| `ViewerRequest.ts` | Uses `respondWith`, typed handler, named import |
| `ViewerResponse.ts` | Same changes as `OriginResponse.ts` |


## 💡 Recommended

After upgrading:

- Run `tsc` to check for type errors.
- Test each CloudFront function (Viewer Request, Viewer Response, Origin Response) in staging.
- Review any custom logic interacting with `@netacea/cloudfront`.
