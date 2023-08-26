<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 15:16:17
 FilePath     : /src/components/dashboard/timelog-item.svelte
 LastEditTime : 2023-08-27 01:14:46
 Description  : 
-->
<script lang="ts">
    import Active from "@/components/time-logger/active.svelte";

    export let interval: IInterval;
    export let log: ITimeLog;

    let active = log.active;
</script>

<div class="timelog-item">
    <div>
        <Active
            size={{ item: 40, emoji: 30, title: 12, emojiFontsize: 25 }}
            {active}
            showTitle={false}
            style={"margin-right: 5px;"}
        />
    </div>
    <div class="timelog"
    >
        <div class="timelog-title">
            {active.title}
        </div>
        <div class="timelog-interval">
            {interval.beg} - {interval.end}
        </div>
        {#if log.memo != ""}
            <div class="timelog-memo">
                {log.memo}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    div.timelog-item {
        display: flex;
        gap: 5px;

        // border-top: 1px solid var(--b3-border-color);
        border-bottom: 2px dashed var(--b3-border-color);
        margin-bottom: 10px;
        padding-top: 10px;
        padding-bottom: 10px;

        align-items: center;

        position: relative;

        .timelog {
            display: flex;
            flex-direction: column;
            flex: 1;
            gap: 4px;
            .timelog-title {
                flex: 0;
                font-size: 14px;
                font-weight: bold;
                color: var(--b3-protyle-inline-em-color);
            }
            .timelog-interval {
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
            }
        }
    }
</style>
