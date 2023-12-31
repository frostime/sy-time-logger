<script lang="ts">
    import { fly } from 'svelte/transition';

    import { time2str } from "@/utils";
    import Active from "./active.svelte";
    import { TimeLogSession } from "@/core";

    import { eventBus, i18n } from "@/utils";
    import { onDestroy, onMount } from "svelte";

    import { inputDialog } from "@/utils";

    export let session: TimeLogSession;
    let active: IActive;
    $: active = session.active;

    const updateActive = () => {
        active = session.active;
    };

    //@ts-ignore
    // const emoji = window.siyuan.emojis;
    // let active: IActive = {
    //     emoji: {
    //         type: "custom",
    //         code: emoji[0].items[0].unicode,
    //     },
    //     title: "大声阅读论文",
    // };

    // let session: TimeLogSession = sessionHub.new(active);

    onMount(() => {
        console.debug("Mount session", session);
    });

    onDestroy(() => {
        console.debug("Destroy session", session);
    });

    let timer: string = time2str(session.elapsed / 1000);
    const update = (elapsed) => {
        timer = time2str(elapsed / 1000);
    };
    session.addCallback(update);
    session.updateActiveCallback = updateActive;

    type Status = "running" | "pause" | "stop";
    let status: Status = session.status;

    const start = () => {
        if (status == "stop") return;
        status = "running";
        session.start();
    };

    const pause = () => {
        if (status == "stop") return;
        status = "pause";
        session.pause();
    };

    const stop = () => {
        status = "stop";
        session.stop();
        eventBus.emit("on-session-stop", session);
    };

    const del = (e: MouseEvent) => {
        session.del();
        eventBus.emit("on-session-del", session);
        e.stopPropagation();
    };
</script>

<div class="running-active" out:fly="{{ x: 200, duration: 250 }}">
    <div>
        <Active
            size={{ item: 40, emoji: 30, title: 12, emojiFontsize: 25 }}
            {active}
            showTitle={false}
            style={"margin-right: 5px;"}
        />
    </div>
    <div class="running"
        on:keypress={() => {}}
        on:click={() => {
            inputDialog(i18n.ui_logging_active.memo, session.memo, i18n.ui_logging_active.input_memo).then((memo) => {
                session.memo = memo;
            });
        }}
    >
        <div class="running-title">
            {active.title}
        </div>
        <div class="running-time">
            {timer}
        </div>
        <div class="running-memo">
            {session.memo}
        </div>
    </div>
    <div class="action-button">
        {#if status == "running"}
            <button class="btn-pause" on:click={pause}>{i18n.ui_logging_active.pause}</button>
        {:else if status == "pause"}
            <button class="btn-start" on:click={start}>{i18n.ui_logging_active.start}</button>
        {/if}
        <button class="btn-stop" on:click={stop}>{i18n.ui_logging_active.stop}</button>
    </div>
    <div class="close-action" on:click={del} on:keypress={() => {}}>
        <svg><use xlink:href="#iconClose" /></svg>
    </div>
</div>

<style lang="scss">
    div.running-active {
        display: flex;
        gap: 5px;

        // border-top: 1px solid var(--b3-border-color);
        border-bottom: 2px dashed var(--b3-border-color);
        margin-bottom: 10px;
        padding-top: 10px;
        padding-bottom: 10px;

        align-items: center;

        position: relative;

        .running {
            display: flex;
            flex-direction: column;
            flex: 1;
            gap: 4px;
            min-width: 105px;
            overflow-x: hidden; //配合下面的 text-overflow 使用
            .running-title {
                flex: 0;
                font-size: 14px;
                font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
            }
            .running-time {
                flex: 1;
                font-size: 24px;
                font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
            }

            .running-memo {
                flex: 0;
                margin: 0;
                padding: 0;
                font-size: 12px;
                // font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
                overflow-x: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        div.close-action {
            position: absolute;
            top: 0px;
            right: 10px;
            width: 10px;
            height: 10px;
            > svg {
                width: 100%;
                height: 100%;
                color: var(--b3-theme-on-surface);
                &:hover {
                    color: var(--b3-theme-primary);
                }
            }
        }
    }

    div.action-button {
        margin-right: 5px;
        .btn-start {
            background-color: rgb(62, 189, 124);
            color: white;
            border: 1px solid var(--b3-border-color);
            border-radius: var(--b3-border-radius);
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            &:hover {
                box-shadow: 0 0 0 1px rgb(62, 189, 124);
            }
        }
        .btn-pause {
            background-color: rgb(31, 120, 221);
            color: white;
            border: 1px solid var(--b3-border-color);
            border-radius: var(--b3-border-radius);
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            &:hover {
                box-shadow: 0 0 0 1px rgb(31, 120, 221);
            }
        }
        .btn-stop {
            background-color: rgb(226, 133, 133);
            color: white;
            border: 1px solid var(--b3-border-color);
            border-radius: var(--b3-border-radius);
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            &:hover {
                box-shadow: 0 0 0 1px rgb(226, 133, 133);
            }
        }
    }
</style>
