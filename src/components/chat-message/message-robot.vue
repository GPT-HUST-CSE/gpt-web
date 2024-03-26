<template>
  <div class="message-robot">
    <div class="message-robot-container">
        <div class="header">
            <div class="avatar">
                <img :src="avatar">
            </div>
        </div>
        <div class="item">
            <div class="markdown-body">
                {{ content }}
            </div>
        </div>
        <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { formatMonthDay } from '@/utils/format_date'
import Message from '@/classes/Message'

const props = defineProps({
    message: {
        type: Message,
        default: new Message({content: "听不懂思密达", role: "robot"})
    },
    avatar: {
        type: String,
        default: "/img/icons/chatgpt.svg"
    }
})

const content = computed(() => props.message.content)
const time = computed(() => formatMonthDay(props.message.time, "YYYY/MM/DD hh:mm:ss"))
</script>

<style lang="less" scoped>
.message-robot {
    display: flex;

    .message-robot-container {
        max-width: 80%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        
        white-space: pre-wrap;

        .header {
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
            margin-top: 20px;

            .avatar {
                box-sizing: border-box;
                width: 32px;
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: var(--border-in-light);
                border-radius: 10px;

                img {
                    width: 70%;
                    height: 70%;
                }
            }
        }

        .item {
            min-height: 43px;
            background-color: var(--second);
            box-sizing: border-box;
            max-width: 100%;
            margin-top: 10px;
            border-radius: 10px;
            padding: 10px;
            font-size: 14px;
            user-select: text;
            word-break: break-all;
            border: var(--border-in-light);

            .markdown-body {
                margin: 0;
                color: #24292f;
                background-color: transparent;
                line-height: 1.5;

            }
        }

        .time {
            font-size: 12px;
            opacity: .2;
            padding-top: 2px;
            padding-left: 10px;
            pointer-events: none;
            user-select: none;
        }
    }
}
</style>
