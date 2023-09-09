<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 14:54:10
 FilePath     : /src/components/dashboard/history-timelog.svelte
 LastEditTime : 2023-09-09 15:49:01
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

<main>
    <div class="banner">
        <div style="width: 20%;"/>
        <div class="history-scope">
            <div> 2023 </div>
            <div> 记录时间总计: 09:18 </div>
            <div class="triangle-button"/>
        </div>
        <div style="width: 20%;"/>
    </div>
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
</main>

<style lang="scss">
    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .banner {
        background-color: var(--b3-theme-primary);
        color: var(--b3-theme-on-primary);
        display: flex;
        .history-scope {
            flex: 1;
            text-align: center;
            padding: 5px 10px;
            position: relative;
            >div:first-child {
                font-size: 1.3em;
            }
            >div.triangle-button {
                position: absolute;
                right: 0;
                bottom: 2px;
                --triangle-size: 6px;
                border-top: var(--triangle-size) solid transparent;
                border-left: var(--triangle-size) solid transparent;
                border-right: var(--triangle-size) solid var(--b3-theme-on-primary);
                border-bottom: var(--triangle-size) solid var(--b3-theme-on-primary);
                cursor: pointer;
            }
        }
    }
    
    section {
        overflow-y: scroll;
    }
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

