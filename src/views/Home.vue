<template>
    <div class="home">
        <div class="home_contain">
            <home-sidebar />
            <home-content />
        </div>
    </div>
</template>

<script setup>
import HomeContent from '@/components/home-content.vue'
import HomeSidebar from '@/components/home-sidebar.vue'

</script>

<style lang="less" scoped>
.home {
    --sidebar-width: 300px;

    height: 100vh;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    .home_contain {
        background-color: var(--white);
        color: var(--black);
        min-width: 600px;
        max-width: 1200px;
        min-height: 500px;
        height: 90%;
        width: 90%;

        border: 1px solid #dedede;
        border-radius: 20px;

        overflow: hidden;
        display: flex;
    }
}
</style>
