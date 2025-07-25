
<script lang="ts">
    import {onMount} from "svelte";
    import {Separator} from "$lib/components/ui/separator";
    import {Textarea} from "$lib/components/ui/textarea";
    import type {PageProps} from "./$types";

    const host = 'tts.borpa.chat';
    const title = `Hannah TTS`;

    let { data }: PageProps = $props();

    let curr_msg_ix = $state(0);
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
            Send a message with the appropriate amounts of bits, your selected voice, and then the message you want the voice to read out.
            <br/>
            <div class="bg-bottom bg-no-repeat"
                 style="background-image: linear-gradient(rgba(59, 7, 100, {ollie_opacity}), rgba(59, 7, 100, {ollie_opacity})), url('/ollieWide-4x.png')">
                {#await data.example_messages}
                <Textarea disabled class="text-xs md:text-sm"
                      placeholder="Cheer100 [brian] generation failed ha"/>
                {:then messages}
                <Textarea disabled class="text-xs md:text-sm"
                      placeholder="Cheer100 {messages[curr_msg_ix]}"/>
                {/await}
            </div>
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
                <div class="bg-slate-900 text-base md:text-xl p-2 rounded-xl border-2 border-yellow-400">{voice}</div>
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
    Source available on <a class="text-yellow-400" href="https://github.com/sigfalt/chat-borpa-tts">Github</a>
</div>
