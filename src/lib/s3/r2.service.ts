
export class AudioStorage {
    constructor(private readonly storage: R2Bucket) {}
    
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
}
