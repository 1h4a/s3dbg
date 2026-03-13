import {
    CopyObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    DeleteObjectTaggingCommand,
    GetObjectAclCommand,
    GetObjectCommand,
    GetObjectTaggingCommand,
    HeadObjectCommand,
    ListObjectVersionsCommand,
    ListObjectsCommand,
    ListObjectsV2Command,
    PutObjectAclCommand,
    PutObjectCommand,
    PutObjectTaggingCommand,
    type CopyObjectCommandInput,
    type DeleteObjectCommandInput,
    type DeleteObjectsCommandInput,
    type DeleteObjectTaggingCommandInput,
    type GetObjectAclCommandInput,
    type GetObjectCommandInput,
    type GetObjectTaggingCommandInput,
    type HeadObjectCommandInput,
    type ListObjectVersionsCommandInput,
    type ListObjectsCommandInput,
    type ListObjectsV2CommandInput,
    type PutObjectAclCommandInput,
    type PutObjectCommandInput,
    type PutObjectTaggingCommandInput,
} from "@aws-sdk/client-s3";
import type { Command } from "@smithy/smithy-client";

import { S3Client } from "@aws-sdk/client-s3";

import type { CommandConfig } from "@/lib/requests";
import { s3Requests } from "@/lib/requests";

/**
 * Generic umbrella type to include all S3 commands.
 */
type SDKS3Command = Command<any, any, any, any>;

// Util functions to parse and validate values.

function str(v: CommandConfig[string] | undefined, key: string): string {
    if (typeof v !== "string" || v.length === 0) throw new Error(`Missing or invalid ${key}`);
    return v;
}
function optStr(v: CommandConfig[string] | undefined): string | undefined {
    return typeof v === "string" && v.length > 0 ? v : undefined;
}
function optNum(v: CommandConfig[string] | undefined): number | undefined {
    return typeof v === "number" ? v : undefined;
}
function optBool(v: CommandConfig[string] | undefined): boolean | undefined {
    return typeof v === "boolean" ? v : undefined;
}
function optDate(v: CommandConfig[string] | undefined): Date | undefined {
    if (!(v instanceof Date)) return undefined;
    const t = v.getTime();
    // `parseValue` uses `new Date(1)` as the sentinel for "empty" date inputs.
    // Don't send that to S3 as a real precondition.
    if (!Number.isFinite(t) || t <= 1) return undefined;
    return v;
}

type Spec<TInput> = {
    buildInput: (config: CommandConfig) => TInput;
    create: (input: TInput) => SDKS3Command;
};

/**
 * Field specifications for all supported commands.
 *
 * Currently supports Checkpoint 1 requirements.
 */
const commandSpecs: Record<string, Spec<any>> = {
    get_object: {
        buildInput: (c: CommandConfig): GetObjectCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            IfMatch: optStr(c.mod_ifMatch),
            IfNoneMatch: optStr(c.mod_ifNoneMatch),
            IfModifiedSince: optDate(c.mod_ifModifiedSince),
            IfUnmodifiedSince: optDate(c.mod_ifUnmodifiedSince),
            Range: optStr(c.mod_range),
            ResponseCacheControl: optStr(c.mod_response_cache_control),
            ResponseContentDisposition: optStr(c.mod_response_content_disposition),
            ResponseContentEncoding: optStr(c.mod_response_content_encoding),
            ResponseContentLanguage: optStr(c.mod_response_content_language),
            ResponseContentType: optStr(c.mod_response_content_type),
            ResponseExpires: optDate(c.mod_response_expires),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new GetObjectCommand(input),
    },

    get_object_acl: {
        buildInput: (c: CommandConfig): GetObjectAclCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new GetObjectAclCommand(input),
    },

    get_object_tagging: {
        buildInput: (c: CommandConfig): GetObjectTaggingCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new GetObjectTaggingCommand(input),
    },

    // 4) HeadObject
    head_object: {
        buildInput: (c: CommandConfig): HeadObjectCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            IfMatch: optStr(c.mod_ifMatch),
            IfNoneMatch: optStr(c.mod_ifNoneMatch),
            IfModifiedSince: optDate(c.mod_ifModifiedSince),
            IfUnmodifiedSince: optDate(c.mod_ifUnmodifiedSince),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new HeadObjectCommand(input),
    },

    list_objects: {
        buildInput: (c: CommandConfig): ListObjectsCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Prefix: optStr(c.list_prefix),
            Delimiter: optStr(c.list_delimiter),
            Marker: optStr(c.list_marker),
            MaxKeys: optNum(c.list_max_keys),
        }),
        create: (input) => new ListObjectsCommand(input),
    },

    list_objects_v2: {
        buildInput: (c: CommandConfig): ListObjectsV2CommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Prefix: optStr(c.list_prefix),
            Delimiter: optStr(c.list_delimiter),
            ContinuationToken: optStr(c.list_continuation_token),
            StartAfter: optStr(c.list_start_after),
            MaxKeys: optNum(c.list_max_keys),
        }),
        create: (input) => new ListObjectsV2Command(input),
    },

    list_object_versions: {
        buildInput: (c: CommandConfig): ListObjectVersionsCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Prefix: optStr(c.list_prefix),
            Delimiter: optStr(c.list_delimiter),
            KeyMarker: optStr(c.list_key_marker),
            VersionIdMarker: optStr(c.list_version_id_marker),
            MaxKeys: optNum(c.list_max_keys),
        }),
        create: (input) => new ListObjectVersionsCommand(input),
    },

    copy_object: {
        buildInput: (c: CommandConfig): CopyObjectCommandInput => {
            const bucket = str(c.bucket, "bucket");
            const key = str(c.key, "key");
            const sourceBucket = optStr(c.source_bucket) ?? bucket;
            const sourceKey = optStr(c.source_key) ?? key;

            return {
                Bucket: bucket,
                Key: key,
                CopySource: `${sourceBucket}/${sourceKey}`,
            };
        },
        create: (input) => new CopyObjectCommand(input),
    },

    delete_object: {
        buildInput: (c: CommandConfig): DeleteObjectCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new DeleteObjectCommand(input),
    },

    delete_objects: {
        buildInput: (c: CommandConfig): DeleteObjectsCommandInput => {
            const bucket = str(c.bucket, "bucket");
            const targetKey = optStr(c.delete_target_key) ?? str(c.key, "key");
            const versionId = optStr(c.delete_target_version_id);

            return {
                Bucket: bucket,
                Delete: {
                    Quiet: optBool(c.delete_quiet),
                    Objects: [{ Key: targetKey, ...(versionId ? { VersionId: versionId } : {}) }],
                },
            };
        },
        create: (input) => new DeleteObjectsCommand(input),
    },

    delete_object_tagging: {
        buildInput: (c: CommandConfig): DeleteObjectTaggingCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            VersionId: optStr(c.version_id),
        }),
        create: (input) => new DeleteObjectTaggingCommand(input),
    },

    put_object: {
        buildInput: (c: CommandConfig): PutObjectCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            Body: optStr(c.request_body),
            ContentType: optStr(c.put_content_type),
            ContentDisposition: optStr(c.put_content_disposition),
            ContentEncoding: optStr(c.put_content_encoding),
            CacheControl: optStr(c.put_cache_control),
            StorageClass: optStr(c.put_storage_class) as any,
        }),
        create: (input) => new PutObjectCommand(input),
    },

    // 13) PutObjectAcl
    put_object_acl: {
        buildInput: (c: CommandConfig): PutObjectAclCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            ACL: optStr(c.acl_acl) as any,
            GrantRead: optStr(c.acl_grant_read),
            GrantWrite: optStr(c.acl_grant_write),
            GrantReadACP: optStr(c.acl_grant_read_acp),
            GrantWriteACP: optStr(c.acl_grant_write_acp),
            GrantFullControl: optStr(c.acl_grant_full),
        }),
        create: (input) => new PutObjectAclCommand(input),
    },

    put_object_tagging: {
        buildInput: (c: CommandConfig): PutObjectTaggingCommandInput => ({
            Bucket: str(c.bucket, "bucket"),
            Key: str(c.key, "key"),
            VersionId: optStr(c.version_id),
            // tags UI is currently disabled, so tags aren't mapped yet.
            // when enabled, it'll be mapped here
            Tagging: {
                TagSet: [],
            },
        }),
        create: (input) => new PutObjectTaggingCommand(input),
    },
};

/**
 * Returns a list of all commands supported in commandSpecs.
 */
export function getSupportedCommandIds(): string[] {
    return Object.keys(commandSpecs);
}

/**
 * Test function that returns all command ids that exist in s3Requests but not in commandSpecs.
 */
export function getMissingCommandSpecIds(): string[] {
    const allRequestIds = s3Requests.flatMap((section) => section.requests.map((r) => r.id));
    return allRequestIds.filter((id) => !(id in commandSpecs));
}

export function constructS3Command(id: string, config: CommandConfig): SDKS3Command {
    const spec = commandSpecs[id];
    if (!spec) throw new Error(`Unsupported request id: ${id}`);
    return spec.create(spec.buildInput(config));
}

export async function sendCommand(c: CommandConfig, command: SDKS3Command): Promise<any> {
    const credentials = {
        accessKeyId: str(c.access_key, "access_key"),
        secretAccessKey: str(c.secret_key, "secret_key"),
        ...(optStr(c.session_token) ? { sessionToken: optStr(c.session_token) } : {}),
    };

    const client = new S3Client({
        endpoint: str(c.endpoint, "endpoint"),
        region: str(c.region, "region"),
        credentials,
        maxAttempts: optNum(c.max_attempts),
        forcePathStyle: optBool(c.force_path_style),
    });

    return await client.send(command)
}