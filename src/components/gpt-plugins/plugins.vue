<template>
    <div class="plugins"
        @click="clickPlugins">
        <div><img src="@/assets/image/plugins.svg"></div>
        <div class="text">插件</div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const clickPlugins = () => {
    ElMessage({
        message: '功能正在开发中...'
    })
}

</script>

<style lang="less" scoped>
.plugins {
    font-size: 12px;

    .text {
        margin-left: 5px;
    }
}
</style>
