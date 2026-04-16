import * as v from 'valibot';
import {command} from "$app/server";

const TTSSchema = v.object({
    voice_id: v.pipe(
        v.number(),
        v.integer()
    ),
    tts_msg: v.string(),
});

export const getVoice = command(TTSSchema, async (cmd_obj) => {
    let { voice_id, tts_msg } = cmd_obj;
    
    // check db with voice_id
    // check if message and voice combo already generated and fetch from S3
    // otherwise generate sound clip with elevenlabs
    // save file to S3 bucket and store in db
    // return voice clip
});
