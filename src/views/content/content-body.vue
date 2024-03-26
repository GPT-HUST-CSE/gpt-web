<template>
    <div class="content-body" ref="contentBody">
        <template v-for="(message, index) in conversation.messages" :key="index">
            <message-user v-if="message.role === 'user'" :message="message"></message-user>
            <message-robot v-else :message="message"></message-robot>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MessageUser from '@/components/chat-message/message-user.vue'
import MessageRobot from '@/components/chat-message/message-robot.vue'

import useConversationStore from '@/store/modules/Conversation'

import Message from '@/classes/Message'

const contentBody = ref(null)
const conversationStore = useConversationStore()
const conversation  = computed(() => conversationStore.currentConversation)
const conversationMessageLength  = computed(() => conversationStore.currentConversation.messages.length)

const scrollToBottom = () => {
    contentBody.value.scrollTop =  contentBody.value.scrollHeight - contentBody.value.clientHeight + 121
    console.log("scrollToBottom", contentBody.value.scrollTop, contentBody.value.scrollHeight, contentBody.value.clientHeight)
}

watch(conversationMessageLength, (newValue, oldValue) => {
    if(newValue > oldValue) {
        console.log("conversationMessageLength", contentBody.value.scrollTop, contentBody.value.scrollHeight, contentBody.value.clientHeight)
        setTimeout(scrollToBottom, 0.2)
    }
})

</script>

<style lang="less" scoped>
.content-body {
    flex: 1 1 0;
    padding: 20px 20px 40px;
    overflow: hidden auto;
    overscroll-behavior: none;
    position: relative;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        --bar-width: 5px;
        width: var(--bar-width);
        height: var(--bar-width);
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--bar-color);
        border-radius: 20px;
        background-clip: content-box;
        border: 1px solid transparent;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}
</style>
