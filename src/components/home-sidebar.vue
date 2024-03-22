<template>
    <div class="sidebar">
        <div class="sidebar-header">

            <img class="sidebar-logo" src="../assets/image/gpt.svg">
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.sidebar {
    width: var(--sidebar-width);
    box-sizing: border-box;
    background-color: #e7f8ff;
    padding: 20px;
    position: relative;

    .sidebar-header {
        position: relative;
        padding: 20px 0;


        .sidebar-logo {
            width: 43px;
            height: 44px;
            opacity: 0.2;

            position: absolute;
            right: 0;
        }
    }
}
</style>
