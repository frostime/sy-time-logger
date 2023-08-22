<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-22 14:45:10
 FilePath     : /src/components/time-logger/all-actives.svelte
 LastEditTime : 2023-08-22 15:52:00
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Active from "./active.svelte";

    export let actives: IActive[];

    const dispatch = createEventDispatcher();

    const ItemWidth: number = 60;
    const Size = {
        item: ItemWidth,
        emoji: 40,
        title: 12
    };

    const onResize =  (event: UIEvent) => {
        let container: HTMLDivElement = event.target as HTMLDivElement;
        var containerWidth = container.offsetWidth;
        var itemsPerRow = Math.floor(containerWidth / (ItemWidth));
        container.style.flexBasis = containerWidth / itemsPerRow + "px";
    }

</script>

<section class="all-actives" id="all-actives"
    on:resize={onResize}
>
    {#each actives as active}
        <Active size={Size} active={active} on:click={
            () => {
                dispatch("click", active);
            }
        }/>
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
