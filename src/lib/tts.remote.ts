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
    
    // check if message and voice combo already generated and fetch from S3
    const audio_file = await locals.db_service.searchAudioFile(voice_record!.voice_id, tts_msg);
    console.log(`Audio record: ${JSON.stringify(audio_file)}`);
    
    let audio_data;
    if (audio_file) {
        audio_data = audio_file.s3_path;
    } else {
        // otherwise generate sound clip with elevenlabs
        // save file to S3 bucket and store in db
    }
    
    // return voice clip
});
