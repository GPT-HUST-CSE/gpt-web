<template>
    <div class="conversation-item button-icon" draggable="true">
        <div class="conversation-title">
            {{ conversation.title }}
        </div>
        <div class="conversation-info">
            <div>{{ messageCount }}</div>
            <div>{{ conversationTime }}</div>
        </div>
        <div class="conversation-delete" @click="deleteConversation(conversation.id, $event)">
            <img src="@/assets/image/delete.svg">
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Conversation from '@/classes/Conversation'
import { formatMonthDay } from '@/utils/format_date'
import useConversationStore from '@/store/modules/Conversation';

const props = defineProps({
    conversation: {
        type: Conversation,
        default: () => new Conversation()
    }
})

const conversationStore = useConversationStore()

const messageCount = computed(() => `${props.conversation.getMessageLength()}条对话`)
const conversationTime = computed(() => formatMonthDay(props.conversation.time, "YYYY/MM/DD hh:mm:ss"))

const deleteConversation = (id, event) => {
    event.stopPropagation()
    conversationStore.deleteConversation(id)
}

</script>

<style lang="less" scoped>
.conversation-item {
    display: block;
    padding: 10px 14px;
    margin-bottom: 10px;
    border: 2px solid transparent;
    border-radius: 10px;

    position: relative;

    background-color: var(--white);
    box-shadow: var(--card-shadow);


    &.active {
        border-color: var(--primary)
    }

    &:hover {
        .conversation-delete {
            opacity: 0.5;
            transform: translate(-5px);

            &:hover {
                opacity: 1;
            }
        }
    }

    .conversation-title {
        width: calc(100% - 15px);
        font-size: 14px;
        font-weight: bolder;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .conversation-info {
        font-size: 12px;
        line-height: 16.5px;
        margin-top: 8px;
        color: var(--light);

        display: flex;
        justify-content: space-between;
    }

    .conversation-delete {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 0;
        opacity: 0;
        transition: all .3s ease
    }
}
</style>
