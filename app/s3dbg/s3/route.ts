import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

function route() {
    // accessKeyId: string, secretAccessKey: string, sessionToken?: string
    const credentials = { accessKeyId: "", secretAccessKey: "", sessionToken: "" }
    // region: string
    const region = "eu-west-1";
    // endpoint: string
    const endpoint = "http://localhost:8000";
    // forcePathStyle: boolean
    const forcePathStyle = false;
    // maxAttempts: number
    const maxAttempts = 3;

    const config: S3ClientConfig = {
        region: region,
        credentials: credentials,
        endpoint: endpoint,
        forcePathStyle: forcePathStyle,
        maxAttempts: maxAttempts
    };
    const client = new S3Client(config);


}