<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-20 21:38:53
 FilePath     : /src/components/time-logger/index.svelte
 LastEditTime : 2023-08-21 15:43:30
 Description  : 
-->
<script lang="ts">
    import AllActives from './all-actives.svelte';

    const doNothing = () => {};
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
    <main class="fn__flex-1">
        <AllActives />
    </main>
</div>