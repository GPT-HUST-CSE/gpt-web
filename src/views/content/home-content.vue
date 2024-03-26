<template>
    <div class="content">
        <content-header :title="conversation.title"
                        :count="conversation.messages.length"/>
        <content-body />
        <content-tail @sendMessage="sendMessageHandler" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ContentHeader from './content-header.vue'
import ContentBody from './content-body.vue'
import ContentTail from './content-tail.vue'

import useConversationStore from '@/store/modules/Conversation'

import Message from '@/classes/Message'

const conversationStore = useConversationStore()
const conversation  = computed(() => conversationStore.currentConversation)

const sendMessageHandler = (content) => {
    const userMessage = new Message({role: "user", content, time: new Date()})
    conversationStore.addMessage(userMessage)
}

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
