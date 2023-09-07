<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/active-config.svelte
 LastEditTime : 2023-09-07 18:32:36
 Description  : 
-->
<script lang="ts">
    import { fade, fly } from "svelte/transition";

    // import Active from "./time-logger/active.svelte";
    import Emoji from "@/components/libs/emoji.svelte";
    import AllActivesGrid from "./time-logger/all-actives-grid.svelte";
    import ActivesList from "./time-logger/actives-list.svelte";
    import { chooseIcon } from "@/components";

    import { activeHub, ActiveHub } from "@/core";
    import { confirmDialog, eventBus } from "@/utils";
    import { onDestroy, onMount } from "svelte";

    import { confirm, Dialog, showMessage } from "siyuan";

    let currentGroup: TActiveGroupID = "";
    let currentActives: IActive[] = activeHub.getGroupActives(currentGroup);

    let disablGroupConfig = true;

    onMount(() => {
        eventBus.on("on-active-updated", updateActives);
    });

    onDestroy(() => {
        eventBus.off("on-active-updated", updateActives);
    });

    const updateActives = () => {
        console.groupCollapsed("sy-time-logger: updateActives")
        console.log("Update Current Actives in group", currentGroup);
        currentActives = activeHub.getGroupActives(currentGroup);
        console.log(currentActives);
        console.groupEnd();
    };

    let rootStyles = getComputedStyle(document.documentElement);
    const SvgColor = {
        circle: rootStyles.getPropertyValue("--b3-theme-primary"),
        rect: rootStyles.getPropertyValue("--b3-theme-on-primary"),
    };

    let focusedActive: IActive;

    const onclick = (e: CustomEvent<IActive>) => {
        e.preventDefault();
        console.groupCollapsed("sy-time-logger: Config Active")
        let active = e.detail;
        console.log("select active", active);
        if (active.isGroup === true) {
            currentGroup = active.id;
            updateActives();
        } else {
            focusedActive = e.detail;
            console.log("focusedActive", focusedActive);
        }
        console.groupEnd();
        e.stopPropagation();
    };

    const onchooseicon = () => {
        console.log("choose icon");
        chooseIcon().then((ans: any) => {
            console.log("choose icon", ans);
            let emoji = {
                type: ans.type,
                code: ans.unicode,
            };
            focusedActive.emoji = emoji;
        });
    };

    const ondel = () => {
        if (focusedActive.isGroup) {
            let cnt = activeHub.groupActiveCount(focusedActive.id);
            if (cnt > 0) {
                showMessage("不允许删除非空的群组", 5000, "error");
                return;
            }
        }
        confirm("确认", "<p>确定要删除?</p><p>删除后所有相关联的记录都将无效!</p>", () => {
            activeHub.del(focusedActive);
            if (focusedActive.isGroup) {
                currentGroup = focusedActive.groupId ?? ActiveHub.RootGroup;
                updateActives();
            }
            focusedActive = null;
        });
    };

    const add = () => {
        focusedActive = {
            emoji: {
                type: "symbols",
                code: "1f518",
            },
            title: "新建项目",
            isGroup: false,
            id: undefined,
            groupId: currentGroup === "" ? undefined : currentGroup
        };
        disablGroupConfig = currentGroup !== ""; //暂时不允许在群组内创建群组
    };

    const onsave = () => {
        console.log("save");
        if (focusedActive.id !== undefined) {
            activeHub.update(focusedActive);
        } else {
            activeHub.add(focusedActive);
            disablGroupConfig = true;
        }
        focusedActive = null;
    };

    const onreordered = (e: CustomEvent<IActive[]>) => {
        console.log("reordered", e.detail);
        // activeHub.updateActives(e.detail);
        activeHub.setGroupActives(e.detail, currentGroup);
    };

    const onmovetogroup = () => {
        console.log("move to group", focusedActive);
        let groups: IActive[] = activeHub.allGroups().filter((active) => active.id !== currentGroup);
        let rootGroup: IActive = {
            id: "",
            title: "顶层",
            emoji: {
                type: "symbols",
                code: "1f518",
            }
        };
        groups = [rootGroup, ...groups];
        // let dialog = new Dialog({
        //     title: "移动到群组",
        //     content: "<div id='move-to-group' style=\"height: 100%;\"></div>",
        //     width: "250px",
        //     height: "350px",
        // });
        let selectedActive: IActive;
        let dialog: Dialog = confirmDialog(
            "移动到群组",
            "<div id='move-to-group' style=\"height: 100%;\"></div>",
            () => {
                console.log("selectedActive", selectedActive);
                if (selectedActive?.isGroup === true && selectedActive?.id !== focusedActive.groupId) {
                    focusedActive.isGroup = false;
                    focusedActive.groupId = selectedActive.id;
                }
            }
        );
        let container = dialog.element.querySelector(".b3-dialog__container") as HTMLElement;
        container.style.maxHeight = "400px";
        let ele = dialog.element.querySelector("#move-to-group") as HTMLElement;
        let activeList = new ActivesList({
            target: ele,
            props: {
                actives: groups
            }
        });
        activeList.$on("click", (e: CustomEvent<IActive>) => {
            selectedActive = e.detail;
        });
    };

</script>

<main>
    <div class="block__icons">
        <div class="fn__flex-1">
            群组: {currentGroup == ""? "无" : activeHub.get(currentGroup).title}
        </div>
        <div class="toolbar__item"
            style="{currentGroup === "" ? "display: none;" : ""}"
            on:click={() => {
                focusedActive = null;
                currentGroup = ActiveHub.RootGroup;
                updateActives();
            }}
            on:keydown={() => {}}
        >
            <svg>
                <use xlink:href="#iconBack"></use>
            </svg>
        </div>
        <div class="toolbar__item"
            style="{currentGroup === "" ? "display: none;" : ""}"
            on:click={() => {
                let groupActive = activeHub.get(currentGroup);
                focusedActive = groupActive;
            }}
            on:keydown={() => {}}
        >
            <svg>
                <use xlink:href="#iconSettings"></use>
            </svg>
        </div>
    </div>
    <div
        id="all-actives"
        on:click={() => {
            focusedActive = null;
        }}
        on:keypress={() => {}}
    >
        <AllActivesGrid on:click={onclick} actives={currentActives} dragDisabled={false} 
            on:reordered={onreordered}
        />
    </div>

    {#if focusedActive}
        <div
            id="selected-active"
            out:fly={{ y: 200, duration: 100 }}
            in:fly={{ y: 200, duration: 100 }}
        >
            <div style="display: flex; padding: 16px 24px; gap: 25px;">
                <div class="b3-label__text">
                    {focusedActive.id ?? "新建项目"}
                </div>
                <div class="b3-label__text">
                    群组:
                    {#if focusedActive?.groupId}
                        {activeHub.get(focusedActive.groupId).title}
                    {:else}
                        无
                    {/if}
                </div>
                <div class="fn__flex-1"></div>
                {#if focusedActive.id}
                    <div
                        class="b3-tooltips b3-tooltips__s"
                        style="{focusedActive.isGroup === true ? 'display: none' : ''}"
                        aria-label="加入群组"
                        on:click={onmovetogroup}
                        on:keypress={() => {}}
                    >
                        <svg
                            style="width: 20px; height: 20px; color: var(--b3-theme-error);"
                        >
                            <use xlink:href="#iconMoveToGroup" />
                        </svg>
                    </div>
                    <div
                        class="b3-tooltips b3-tooltips__s"
                        aria-label="删除"
                        on:click={ondel}
                        on:keypress={() => {}}
                    >
                        <svg
                            style="width: 20px; height: 20px; color: var(--b3-theme-error);"
                        >
                            <use xlink:href="#iconTrashcan" />
                        </svg>
                    </div>
                {/if}
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
                <div
                    class="fn__flex-center fn__size200 attr-value"
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
                        disabled={disablGroupConfig}
                        bind:checked={focusedActive.isGroup}
                    />
                </div>
            </div>
            <div class="fn__flex b3-label">
                <div class="fn__flex-1" />
                <span class="fn__space" />
                <div
                    class="fn__flex-center fn__size200 attr-value"
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
                    <button class="b3-button b3-button--text" on:click={onsave}>
                        保存
                    </button>
                </div>
            </div>
        </div>
    {/if}
</main>

<div
    id="btn-add"
    style="width: 24px; height: 24px; {focusedActive ? 'display: none' : ''}"
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
    on:click={add}
    on:keypress={() => {}}
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

    main > div.block__icons {
        padding-left: 25px;
        padding-right: 25px;
        background-color: var(--b3-theme-primary);
        color: var(--b3-theme-on-primary);
        >.toolbar__item {
            color: var(--b3-theme-on-primary);
        }
    }

    main > div#selected-active {
        flex: 1;

        display: flex;
        flex-direction: column;

        box-shadow: 0px -1px 10px -5px var(--b3-theme-on-surface);

        // border-top: 3px solid var(--b3-border-color);
        // border-left: 3px solid var(--b3-border-color);
        // border-right: 3px solid var(--b3-border-color);
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
