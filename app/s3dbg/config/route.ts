import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { constants as fsConstants } from "node:fs";
import type { ConfigSchema, Field } from "@/lib/fields";
import { parseValue } from "@/lib/fields";

/*

The /config route is used to update the local configuration.
The following methods are supported:
- POST - Updates the local configuration (expects request body as JSON with config values + an "id" field containing the schema ID)
- GET - Retrieves the local configuration (returns all local configurations as an array of JSON objects)
- DELETE - Resets the local configuration to defaults (expects request body as JSON with a single "id" field containing the schema ID)

All other methods return 405 Method Not Allowed.

 */

function getDefaultsFromSchema(
  schema: ConfigSchema,
): Record<string, string | number | boolean | Date> {
  const defaults: Record<string, string | number | boolean | Date> = {
    id: schema.id,
  };

  const processField = (field: Field) => {
    defaults[field.id] = parseValue(field.default, field.type);
  };

  // Extract defaults from top-level fields
  for (const field of schema.fields) {
    processField(field);
  }

  // Extract defaults from section fields
  if (schema.sections) {
    for (const section of schema.sections) {
      for (const field of section.fields) {
        processField(field);
      }
    }
  }

  return defaults;
}

async function ensureConfigFile(
  id: string,
  filePath: string,
  getDefaults: () => Promise<Record<string, string | number | boolean | Date>>,
) {
  try {
    await fs.access(filePath, fsConstants.F_OK);
  } catch {
    const defaults = await getDefaults();
    await fs.writeFile(filePath, JSON.stringify(defaults, null, 2));
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (data) {
    switch (data.id) {
      case "client_config":
        fs.truncate(process.cwd() + "/app/local/config/client.json", 0).then(
          (_) => {
            fs.writeFile(
              process.cwd() + "/app/local/config/client.json",
              JSON.stringify(data, null, 2),
            ).then((_) => {});
          },
        );
        break;
      case "sender_config":
        fs.truncate(process.cwd() + "/app/local/config/sender.json", 0).then(
          (_) => {
            fs.writeFile(
              process.cwd() + "/app/local/config/sender.json",
              JSON.stringify(data, null, 2),
            ).then((_) => {});
          },
        );
        break;
      case "logging_config":
        fs.truncate(process.cwd() + "/app/local/config/logging.json", 0).then(
          (_) => {
            fs.writeFile(
              process.cwd() + "/app/local/config/logging.json",
              JSON.stringify({ id: "logging_config" }, null, 2),
            ).then((_) => {});
          },
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid configuration ID" },
          { status: 400 },
        );
    }
    return new NextResponse("Local configuration updated", { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Invalid data provided" },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    const { clientConfig, senderConfig } = await import("@/lib/fields");

    const clientPath = process.cwd() + "/app/local/config/client.json";
    const senderPath = process.cwd() + "/app/local/config/sender.json";
    const loggingPath = process.cwd() + "/app/local/config/logging.json";

    await Promise.all([
      ensureConfigFile("client_config", clientPath, async () =>
        getDefaultsFromSchema(clientConfig),
      ),
      ensureConfigFile("sender_config", senderPath, async () =>
        getDefaultsFromSchema(senderConfig),
      ),
      ensureConfigFile("logging_config", loggingPath, async () => ({
        id: "logging_config",
      })),
    ]);

    const [clientData, senderData, loggingData] = await Promise.all([
      fs.readFile(clientPath, "utf-8"),
      fs.readFile(senderPath, "utf-8"),
      fs.readFile(loggingPath, "utf-8"),
    ]);

    const configs = [
      { ...JSON.parse(clientData) },
      { ...JSON.parse(senderData) },
      { ...JSON.parse(loggingData) },
    ];

    return NextResponse.json(configs, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error while reading local configuration" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  if (!data || !data.id) {
    return NextResponse.json(
      { error: "Invalid data provided" },
      { status: 400 },
    );
  }

  const { clientConfig, senderConfig } = await import("@/lib/fields");

  try {
    switch (data.id) {
      case "client_config": {
        const defaults = getDefaultsFromSchema(clientConfig);
        const filePath = process.cwd() + "/app/local/config/client.json";
        await fs.truncate(filePath, 0);
        await fs.writeFile(filePath, JSON.stringify(defaults, null, 2));
        break;
      }
      case "sender_config": {
        const defaults = getDefaultsFromSchema(senderConfig);
        const filePath = process.cwd() + "/app/local/config/sender.json";
        await fs.truncate(filePath, 0);
        await fs.writeFile(filePath, JSON.stringify(defaults, null, 2));
        break;
      }
      case "logging_config": {
        // TODO: Add loggingConfig schema when available
        const filePath = process.cwd() + "/app/local/config/logging.json";
        await fs.truncate(filePath, 0);
        await fs.writeFile(
          filePath,
          JSON.stringify({ id: "logging_config" }, null, 2),
        );
        break;
      }
      default:
        return NextResponse.json(
          { error: "Invalid configuration ID" },
          { status: 400 },
        );
    }
    return NextResponse.json(
      { message: "Configuration reset to defaults" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resetting configuration:", error);
    return NextResponse.json(
      { error: "Failed to reset configuration" },
      { status: 500 },
    );
  }
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function HEAD() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
