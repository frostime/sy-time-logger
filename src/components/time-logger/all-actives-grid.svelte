<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-22 14:45:10
 FilePath     : /src/components/time-logger/all-actives.svelte
 LastEditTime : 2023-08-24 17:28:40
 Description  : 
-->
<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";

    import { createEventDispatcher } from "svelte";
    import Active from "./active.svelte";

    export let actives: IActive[];
    export let dragDisabled: boolean = true;

    const dispatch = createEventDispatcher();

    const ItemWidth: number = 60;
    const Size = {
        item: ItemWidth,
        emoji: 40,
        title: 12,
    };

    const onResize = (event: UIEvent) => {
        let container: HTMLDivElement = event.target as HTMLDivElement;
        var containerWidth = container.offsetWidth;
        var itemsPerRow = Math.floor(containerWidth / ItemWidth);
        container.style.flexBasis = containerWidth / itemsPerRow + "px";
    };

    function handleDndConsider(e) {
        actives = e.detail.items;
    }
    function handleDndFinalize(e) {
        actives = e.detail.items;
        dispatch("reordered", actives);
    }
</script>

<!-- eslint-disable-next-line -->
<section
    class="all-actives"
    id="all-actives"
    use:dndzone={{ items: actives, dragDisabled: dragDisabled }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
    on:resize={onResize}
>
    {#each actives as active, i (active.id)}
        <div class="" data-index={i} animate:flip={{ duration: 200 }}>
            <Active
                size={Size}
                {active}
                on:click={() => {
                    dispatch("click", active);
                }}
            />
        </div>
    {/each}
</section>

<style lang="scss">
    #all-actives {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        margin-bottom: 20px;
    }
</style>
