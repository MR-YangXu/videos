<template>
    <videocom :playsData="playsData"></videocom>
    <!-- 底部栏组件 -->
    <!-- <bottomBar :playsData="playsData"></bottomBar> -->
</template>

<script setup>
import Videocom from '@/components/videoPlay/videocom.vue'
// import bottomBar from '../components/bottomBar.vue'
// import { useVideoStore } from '../store/videos'
import { storeToRefs } from 'pinia';


// 获取pinia里的数据
// let videoStore = useVideoStore()
// 使pinia里state变成响应式数据
// let { playsData } = storeToRefs(videoStore)
const playsData = {
    num: "666666",
    img: "./image/jyz.jpg",
    sex: false,
    collTotal: 66,
    fanTotal: 66,
    collectionFlag: true,
    age: "22",
    address: "北京",
    school: "北京幼儿园",
    isPlay: null,
    navIndex: 3, //视频类别索引
    swipeIndex: 0, //轮播索引
    backHomeIndex: 0, //切换回主页时赋值给轮播索引
    videos: [
        {
        videoUrl: "./video/fj6.avi",
        imgUrl: "./image/jyz.jpg",
        likeFlag: false,
        collectionFlag: true,
        text: "树是梧桐树，城是南京城 一句梧桐美，种满南京城 #南京 #梧桐树 #向往新生活",
        name: "Q音推荐",
        time: "2023-05-10",
        likeTotal: 66,
        collTotal: 66,
        chat: [
            {
            flag: true,
            name: "Q音推荐",
            chatImg: "./image/jyz.jpg",
            chatText: "今天吃什么",
            chatLikeShow: false,
            chatTextShow: false,
            },
        ],
        },
        {
        videoUrl: "./video/bldxx.avi",
        imgUrl: "./image/jyz.jpg",
        likeFlag: false,
        collectionFlag: false,
        sizeFlag: true,
        text: "所有的相遇，都是久别重逢 #便利店超新星 #池昌旭 #金裕贞",
        name: "Q音推荐",
        time: "2023-05-10",
        likeTotal: 66,
        collTotal: 66,
        chat: [
            {
            flag: true,
            name: "Q音推荐",
            chatImg: "./image/jyz.jpg",
            chatText: "妈妈做的宫爆鸡丁",
            chatLikeShow: false,
            chatTextShow: false,
            },
        ],
        },
        {
        videoUrl: "./video/zysh.avi",
        imgUrl: "./image/jyz.jpg",
        likeFlag: false,
        collectionFlag: false,
        sizeFlag: true,
        text: "拥有三项征服者的力量，胜利是必然的 #青钢影 #折一束花",
        name: "Q音推荐",
        time: "2023-05-10",
        likeTotal: 66,
        collTotal: 66,
        chat: [
            {
            flag: true,
            name: "Q音推荐",
            chatImg: "./image/jyz.jpg",
            chatText: "妈妈做的孜然羊肉",
            chatLikeShow: false,
            chatTextShow: false,
            },
        ],
        },
    ],
};


</script>

<style scoped lang="less"></style>
