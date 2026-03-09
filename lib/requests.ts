import type { Field } from "@/lib/fields";
import { availableFields } from "@/lib/fields";

/**
 * Internal representation of a S3Request.
 * This is used internally to validate requests.
 * Should not be used for anything else.
 */
type InternalS3Request = { label: string; id: string; requires: Field[] };

/**
 * A command config is a map of command arguments to their values.
 * Expects the format { [argument: string]: value }
 */
export type CommandConfig = Record<string, string | number | boolean | Date>;

/**
 * A S3Request is a command that can be executed on S3.
 * Unlike the aws-sdk, there are no classes for individual commands.
 * S3Requests are validated against the s3Requests array.
 */
export class S3Request {
  label: string = "";
  id: string = "";
  config: CommandConfig = {};
}

/**
 * Alias for `availableFields`.
 *
 * Should not be exported.
 */
const avf = availableFields;

/* Grouping of required fields for each request */
const commonRequires: Field[] = [avf["bucket"]];
/** Required fields for Get requests */
const getRequires: Field[] = [...commonRequires, avf["key"]];
/** Required fields for List requests */
const listRequires: Field[] = [...commonRequires];
/** Required fields for Cooy requests */
const copyRequires: Field[] = [
  ...commonRequires,
  avf["key"],
  avf["source_bucket"],
  avf["source_key"],
];
/** Required fields for Delete requests */
const deleteRequires: Field[] = [...commonRequires, avf["key"]];
/** Required fields for Put requests */
const putRequires: Field[] = [...commonRequires, avf["key"], avf["body"]];

// currently meets checkpoint 1 requirements
/**
 * List of all supported request types.
 * Each request is validated against this list.
 *
 * This array is exported only for use in the UI, and should not be used for anything else.
 *
 * `requests.ts` should be the single source of truth for all supported requests and any
 * data manipulation, as it contains all the necessary logic to validate and format data.
 */
export const s3Requests: { section: string; requests: InternalS3Request[] }[] =
  [
    // Get Requests
    {
      section: "Get Requests",
      requests: [
        {
          label: "GetObject",
          id: "get_object",
          requires: [...getRequires],
        },
        {
          label: "GetObjectAcl",
          id: "get_object_acl",
          requires: [...getRequires],
        },
        {
          label: "GetObjectTagging",
          id: "get_object_tagging",
          requires: [...getRequires],
        },
      ],
    },
    {
      section: "Head Requests",
      requests: [
        {
          label: "HeadObject",
          id: "head_object",
          requires: [...getRequires],
        },
      ],
    },
    {
      section: "List Requests",
      requests: [
        {
          label: "ListObjects",
          id: "list_objects",
          requires: [...listRequires],
        },
        {
          label: "ListObjectsV2",
          id: "list_objects_v2",
          requires: [...listRequires],
        },
        {
          label: "ListObjectVersions",
          id: "list_object_versions",
          requires: [...listRequires],
        },
      ],
    },
    {
      section: "Copy Requests",
      requests: [
        {
          label: "CopyObject",
          id: "copy_object",
          requires: [...copyRequires],
        },
      ],
    },
    {
      section: "Delete Requests",
      requests: [
        {
          label: "DeleteObject",
          id: "delete_object",
          requires: [...deleteRequires],
        },
        {
          label: "DeleteObjects",
          id: "delete_objects",
          requires: [...deleteRequires],
        },
        {
          label: "DeleteObjectTagging",
          id: "delete_object_tagging",
          requires: [...deleteRequires],
        },
      ],
    },
    {
      section: "Put Requests",
      requests: [
        {
          label: "PutObject",
          id: "put_object",
          requires: [...putRequires],
        },
        {
          label: "PutObjectAcl",
          id: "put_object_acl",
          requires: [...putRequires],
        },
        {
          label: "PutObjectTagging",
          id: "put_object_tagging",
          requires: [...putRequires, avf["tagging_tags"]],
        },
      ],
    },
  ];
