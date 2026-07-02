import type {VoiceDatabase} from "$lib/db/d1.service";
import type {AudioStorage} from "$lib/s3/r2.service";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// cloudflare bindings
			db_service: VoiceDatabase;
			s3_service: AudioStorage;
			tts_service: ElevenLabsClient;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				// cloudflare bindings
				VOICES_DB: D1Database;
				VOICES_S3: R2Bucket;
				ELEVENLABS_API_KEY: string;
			};
			// context: {
			// 	waitUntil(promise: Promise<any>): void;
			// };
			// caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
