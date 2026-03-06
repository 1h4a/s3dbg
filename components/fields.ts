/*

This document is the source of truth for the configuration schema.
All input fields should be defined using these types.

*/

// Types

/**
 * Supported input types for form fields.
 * Will eventually be extended to support Blobs or other file types.
 * - `"string"` - Text input
 * - `"number"` - Numeric input
 * - `"boolean"` - Checkbox/toggle, not currently implemented, just parses string "true"/"false"
 * - `"date"` - Parses string date into a Date object
 */
type FieldType = "string" | "number" | "boolean" | "date";

/**
 * Represents a single configurable form field.
 * @property {string} label - Display label shown to the user
 * @property {string} id - Unique identifier used for form state
 * @property {string} [description] - Help text shown below the field
 * @property {string} [default] - Pre-filled value (optional)
 * @property {string} [placeholder] - Placeholder text shown when empty (optional)
 * @property {boolean} [disabled] - Prevents user interaction when true (optional)
 * @property {boolean} [optional] - Marks field as optional (if left empty, defaults to false)
 * @property {FieldType} type - Input type for rendering and validation
 * If optional fields are left empty, it is best practice to pass the field through `normaliseFieldValues` to ensure default values are applied.
 */
export type Field = {
  label: string;
  id: string;
  description?: string;
  default?: string;
  placeholder?: string;
  disabled?: boolean;
  optional?: boolean;
  type: FieldType;
};

/**
 * A group of related fields under a common heading.
 * @property {string} title - Section heading
 * @property {Field[]} fields - Fields contained in this section
 */
export type Section = {
  title: string;
  fields: Field[];
};

/**
 * Top-level configuration form schema.
 * @property {string} title - Form title
 * @property {Field[]} fields - Top-level fields (not in a section)
 * @property {Section[]} [sections] - Optional grouped sections
 */
export type ConfigSchema = {
  title: string;
  id: string;
  fields: Field[];
  sections?: Section[];
};

// Utility Functions

/**
 * Applies default values and formatting to field properties.
 * @param {Field} field - Field to normalize
 * @returns {Field} - Field with defaults applied (`default: ""`, `disabled: false`, `optional: false`)
 */
function normaliseFieldValues(field: Field): Field {
  const nfield: Field = {
    ...field,
    default: field.default ?? "",
    placeholder: field.placeholder ?? "",
    disabled: field.disabled ?? false,
    optional: field.optional ?? false,
  };
  if (nfield.optional) {
    nfield.label = nfield.label + " ?";
  }
  return nfield;
}

/**
 * Applies default values and formatting to section properties.
 * @param {Section} section - Section to normalize
 * @returns {Section} - Section with defaults applied
 */
function normaliseSectionValues(section: Section): Section {
  const nsection: Section = {
    ...section,
    title: section.title + " *",
  };
  return nsection;
}

/**
 * Applies normalisation to all fields and sections in a ConfigSchema.
 * @param {ConfigSchema} schema - Schema to normalise
 * @returns {ConfigSchema} - Normalised schema
 */
function normaliseConfigSchema(schema: ConfigSchema): ConfigSchema {
  return {
    ...schema,
    fields: schema.fields.map(normaliseFieldValues),
    sections: schema.sections?.map((section) => ({
      ...normaliseSectionValues(section),
      fields: section.fields.map(normaliseFieldValues),
    })),
  };
}

/**
 * Parses input field values into their appropriate type.
 * @param {string} value - Value to parse
 * @param {FieldType} type - Target type
 */
export function parseValue(
  value: string | undefined,
  type: FieldType,
): string | number | boolean | Date {
  const dval = value ?? "";
  switch (type) {
    case "string":
      return dval;
    case "number":
      const nval = parseFloat(dval);
      if (dval === "") {
        return 0;
      } else if (Number.isNaN(nval)) {
        throw new Error("Invalid value passed to input field of type number.");
      } else {
        return nval;
      }
    case "boolean":
      const bval = dval.toLowerCase();
      if (bval === "true" || bval === "false") {
        return bval === "true";
      } else if (bval === "") {
        return false;
      } else {
        throw new Error("Invalid value passed to input field of type boolean.");
      }
    case "date":
      if (dval == "") {
        return new Date(1);
      }
      return new Date(dval);
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
}

// Schema

/* Configuration schema for client settings */
const clientConfigFields: ConfigSchema = {
  title: "Client Settings",
  id: "client_config",
  fields: [
    {
      label: "Access Key",
      id: "access_key",
      type: "string",
    },
    {
      label: "Secret Key",
      id: "secret_key",
      type: "string",
    },
    {
      label: "Session Token",
      id: "session_token",
      type: "string",
      optional: true,
    },
    {
      label: "Region",
      id: "region",
      type: "string",
      default: "us-east-1",
    },
    {
      label: "Endpoint",
      id: "endpoint",
      type: "string",
      default: "http://localhost:1519",
    },
    {
      label: "Force Path Style",
      id: "force_path_style",
      type: "boolean",
      disabled: true,
      optional: true,
    },
    {
      label: "Maximum Attempts",
      id: "max_attempts",
      type: "number",
    },
  ],
};

const senderConfigFields: ConfigSchema = {
  title: "Sender Settings",
  id: "sender_config",
  fields: [
    {
      label: "Bucket",
      type: "string",
      id: "bucket",
      description:
        "Bucket and Key are mandatory values and most commands will fail without them.",
    },
    {
      label: "Key",
      type: "string",
      id: "key",
    },
    {
      label: "Body",
      type: "string",
      id: "request_body",
      disabled: true,
      description: "Currently only supports string bodies.",
    },
  ],
  sections: [
    {
      title: "Copy Operations",
      fields: [
        {
          label: "Source Bucket",
          optional: true,
          id: "source_bucket",
          type: "string",
          description:
            "Source values are used for copy operations. If not specified, s3dbg will try to apply the operation to and from the same bucket.",
        },
        {
          label: "Source Key",
          optional: true,
          id: "source_key",
          type: "string",
        },
      ],
    },
    {
      title: "Versioning",
      fields: [
        {
          label: "Version ID",
          id: "version_id",
          type: "string",
          description: "Specifies object version to operate on.",
        },
      ],
    },
    {
      title: "List Operations",
      fields: [
        {
          label: "Prefix",
          id: "list_prefix",
          type: "string",
          optional: true,
        },
        {
          label: "Delimiter",
          id: "list_delimiter",
          type: "string",
          optional: true,
        },
        {
          label: "Max Keys",
          id: "list_max_keys",
          type: "number",
          optional: true,
        },
        {
          label: "Marker",
          id: "list_marker",
          type: "number",
          optional: true,
        },
        {
          label: "Continuation Token",
          id: "list_continuation_token",
          type: "string",
          optional: true,
        },
        {
          label: "Start After",
          id: "list_start_after",
          type: "string",
          optional: true,
        },
        {
          label: "Key Marker",
          id: "list_key_marker",
          type: "string",
          optional: true,
        },
        {
          label: "Version ID Marker",
          id: "list_version_id_marker",
          type: "string",
          optional: true,
          description: "Version ID to start listing after.",
        },
      ],
    },
    {
      title: "Put / Upload Operations",
      fields: [
        {
          label: "Content Type",
          id: "put_content_type",
          type: "string",
          optional: true,
          description: "MIME type.",
        },
        {
          label: "Content Disposition",
          id: "put_content_disposition",
          type: "string",
          optional: true,
        },
        {
          label: "Content Encoding",
          id: "put_content_encoding",
          type: "string",
          optional: true,
        },
        {
          label: "Cache Control",
          id: "put_cache_control",
          type: "string",
          optional: true,
          description: "Caching directives for this object.",
        },
        {
          label: "Metadata",
          id: "put_metadata",
          type: "string",
          optional: true,
          disabled: true,
          description: "Metadata key-value pairs. Disabled for now.",
        },
        {
          label: "Storage Class",
          id: "put_storage_class",
          type: "string",
          optional: true,
          description:
            "Storage class for this object. (e.g. STANDARD, GLACIER, DEEP_ARCHIVE)",
        },
      ],
    },
    {
      title: "ACL",
      fields: [
        {
          label: "ACL",
          id: "acl_acl",
          type: "string",
          optional: true,
          description:
            "ACL to set on the object. (e.g. private, public-read, etc.)",
        },
        {
          label: "Grant Read",
          id: "acl_grant_read",
          type: "string",
          optional: true,
          description: "Grantee(s) allowed to read the object.",
        },
        {
          label: "Grant Write",
          id: "acl_grant_write",
          type: "string",
          optional: true,
          description: "Grantee(s) allowed to write to the object.",
        },
        {
          label: "Grant Read ACP",
          id: "acl_grant_read_acp",
          type: "string",
          optional: true,
          description: "Grantee(s) allowed to read the object's ACP params.",
        },
        {
          label: "Grant Full Control",
          id: "acl_grant_full",
          type: "string",
          optional: true,
          description: "Grantee(s) with full permissions.",
        },
      ],
    },
    {
      title: "Tagging",
      fields: [
        {
          label: "Tags",
          id: "tagging_tags",
          type: "string",
          optional: true,
          disabled: true,
          description: "Key-value pairs to set as tags. Disabled for now.",
        },
      ],
    },
    {
      title: "Delete Operations",
      fields: [
        {
          label: "Target Object Key",
          optional: true,
          type: "string",
          id: "delete_target_key",
          description: "Specifies object key to delete.",
        },
        {
          label: "Target Version ID",
          optional: true,
          type: "string",
          id: "delete_target_version_id",
          description: "Specifies object version to delete.",
        },
        {
          label: "Quiet Delete",
          optional: true,
          type: "boolean",
          id: "delete_quiet",
          description: "If true, only report errors. Expects boolean.",
        },
      ],
    },
    {
      title: "Response Modifiers (GetObject)",
      fields: [
        {
          label: "Range",
          optional: true,
          type: "string",
          id: "mod_range",
          description:
            "Specifies byte range to retrieve. Expects format 'bytes=0-499'",
        },
        {
          label: "ETag Match",
          optional: true,
          type: "string",
          id: "mod_ifMatch",
          description:
            "Returns the object only if its entity tag (ETag) is the same as the specified tag.",
        },
        {
          label: "No ETag Match",
          optional: true,
          type: "string",
          id: "mod_ifNoneMatch",
          description:
            "Returns the object only if its entity tag (ETag) is different from the specified tag.",
        },
        {
          label: "Modified Since",
          optional: true,
          type: "date",
          id: "mod_ifModifiedSince",
          description:
            "Returns the object only if it has been modified since the specified date/time. Enter a date in string format, which will be parsed.",
        },
        {
          label: "Unmodified Since",
          optional: true,
          type: "date",
          id: "mod_ifUnmodifiedSince",
          description:
            "Returns the object only if it has not been modified since the specified date/time.",
        },
        {
          label: "Response Cache Control",
          optional: true,
          type: "string",
          id: "mod_response_cache_control",
          description: "Sets the Cache-Control header in the response.",
        },
        {
          label: "Response Content Disposition",
          optional: true,
          type: "string",
          id: "mod_response_content_disposition",
          description: "Sets the Content-Disposition header in the response.",
        },
        {
          label: "Response Content Encoding",
          optional: true,
          type: "string",
          id: "mod_response_content_encoding",
          description: "Sets the Content-Encoding header in the response.",
        },
        {
          label: "Response Content Language",
          optional: true,
          type: "string",
          id: "mod_response_content_language",
          description: "Sets the Content-Language header in the response.",
        },
        {
          label: "Response Content Type",
          optional: true,
          type: "string",
          id: "mod_response_content_type",
          description: "Sets the Content-Type header in the response.",
        },
        {
          label: "Response Expires",
          optional: true,
          type: "date",
          id: "mod_response_expires",
          description: "Sets the Expires header in the response. Date value.",
        },
      ],
    },
  ],
};

const loggingConfigFields = {};

/** Formatted schemas */
export const clientConfig = normaliseConfigSchema(clientConfigFields);
export const senderConfig = normaliseConfigSchema(senderConfigFields);
// export const loggingConfig = normaliseConfigSchema(loggingConfigFields);
