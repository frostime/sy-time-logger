<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:55:13
 FilePath     : /src/components/time-logger/active.svelte
 LastEditTime : 2023-08-21 20:18:13
 Description  : 单个活动项目
-->
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Emoji from "@/components/libs/emoji.svelte";

    export let size: { item: number; emoji: number; title: number; emojiFontsize?: number };
    export let active: IActive;
    export let showTitle: boolean = true;
    // let emoji: { type: string; code: string };
    // let title: string;

    let height = active.title ? size.emoji + size.title + 6 : size.emoji;

    let subActiveCnt = 0;
    let styleDisplayCnt = subActiveCnt == 0 ? "display: none;" : "";


    const dispatch = createEventDispatcher();
    const onclick = () => {
        dispatch("click");
    };

</script>

<div
    class="active b3-tooltips b3-tooltips__s"
    aria-label={active.title}
    style="width: {size.item}px; height: {height}px;"
    on:click={onclick}
    on:keypress={() => {}}
>
    <div class="sub-actives" style={styleDisplayCnt}>{subActiveCnt}</div>
    <Emoji type={active.emoji.type} code={active.emoji.code} width="{size.emoji}px" unicodeFontSize="{size?.emojiFontsize}"/>
    {#if showTitle}
        <div
            class="hint"
            style="font-size: {size.title}px; width: {size.item}px; line-height: {size.title +
                6}px"
        >
            {active.title}
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
