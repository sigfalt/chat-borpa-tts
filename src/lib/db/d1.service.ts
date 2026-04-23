import type {D1Database} from '@cloudflare/workers-types';

export interface Voice {
    voice_id: number;
    voice_name: string;
    elevenlabs_id: string;
    enabled: boolean;
}

export interface AudioFile {
    audio_id: number;
    voice_id: number;
    msg_text: string;
    s3_path: string;
    fetch_count: number;
    req_timestamp: string;
}

export class VoiceDatabase {
    constructor(private readonly db: D1Database) {}
    
    async getVoice(voice_id: number): Promise<Voice | null> {
        return this.db
            .prepare("SELECT * FROM voices WHERE voice_id = ? AND enabled IS TRUE")
            .bind(voice_id)
            .first();
    }
    
    async searchAudioFile(voice_id: number, msg_text: string): Promise<AudioFile | null> {
        return this.db
            .prepare("SELECT * FROM audio_files WHERE voice_id = ? AND msg_text = ?")
            .bind(voice_id, msg_text)
            .first();
    }
}
