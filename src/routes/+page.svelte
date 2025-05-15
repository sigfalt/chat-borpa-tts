
<script lang="ts">
    import {Separator} from "$lib/components/ui/separator";
    import {Textarea} from "$lib/components/ui/textarea";

    const host = 'tts.borpa.chat';
    const title = `Hannah TTS`;

    const deluxe_voices = [{
        name: 'DeluxePirate',
        price: 1000
    }, {
        name: 'GigaDeluxePirate',
        price: 2000
    }, {
        name: 'GigaDeluxePirateOFHELL',
        price: 2500
    }];

    const standard_voices = [
        'Hiro',
        'Sol',
        'Hannah',
        'Dagoth',
        'Dracula',
        'Goblin',
        'Ranni',
        'Demon',
        'Chief',
        'Nerd',
        'Sad',
        'VillianMommy',
        'Santa',
        'Herbert',
        'Timmy',
        'Cowboy',
        'Dandy',
        'Daddy',
        'Baldi',
        'CursedDoc',
        'Doc',
        'Kawaii',
        'Pirate',
        'Brian'
    ];
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
    <meta property="og:image" content="https://{host}/favicon.png" />
</svelte:head>

<div id="main" class="text-center text-white m-8 font-rowdies space-y-8">
    <h2 class="text-4xl font-germania">Hannah TTS</h2>

    <div class="flex flex-row">
        <div class="basis-1/4"></div>
        <div class="bg-purple-950 basis-1/2 justify-center items-center p-2 rounded-xl border-2 border-yellow-400 text-sm">
            Send a message with the appropriate amounts of bits, your selected voice, and then the message you want the voice to read out.
            <br/>
            <Textarea disabled
                      placeholder="Cheer100 [sol] I don't do moms. Moms do me. Because I'm a subby little bottom. Shy"/>
        </div>
        <div class="basis-1/4"></div>
    </div>

    <div class="bg-purple-950 p-2 rounded-xl border-2 border-yellow-400">
        <h3 class="text-3xl font-germania">GIGA Money</h3>
        <br/>

        <div class="grid grid-cols-3 grid-flow-row-dense gap-6">
            {#each deluxe_voices as voice}
                <div class="bg-slate-900 p-4 rounded-xl border-2 border-yellow-400">
                    <p class="text-2xl">{voice.name}</p>
                    <p class="text-lg">{voice.price} bits</p>
                </div>
            {/each}
        </div>
    </div>

    <div class="bg-purple-950 p-2 rounded-xl border-2 border-yellow-400">
        <h3 class="text-2xl font-germania">Standard Voices</h3>
        <p class="text-lg">100 bits</p>
        <br/>

        <div class="grid grid-cols-4 grid-flow-row-dense gap-6">
            {#each standard_voices as voice}
                <div class="bg-slate-900 text-xl p-2 rounded-xl border-2 border-yellow-400">{voice}</div>
            {/each}
        </div>
    </div>
</div>

<div class="flex w-screen">
    <div class="basis-1/12"></div>
    <div class="basis-10/12"><Separator /></div>
    <div class="basis-1/12"></div>
</div>

<div class="flex w-screen">
    <div class="basis-1/3"></div>
    <div class="basis-1/3 p-4 text-center text-white font-germania text-xs">
        Not officially associated with HannahHyrule
        <br/>
        Hosted by <a class="text-yellow-400" href="https://sigfalt.dev">sigfalt</a>
    </div>
    <div class="basis-1/3"></div>
</div>
