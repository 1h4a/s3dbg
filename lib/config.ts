import type { SchemaType } from "@/lib/fields";
import type { CommandConfig } from "@/lib/requests";
import { availableFields } from "@/lib/fields";
import { promises as fs } from "fs";

/**
 * Pulls and parses a local config file from `app/local/config`.
 * Can only be used in server context, as this function uses fs.
 *
 * @param {SchemaType} name Configuration file name without extension.
 * @returns {Promise<CommandConfig>} Parsed config object with typed values.
 */
export async function pullLocalConfig(name: SchemaType): Promise<CommandConfig> {
    const filepath = process.cwd() + `/app/local/config/${name}.json`;
    const parsed = JSON.parse(await fs.readFile(filepath, "utf-8")) as Record<
        string,
        unknown
    >;

    const out: CommandConfig = {};

    for (const [key, value] of Object.entries(parsed)) {
        const type = availableFields[key]?.type;

        if (type === "date") {
            if (value instanceof Date) {
                out[key] = value;
            } else if (typeof value === "string" && value !== "") {
                out[key] = new Date(value);
            } else {
                out[key] = new Date(1);
            }
            continue;
        }

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            out[key] = value;
            continue;
        }

        if (value == null) {
            out[key] = "";
            continue;
        }

        throw new Error(`Invalid config value for "${key}" in ${filepath}`);
    }

    return out;
}