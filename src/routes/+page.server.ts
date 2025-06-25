import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    return {
        deluxe_voices: await fetch("/deluxe_voices.json")
            .then((res) => res.json()),
        standard_voices: await fetch("/standard_voices.json")
            .then((res) => res.json()),
        example_messages: await fetch("/example_messages.json")
            .then((res) => res.json())
            .then((data) => {
                // shuffle example messages
                for (let i = data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [data[i], data[j]] = [data[j], data[i]];
                }
                return data;
            }),
    }
}