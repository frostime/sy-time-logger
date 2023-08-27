<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 15:16:17
 FilePath     : /src/components/dashboard/timelog-item.svelte
 LastEditTime : 2023-08-27 14:35:12
 Description  : 
-->
<script lang="ts">
    import Active from "@/components/time-logger/active.svelte";
    import { time2str } from "@/utils";

    export let interval: IInterval;
    export let log: ITimeLog;

    let active = log.active;

    const duration: number = interval.end - interval.beg; //mili-seconds

    const timestamp2timestr = (timestamp: number) => {
        let date = new Date(timestamp);
        let hour = date.getHours().toString().padStart(2, '0');
        let minute = date.getMinutes().toString().padStart(2, '0');
        let second = date.getSeconds().toString().padStart(2, '0');
        //HH:MM:SS
        return `${hour}:${minute}:${second}`;
    };

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
            {timestamp2timestr(interval.beg)} - {timestamp2timestr(interval.end)}
        </div>
        <div class="timelog-memo">
            {log.memo ?? ""}
        </div>
    </div>
    <div class="timelog-duration">
        {time2str(duration / 1000)}
    </div>
</div>

<style lang="scss">
    div.timelog-item {
        display: flex;
        gap: 5px;

        // border-top: 1px solid var(--b3-border-color);
        border-bottom: 1px solid var(--b3-border-color);
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
                // color: var(--b3-protyle-inline-em-color);
            }
            .timelog-interval {
                flex: 1;
                font-size: 18px;
                // color: var(--b3-protyle-inline-em-color);
            }

            .running-memo {
                flex: 0;
                margin: 0;
                padding: 0;
                font-size: 12px;
                // font-weight: bold;
                // color: var(--b3-protyle-inline-em-color);
            }
        }
        .timelog-duration {
            margin: 0 10px;
            font-size: 20px;
            font-weight: bold;
            color: var(--b3-protyle-inline-em-color);
        }
    }
</style>
