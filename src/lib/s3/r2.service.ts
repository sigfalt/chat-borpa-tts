import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

import { PUBLIC_S3_URL, PUBLIC_S3_BUCKET_NAME, PUBLIC_S3_ACCESS_ID } from '$env/static/public';
import { S3_ACCESS_KEY } from '$env/static/private';

export class AudioStorage {
    
    private readonly s3_client: S3Client;
    
    constructor(
        private readonly storage: R2Bucket
    ) {
        this.s3_client = new S3Client({
            region: 'auto',
            endpoint: PUBLIC_S3_URL,
            credentials: {
                accessKeyId: PUBLIC_S3_ACCESS_ID,
                secretAccessKey: S3_ACCESS_KEY,
            },
        });
    }
    
    async exists(key: string): Promise<boolean> {
        const val = await this.storage.head(key);
        return val != null;
    }
    
    async get(key: string): Promise<Blob | null> {
        const val = await this.storage.get(key);
        return val != null ? val.blob() : null;
    }
    
    async put(key: string, value: Blob): Promise<boolean> {
        const val = await this.storage.put(key, value);
        return val != null;
    }
    
    async getPresignedURL(key: string, validDuration = 3600): Promise<string> {
        return await getSignedUrl(
            this.s3_client,
            new GetObjectCommand({ Bucket: PUBLIC_S3_BUCKET_NAME, Key: key }),
            { expiresIn: validDuration }
        );
    }
}
