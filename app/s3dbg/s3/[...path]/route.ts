import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "../_shared";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function HEAD(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

