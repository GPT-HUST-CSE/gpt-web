<template>
    <div class="content-header">
        <div class="title">
            <div class="main-title one-line-ellipsis">{{ title }}</div>
            <div class="subtitle">{{ countInfo }}</div>
        </div>
        <div class="actions">
            <div class="action"><button class="button-icon"><img src="@/assets/image/edit.svg"></button></div>
            <div class="action"><button class="button-icon"><img src="@/assets/image/share.svg"></button></div>
            <div class="action"><button class="button-icon"><img src="@/assets/image/fullScreen.svg"></button></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    title: {
        type: String,
        default: "新的聊天"
    },
    count: {
        type: Number,
        default: 0
    }
})
const countInfo = computed(() => `共${props.count}条对话`)
</script>

<style lang="less" scoped>
.content-header {
    display: flex;
    justify-content: space-between;

    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,.1);

    .title {
        .main-title {
            font-size: 20px;
            font-weight: bold;
        }
        .sub-title {
            font-size: 14px;
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
