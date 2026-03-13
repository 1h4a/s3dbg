import { NextRequest, NextResponse } from "next/server";
import { validateRequest, constructRequest } from "@/lib/requests";
import type { CommandConfig, S3Request } from "@/lib/requests";
import { pullLocalConfig } from "@/lib/config";
import { constructS3Command, sendCommand } from "@/lib/s3";

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (!data) {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 },
    );
  }
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

      const res = sendCommand(config, sdk_command);

      // for debugging, will remove later
      const static_res = await res;
      const bytes = await static_res.Body?.transformToString();
      console.log(" * OUT: " + bytes);

      // The response from the S3 endpoint shouldn't be returned here with the Response, it should be immediately passed to the /log API route
      // will add this later

      return NextResponse.json(
        {
          message: " Request sent successfully. ",
          requestId: internal_req.id,
          body: res,
        },
        { status: 200 },
      );
    } catch (err) {
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
