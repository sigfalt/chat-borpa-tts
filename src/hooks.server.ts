import type {Handle} from "@sveltejs/kit";
import {ElevenLabsClient} from "@elevenlabs/elevenlabs-js";

import {VoiceDatabase} from "$lib/db/d1.service";
import {AudioStorage} from "$lib/s3/r2.service";
import {verifySession} from "$lib/auth";


export const handle: Handle = async ({ event, resolve }) => {
    // populate cloudflare bindings
    event.locals.db_service = new VoiceDatabase(event.platform!.env.VOICES_DB);
    event.locals.s3_service = new AudioStorage(event.platform!.env.VOICES_S3);
    event.locals.tts_service = new ElevenLabsClient({ apiKey: event.platform!.env.ELEVENLABS_API_KEY });
    
    // check and validate auth cookie
    // const session = verifySession(event.cookies.get('auth'));
    
    return resolve(event);
}
