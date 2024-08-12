<template>
    <div class="sidebar-tail">
        <actions />
        <add-conversation :text="'新增对话'" />
    </div>
</template>

<script setup>
import actions from '@/components/sidebar-tail/actions.vue';
import addConversation from '@/components/sidebar-tail/add-conversation.vue';
</script>

<style lang="less" scoped>
.sidebar-tail {
    // height: 36px;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
}
</style>
