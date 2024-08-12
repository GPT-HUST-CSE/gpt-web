<template>
    <div class="content">
        <content-header :title="currentConversation.title"
                        :count="currentConversation.messages.length"
                        :conversationId="currentConversation.id"
                        @changeName="handlerChangeName"/>
        <content-body ref="contentBody" />
        <content-tail :isgenerating="currentConversation.generating" 
                    @sendMessage="sendMessageHandler" 
                    @cancleSend="handlerCancel"
                    @chatSetting="handlerChatSetting" />
        <div v-show="showChatSetting" class="chat-setting">
            <div class="chat-setting-container">
                <el-form
                    label-position="top"
                    label-width="auto"
                    :model="chatSetData"
                    style="max-width: 600px"
                >
                    <el-form-item label="default api" label-position="top">
                        <el-input disabled v-model="chatSetData.defaultApi" />
                    </el-form-item>
                    <el-form-item label="api" label-position="top">
                        <el-input v-model="chatSetData.api" />
                    </el-form-item>
                    <el-form-item label="key" label-position="top">
                        <el-input v-model="chatSetData.key" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onChatSetSubmit">确定</el-button>
                        <el-button @click="onChatSetCancle">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, ref, provide, reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { completion } from '@/services'
import GptRequestInfo from '@/classes/GptRequestInfo'
import ContentHeader from './content-header.vue'
import ContentBody from './content-body.vue'
import ContentTail from './content-tail.vue'

import useGptModels from '@/store/modules/GptModels'
import useConversationStore from '@/store/modules/Conversation'

import Message from '@/classes/Message'

const conversationStore = useConversationStore()
const currentConversation  = computed(() => conversationStore.currentConversation)

const gptModelsStore = useGptModels()
const currentModel = computed(() => gptModelsStore.currentModel)
const contentBody = ref(null)
const autoScrollToMessage = ref(true);

provide('autoScrollToMessage', autoScrollToMessage)

const sendMessageHandler = (content, images) => {
    const userMessage = new Message({role: "user", content, time: new Date(), images})
    const conversation = conversationStore.currentConversation
    conversation.generating = true
    conversation.addMessage(userMessage)
    contentBody.value?.scrollToBottom()
    autoScrollToMessage.value = true
    handlerReceive(conversation)
}

const handlerChangeName = (newName) => {
    conversationStore.updateMessageName(newName)
}

let cancelRef = ref(null);
const handlerCancel = () => cancelRef.value?.()

const handlerReceive = async (conversation) => {
    const requestInfo = new GptRequestInfo({model: currentModel.value, stream: true, messages: conversation.messages})
    const receiveMessage = new Message({role: "assistant", content: '...', time: new Date()})
    conversation.addMessage(receiveMessage)
    autoScrollToMessage.value && contentBody.value?.scrollToBottom()
    contentBody.value?.lazy_load_throttle()
    try {
        await completion(requestInfo, generateOnText(conversation), generateOnError(conversation))
    } catch (err) {
        conversationStore.updateMessage(conversation.id, {time: new Date(), content: err.message})
    } finally {
        conversationStore.updateMessage(conversation.id, {time: new Date()})
    }
}

const generateOnText = (conversation) => {
    return (result) => {
        const { text, cancle } = result
        cancelRef.value = () => {
            cancle()
            conversationStore.updateMessage(conversation.id, {time: new Date()})
            nextTick(() => cancelRef.value = null)
        }
        conversationStore.updateMessage(conversation.id, {content: text}, true)
        autoScrollToMessage.value && contentBody.value?.scrollToBottom()
    }
}

const generateOnError = (conversation) => {
  return (error) => {
    try {
      const message = JSON.parse(error.message)
      conversationStore.updateMessage(conversation.id, {content: message.error.message, time: new Date()})
    } catch {
        conversationStore.updateMessage(conversation.id, {content: 'An error occurred, please retry', time: new Date()})
    } finally {
    //   messageRef.value?.scrollToMessage(id);
    }
  }
}

import useChatSettingStore from '@/store/modules/ChatSetting'
const chatSettingStore = useChatSettingStore()
const showChatSetting = ref(false)
const chatSetData = reactive({
    defaultApi: chatSettingStore.defaultApi,
    api: chatSettingStore.api,
    key: chatSettingStore.key,
})
const handlerChatSetting = () => {
    showChatSetting.value = true
}

const onChatSetSubmit = () => {
    chatSettingStore.set_data(chatSetData.api, chatSetData.key)
    showChatSetting.value = false
    ElMessage({
        message: '聊天设置修改成功',
        type: 'success'
    })
}

const onChatSetCancle = () => {
    showChatSetting.value = false
}

</script>

<style lang="less" scoped>

.content {
    width: calc(100% - var(--sidebar-width));

    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    .chat-setting {
        display: flex;

        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(16, 22, 26, .7);

        .chat-setting-container {
            margin: auto;
            padding: 20px;
            border-radius: 5px;

            width: 400px;

            background-color: #fff;
        }
    }
}

</style>
