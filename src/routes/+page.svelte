
<script lang="ts">
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
    <meta property="og:title" content="{title}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="{host}" />
<!--    <meta property="og:image" content="https://{host}/favicon.png" />-->
</svelte:head>

<div id="main" class="text-center text-white m-16 font-germania space-y-10 text-5xl">
    <h2>Hannah TTS</h2>

    <div class="bg-purple-950 p-4 rounded-xl border-2 border-yellow-400">
        <h3>GIGA Money</h3>
        <br/>

        <div class="grid grid-cols-3 grid-flow-row-dense gap-8">
            {#each deluxe_voices as voice}
                <div class="bg-slate-900 p-4 rounded-xl border-2 border-yellow-400">
                    {voice.name}
                    <p class="text-xl">{voice.price} bits</p>
                </div>
            {/each}
        </div>
    </div>

    <div class="bg-purple-950 p-4 rounded-xl border-2 border-yellow-400">
        <h3>Standard Voices</h3>
        <p class="text-xl">100 bits</p>
        <br/>

        <div class="grid grid-cols-4 grid-flow-row-dense gap-8">
            {#each standard_voices as voice}
                <div class="bg-slate-900 p-4 rounded-xl border-2 border-yellow-400">{voice}</div>
            {/each}
        </div>
    </div>
</div>
