<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/active-config.svelte
 LastEditTime : 2023-08-23 22:41:06
 Description  : 
-->
<script lang="ts">
    import { fly } from "svelte/transition";

    import Emoji from "@/components/libs/emoji.svelte";
    import AllActives from "./time-logger/all-actives.svelte";
    import { activeHub } from "@/actives";

    let currentActives: IActive[] = activeHub.rootActives;

    let rootStyles = getComputedStyle(document.documentElement);
    const SvgColor = {
        circle: rootStyles.getPropertyValue("--b3-theme-primary"),
        rect: rootStyles.getPropertyValue("--b3-theme-on-primary"),
    };

    let selectedActive: IActive;

    const onclick = (e: CustomEvent<IActive>) => {
        e.preventDefault();
        console.log("select active", e.detail);
        selectedActive = e.detail;
        e.stopPropagation();
    };
</script>

<main>
    <div id="all-actives"
        on:click={() => { selectedActive = null;}}
        on:keypress={() => {}}
    >
        <AllActives on:click={onclick} actives={currentActives} />
    </div>

    {#if selectedActive}
        <div id="selected-active"
            out:fly="{{ y: 200, duration: 100 }}"
            in:fly="{{ y: 200, duration: 100 }}"
        >
            <Emoji
                type={selectedActive.emoji.type}
                code={selectedActive.emoji.code}
                width={50}
                unicodeFontSize={30}
            />
        </div>
    {/if}
</main>

<div id="btn-add" style="width: 24px; height: 24px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill={SvgColor.circle} />
        <rect x="10" y="5" width="4" height="14" fill={SvgColor.rect} />
        <rect x="5" y="10" width="14" height="4" fill={SvgColor.rect} />
    </svg>
</div>

<style lang="scss">

    div#selected-active {
        border-top: 2px solid var(--b3-border-color);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        margin-left: 0px;
        margin-right: 0px;
        padding: 10px;
    }

    div#btn-add {
        position: absolute;
        right: 12px;
        bottom: 12px;
        border-radius: 50%;
        &:hover {
            //阴影
            box-shadow: 0 0 10px 2px var(--b3-theme-primary-light);
        }
    }
</style>
