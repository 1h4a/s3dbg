# s3dbg

s3dbg uses @aws-sdk/client-s3 to send configurable S3 requests to a selected address.

This is not an S3 client or any infrastructure component. It is a debug tool initially developed to manually debug and finetune [os2](https://github.com/1h4a/os2) and its S3 adapter.

This tool is not actively maintained and will not recieve any support.

### Running and Usage

s3dbg is a Next.js app. To run, clone the repository, then in the local directory run:

_npm:_
`npm install`
`npm run dev`

_pnpm:_
`pnpm i`
`pnpm dev`

While you can theoretically build and deploy the app, it's not intended to be used in such a manner, therefore, there is no support for deployed instances.

Requests are sent via the GUI.

### Architecture

All operations are individual local endpoints.

The server sends requests to itself, to the endpoint at:

`/s3dbg/s3`

The user client sends requests to:

`/s3dbg/send`

Config requests are sent to:

`/s3dbg/config`

Logging requests are sent to:

`/s3dbg/log`

User interface paths:

Config - `/`

Logging - `/logging`

### Regarding Code Quality

This is not production software, and expectations for code quality should follow that standard. While attempts are made to keep the codebase as maintainable as possible, there isn't a large emphasis on it. Documentation *.md files are largely AI generated references, but are also mostly human-verified.

Operations are held to a "known-good" standard, which means behavior is predictable and in line with S3 behavior.
