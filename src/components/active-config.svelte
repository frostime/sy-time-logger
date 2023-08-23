<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/active-config.svelte
 LastEditTime : 2023-08-24 00:55:52
 Description  : 
-->
<script lang="ts">
    import { fade, fly } from "svelte/transition";

    // import Active from "./time-logger/active.svelte";
    import Emoji from "@/components/libs/emoji.svelte";
    import AllActives from "./time-logger/all-actives.svelte";
    import { chooseIcon } from "@/components";

    import { activeHub } from "@/actives";
    import { eventBus } from "@/utils";
    import { onDestroy, onMount } from "svelte";

    import {confirm} from "siyuan";

    let rootActive: IActive = null;
    let currentActives: IActive[] = activeHub.getActives(rootActive);

    onMount(() => {
        eventBus.on("on-active-updated", updateActives);
    });

    onDestroy(() => {
        eventBus.off("on-active-updated", updateActives);
    });

    const updateActives = () => {
        currentActives = activeHub.getActives(rootActive);
    };

    let rootStyles = getComputedStyle(document.documentElement);
    const SvgColor = {
        circle: rootStyles.getPropertyValue("--b3-theme-primary"),
        rect: rootStyles.getPropertyValue("--b3-theme-on-primary"),
    };

    let focusedActive: IActive;

    const onclick = (e: CustomEvent<IActive>) => {
        e.preventDefault();
        console.log("select active", e.detail);
        focusedActive = e.detail;
        e.stopPropagation();
    };

    const onchooseicon = () => {
        console.log("choose icon");
        chooseIcon().then((ans: any) => {
            // console.log("choose icon ans", ans);
            let emoji = {
                type: ans.type,
                code: ans.unicode
            };
            focusedActive.emoji = emoji;
        });
    };

    const ondel = () => {
        confirm("确认", "确定要删除?", ()=> {
            activeHub.del(focusedActive);
            focusedActive = null;
        });
    };

    const onsave = () => {
        console.log("save");
        activeHub.update(focusedActive);
        focusedActive = null;
    };

</script>

<main>
    <div
        id="all-actives"
        on:click={() => {
            focusedActive = null;
        }}
        on:keypress={() => {}}
    >
        <AllActives on:click={onclick} actives={currentActives} />
    </div>

    {#if focusedActive}
        <div
            class="fn__flex-column"
            id="selected-active"
            out:fly={{ y: 200, duration: 100 }}
            in:fly={{ y: 200, duration: 100 }}
        >
            <div style="display: flex; padding: 16px 24px;">
                <div class="b3-label__text fn__flex-1"
                >
                    {focusedActive.id}
                </div>
                <div class="b3-tooltips b3-tooltips__s"
                    aria-label="删除"
                    on:click={ondel}
                    on:keypress={() => {}}
                >
                    <svg style="width: 20px; height: 20px; color: var(--b3-theme-error);"
                    >
                        <use xlink:href="#iconTrashcan"></use>
                    </svg>
                </div>
            </div>
            <div class="fn__flex b3-label">
                <div class="fn__flex-1">
                    标题
                    <div class="b3-label__text">项目的标题</div>
                </div>
                <span class="fn__space" />
                <div class="fn__flex-center fn__size200 attr-value">
                    <input
                        class="b3-text-field fn__flex-center fn__size200"
                        bind:value={focusedActive.title}
                    />
                </div>
            </div>
            <div class="fn__flex b3-label">
                <div class="fn__flex-1">
                    图标
                    <div class="b3-label__text">点击右侧更改图标</div>
                </div>
                <span class="fn__space" />
                <div class="fn__flex-center fn__size200 attr-value"
                    style="cursor: pointer;"
                    on:click={onchooseicon}
                    on:keypress={() => {}}
                >
                    <Emoji
                        type={focusedActive.emoji.type}
                        code={focusedActive.emoji.code}
                        width={40}
                        unicodeFontSize={30}
                    />
                </div>
            </div>
            <div class="fn__flex b3-label">
                <div class="fn__flex-1">
                    群组
                    <div class="b3-label__text">群组项目</div>
                </div>
                <span class="fn__space" />
                <div class="fn__flex-center fn__size200 attr-value">
                    <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={focusedActive.isGroup}
                    />
                </div>
            </div>
            <div class="fn__flex b3-label">
                <div class="fn__flex-1">
                </div>
                <span class="fn__space" />
                <div class="fn__flex-center fn__size200 attr-value"
                    style="display: flex; gap: 10px;"
                >
                    <button
                        class="b3-button b3-button--cancel"
                        on:click={() => {
                            focusedActive = null;
                        }}
                    >
                        取消
                    </button>
                    <button
                        class="b3-button b3-button--text"
                        on:click={onsave}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    {/if}
</main>

<div id="btn-add" style="width: 24px; height: 24px; {focusedActive? "display: none" : ""}"
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill={SvgColor.circle} />
        <rect x="10" y="5" width="4" height="14" fill={SvgColor.rect} />
        <rect x="5" y="10" width="14" height="4" fill={SvgColor.rect} />
    </svg>
</div>

<style lang="scss">
    main {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    div.attr-value {
        display: flex;
        justify-content: end;
        align-items: center;
    }

    main > div#selected-active {
        flex: 1;

        border-top: 3px solid var(--b3-border-color);
        border-left: 3px solid var(--b3-border-color);
        border-right: 3px solid var(--b3-border-color);
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        margin-left: 10px;
        margin-right: 10px;
        padding: 10px;
    }

    div#btn-add {
        position: absolute;
        right: 20px;
        bottom: 20px;
        border-radius: 50%;
        &:hover {
            //阴影
            box-shadow: 0 0 10px 2px var(--b3-theme-primary-light);
        }
    }
</style>
