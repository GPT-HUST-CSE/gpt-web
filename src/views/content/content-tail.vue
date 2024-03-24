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
        <textarea id="chat-input" placeholder="Enter 发送，Shift + Enter 换行，/ 触发补全，: 触发命令"></textarea>
        <button class="submit button-icon">
            <img src="@/assets/image/submit.svg">
            <div class="text one-line-ellipsis">发送</div>
        </button>
    </label>
  </div>
</template>

<script setup>
import { getAssetURL } from '@/utils/load_assets'

const actions = [
    {icon: "/img/icons/setting.svg", text: "对话设置"}
]

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
            width: var(--icon-width);
            overflow: hidden;
        }
    }

    .input-inner {
        display: flex;
        textarea {
            color: var(--black);
            background-color: var(--white);
            width: 100%;
            height: 100%;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.03) 0px -2px 5px;
            padding: 10px 90px 10px 14px;
            resize: none;
            outline: none;
            box-sizing: border-box;
            height: 82px;

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
