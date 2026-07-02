import * as v from 'valibot';
import {command, getRequestEvent} from "$app/server";
import {error, fail} from "@sveltejs/kit";

import {DEV_LOCAL} from '$env/static/private';
import {createHash} from "node:crypto";
import {AUTH_COOKIE_NAME, createSession, DEFAULT_TTL} from "$lib/auth";

const UnlockSchema = v.object({
    token: v.string(),
});

export const unlock = command(UnlockSchema, async (cmd_obj) => {
    const { locals, cookies } = getRequestEvent();
    
    const { token } = cmd_obj;
    const token_hash = createHash('sha256').update(token).digest('hex');
    const auth_token = await locals.db_service.searchAuthToken(token_hash);
    if (!auth_token) {
        return fail(401, 'Invalid auth token.');
    }
    
    cookies.set(AUTH_COOKIE_NAME, createSession(auth_token.id.toString()), {
        httpOnly: true,
        maxAge: DEFAULT_TTL,
        path: '/',
        secure: true,
        sameSite: true,
    });
});


const TTSSchema = v.object({
    voice_id: v.pipe(
        v.number(),
        v.integer()
    ),
    tts_msg: v.string(),
});

export const getVoice = command(TTSSchema, async (cmd_obj) => {
    const { locals } = getRequestEvent();
    console.log(`getVoice command: ${JSON.stringify(cmd_obj)}`);
    const { voice_id, tts_msg } = cmd_obj;
    
    // check db with voice_id
    const voice_record = await locals.db_service.getVoice(voice_id);
    console.log(`Voice record: ${JSON.stringify(voice_record)}`);
    if (!voice_record) {
        console.warn(`Invalid voice ID provided {voice_id}`);
        return fail(400, 'Invalid voice provided.');
    }
    
    // check if message and voice combo already generated
    const audio_record = await locals.db_service.searchAudioFile(voice_record!.voice_id, tts_msg);
    console.log(`Audio record: ${JSON.stringify(audio_record)}`);
    
    let response;
    if (audio_record) {
        // fetch pregenerated audio from s3
        const s3_path = audio_record.s3_path;
        const fetched_stream = await locals.s3_service.get(s3_path);
        
        if (!fetched_stream) {
            console.error(`Failed to fetch audio blob for UUID {s3_path}`);
            error(500, 'Internal server error. [ERR6754]');
        }
        
        await locals.db_service.incrementAudioFetchCount(audio_record.audio_id);
        response = await locals.s3_service.getPresignedURL(s3_path);
    } else {
        // otherwise generate new audio with elevenlabs
        const audio_stream = await locals.tts_service.textToSpeech.convert(
            voice_record!.elevenlabs_id, {
                text: tts_msg,
                modelId: 'eleven_v3',
                // default outputFormat is mp3_44100_128, other values may be plan tier locked
                // outputFormat: 'mp3_44100_128'
            });
        
        // save audio blob to S3 bucket and store in db
        const s3_path = crypto.randomUUID();
        const audio_stored = await locals.s3_service.put(s3_path, audio_stream);
        
        if (!audio_stored) {
            console.error(`Failed to store audio blob for UUID {s3_path}`);
            error(500, 'Internal server error. [ERR5811]');
        }
        
        await locals.db_service.insertNewAudio(voice_record.voice_id, tts_msg, s3_path);
        response = await locals.s3_service.getPresignedURL(s3_path);
    }
    
    // return voice clip
    return {
        url: response
    };
});
