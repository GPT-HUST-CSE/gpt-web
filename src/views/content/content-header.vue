<template>
    <div class="content-header">
        <div class="title">
            <div v-if="changeName" class="main-title one-line-ellipsis">
                <input type="text" ref="inputText" class="change-title" v-model="newName" 
                @change="handlerNameInput"
                @blur="handlerNameInput">
            </div>
            <div v-else class="main-title one-line-ellipsis">{{ title }}</div>
            <div class="subtitle">{{ countInfo }} </div>
        </div>
        <div class="actions">
            <div class="action"><button class="button-icon" @click="handlerChangeName"><img src="@/assets/image/edit.svg"></button></div>
            <!-- <div class="action"><button class="button-icon"><img src="@/assets/image/share.svg"></button></div>
            <div class="action"><button class="button-icon"><img src="@/assets/image/fullScreen.svg"></button></div> -->
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
const props = defineProps({
    title: {
        type: String,
        default: "新的聊天"
    },
    count: {
        type: Number,
        default: 0
    },
    conversationId: {
        type: Number,
        default: 0
    }
})

const emits = defineEmits(['changeName'])

const countInfo = computed(() => `共${props.count}条对话`)
const currentTitle = computed(() => props.title)
const changeName = ref(false)
const newName = ref(currentTitle)
const inputText = ref(null)

const handlerChangeName = () => {
    changeName.value = true
    nextTick(() => inputText.value?.focus())
}

const handlerNameInput = (event) => {
    changeName.value = false
    if(event.target.value === currentTitle) return
    emits('changeName', event.target.value)
}

</script>

<style lang="less" scoped>
.content-header {
    display: flex;
    justify-content: space-between;

    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,.1);

    .title {
        max-width: 80%;
        .main-title {
            font-size: 20px;
            font-weight: bold;
        }
        .sub-title {
            font-size: 14px;
        }
        .change-title {
            // border: none;
            width: 80%;
            height: 24px;
            box-sizing: border-box;
            font-size: 18px;
            font-weight: inherit;
        }
    }

    .actions {
        display: inline-flex;
        align-self: center;

        .action {
            &:not(:last-child) {
                margin-right: 5px;
            }
        }
    }
}
</style>
