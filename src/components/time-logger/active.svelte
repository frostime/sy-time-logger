<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:55:13
 FilePath     : /src/components/time-logger/active.svelte
 LastEditTime : 2023-08-21 19:27:17
 Description  : 单个活动项目
-->
<script lang="ts">
    import Emoji from "@/components/libs/emoji.svelte";

    export let size: { item: number; emoji: number; hint: number };
    export let emoji: { type: string; code: string };
    export let hint: string = null;
    // export let active: IActive;

    let height = hint ? size.emoji + size.hint + 6 : size.emoji;

    let subActiveCnt = 0;
    let styleDisplayCnt = subActiveCnt == 0 ? "display: none;" : "";
</script>

<div
    class="active b3-tooltips b3-tooltips__s"
    aria-label={hint}
    style="width: {size.item}px; height: {height}px;"
>
    <div class="sub-actives" style={styleDisplayCnt}>{subActiveCnt}</div>
    <Emoji type={emoji.type} code={emoji.code} width="{size.emoji}px" />
    {#if hint}
        <div
            class="hint"
            style="font-size: {size.hint}px; width: {size.item}px; line-height: {size.hint +
                6}px"
        >
            {hint}
        </div>
    {/if}
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
        cursor: pointer;

        position: relative;

        div.sub-actives {
            right: 0px;
            top: 0px;
            position: absolute;
            line-height: 16px;
            padding: 0 4px;
            color: var(--b3-theme-on-surface);
            border-radius: var(--b3-border-radius);
            font-size: 12px;
            user-select: none;
            height: 16px;
            background-color: var(--b3-theme-surface);
            z-index: 1;
        }
    }
    div.hint {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
</style>
