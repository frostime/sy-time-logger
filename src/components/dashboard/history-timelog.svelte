<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 14:54:10
 FilePath     : /src/components/dashboard/history-timelog.svelte
 LastEditTime : 2023-09-08 10:00:23
 Description  : 
-->
<script lang="ts">
    import TimelogItem from "./timelog-item.svelte";
    import { timeLogManager, sessionHub } from "@/core";
    import { date2str, i18n } from "@/utils";

    export let dateLogs: IDateLog[] = timeLogManager.allLogs();
    console.log(dateLogs);
    let dateLogCnt = [];
    dateLogs.forEach((dateLog) => {
        let cnt = 0;
        dateLog.timeLogs.forEach((timelog) => {
            cnt += timelog.procedure.length;
        });
        dateLogCnt.push(cnt);
    });
</script>

<section>
    {#if sessionHub.size() > 0}
        <div class="log-date">
            <span class="log-date-str">{i18n.ui_history.running}</span>
        </div>
        <!-- reverse, 把最新的放在前面 -->
        {#each Object.values(sessionHub.sessions).reverse() as session (session.runId)}
            {#each session.procedure.reverse() as interval (interval.beg)}
                <TimelogItem {interval} log={session.export()} />
            {/each}
        {/each}
    {/if}
    {#each dateLogs as dateLog , i (dateLog.date)}
        <div class="log-date">
            <span class="log-date-str">{date2str(dateLog.date)}</span>
            <span class="counter b3-tooltips b3-tooltips__sw" aria-label={i18n.ui_history.cnt}>{dateLogCnt[i]}</span>
        </div>
        {#each dateLog.timeLogs as timelog (timelog.beg)}
            {#each timelog.procedure as interval (interval.beg)}
                <TimelogItem {interval} log={timelog} />
            {/each}
        {/each}
    {/each}
</section>

<style lang="scss">
    .log-date {
        margin-top: 1rem;
        font-size: 20px;
        border-bottom: 2px solid var(--b3-border-color);
        padding-bottom: 5px;
        position: relative;

        >span.log-date-str {
            padding: 5px 20px;
            border-bottom: 3px solid var(--b3-theme-primary);
        }
        >span.counter {
            position: absolute;
            right: 10px;
        }
    }
</style>

