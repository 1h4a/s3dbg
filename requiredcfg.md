### Core identifiers

| Parameter | Type | Used by |
|---|---|---|
| `bucket` | `string` | All commands |
| `key` | `string` | All object-level commands |

### CopyObject

| Parameter | Type | Notes |
|---|---|---|
| `sourceBucket` | `string` | Part of `CopySource` |
| `sourceKey` | `string` | Part of `CopySource` |
| `sourceVersionId` | `string?` | Optional part of `CopySource` |

### Versioning

| Parameter | Type | Used by |
|---|---|---|
| `versionId` | `string?` | GetObject, GetObjectAcl, GetObjectTagging, HeadObject, DeleteObject |

### List operations

| Parameter | Type | Used by |
|---|---|---|
| `prefix` | `string?` | ListObjects, ListObjectsV2, ListObjectVersions |
| `delimiter` | `string?` | ListObjects, ListObjectsV2, ListObjectVersions |
| `maxKeys` | `number?` | ListObjects, ListObjectsV2, ListObjectVersions |
| `marker` | `string?` | ListObjects |
| `continuationToken` | `string?` | ListObjectsV2 |
| `startAfter` | `string?` | ListObjectsV2 |
| `keyMarker` | `string?` | ListObjectVersions |
| `versionIdMarker` | `string?` | ListObjectVersions |

## #Put/Upload

| Parameter | Type | Used by |
|---|---|---|
| `body` | `string \| Blob \| ReadableStream \| Buffer` | PutObject, PostObject |
| `contentType` | `string?` | PutObject, PostObject |
| `contentDisposition` | `string?` | PutObject |
| `contentEncoding` | `string?` | PutObject |
| `cacheControl` | `string?` | PutObject, CopyObject |
| `metadata` | `Record<string, string>?` | PutObject, CopyObject |
| `storageClass` | `string?` | PutObject, CopyObject |

### ACL

| Parameter | Type | Used by |
|---|---|---|
| `acl` | `string?` | PutObjectAcl, PutObject, CopyObject (`"private" \| "public-read" \| ...`) |
| `grantRead` | `string?` | PutObjectAcl |
| `grantWrite` | `string?` | PutObjectAcl |
| `grantReadAcp` | `string?` | PutObjectAcl |
| `grantWriteAcp` | `string?` | PutObjectAcl |
| `grantFullControl` | `string?` | PutObjectAcl |

### Tagging

| Parameter | Type | Used by |
|---|---|---|
| `tags` | `Record<string, string>?` | PutObjectTagging |

### Batch delete

| Parameter | Type | Used by |
|---|---|---|
| `deleteObjects` | `{ key: string; versionId?: string }[]` | DeleteObjects |
| `quiet` | `boolean?` | DeleteObjects (suppress per-key response) |

### Response modifiers (GetObject)

| Parameter | Type | Used by |
|---|---|---|
| `range` | `string?` | GetObject (`"bytes=0-499"`) |
| `ifMatch` | `string?` | GetObject, HeadObject |
| `ifNoneMatch` | `string?` | GetObject, HeadObject |
| `ifModifiedSince` | `Date?` | GetObject, HeadObject |
| `ifUnmodifiedSince` | `Date?` | GetObject, HeadObject |
| `responseCacheControl` | `string?` | GetObject |
| `responseContentDisposition` | `string?` | GetObject |
| `responseContentEncoding` | `string?` | GetObject |
| `responseContentLanguage` | `string?` | GetObject |
| `responseContentType` | `string?` | GetObject |
| `responseExpires` | `Date?` | GetObject |

### Aggregate type

```typescript
export type S3CommandParams = {
  // Core
  bucket: string;
  key?: string;

  // Copy
  sourceBucket?: string;
  sourceKey?: string;
  sourceVersionId?: string;

  // Versioning
  versionId?: string;

  // List
  prefix?: string;
  delimiter?: string;
  maxKeys?: number;
  marker?: string;
  continuationToken?: string;
  startAfter?: string;
  keyMarker?: string;
  versionIdMarker?: string;

  // Upload body
  body?: string | Blob | ReadableStream | Buffer;
  contentType?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
  storageClass?: string;

  // ACL
  acl?: string;
  grantRead?: string;
  grantWrite?: string;
  grantReadAcp?: string;
  grantWriteAcp?: string;
  grantFullControl?: string;

  // Tagging
  tags?: Record<string, string>;

  // Batch delete
  deleteObjects?: { key: string; versionId?: string }[];
  quiet?: boolean;

  // Conditional / response overrides
  range?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
  ifModifiedSince?: Date;
  ifUnmodifiedSince?: Date;
  responseCacheControl?: string;
  responseContentDisposition?: string;
  responseContentEncoding?: string;
  responseContentLanguage?: string;
  responseContentType?: string;
  responseExpires?: Date;
};
```

That's **every configurable value** your app needs to be able to supply in order to fully construct any of the 15 listed commands.