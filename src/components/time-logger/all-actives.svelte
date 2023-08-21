<script lang="ts">
    import Active from "./active.svelte";

    const itemWidth: number = 50;

    const onResize =  (event: UIEvent) => {
        let container: HTMLDivElement = event.target as HTMLDivElement;
        var containerWidth = container.offsetWidth;
        var itemsPerRow = Math.floor(containerWidth / itemWidth);
        container.style.flexBasis = containerWidth / itemsPerRow + "px";
    }
</script>

<section class="all-actives" id="all-actives"
    on:resize={onResize}
>
    {#each Array(10) as i}
        <div class="active-item" data-index={i}
            style="width: {itemWidth}px; height: {itemWidth}px;"
        >
            <Active />
        </div>
    {/each}
</section>

<style lang="scss">
    #all-actives {
        display: flex;
        flex-wrap: wrap;
    }

    .active-item {
        background-color: #ccc;
        margin: 10px;
    }
</style>
