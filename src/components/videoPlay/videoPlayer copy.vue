<template>
  <div :width="props.width" :height="props.height" :id="id">
    <img
      v-if="showImage"
      style="background-color: black; object-fit: cover"
      :width="props.width"
      :height="props.height"
      :src="props.poster"
      @click="clickImage"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Player, { Events } from "xgplayer";
import HlsPlugin from 'xgplayer-hls';
import "xgplayer/dist/index.min.css";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: () => "",
  },
  poster: {
    type: String,
    default: () => "",
  },
  playsinline: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  videoType: {
    type: String,
    default: 'mp4'
  }
});

// 子组件向父组件传值
const emits = defineEmits(["playOver", "focus", "blur"]);

const showImage = ref(true);
// 定义一个变量来存储 player 实例
let player: Player;

const clickImage = () => {
  if (player == null) {
    initPlayer();
    showImage.value = false;
  }
};
onMounted(() => {
  initPlayer();
});

const pause = () => {
  player.pause();
  // player.on(Events.PAUSE, () => {
  //     // TODO
  // })
};
const play = () => {
  player.play();
};
// 初始化西瓜视频
const initPlayer = () => {
  if (props.videoType === 'mp4') {
    player = new Player({
      lang: "zh",
      volume: 0.3,
      id: props.id,
      url: props.videoUrl,
      poster: props.poster,
      playsinline: props.playsinline,
      height: props.height,
      width: props.width,
      // closeVideoClick: true, //单击暂停/播放
      // closeVideoDblclick: true, //双击全屏
      // cssFullscreen: false, //显示样式全屏
      // download: true, //显示下载按钮
      // controls: false,
      // marginControls: true,
      controls: {
        mode: "bottom",
      },
      // icons: {
      //   startPlay: `<div></div>`,
      //   startPause: `<div></div>`
      // },
      // ignores: ["start", "progresspreview"],
      commonStyle: {
        // 进度条底色
        progressColor: "",
        // 播放完成部分进度条底色
        playedColor: "#ff9700",
        // 缓存部分进度条底色
        cachedColor: "",
        // 进度条滑块样式
        sliderBtnStyle: {},
        // 音量颜色
        volumeColor: "#ff9700",
      },
      playbackRate: [0.25, 0.5, 1, 1.5, 2, 3],
      // inactive: 1500, //播放器focus状态自动消失延迟时长，单位为ms
      // leavePlayerTime: 1500, //鼠标移出播放器区域就隐藏时间
      // autoplay: true,
      whitelist: [""],
    });
  } else if (props.videoType === 'hls') {
    player = new Player({
      lang: "zh",
      volume: 0.3,
      id: props.id,
      url: props.videoUrl,
      poster: props.poster,
      playsinline: props.playsinline,
      height: props.height,
      width: props.width,
      // closeVideoClick: true, //单击暂停/播放
      // closeVideoDblclick: true, //双击全屏
      // cssFullscreen: false, //显示样式全屏
      // download: true, //显示下载按钮
      // controls: false,
      // marginControls: true,
      controls: {
        mode: "bottom",
      },
      // icons: {
      //   startPlay: `<div></div>`,
      //   startPause: `<div></div>`
      // },
      // ignores: ["start", "progresspreview"],
      commonStyle: {
        // 进度条底色
        progressColor: "",
        // 播放完成部分进度条底色
        playedColor: "#ff9700",
        // 缓存部分进度条底色
        cachedColor: "",
        // 进度条滑块样式
        sliderBtnStyle: {},
        // 音量颜色
        volumeColor: "#ff9700",
      },
      playbackRate: [0.25, 0.5, 1, 1.5, 2, 3],
      // inactive: 1500, //播放器focus状态自动消失延迟时长，单位为ms
      // leavePlayerTime: 1500, //鼠标移出播放器区域就隐藏时间
      // autoplay: true,
      whitelist: [""],
      plugins: [HlsPlugin]
    });
  }
  
  player.play();
  // 播放器结束时候调用
  player.on(Events.ENDED, () => {
    emits("playOver");
  });
  player.on(Events.PLAYER_FOCUS, () => {
    emits("focus");
  });
  player.on(Events.PLAYER_BLUR, () => {
    emits("blur");
  });
};

defineExpose({
  pause,
  play,
});
</script>
