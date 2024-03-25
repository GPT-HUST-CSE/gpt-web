<template>
  <div class="content-tail">
    <div class="input-actions">
        <template v-for="(action, index) in actions" :key="index">
            <div class="action">
                <div class="icon"><img :src="action.icon"></div>
                <div class="text">{{ action.text }}</div>
            </div>
        </template>
    </div>
    <label class="input-inner" for="chat-input">
        <textarea v-model.trim="message" @keydown="keydownHandler" id="chat-input" :placeholder="placeholder"></textarea>
        <button class="submit button-icon" @click="sendMessage">
            <img src="@/assets/image/submit.svg">
            <div class="text one-line-ellipsis">发送</div>
        </button>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['sendMessage']);

const actions = [
    {icon: "/img/icons/setting.svg", text: "对话设置"},
    {icon: "/img/icons/auto.svg", text: "自动主题"},
    {icon: "/img/icons/magic.svg", text: "快捷指令"},
    {icon: "/img/icons/mask.svg", text: "所有面具"},
    {icon: "/img/icons/clear.svg", text: "清除聊天"},
    {icon: "/img/icons/robot.svg", text: "gpt-3.5-turbo"}
]

const placeholder = "Message..."

const message = ref("")

const keydownHandler = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
    }
}

const sendMessage = () => {
    if(message.value) {
        emit('sendMessage', message.value)
        message.value = ""
    } else {
        ElMessage({
            message: '请输入内容！！！',
            type: 'warning',
        })
    }
    
}
</script>

<style lang="less" scoped>
.content-tail {
    border-top: var(--border-in-light);
    width: 100%;
    padding: 10px 20px 20px;
    box-sizing: border-box;

    .input-actions {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;

        .action {
            display: inline-flex;
            border-radius: 20px;
            font-size: 12px;
            color: var(--black);
            background-color: var(--white);
            border: var(--border-in-light);
            padding: 4px 10px;
            box-shadow: var(--card-shadow);
            transition: width .3s ease;
            align-items: center;
            height: 16px;
            width: 16px;
            overflow: hidden;
            cursor: pointer;

            &:not(:last-child) {
                margin-right: 5px;
            }

            &:hover {
                width: 70px;
                background-color: var(--hover-color);

                &:last-child {
                    width: 95px;
                }
                

                .text {
                    transform: translateX(0);
                    opacity: 1;
                }

            }

            .text {
                user-select: none;

                display: flex;
                justify-content: center;
                align-items: center;

                opacity: 0;

                white-space: nowrap;
                padding-left: 5px;
                transform: translateX(-5px);
                transition: all .3s ease;
                pointer-events: none;
            }
        }
    }

    .input-inner {
        display: flex;
        textarea {
            color: var(--black);
            background-color: var(--white);
            width: 100%;
            height: 100px;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.03) 0px -2px 5px;
            padding: 10px 90px 10px 14px;
            resize: none;
            outline: none;
            box-sizing: border-box;

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
            

            &:focus {
                border: 1px solid var(--primary);
            }
        }
        .submit {
            position: absolute;
            right: 30px;
            bottom: 32px;

            display: flex;

            background-color: var(--primary);
            color: #fff;

            .text {
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
}
</style>
