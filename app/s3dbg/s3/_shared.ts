import { NextRequest, NextResponse } from "next/server";

// https://fra1.digitaloceanspaces.com

export type RequestLogBody = {
  method: string;
  url: string;
  path: string;
  objectKey: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
};

function headersToObject(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

function getObjectKeyFromPath(pathname: string): string {
  const prefix = "/s3dbg/s3";
  if (pathname === prefix) return "";
  if (!pathname.startsWith(prefix + "/")) return "";
  return decodeURIComponent(pathname.slice(prefix.length + 1));
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  const raw = await request.clone().text();

  if (!raw) return "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return raw;
}

async function logIncomingRequest(request: NextRequest): Promise<string> {
  const requestId = crypto.randomUUID();
  const logPayload: RequestLogBody = {
    method: request.method,
    url: request.url,
    path: request.nextUrl.pathname,
    objectKey: getObjectKeyFromPath(request.nextUrl.pathname),
    query: Object.fromEntries(request.nextUrl.searchParams.entries()),
    headers: headersToObject(request.headers),
    body: await parseRequestBody(request),
  };

  const logUrl = new URL("/s3dbg/log", request.url);
  await fetch(logUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: requestId,
      type: "request",
      contents: JSON.stringify(logPayload, null, 2),
    }),
  });

  return requestId;
}

export async function handleRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const requestId = await logIncomingRequest(request);
    return NextResponse.json(
      {
        message: "Request received and logged",
        requestId,
        objectKey: getObjectKeyFromPath(request.nextUrl.pathname),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to log request: ${String(error)}` },
      { status: 500 },
    );
  }
}

