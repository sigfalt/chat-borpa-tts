import type {Handle} from "@sveltejs/kit";
import {VoiceDatabase} from "$lib/db/d1.service";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.db_service = new VoiceDatabase(event.platform!.env.VOICES_DB);
    return resolve(event);
}
