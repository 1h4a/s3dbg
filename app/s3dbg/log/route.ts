import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs'
import { constants as fsConstants } from "node:fs";
import { IndexedLog } from "@/lib/logging"

export async function GET() {
    const path = process.cwd() + "/app/local/logs/index.json";
    const defaultContent = {}
    try {
        await fs.access(path, fsConstants.F_OK)
    }
    catch {
        await fs.writeFile(path, JSON.stringify(defaultContent, null, 2))
    }
    const data = await fs.readFile(path, 'utf-8')
    return NextResponse.json(JSON.parse(data), { status: 200 })
}

/**
 * Handles updating log files.
 * @param {NextRequest} request
 *
 * Request expects a JSON body with structure that adheres to the `Entry` type:
 * {
 *   "id": "string", (expects a unique ID for each log entry, in case of a response_body log, the "body" field of the related response
 *   log should contain the ID of the response_body log)
 *   "type": "request" | "response" | "response_body" (response_body is used for example for GetObject response bodies,
 *   which shouldn't be displayed in the UI but instead be available for download.)
 *   "contents": "string"
 *   "attachedBody": "boolean" (optional, defaults to false. should be set to true if the log entry is a Get request with a relevant response_body log.)
 * }
 * @constructor
 */
export async function POST(request: NextRequest) {
    if (!request) {
        return NextResponse.json({ error: "No request provided" }, { status: 400 })
    }
    const data = await request.json()
    if (!(data && data.id && data.type)) {
        return NextResponse.json({ error: "Invalid request format"}, { status: 400 })
    }

    if (data.type === "response_body") {
        // TODO: add filetype resolution
        const path = process.cwd() + "/app/local/logs/body_" + data.id + ".raw";
        if (await fs.readFile(path, 'utf-8').then(_ => true).catch(_ => false)) {
            return NextResponse.json({ error: "Entry with this ID already exists" }, { status: 400 })
        }
        await fs.writeFile(path, JSON.stringify(data.contents, null, 2), 'utf-8')
        return NextResponse.json({ message: "Response body stored" }, { status: 200 })
    }

    const path = process.cwd() + "/app/local/logs/index.json";
    if (!data.attachedBody) { data.attachedBody = false }
    const content: IndexedLog = { [data.id]: data }
    const existing = await fs.readFile(path, 'utf-8').then(data => JSON.parse(data) as IndexedLog).catch(_ => ({} as IndexedLog))
    const updated = { ...existing, ...content }
    await fs.writeFile(path, JSON.stringify(updated, null, 2), 'utf-8')
    return NextResponse.json({ message: "Entry stored" }, { status: 200 })
}

export async function DELETE() {
    const path = process.cwd() + "/app/local/logs/index.json";
    try {
        await fs.writeFile(path, JSON.stringify({}, null, 2), 'utf-8')
        return NextResponse.json({ message: "Cleared logs" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ error: err }, { status: 500 })
    }
}