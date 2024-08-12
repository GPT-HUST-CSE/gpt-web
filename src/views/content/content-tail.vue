<template>
  <div class="content-tail">
    <div class="input-actions">
        <template v-for="(action, index) in actions" :key="index">
            <div :class="'action ' + `action-${action.type}`" @click="handlerActions">
                <div class="icon"><img :src="action.icon"></div>
                
                <div v-if="action.type === 'model'" class="model-selector">
                    <select v-model="selectedModel" @change="handlerSelectModel" value="gpt-3.5-turbo">
                        <template v-for="model in models" :key="model">
                            <option :value="model" class="one-line-ellipsis model-option">{{ model }}</option>
                        </template>
                    </select>
                </div>
                <div v-else class="text">{{ action.text }}</div>
            </div>
        </template>
    </div>
    <label class="input-inner" for="chat-input">
        <div class="text">
            <textarea v-model.trim="message" @keydown="keydownHandler" id="chat-input" :placeholder="placeholder"></textarea>
        </div>
        
        <button v-if="!isgenerating" class="image button-icon" @click="uploadImage">
            <img src="@/assets/image/images.svg">
            <div class="text one-line-ellipsis">图片</div>
        </button>

        <div id="images" ref="images_div">
            <template v-for="(image, index) in images" :key="index">
                <div :class="{'image-container': true, 'loading': image.loading}">
                    <img :src="image.src" style="width: 100%;height: 100%;">
                    <div class="loading-overlay">Loading...</div>
                </div>
            </template>
        </div>

        <button v-if="!isgenerating" class="submit button-icon" @click="sendMessage">
            <img src="@/assets/image/submit.svg">
            <div class="text one-line-ellipsis">发送</div>
        </button>
        <button v-else class="submit button-icon" @click="cancleSend">
            <img src="@/assets/image/cancle.svg">
            <div class="text one-line-ellipsis">取消</div>
        </button>
    </label>
  </div>
</template>

<script setup>
import { nextTick, ref, toRefs, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus'
import { isImageFile } from '@/utils/image_types';

import useGptModels from '@/store/modules/GptModels';

const emit = defineEmits(['sendMessage', 'cancleSend', 'chatSetting']);

const props = defineProps({
    isgenerating: {
        type: Boolean,
        default: false
    }
})

const gptModelsStore = useGptModels()
const { currentModel, models } = storeToRefs(gptModelsStore)

const actions = [
    {icon: "/img/icons/setting.svg", text: "对话设置", type: 'setting'},
    // {icon: "/img/icons/auto.svg", text: "自动主题", type: 'theme'},
    // {icon: "/img/icons/magic.svg", text: "快捷指令", type: 'instruction'},
    // {icon: "/img/icons/mask.svg", text: "所有面具", type: 'mask'},
    // {icon: "/img/icons/clear.svg", text: "清除聊天", type: 'clear'},
    {icon: "/img/icons/robot.svg", text: gptModelsStore.currentModel, type: 'model'},
]

const handlerActions = (event) => {
    if(event.currentTarget.classList.contains('action-setting')) {
        emit('chatSetting')
    }
}

const selectedModel = ref(currentModel)

const handlerSelectModel = () => {
    gptModelsStore.setModel(selectedModel.value)
}

import useImagesStore from '@/store/modules/Images';
import { updateFile } from '@/services';
const imagesStore = useImagesStore()
const images = ref([])
const images_div = ref(null)
let isuploading = false
const uploadImage = () => {
    if(isuploading) {
        ElMessage({
            message: '请等待前一张图片上传完成',
            type: 'warning',
        })
        return
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) => {
        isuploading = !isuploading
        const files = fileInput.files;
        if (files && files.length > 0) {
            const file = files[0];
            if(!isImageFile(file)) {
                ElMessage({
                    message: '仅接受图片类型文件',
                    type: 'warning',
                })
                return
            }
            const tmp_img = {
                'src': window.URL.createObjectURL(file),
                'loading': true,
                'image_id': ''
            }
            images.value.push(tmp_img)
            const img_idx = images.value.length - 1
            updateFile(file, (id, base64) => {
                imagesStore.set_image(id, base64)
                nextTick(() => {
                    images.value[img_idx] = {
                        'src': tmp_img.src,
                        'loading': false,
                        'image_id': id
                    }
                })
                isuploading = !isuploading
            }, (error) => {
                nextTick(() => {images.value.splice(img_idx, 1)})
                ElMessage({
                    message: error.message,
                    type: error,
                })
                isuploading = !isuploading
            })
        } else {
            ElMessage({
                message: '请上传图片',
                type: 'warning',
            })
            return
        }
    });
    fileInput.click();
}

const placeholder = "Message..."

const message = ref("")

const keydownHandler = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
    }
}

const sendMessage = () => {
    if(!message.value) {
        ElMessage({
            message: '请输入内容！！！',
            type: 'warning',
        })
    } else if(!images.value.every(img => img.image_id)) {
        ElMessage({
            message: '图片还未全部加载完成，请稍等',
            type: 'warning',
        })
    } else {
        emit('sendMessage', message.value, images.value.map(img => img.image_id))
        message.value = ""
        images.value.splice(0, images.value.length)
    }
}

const cancleSend = () => {
    emit('cancleSend')
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
        // overflow: visible;
        .action-model:hover {
            overflow: visible;
            width: 130px !important;
        }

        .action {
            position: relative;
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

            .model-selector {
                display: none;
            }

            &:hover {
                width: 70px;
                background-color: var(--hover-color);
                
                .text {
                    transform: translateX(0);
                    opacity: 1;
                }

                .model-selector {
                    padding-left: 5px;
                    display: block;
                    // position: absolute;
                    // left: 10%;
                    // top: 100%;
                    // height: 100%;
                    width: 80%;
                    border-radius: 15px;

                    select {
                        max-width: 100%;
                        border: none;
                        background-color: inherit;
                        overflow: hidden;
                    }
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
        // display: flex;
        .text {
            width: 100%;
            display: flex;

            textarea {
                color: var(--black);
                background-color: var(--white);
                width: 100%;
                height: 100px;
                border-radius: 10px;
                box-shadow: rgba(0, 0, 0, 0.03) 0px -2px 5px;
                padding: 10px 170px 10px 14px;
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
        }
        
        #images {
            position: absolute;
            right: 100px;
            bottom: 28px;

            width: 80px;
            height: 80px;

            overflow: auto;

            .image-container {
                position: relative;
                display: inline-block;
                width: 100%;
                height: 100%;

                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 10px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                &.loading .loading-overlay {
                    opacity: 1;
                }
            }

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

        .image {
            position: absolute;
            right: 30px;
            bottom: 74px;

            display: flex;

            background-color: var(--black);
            color: #fff;

            .text {
                margin-left: 5px;
                font-size: 12px;
            }
        }

        .submit {
            position: absolute;
            right: 30px;
            bottom: 28px;

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
