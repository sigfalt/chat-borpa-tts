
<script lang="ts">
    import IcBaselineKeyboardDoubleArrowLeft from '~icons/ic/baseline-keyboard-double-arrow-left';
    import IcBaselineKeyboardDoubleArrowRight from '~icons/ic/baseline-keyboard-double-arrow-right';

    import {onMount} from "svelte";
    import type {PageProps} from "./$types";

    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import {Separator} from "$lib/components/ui/separator";
    import {Textarea} from "$lib/components/ui/textarea";
    
    import {getVoice, unlock} from "$lib/tts.remote";
    import {SvelteMap} from "svelte/reactivity";
	import AudioPlayer from '$lib/components/player/AudioPlayer.svelte';
    let voice_id = $state(1);

    const host = 'tts.borpa.chat';
    const title = `Hannah TTS`;

    
    let { data }: PageProps = $props();

    let curr_msg_ix = $state(0);
    function click_left() {
        if (curr_msg_ix > 0) {
            curr_msg_ix -= 1;
        } else {
            curr_msg_ix = data.example_messages.length - 1;
        }
    }
    function click_right() {
        if (curr_msg_ix + 1 < data.example_messages.length) {
            curr_msg_ix += 1;
        } else {
            curr_msg_ix = 0;
        }
    }

    
    let tts_unlocked = $state(false);
    let access_key = $state('');
    let tts_msg = $state('');
    let loaded_voice_data = new SvelteMap<any, string>();

    
    let raw_opacity = $state(0);
    let ollie_opacity = $derived(1 - Math.min(raw_opacity, 1));
    onMount(() => {
        setInterval(() => {
            raw_opacity += 0.01;
        }, 30000);
    });
</script>

<svelte:head>
    <title>{title}</title>

    <link rel="icon" href="/favicon.ico" sizes="16x16">
    <link rel="icon" href="/favicon-32x32.png" type="image/png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <meta property="og:title" content="{title}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="{host}" />
    <meta property="og:image" content="https://{host}/favicon.ico" />
</svelte:head>

<div id="main" class="text-center text-white m-8 font-rowdies space-y-4">
    <h2 class="text-3xl md:text-4xl font-germania">{title}</h2>

    <div class="flex flex-row">
        <div class="basis-1/6 md:basis-1/4"></div>
        <div class="bg-purple-950 basis-2/3 md:basis-1/2 justify-center items-center p-2 rounded-xl border-2 border-yellow-400 text-sm">
            <p>Send a message with the appropriate amounts of bits, your selected voice (otherwise a random voice will be chosen), and then the message you want the voice to read out.</p>
            <br/>
            <div class="flex items-stretch">
                <Button variant="ghost" onclick={click_left} disabled={!data.example_messages}><IcBaselineKeyboardDoubleArrowLeft /></Button>
                <div class="bg-bottom bg-no-repeat flex-1"
                     style="background-image: linear-gradient(rgba(59, 7, 100, {ollie_opacity}), rgba(59, 7, 100, {ollie_opacity})), url('/ollieWide-4x.png')">
                    {#await data.example_messages}
                    <Textarea disabled class="text-xs md:text-sm"
                              placeholder="Cheer100 [brian] generation failed ha"/>
                    {:then messages}
                    <Textarea disabled class="text-xs md:text-sm"
                              placeholder="Cheer100 {messages[curr_msg_ix]}"/>
                    {/await}
                </div>
                <Button variant="ghost" onclick={click_right} disabled={!data.example_messages}><IcBaselineKeyboardDoubleArrowRight /></Button>
            </div>
        </div>
        <div class="basis-1/6 md:basis-1/4"></div>
    </div>

    <div class="flex flex-row">
        <div class="basis-1/6 md:basis-1/4"></div>
        <div class="bg-purple-950 basis-2/3 md:basis-1/2 justify-center items-center p-2 rounded-xl border-2 border-yellow-400 text-sm">

            <p><span class="text-yellow-400">NEW:</span> Test out the TTS message you're about to send! No more surprises!</p>
            <p>Note: this is a <span class="text-yellow-400">FREE</span> gratuity being offered, no quality or speed guarantees are made.</p>

            <br/>

            {#if !tts_unlocked}
                <div class="flex flex-row">
                    <Input type="text" placeholder="Enter Access Key..." class="bg-purple-950 placeholder:text-gray-400"
                           bind:value={access_key}
                    />
                    <Button variant="secondary" onclick={async () => {
                        console.log(access_key);
                        unlock({token: access_key});
                    }}><IcBaselineKeyboardDoubleArrowRight /></Button>
                </div>
            {:else}
                <Textarea class="text-xs md:text-sm"
                          style="background-image: linear-gradient(rgb(155, 129, 176));"
                          bind:value={tts_msg}
                />

                <div class="flex flex-row">
                    <select name="voice_name" id="voice_id_dropdown" class="basis-1/4 bg-purple-950" bind:value={voice_id}>
                        {#each data.standard_voices as voice}
                            <option value={voice.voice_id}>{voice.name}</option>
                        {/each}
                    </select>
                    <div class="basis-1/2"></div>
                    <Button variant="secondary" class="basis-1/4" onclick={async () => {
                        const params = {voice_id, tts_msg};
                        const voice_response = await getVoice(params);
                        loaded_voice_data.set(params, voice_response.url);
                    }}><IcBaselineKeyboardDoubleArrowRight /></Button>
                </div>

                <div class="grid grid-cols-2 items-center">
                    {#each loaded_voice_data as [key, audio_s3_key]}
                        <div>{key.tts_msg}</div>
                        <AudioPlayer src={audio_s3_key} label={key.tts_msg} />
                    {/each}
                </div>
            {/if}

        </div>
        <div class="basis-1/6 md:basis-1/4"></div>
    </div>

    <div class="bg-purple-950 p-2 rounded-xl border-2 border-yellow-400">
        <h3 class="text-2xl md:text-3xl font-germania pb-2 md:pt-2 md:pb-4">GIGA Money</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 grid-flow-row-dense gap-3 md:gap-6">
            {#each data.deluxe_voices as voice}
                <div class="bg-slate-900 p-2 rounded-xl border-2 border-yellow-400">
                    <p class="text-xl md:text-2xl">{voice.name}</p>
                    <p class="text-sm md:text-base">{voice.price} bits</p>
                </div>
            {/each}
        </div>
    </div>

    <div class="bg-purple-950 p-2 rounded-xl border-2 border-yellow-400">
        <div class="pb-2 md:pt-2 md:pb-4">
            <h3 class="text-xl md:text-2xl font-germania">Standard Voices</h3>
            <p class="text-sm md:text-base">100 bits</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 grid-flow-row-dense gap-3 md:gap-6">
            {#each data.standard_voices as voice}
                <div class="bg-slate-900 text-base md:text-xl p-2 rounded-xl border-2 border-yellow-400">{voice.name}</div>
            {/each}
        </div>
    </div>
</div>

<div class="flex w-full">
    <div class="basis-1/12"></div>
    <div class="basis-10/12"><Separator /></div>
    <div class="basis-1/12"></div>
</div>

<div class="p-4 text-center text-white font-germania text-xs">
    Not officially associated with <a class="text-yellow-400" href="https://borpa.chat">HannahHyrule</a>
    <br/>
    Developed and hosted by <a class="text-yellow-400" href="https://sigfalt.dev">sigfalt</a>
    <br/>
    TTS powered by <a class="text-yellow-400" href="https://elevenlabs.io/">ElevenLabs</a>
    <br/>
    Source available on <a class="text-yellow-400" href="https://github.com/sigfalt/chat-borpa-tts">Github</a>
</div>


<style>
  select,
  ::picker(select) {
    appearance: base-select;
  }
</style>
