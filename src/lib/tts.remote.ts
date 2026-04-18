import * as v from 'valibot';
import {command, getRequestEvent} from "$app/server";

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
    let { voice_id, tts_msg } = cmd_obj;
    
    // check db with voice_id
    let voice_record = await locals.db_service.getVoice(voice_id);
    console.log(`Voice record: ${JSON.stringify(voice_record)}`);
    
    // check if message and voice combo already generated and fetch from S3
    // otherwise generate sound clip with elevenlabs
    // save file to S3 bucket and store in db
    // return voice clip
});
