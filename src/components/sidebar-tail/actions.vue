<template>
    <div class="actions">
        <div class="action button-icon">
            <img src="@/assets/image/setting.svg">
        </div>
        <div class="action button-icon">
            <a href="https://github.com/GPT-HUST-CSE" target="_blank">
                <img src="@/assets/image/github.svg">
            </a>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.actions {
    display: inline-flex;

    .action {
        a {
            width: 16px;
            height: 16px;
        }

        &:not(:last-child) {
            margin-right: 10px;
        }
    }
}
</style>
