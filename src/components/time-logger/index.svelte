<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/time-logger/index.svelte
 LastEditTime : 2023-08-24 20:29:17
 Description  : 
-->
<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import AllActives from './all-actives.svelte';
    import LoggingActive from './logging-active.svelte';
    import { TimeLogSession, sessionHub } from "@/actives";

    import { eventBus } from "@/utils";

    import { activeHub } from "@/actives";

    let rootActive: IActive = null;
    let currentActives: IActive[] = activeHub.getActives(rootActive);

    const updateActives = () => {
        currentActives = activeHub.getActives(rootActive);
    };

    const doNothing = () => {};
    let runningSession: TimeLogSession[] = [];

    onMount(() => {
        eventBus.on("on-session-stop", removeActive);
        eventBus.on("on-session-del", removeActive);
        eventBus.on("on-active-updated", updateActives);

        let sessions = [];
        for (let id in sessionHub.sessions) {
            sessions.push(sessionHub.sessions[id]);
        }
        runningSession = sessions;

    });
    onDestroy(() => {
        eventBus.off("on-session-stop", removeActive);
        eventBus.off("on-session-del", removeActive);
        eventBus.off("on-active-updated", updateActives);
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

<div class="fn__flex-1" style="padding-bottom: 25px;">
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconBookmark" /></svg>
            时间日志
        </div>
        <span class="fn__flex-1" />
        <span class="fn__space" />
        <span
            on:click={() => {
                eventBus.emit("open-settings");
            }}
            on:keydown={doNothing}
            class="block__icon b3-tooltips b3-tooltips__sw"
            aria-label="设置"
        >
            <svg class=""><use xlink:href="#iconSettings" /></svg>
        </span>
    </div>

    <section id="running-action-list">
        {#each runningSession as session (session.runId)}
            <LoggingActive session={session} />
        {/each}
    </section>

    <AllActives on:click={onclick} actives={currentActives}/>
</div>