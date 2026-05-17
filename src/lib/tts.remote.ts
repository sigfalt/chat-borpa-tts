import * as v from 'valibot';
import {command, getRequestEvent} from "$app/server";
import {error} from "@sveltejs/kit";

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
        error(400, 'Invalid voice provided.');
    }
    
    // check if message and voice combo already generated
    const audio_record = await locals.db_service.searchAudioFile(voice_record!.voice_id, tts_msg);
    console.log(`Audio record: ${JSON.stringify(audio_record)}`);
    
    let response_blob;
    if (audio_record) {
        // fetch pregenerated audio from s3
        const s3_path = audio_record.s3_path;
        const fetched_stream = await locals.s3_service.get(s3_path);
        
        if (!fetched_stream) {
            error(500, 'Pregenerated audio file not found.');
        }
        await locals.db_service.incrementAudioFetchCount(audio_record.audio_id);
        response_blob = await new Response(fetched_stream, {
            headers: { 'Content-Type': 'audio/mpeg' },
        }).blob();
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
        if (audio_stored) {
            await locals.db_service.insertNewAudio(voice_record.voice_id, tts_msg, s3_path);
        } else {
            console.warn(`Failed to store audio blob for UUID {s3_path}`);
        }
        // even if blob storage failed, return generated audio to user
        response_blob = await new Response(audio_stream, {
            headers: { 'Content-Type': 'audio/mpeg' },
        }).blob();
    }
    
    // return voice clip
    return response_blob;
});
