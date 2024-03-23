<template>
    <div class="add-conversation">
        <button class="button button-icon" @click="addConversation">
            <img class="add" src="@/assets/image/add.svg">
            <span>
                {{ text }}
            </span>
        </button>
    </div>
</template>

<script setup>
import useConversationStore from '@/store/modules/Conversation';

const conversationStore = useConversationStore()

defineProps({
    text: {
        type: String,
        default: "新的聊天"
    }
})

const addConversation = () => {
    conversationStore.addConversation()
}
</script>

<style lang="less" scoped>
.add-conversation {
    .button {
        .add {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }

        span {
            font-size: 12px;
        }
    }
}
</style>
@/store/modules/Conversation