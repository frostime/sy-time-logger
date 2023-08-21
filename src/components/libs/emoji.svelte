<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:42:06
 FilePath     : /src/components/libs/emoji.svelte
 LastEditTime : 2023-08-21 16:29:21
 Description  : 
-->
<script lang="ts">
    export let type: string;
    export let code: string;
    export let width: string | number = null;
    let styleWidth: string = "";
    let unicodeFontSize: number = 30;
    $: {
        if (width) {
            if (typeof width === "number") {
                styleWidth = `width: ${width}px; height: ${width}px;`;
                unicodeFontSize = width * 0.75;
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

<div class="emojis" style="{styleWidth}">
    {#if type === "custom"}
        <img class="" src="/emojis/{code}" alt="">
    {:else}
        <span class="emoji-unicode"
            style="height: {width}; width: {width}; line-height: {width}; font-size: {unicodeFontSize}px;"
        >
            {parseEmoji(code)}
        </span>
    {/if}
</div>

<style>
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
