<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/time-logger/index.svelte
 LastEditTime : 2023-08-22 17:32:48
 Description  : 
-->
<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import AllActives from './all-actives.svelte';
    import LoggingActive from './logging-active.svelte';
    import { TimeLogSession, sessionHub } from "@/actives";

    import { eventBus } from "@/utils";

    const doNothing = () => {};
    let runningSession: TimeLogSession[] = [];

    onMount(() => {
        eventBus.on("on-session-stop", removeActive);
        eventBus.on("on-session-del", removeActive);

        let sessions = [];
        for (let id in sessionHub.sessions) {
            sessions.push(sessionHub.sessions[id]);
        }
        runningSession = sessions;

    });
    onDestroy(() => {
        eventBus.off("on-session-stop", removeActive);
        eventBus.off("on-session-del", removeActive);
    });


    const onclick = (e: CustomEvent<IActive>) => {
        let session = sessionHub.new(e.detail);
        runningSession = [...runningSession, session];
    }

    const removeActive = (e: CustomEvent<TimeLogSession>) => {
        let detail = e.detail;
        runningSession = runningSession.filter((session) => session.runId != detail.runId);
    }

</script>

<div class="fn__flex-1">
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconBookmark" /></svg>
            时间日志
        </div>
        <span class="fn__flex-1" />
        <span class="fn__space" />
        <span
            on:click={() => {}}
            on:keydown={doNothing}
            data-type="setting"
            class="block__icon b3-tooltips b3-tooltips__sw"
            aria-label="设置"
        >
            <svg class=""><use xlink:href="#iconSetting" /></svg>
        </span>
    </div>

    <section id="running-action-list">
        {#each runningSession as session (session.runId)}
            <LoggingActive session={session} />
        {/each}
    </section>

    <AllActives on:click={onclick}/>
</div>