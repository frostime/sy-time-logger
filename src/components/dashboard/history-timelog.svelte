<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 14:54:10
 FilePath     : /src/components/dashboard/history-timelog.svelte
 LastEditTime : 2023-09-09 18:18:37
 Description  : 
-->
<script lang="ts">
    import TimelogItem from "./timelog-item.svelte";
    import { timeLogManager, sessionHub } from "@/core";
    import { date2str, i18n } from "@/utils/index";
    import { getWeek } from "@/utils/time";

    type ScoopType = 'day' | 'week' | 'month' |'year';
    const AllScoopType: ScoopType[] = ['day', 'week', 'month', 'year'];
    let scoop = {
        type: 'year' as ScoopType,
        beg: new Date() as Date,
        end: null as Date,
        value: new Date().getFullYear() as any
    }

    export let dateLogs: IDateLog[] = [];

    const updateQueryDateLogs = () => {
        if (scoop.type === 'year') {
            dateLogs = timeLogManager.queryYearLogs(scoop.beg.getFullYear());
        } else if (scoop.type === 'month') {
            let year = scoop.beg.getFullYear();
            let month = scoop.beg.getMonth() + 1;
            dateLogs = timeLogManager.queryMonthLogs(year, month);
        } else if (scoop.type === 'day') {
            dateLogs = timeLogManager.queryDateLogs(scoop.beg);
        } else if (scoop.type === 'week') {
            dateLogs = timeLogManager.qeuryDurationLogs(scoop.beg, scoop.end);
        }
    }
    updateQueryDateLogs();

    let dateLogCnt = [];
    dateLogs.forEach((dateLog) => {
        let cnt = 0;
        dateLog.timeLogs.forEach((timelog) => {
            cnt += timelog.procedure.length;
        });
        dateLogCnt.push(cnt);
    });

    const updateScoopValue = () => {
        let beg = scoop.beg;
        let stype = scoop.type;
        if (stype === 'year') {
            scoop.value = beg.getFullYear();
        } else if (stype === 'month') {
            scoop.value = date2str(beg).slice(0, -3);
        } else if (stype === 'day') {
            scoop.value = date2str(beg);
        } else if (stype === 'week') {
            let week = getWeek(beg);
            scoop.beg = week.start;
            scoop.end = week.end;
            scoop.value = `${date2str(scoop.beg)} ~ ${date2str(scoop.end)}`;
        }
    }
    const changeScoopType = (stype: ScoopType) => {
        scoop.type = stype;
        updateScoopValue();
        updateQueryDateLogs();
    }
    const shiftScoopBeg = (delta: -1 | 1) => {
        let beg = scoop.beg;
        let stype = scoop.type;
        if (stype === 'year') {
            beg.setFullYear(beg.getFullYear() + delta);
        } else if (stype === 'month') {
            beg.setMonth(beg.getMonth() + delta);
        } else if (stype === 'day') {
            beg.setDate(beg.getDate() + delta);
        } else if (stype === 'week') {
            beg.setDate(beg.getDate() + delta * 7);
        }
        updateScoopValue();
        updateQueryDateLogs();
    }

    let showCompScopeMenu = false;

</script>

<main>
    <div class="banner">
        <div style="width: 20%;"/>
        <div class="history-scope"
            on:click={() => {
                showCompScopeMenu = !showCompScopeMenu;
            }}
            on:keypress={() => {}}
        >
            <div> {scoop.value} </div>
            <div> 记录时间总计: 09:18 </div>
            <div class="triangle-button"/>
        </div>
        <div style="width: 20%;"/>
        {#if showCompScopeMenu} 
            <div class="scope-menu">
                <div on:click={() => shiftScoopBeg(-1)}>&lt;</div>
                {#each AllScoopType as type}
                    <div data-type="{type}"
                        class={type === scoop.type ? "current-type" : ""}
                        on:click={() => changeScoopType(type)}
                    >
                        {type}
                    </div>
                {/each}
                <div on:click={() => shiftScoopBeg(1)}>&gt;</div>
            </div>
        {/if}
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
        position: relative;
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
        .scope-menu {
            z-index: 1;
            position: absolute;
            left: 3px;
            right: 3px;
            bottom: -36px;
            height: 30px;
            border: 2px solid var(--b3-theme-primary);
            background-color: var(--b3-theme-background);
            color: var(--b3-theme-on-background);
            display: flex;
            align-items: center;
            &>div {
                flex: 1;
                text-align: center;
                font-weight: bold;
                cursor: pointer;
            }
            &>div.current-type {
                color: var(--b3-theme-primary);
            }
            &>div:first-child:hover {
                color: var(--b3-theme-primary);
            }
            &>div:last-child:hover {
                color: var(--b3-theme-primary);
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

