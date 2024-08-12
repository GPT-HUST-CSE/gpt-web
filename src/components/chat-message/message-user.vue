<template>
  <div class="message-user" ref="message_user">
    <div class="message-user-container">
        <div class="header">
            <div class="avatar">
                <img :src="avatar">
            </div>
        </div>
        <div class="item">
            <template v-for="image_id in message.images" :key="image_id">
                <img class="user-image" :src="imagesStore.get_image(image_id) || '/img/gifs/loading.gif'" :data-src="image_id">
            </template>
            <div class="markdown-body">
                {{ content }}
            </div>
        </div>
        <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getFileContentAsBase64 } from '@/services';
import { formatMonthDay } from '@/utils/format_date'
import Message from '@/classes/Message'

const props = defineProps({
    message: {
        type: Message,
        default: new Message()
    },
    avatar: {
        type: String,
        default: "/img/icons/default_user_avatar.svg"
    }
})

const content = computed(() => props.message.content)
const time = computed(() => formatMonthDay(props.message.time, "YYYY/MM/DD hh:mm:ss"))

import useImagesStore from '@/store/modules/Images';
const imagesStore = useImagesStore()
// const images = ref({})
// const image_datas = computed(() => props.message.images)

// watch(image_datas, () => {
//     initImages()
//     // load_images()
// })

// const initImages = () => {
//     for(const image_id of props.message.images) {
//         if(!Object.prototype.hasOwnProperty.call(images.value, image_id)){
//             images.value[image_id] = "/img/gifs/loading.gif"
//         }
//     }
// }
// initImages()

// const load_images = async () => {
//     for(const image_id of props.message.images) {
//         let image_base64 = imagesStore.get_image(image_id)
//         if(!image_base64) {
//             image_base64 = await getFileContentAsBase64(image_id)
//             imagesStore.set_image(image_id, image_base64)
//         }
//         images.value[image_id] = image_base64
//     }
// }
// const loaded = false
// const message_user = ref(null)
// const lazy_load = async () => {
//     const content_body = document.querySelector('.content-body')
//     const scroll_bottom = content_body.scrollHeight - content_body.scrollTop - content_body.clientHeight
//     const message_user_bottom = content_body.scrollHeight - message_user.value.offsetTop - message_user.value.clientHeight
//     if(message_user_bottom <= (scroll_bottom + 10)) {
//         await load_images()
//     }
// }

// onMounted(lazy_load)
</script>

<style lang="less" scoped>
.message-user {
    display: flex;
    flex-direction: row-reverse;

    .message-user-container {
        max-width: 80%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        
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
            font-size: var(--content-font-size);
            user-select: text;
            word-break: break-all;
            border: var(--border-in-light);

            .user-image {
                margin: 0 5px 10px;
                max-width: 200px;
            }

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
            padding-right: 10px;
            pointer-events: none;
            user-select: none;
        }
    }
}
</style>
