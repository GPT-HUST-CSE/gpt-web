<template>
    <div class="sidebar-body">
        <transition-group name="chat">
            <template v-for="conversation in conversations" :key="conversation.id">
                <conversation-item :conversation="conversation" @click="change(conversation.id)"
                                    :class="{ active: currentIndex === conversation.id }" />
            </template>
        </transition-group>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import useConversationStore from '@/store/modules/Conversation.ts'
import Conversation from '@/classes/Conversation';
import conversationItem from '@/components/conversation-item/conversation-item.vue';

const conversationStore = useConversationStore()
const { conversations, currentIndex } = storeToRefs(conversationStore)

const change = (index) => {
    currentIndex.value = index
}


</script>

<style lang="less" scoped>
.sidebar-body {
    flex: 1 1;
    overflow-x: hidden;
    overflow-y: auto;

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

.chat-enter-from,
.chat-leave-to {
    opacity: 0;
}

.chat-leave-to {
    transform: translateX(-100%);
}

.chat-enter-to,
.chat-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.chat-enter-active,
.chat-leave-active {
    transition: all 1s ease;
}

.chat-leave-active {
  position: absolute;
}

.chat-move {
  transition: all 1s ease;
}


</style>