import type {Handle} from "@sveltejs/kit";
import {VoiceDatabase} from "$lib/db/d1.service";
import {AudioStorage} from "$lib/s3/r2.service";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.db_service = new VoiceDatabase(event.platform!.env.VOICES_DB);
    event.locals.s3_service = new AudioStorage();
    return resolve(event);
}
