<template>
  <div class="content">
    <content-header :title="conversation.title"
                    :count="conversation.messages.length"/>
    <content-body></content-body>
    <content-tail></content-tail>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ContentHeader from './content-header.vue'
import ContentBody from './content-body.vue'
import ContentTail from './content-tail.vue'

import useConversationStore from '@/store/modules/Conversation'

const conversationStore = useConversationStore()
const conversation = computed(() => (conversationStore.currentConversation))

</script>

<style lang="less" scoped>

.content {
    width: calc(100% - var(--sidebar-width));

    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
}

</style>
