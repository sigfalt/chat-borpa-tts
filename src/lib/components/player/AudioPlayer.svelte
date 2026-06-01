<script>
    /**
     * AudioPlayer.svelte
     * Minimal play/pause audio player component.
     *
     * Props:
     *   src      {string}                          - Required. URL of the audio file.
     *   label    {string}                          - Accessible name for the player (e.g. the TTS
     *                                                message text). Used as aria-label on the button.
     *                                                Defaults to "Audio".
     *   preload  {"none"|"metadata"|"auto"}        - Passed through to the <audio> element. Use "none"
     *                                                on pages with many players to defer network
     *                                                requests until play is pressed. Defaults to
     *                                                "metadata".
     *   autoplay {boolean}                         - Whether to begin playback immediately on mount.
     *                                                Defaults to false. Note: most browsers block
     *                                                autoplay without prior user interaction.
     */

    export let src;
    export let label = "Audio";
    /** @type {"none"|"metadata"|"auto"} */
    export let preload = "metadata";
    export let autoplay = false;

    /** @type {HTMLAudioElement} */
    let audio;

    /** @type {"loading"|"ready"|"error"} */
    let status = "loading";

    let playing = false;

    function onCanPlay() {
        if (status !== "error") status = "ready";
    }

    function onError() {
        status = "error";
    }

    function onPlay() {
        playing = true;
    }

    function onPause() {
        playing = false;
    }

    function onEnded() {
        playing = false;
    }

    function toggle() {
        if (!audio || status === "loading" || status === "error") return;

        if (playing) {
            audio.pause();
        } else {
            // Replay from start if the track has finished.
            if (audio.ended) audio.currentTime = 0;
            audio.play();
        }
    }

    $: icon = status === "loading" ? "⏳"
        : status === "error"       ? "⚠️"
            : playing              ? "⏸"
                :                    "▶";

    $: ariaLabel = status === "loading" ? `${label} — loading`
        : status === "error"            ? `${label} — failed to load`
            : playing                   ? `Pause ${label}`
                : audio?.ended          ? `Replay ${label}`
                    :                     `Play ${label}`;

    $: disabled = status === "loading" || status === "error";
</script>

<button
        class="audio-player"
        class:is-error={status === "error"}
        class:is-disabled={disabled}
        class:is-playing={playing}
        on:click={toggle}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        title={ariaLabel}
>
    <span class="icon" aria-hidden="true">{icon}</span>
</button>

<!-- audio element intentionally invisible -->
<audio
        bind:this={audio}
        {src}
        {preload}
        {autoplay}
        on:canplay={onCanPlay}
        on:error={onError}
        on:ended={onEnded}
        on:play={onPlay}
        on:pause={onPause}
></audio>

<style>
    .audio-player {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        /* WCAG 2.5.5 AAA target size */
        width: 44px;
        height: 44px;

        border: 1px solid currentColor;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;

        font-size: 1.1rem;
        line-height: 1;
        
        color: inherit;

        transition: opacity 0.15s ease, background-color 0.15s ease;
    }

    .audio-player:hover:not(.is-disabled) {
        background-color: color-mix(in srgb, currentColor 10%, transparent);
    }

    .audio-player:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    .audio-player.is-disabled {
        cursor: default;
        opacity: 0.5;
    }

    .audio-player.is-error {
        opacity: 0.75;
    }

    /* nudge play icon to visual center */
    .audio-player:not(.is-playing) .icon {
        padding-inline-start: 2px;
    }
</style>