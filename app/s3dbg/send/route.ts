import { NextRequest, NextResponse } from "next/server";
import { validateRequest, constructRequest } from "@/lib/requests";
import type { CommandConfig, S3Request } from "@/lib/requests";
import { pullLocalConfig } from "@/lib/config";
import { constructS3Command, sendCommand } from "@/lib/s3";
import { randomUUID } from "node:crypto";

type LogType = "request" | "response" | "response_body";

async function postLogEntry(
  origin: string,
  payload: { id: string; type: LogType; contents: string; attachedBody?: boolean },
): Promise<void> {
  await fetch(`${origin}/s3dbg/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function serialiseSdkResponse(response: any): Promise<{
  bodyText?: string;
  serialised: Record<string, unknown>;
}> {
  const serialised: Record<string, unknown> = {
    ...response,
  };

  let bodyText: string | undefined;
  if (response?.Body && typeof response.Body.transformToString === "function") {
    bodyText = await response.Body.transformToString();
    delete serialised.Body;
  }

  return { bodyText, serialised };
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (!data || typeof data.requestType !== "string") {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 },
    );
  }

  const traceId = randomUUID();
  const origin = request.nextUrl.origin;

  const check = validateRequest(data.requestType);
  if (check.isValid) {
    const client = await pullLocalConfig("client");
    const sender = await pullLocalConfig("sender");
    const config: CommandConfig = { ...client, ...sender };

    try {
      const internal_req: S3Request = constructRequest(
        data.requestType,
        config,
      );
      const sdk_command = constructS3Command(
        internal_req.id,
        internal_req.config,
      );

      await postLogEntry(origin, {
        id: `${traceId}_request`,
        type: "request",
        contents: JSON.stringify(
          {
            traceId,
            requestType: data.requestType,
            commandId: internal_req.id,
            commandLabel: internal_req.label,
            config: internal_req.config,
          },
          null,
          2,
        ),
      }).catch((err) => {
        console.error("Failed to write request log entry:", err);
      });

      const sdkResponse = await sendCommand(config, sdk_command);
      const { bodyText, serialised } = await serialiseSdkResponse(sdkResponse);

      let bodyLogId: string | undefined;
      if (typeof bodyText === "string") {
        bodyLogId = `${traceId}_response_body`;
        await postLogEntry(origin, {
          id: bodyLogId,
          type: "response_body",
          contents: bodyText,
        }).catch((err) => {
          console.error("Failed to write response_body log entry:", err);
        });
      }

      await postLogEntry(origin, {
        id: `${traceId}_response`,
        type: "response",
        attachedBody: bodyLogId !== undefined,
        contents: JSON.stringify(
          {
            traceId,
            commandId: internal_req.id,
            responseBodyId: bodyLogId,
            response: serialised,
          },
          null,
          2,
        ),
      }).catch((err) => {
        console.error("Failed to write response log entry:", err);
      });

      return NextResponse.json(
        {
          message: "Request sent successfully.",
          requestId: internal_req.id,
          traceId,
          body: serialised,
          responseBodyId: bodyLogId,
        },
        { status: 200 },
      );
    } catch (err) {
      await postLogEntry(origin, {
        id: `${traceId}_response`,
        type: "response",
        contents: JSON.stringify(
          {
            traceId,
            requestType: data.requestType,
            error: String(err),
          },
          null,
          2,
        ),
      }).catch((logErr) => {
        console.error("Failed to write error response log entry:", logErr);
      });

      return NextResponse.json(
        { error: "Unexpected error during command parsing: " + err },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      {
        error:
          "Could not find request type " +
          data.requestType +
          " (" +
          check.error +
          ")",
      },
      { status: 404 },
    );
  }
}
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export async function HEAD() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
