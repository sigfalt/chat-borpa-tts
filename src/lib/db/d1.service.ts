import type {D1Database} from '@cloudflare/workers-types';

export interface Voice {
    voice_id: number;
    voice_name: string;
    elevenlabs_id: string;
    enabled: boolean;
}

export class VoiceDatabase {
    constructor(private readonly db: D1Database) {}
    
    async getVoice(voice_id: number): Promise<Voice | null> {
        return this.db
            .prepare("SELECT * FROM voices WHERE voice_id = ? AND enabled IS TRUE")
            .bind(voice_id, 1)
            .first();
    }
}
