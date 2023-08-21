<script lang="ts">
    import Active from "./active.svelte";

    const ItemWidth: number = 60;
    const Size = {
        item: ItemWidth,
        emoji: 40,
        hint: 12
    };

    const onResize =  (event: UIEvent) => {
        let container: HTMLDivElement = event.target as HTMLDivElement;
        var containerWidth = container.offsetWidth;
        var itemsPerRow = Math.floor(containerWidth / (ItemWidth));
        container.style.flexBasis = containerWidth / itemsPerRow + "px";
    }

    //@ts-ignore
    const emoji = window.siyuan.emojis;
    let actives = [
        {
            emoji: {
                type: "custom",
                code: emoji[0].items[0].unicode,
            },
            hint: "说明"
        },
        {
            emoji: {
                type: "custom",
                code: emoji[0].items[1].unicode,
            },
            hint: "说明"
        },
        {
            emoji: {
                type: "custom",
                code: emoji[0].items[2].unicode,
            },
            hint: "Academic"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[1].items[0].unicode
            },
            hint: "Take notes"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[2].items[10].unicode
            },
            hint: "大声说明出来啊！"
        },
        {
            emoji: {
                type: "unicode",
                code: emoji[4].items[20].unicode
            },
            hint: "阅读论文"
        }
    ]

</script>

<section class="all-actives" id="all-actives"
    on:resize={onResize}
>
    {#each actives as active}
        <Active size={Size} emoji={active.emoji} hint={active.hint}/>
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
