<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:42:06
 FilePath     : /src/components/libs/emoji.svelte
 LastEditTime : 2023-08-20 21:53:42
 Description  : 
-->
<script lang="ts">
    export let type: string;
    export let code: string;
    export let width: string = null;
    let styleWidth: string = width ? `width: ${width}` : "";

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
        <span class="b3-menu__icon">{parseEmoji(code)}</span>
    {/if}
</div>
