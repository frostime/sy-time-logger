<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/time-logger/index.svelte
 LastEditTime : 2023-09-07 21:09:46
 Description  : 
-->
<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import AllActivesGrid from './all-actives-grid.svelte';
    import LoggingActive from './logging-active.svelte';
    import { TimeLogSession, sessionHub } from "@/core";

    import { eventBus } from "@/utils";

    import { activeHub, ActiveHub } from "@/core";

    // let rootActive: IActive = null;
    let currentGroup: TActiveGroupID = "";
    let currentActives: IActive[];

    const updateActives = () => {
        console.groupCollapsed("sy-time-logger: updateActives")
        console.log("Update Current Actives in group", currentGroup);
        currentActives = activeHub.getGroupActives(currentGroup);
        if (currentGroup !== "") {
            currentActives = [ActiveHub.SpecialActives.Back, ...currentActives];
        }
        console.log(currentActives);
        console.groupEnd();
    };
    updateActives();

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
        let active = e.detail;
        if (active.isGroup) {
            currentGroup = active.id;
            updateActives();
        } else if (active.id === ActiveHub.SpecialActives.Back.id) {
            currentGroup = ActiveHub.RootGroup;
            updateActives();
        } else {
            let session = sessionHub.new(e.detail);
            runningSession = [...runningSession, session];
        }
    }

    const removeActive = (e: CustomEvent<TimeLogSession>) => {
        let detail = e.detail;
        runningSession = runningSession.filter((session) => session.runId != detail.runId);
    }

</script>

<div class="fn__flex-1" style="padding-bottom: 25px; overflow-x: hidden;">
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconTimeLogger" /></svg>
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
        <span class="fn__space" />
        <span
            on:click={() => {
                eventBus.emit("open-log-history");
            }}
            on:keydown={doNothing}
            class="block__icon b3-tooltips b3-tooltips__sw"
            aria-label="记录"
        >
            <svg><use xlink:href="#iconAlignCenter"></use></svg>
        </span>
        <span class="fn__space" />
        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="最小化 Ctrl+W"><svg><use xlink:href="#iconMin"></use></svg></span>
    </div>

    <section id="running-action-list">
        {#each runningSession as session (session.runId)}
            <LoggingActive session={session} />
        {/each}
    </section>

    <AllActivesGrid on:click={onclick} actives={currentActives}/>
</div>