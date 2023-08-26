<script lang="ts">
    import TimelogItem from "./timelog-item.svelte";

    export let timelogs: ITimeLog[];
    

</script>

<section id="running-action-list">
    {#each timelogs as timelog (timelog.beg)}
        {#each timelog.procedure as interval (interval.beg)}
            <TimelogItem {interval} log={timelog} />
        {/each}
    {/each}
</section>