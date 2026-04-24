
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
        return await this.db
            .prepare("SELECT * FROM voices WHERE voice_id = ? AND enabled IS TRUE")
            .bind(voice_id)
            .first();
    }
    
    async searchAudioFile(voice_id: number, msg_text: string): Promise<AudioFile | null> {
        return await this.db
            .prepare("SELECT * FROM audio_files WHERE voice_id = ? AND msg_text = ?")
            .bind(voice_id, msg_text)
            .first();
    }
    
    async insertNewAudio(voice_id: number, msg_text: string, s3_path: string): Promise<number> {
        const inserted = await this.db
            .prepare("INSERT INTO audio_files (voice_id, msg_text, s3_path, fetch_count) VALUES (?, ?, ?, 1) RETURNING audio_id")
            .bind(voice_id, msg_text, s3_path)
            .run();
        return inserted.meta.last_row_id;
    }
    
    async incrementAudioFetchCount(audio_id: number) {
        await this.db
            .prepare("UPDATE audio_files SET fetch_count = fetch_count + 1 WHERE audio_id = ?")
            .bind(audio_id)
            .run();
    }
}
