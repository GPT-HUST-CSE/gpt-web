<template>
    <div class="drag">
        <img src="@/assets/image/drag.svg">
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.drag {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 14px;
    background-color: transparent;
    display: flex;
    align-items: center;

    img {
        opacity: 0;
    }

    &.hover {
        img {
            opacity: 1;
        }
    }
}
</style>
