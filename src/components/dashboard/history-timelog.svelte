<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 14:54:10
 FilePath     : /src/components/dashboard/history-timelog.svelte
 LastEditTime : 2023-08-27 14:22:35
 Description  : 
-->
<script lang="ts">
    import TimelogItem from "./timelog-item.svelte";
    import { timeLogManager } from "@/actives";
    import { date2str } from "@/utils";

    export let dateLogs: IDateLog[] = timeLogManager.allLogs();
    console.log(dateLogs);
</script>

<section>
    {#each dateLogs as dateLog (dateLog.date)}
        <div class="log-date">
            <span>{date2str(dateLog.date)}</span>
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

        >span {
            padding: 5px 20px;
            border-bottom: 3px solid var(--b3-theme-primary);
        }
    }
</style>

