<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-22 19:43:15
 FilePath     : /src/components/icon-chooser/index.svelte
 LastEditTime : 2023-08-22 20:42:41
 Description  : 
-->
<script lang="ts">
    // import Emoji from "@/components/libs/emoji.svelte"
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let types = [
        "custom",
        "objects",
        "nature",
        "activity",
        "food",
        "travel",
        "symbols",
    ];

    const init = () => {
        let emojis: {
            [key: string]: {
                items: any[];
                title: string;
            };
        } = {};
        for (let type of types) {
            emojis[type] = {
                items: [],
                title: "",
            };
        }
        //@ts-ignore
        for (let emoji of window.siyuan.emojis) {
            let id = emoji.id;
            if (id in emojis) {
                emojis[id].items = emoji.items;
                emojis[id].title = emoji.title;
            }
        }
        return emojis;
    };

    let emojis = init();

    function parseEmoji(code: string) {
        try {
            let emoji = String.fromCodePoint(parseInt(code, 16));
            return emoji;
        } catch (error) {
            return "";
        }
    }

    const onclick = (type, unicode) => {
        // console.log(type, unicode);
        dispatch("choose", {
            type,
            unicode,
        });
    };

</script>

<div class="emojis">
    <div class="emojis__panel">
        {#each types as type, i}
            {#if type === "custom"}
                {#if emojis["custom"].items.length > 0}
                    <div class="emojis__title" data-type={i}>
                        {emojis[type].title}
                    </div>
                    {#each emojis[type].items as emoji}
                        <button
                            data-unicode={emoji.unicode}
                            class="emojis__item ariaLabel"
                            aria-label={emoji.description}
                            on:click={() => onclick(type, emoji.unicode)}
                        >
                            <img
                                class=""
                                src="/emojis/{emoji.unicode}"
                                alt=""
                            />
                            <!-- <Emoji type="custom" code={emoji.unicode}/> -->
                        </button>
                    {/each}
                {/if}
            {:else}
                <div class="emojis__title" data-type={i}>{emojis[type].title}</div>
                <div style="min-height:336px" class="emojis__content">
                    {#each emojis[type].items as emoji}
                        <button
                            data-unicode={emoji.unicode}
                            class="emojis__item ariaLabel"
                            aria-label={emoji.description}
                            on:click={() => onclick(type, emoji.unicode)}
                        >
                            {parseEmoji(emoji.unicode)}
                        </button>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</div>

