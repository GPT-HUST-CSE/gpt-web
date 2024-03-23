<template>
    <div class="sidebar">
        <sidebar-header :title="'MyChat'" />
        <sidebar-config />
        <sidebar-body />
        <sidebar-tail />
    </div>
</template>

<script setup>

import sidebarHeader from './sidebar-header.vue';
import sidebarConfig from './sidebar-config.vue';
import sidebarBody from './sidebar-body.vue';
import sidebarTail from './sidebar-tail.vue';

</script>

<style lang="less" scoped>
.sidebar {
    width: var(--sidebar-width);
    box-sizing: border-box;
    background-color: #e7f8ff;
    padding: 20px;
    position: relative;

    display: flex;
    flex-direction: column;


}
</style>
