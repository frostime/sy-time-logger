<script lang="ts">
    const onResize =  (event: UIEvent) => {
        let container: HTMLDivElement = event.target as HTMLDivElement;
        var containerWidth = container.offsetWidth;
        var itemWidth = 150; // 假设每个项目的宽度为200px
        var itemsPerRow = Math.floor(containerWidth / itemWidth);
        container.style.flexBasis = containerWidth / itemsPerRow + "px";
    }
</script>

<section class="all-actives" id="all-actives"
    on:resize={onResize}
>
    <div class="active" />
    <div class="active" />
    <div class="active" />
    <div class="active" />
    <div class="active" />
    <div class="active" />
</section>

<style lang="scss">
    #all-actives {
        display: flex;
        flex-wrap: wrap;
    }

    .active {
        flex-basis: 150px; /* 假设每个项目的宽度为200px */
        height: 100px; /* 假设每个项目的高度为100px */
        background-color: #ccc;
        margin: 10px;
    }
</style>
