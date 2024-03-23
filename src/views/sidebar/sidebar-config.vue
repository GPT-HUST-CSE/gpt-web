<template>
    <div class="sidebar-config">
        <gpt-mask class="sidebar-config-button button-icon"></gpt-mask>
        <gpt-plugins class="sidebar-config-button button-icon"></gpt-plugins>
    </div>
</template>

<script setup>

import gptMask from '@/components/gpt-mask/mask.vue';
import gptPlugins from '@/components/gpt-plugins/plugins.vue';

</script>

<style lang="less" scoped>
.sidebar-config {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-bottom: 20px;
}
</style>
