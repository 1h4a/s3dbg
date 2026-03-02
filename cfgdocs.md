## Core identifiers

| Parameter | Description |
|---|---|
| `bucket` | Target S3 bucket name |
| `key` | Object key (path/filename) within the bucket |

## CopyObject

| Parameter | Description |
|---|---|
| `sourceBucket` | Bucket containing the object to copy |
| `sourceKey` | Key of the object to copy |
| `sourceVersionId` | Specific version of source object to copy |

## Versioning

| Parameter | Description |
|---|---|
| `versionId` | Specific object version to operate on |

## List operations

| Parameter | Description |
|---|---|
| `prefix` | Filter results to keys starting with this string |
| `delimiter` | Character to group keys (commonly `/` for folder-like listing) |
| `maxKeys` | Maximum number of keys to return per request |
| `marker` | Key to start listing after (pagination for ListObjects) |
| `continuationToken` | Token from previous response for pagination (ListObjectsV2) |
| `startAfter` | Key to start listing after (ListObjectsV2) |
| `keyMarker` | Key to start listing after (ListObjectVersions) |
| `versionIdMarker` | Version ID to start listing after (ListObjectVersions) |

## Put/Upload

| Parameter | Description |
|---|---|
| `body` | Object content to upload |
| `contentType` | MIME type of the object |
| `contentDisposition` | How the object should be presented (e.g., `attachment; filename="x"`) |
| `contentEncoding` | Encoding applied to the object (e.g., `gzip`) |
| `cacheControl` | Caching directives for the object |
| `metadata` | Custom key-value metadata attached to the object |
| `storageClass` | Storage tier (e.g., `STANDARD`, `GLACIER`, `INTELLIGENT_TIERING`) |

## ACL

| Parameter | Description |
|---|---|
| `acl` | Canned ACL (e.g., `private`, `public-read`) |
| `grantRead` | Grantee(s) allowed to read the object |
| `grantWrite` | Grantee(s) allowed to write (bucket-level only) |
| `grantReadAcp` | Grantee(s) allowed to read the ACL |
| `grantWriteAcp` | Grantee(s) allowed to write the ACL |
| `grantFullControl` | Grantee(s) with full permissions |

## Tagging

| Parameter | Description |
|---|---|
| `tags` | Key-value pairs for object tagging |

## Batch delete

| Parameter | Description |
|---|---|
| `deleteObjects` | Array of objects to delete (key + optional versionId) |
| `quiet` | When true, only report errors (suppress success responses) |

## Response modifiers (GetObject)

| Parameter | Description |
|---|---|
| `range` | Byte range to retrieve (e.g., `bytes=0-499`) |
| `ifMatch` | Return object only if ETag matches |
| `ifNoneMatch` | Return object only if ETag doesn't match |
| `ifModifiedSince` | Return object only if modified after this date |
| `ifUnmodifiedSince` | Return object only if unmodified since this date |
| `responseCacheControl` | Override Cache-Control header in response |
| `responseContentDisposition` | Override Content-Disposition header in response |
| `responseContentEncoding` | Override Content-Encoding header in response |
| `responseContentLanguage` | Override Content-Language header in response |
| `responseContentType` | Override Content-Type header in response |
| `responseExpires` | Override Expires header in response |