<template>
    <div class="content-body" ref="contentBody" @wheel="handlerScrollEvent">
        <template v-for="(message, index) in conversation.messages" :key="index">
            <message-user v-if="message.role === 'user'" :message="message"></message-user>
            <message-robot v-else :message="message"></message-robot>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, inject } from 'vue'
import MessageUser from '@/components/chat-message/message-user.vue'
import MessageRobot from '@/components/chat-message/message-robot.vue'

import useConversationStore from '@/store/modules/Conversation'

import Message from '@/classes/Message'

const contentBody = ref(null)
const conversationStore = useConversationStore()
const conversation  = computed(() => conversationStore.currentConversation)
const conversationId = computed(() => conversationStore.currentConversation.id)

const autoScrollToMessage = inject('autoScrollToMessage')

const handlerScrollEvent = () => {
    autoScrollToMessage.value = false
}

const scrollToBottom = () => {
    nextTick(() => {
        contentBody.value.scrollTop =  contentBody.value.scrollHeight - contentBody.value.clientHeight
    })
}

watch(conversationId, () => {
    scrollToBottom()
})

onMounted(() => {
    scrollToBottom()
})

import { throttle } from '@/utils/throttle'
import { getFileContentAsBase64 } from '@/services'
import useImagesStore from '@/store/modules/Images'
const imagesStore = useImagesStore()
const lazy_load = () => {
    const imgs = contentBody.value.querySelectorAll('.user-image');
    const scrollBottom = contentBody.value.scrollHeight - contentBody.value.scrollTop - contentBody.value.clientHeight
    imgs.forEach(async img => {
        if(!img.src.includes('loading.gif')) return
        const imageBottom = contentBody.value.scrollHeight - img.offsetTop - img.clientHeight
        if(imageBottom <= (scrollBottom + 350)) {
            let base64 = imagesStore.get_image(img.dataset.src)
            if(!base64) {
                try {
                    base64 = await getFileContentAsBase64(img.dataset.src)
                    if(!img.src.includes('loading.gif')) return
                    imagesStore.set_image(img.dataset.src, base64)
                    img.src = base64
                } catch(error) {
                    console.log(error);
                }
                
            }
        }
    });
}

const lazy_load_throttle = throttle(lazy_load)

onMounted(() => {
    contentBody.value.addEventListener('scroll', () => {
        lazy_load_throttle()
    })
})

defineExpose({
    scrollToBottom,
    lazy_load_throttle
});

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

:deep(.message-robot-container) {
    .markdown-body {
        font-size: 0;
        p {
            padding: 0;
            margin: 0;
            font-size: var(--content-font-size);
        }
        .all-code{
            font-size: var(--content-font-size);
            position: relative;

            
            color: #fff;

            border-radius: 10px;

            .code-prefix {
                margin: 0;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                background-color: #2f2f2f;
                color: #a4a4a4;

                .code-wrapper{
                    padding: 5px 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .copy-code {
                        margin: 0;
                        padding: 0;
                        width: 75px;

                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        color: inherit;
                        background: inherit;
                        border: none;
                        cursor: pointer;
                    }
                }
            }

            .hljs {
                margin: 0;
                background-color: #0d0d0d;
                
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;

                .code {
                    // margin: 0 0 10px 10px;
                    padding: 0 0 10px 10px;
                    overflow-x: auto;
                    .hljs-name, .hljs-keyword{
                        color: #569cd6;
                    }

                    .hljs-title {
                        color: #f22c3d;
                    }

                    .function_{
                        color: #af232f;
                    }
                    
                    .hljs-built_in{
                        color: #dcdcaa
                    }

                    .hljs-params {
                        color: #9cdcfe;
                    }

                    .hljs-attr, .hljs-number, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-pseudo, .hljs-template-variable, .hljs-type, .hljs-variable {
                        color: #da2f76;
                    }

                    .hljs-comment {
                        color: hsla(0,0%,100%,.5);
                    }

                    .hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-regexp, .hljs-string {
                        color: #00a67d;
                    }
                    
                }
            }
        }

        li {
            font-size: var(--content-font-size);
        }
    }
}
</style>
