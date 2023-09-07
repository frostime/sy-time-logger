<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:42:06
 FilePath     : /src/components/libs/emoji.svelte
 LastEditTime : 2023-09-07 17:06:21
 Description  : 
-->
<script lang="ts">
    export let type: string;
    export let code: string;
    export let width: string | number = null;
    export let unicodeFontSize: number = 30;
    let styleWidth: string = "";
    $: {
        if (width) {
            if (typeof width === "number") {
                styleWidth = `width: ${width}px; height: ${width}px;`;
            } else {
                styleWidth = `width: ${width}; height: ${width};`;
            }
        }
    }

    function parseEmoji(code: string) {
        try {
            let emoji = String.fromCodePoint(parseInt(code, 16));
            return emoji;
        } catch (error) {
            return "";
        }
    }

</script>

<div class="emoji-div" style="{styleWidth}">
    {#if type === "custom"}
        <img class="" src="/emojis/{code}" alt="" style="width: 75%;">
    {:else if type === "#icon"}
        <svg style="margin: 5px;">
            <use xlink:href="{code}"></use>
        </svg>
    {:else}
        <span class="emoji-unicode"
            style="font-size: {unicodeFontSize}px;"
        >
            {parseEmoji(code)}
        </span>
    {/if}
</div>

<style>
    .emoji-div {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .emoji-unicode {
        /* height: 50px;
        width: 50px; */
        /* cursor: pointer; */
        /* font-size: 38px; */
        /* line-height: 50px; */
        transition: var(--b3-transition);
        text-align: center;
        font-family: var(--b3-font-family-emoji);
    }
</style>
