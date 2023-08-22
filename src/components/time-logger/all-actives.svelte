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

    //@ts-ignore
    const emoji = window.siyuan.emojis;
    let actives: IActive[] = [
        {
            emoji: {
                type: "unicode",
                code: emoji[1].items[0].unicode,
            },
            title: "说明"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[1].items[1].unicode,
            },
            title: "说明"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[4].items[3].unicode,
            },
            title: "Academic"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[1].items[0].unicode
            },
            title: "Take notes"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[2].items[10].unicode
            },
            title: "大声说明出来啊！"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[4].items[20].unicode
            },
            title: "阅读论文"
        }
    ]

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
