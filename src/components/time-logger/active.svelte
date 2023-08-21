<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:55:13
 FilePath     : /src/components/time-logger/active.svelte
 LastEditTime : 2023-08-21 17:00:53
 Description  : 单个活动项目
-->
<script lang="ts">
    import Emoji from "@/components/libs/emoji.svelte";

    export let size: { item: number; emoji: number; hint: number };
    export let emoji: { type: string; code: string };
    export let hint: string = "说明";
</script>

<div
    class="active"
    style="width: {size.item}px; height: {size.emoji + size.hint + 6}px;"
>
    <Emoji type={emoji.type} code={emoji.code} width="{size.emoji}px" />
    <div
        class="hint"
        style="font-size: {size.hint}px; width: {size.item}px; line-height: {size.hint +6}px"
    >
        {hint}
    </div>
</div>

<style lang="scss">
    div.active {
        height: 100%;
        width: 100%;
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    div.hint {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
</style>
