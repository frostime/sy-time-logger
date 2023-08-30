<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-22 14:45:10
 FilePath     : /src/components/time-logger/actives-list.svelte
 LastEditTime : 2023-08-30 20:09:45
 Description  : 
-->
<script lang="ts">
    // import { createEventDispatcher } from "svelte";
    // import Active from "./active.svelte";
    import Emoji from "@/components/libs/emoji.svelte";

    export let actives: IActive[];

    let choosenIndex: number = -1;

    // const dispatch = createEventDispatcher();

</script>

<!-- eslint-disable-next-line -->
<section
    class="actives-list"
>
    {#each actives as active, i (active.id)}
        <div class="actives-list-item {choosenIndex === i ? "choosen-item" : ""}" data-index={i}
            on:click={() => {
                choosenIndex = choosenIndex === i ? -1 : i;
                // dispatch("click", active);
            }}
            on:keypress={() => {}}
        >
            <Emoji type={active.emoji.type} code={active.emoji.code} width="40px" />
            <div class="actives-list-item-title" style="">
                {active.title}
            </div>
        </div>
    {/each}
</section>

<style lang="scss">
    .actives-list {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .actives-list-item {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid var(--b3-border-color);
        box-sizing: content-box;

        &:hover {
            border: 1px dashed var(--b3-theme-primary);
        }
        &.choosen-item {
            border: 2px solid var(--b3-theme-primary);
        }
        .actives-list-item-title {
            flex:1;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 10px;
        }
    }

</style>
