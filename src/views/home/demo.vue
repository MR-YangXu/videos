<template>
    <div class="home-box">
        <div class="home-header-box">
            <div class="header-box-navMenu">
                <div class="header-box-navItem">
                    推荐
                </div>
                <div class="header-box-navItem">
                    分类
                </div>
            </div>
            <div class="hader-box-language">
                <img src="" alt="">
                <span>CN</span>
            </div>
        </div>
        <div class="home-main">
            <div class="main-wrap">
                <van-swipe :initial-swipe="playsData.swipeIndex" @drag-end="dragEnd" @drag-start="dragStart"
                    :show-indicators="false" style="height: 200px;" :lazy-render="true">
                    <van-swipe-item v-for="(item, i) in swipeLists" :key="i">
                        电影推荐
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class="main-content">
            <van-cell title="单元格" is-link />
            <div class="content-item-wrap">
                <div class="content-item" v-for="(item, i) in ">
                    <img src="" alt="">
                    <div>无双君王</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import videocom from '../components/videocom.vue'
import bottomBar from '../components/bottomBar.vue'
import { useVideoStore } from '../store/videos'
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';


// 获取pinia里的数据
let videoStore = useVideoStore()
// 使pinia里state变成响应式数据
let { playsData } = storeToRefs(videoStore)
const swipeLists = reactive([1, 2, 3]);


</script>

<style scoped lang="less"></style>
