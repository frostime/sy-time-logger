<script lang="ts">
    import Active from "./active.svelte";

    let timer: string = "00:04:17";
    //@ts-ignore
    const emoji = window.siyuan.emojis;
    let active = {
        emoji: {
            type: "custom",
            code: emoji[0].items[0].unicode,
        },
        hint: "大声阅读论文",
    };

    type Status = "running" | "pause" | "stop";
    let status: Status = "running";


</script>

<div class="running-active">
    <div>
        <Active
            size={{ item: 40, emoji: 30, hint: 12 }}
            emoji={active.emoji}
        />
    </div>
    <div class="running">
        <div class="runnint-title">
            {active.hint}
        </div>
        <div class="running-time">
            {timer}
        </div>
    </div>
    <div class="action-button">
        {#if status == "running"}
            <button class="btn-pause" on:click={() => {status = "pause"}}>暂停</button>
        {:else if status == "pause"}
            <button class="btn-start" on:click={() => {status = "running"}}>继续</button>
        {/if}
        <button class="btn-stop">结束</button>
    </div>
</div>

<style lang="scss">
    div.running-active {
        display: flex;
        gap: 15px;

        // border-top: 1px solid var(--b3-border-color);
        border-bottom: 2px dashed var(--b3-border-color);
        margin-bottom: 10px;
        padding-top: 10px;
        padding-bottom: 10px;

        align-items: center;

        .running {
            display: flex;
            flex-direction: column;
            flex: 1;
            gap: 4px;
            .runnint-title {
                flex: 0;
                font-size: 14px;
                // font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
            }
            .running-time {
                flex: 1;
                font-size: 24px;
                font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
            }
        }

        .fn__space {
            width: 4px;
            display: inline-block;
            flex-shrink: 0;
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
