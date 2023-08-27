<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-25 14:54:10
 FilePath     : /src/components/dashboard/history-timelog.svelte
 LastEditTime : 2023-08-27 12:26:09
 Description  : 
-->
<script lang="ts">
    import TimelogItem from "./timelog-item.svelte";
    import { timeLogManager } from "@/actives";

    export let dateLogs: IDateLog[] = timeLogManager.allLogs();
</script>

<section id="running-action-list">
    {#each dateLogs as dateLog (dateLog.date)}
        <div class="date-title">{dateLog.date}</div>
        {#each dateLog.timeLogs as timelog (timelog.beg)}
            {#each timelog.procedure as interval (interval.beg)}
                <TimelogItem {interval} log={timelog} />
            {/each}
        {/each}
    {/each}
</section>
