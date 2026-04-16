import type {VoiceDatabase} from "$lib/db/d1.service";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db_service: VoiceDatabase;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				VOICES_DB: D1Database;
			};
			// context: {
			// 	waitUntil(promise: Promise<any>): void;
			// };
			// caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
