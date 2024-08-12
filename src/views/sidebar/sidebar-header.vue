<template>
    <div class="sidebar-header">
        <div class="sidebar-title"> {{ title }} </div>
        <img class="sidebar-logo" src="@/assets/image/gpt.svg">
    </div>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        default: "标题"
    }
})

</script>

<style lang="less" scoped>
.sidebar-header {
    position: relative;
    padding: 20px 0;
    height: 44px;
    font-size: 30px;
    line-height: 44px;
    font-weight: 700;
    text-align: center;


    .sidebar-logo {
        width: 43px;
        height: 44px;
        opacity: 0.2;

        position: absolute;
        right: 0;
        bottom: 18px;
    }
}
</style>
