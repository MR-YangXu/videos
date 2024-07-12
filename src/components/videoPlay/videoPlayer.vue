<template>
  <div :id="id" :width="props.width" :height="props.height">
    <!-- <img
      v-show="showImage && props.poster"
      style="background-color: black; object-fit: cover"
      :style="{ width: width, height: height }"
      :src="props.poster"
      @click="clickImage"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import Player, { Events } from "xgplayer";
import HlsPlugin from "xgplayer-hls";
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
    default: "mp4",
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Number,
    default: 0,
  }
});

// 子组件向父组件传值
const emits = defineEmits(["playOver", "focus", "blur", "time", "load", "pause", "play"]);

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
onUnmounted(() => {
  player.destroy();
})


const pause = () => {
  player.pause();
  // player.on(Events.PAUSE, () => {
  //     // TODO
  // })
};
const togglePlay = () => {
  if (player.paused) {
    player.play(); // 单击播放
  } else {
    player.pause(); // 单击暂停
  }
};
const play = () => {
  player.play();
};
const destroy = () => {
  player.destroy();
};
// 初始化西瓜视频
const initPlayer = () => {
  const params = {
    lang: "en",
    volume: 0.3,
    id: props.id,
    url: props.videoUrl,
    poster: props.poster,
    // poster: props.poster,
    playsinline: props.playsinline,
    height: props.height,
    width: props.width,
    i18n: [
      {
        LANG: "en", // 要定义的语言
        // 文本语言
        TEXT: {
          // MEDIA_ERR_SRC_NOT_SUPPORTED:
          //   "Temporarily unable to watch, please stay tuned", // 如果内置已经有该文本的定义，则直接覆盖， 没有则扩展
          MEDIA_ERR_SRC_NOT_SUPPORTED: "",
        },
      },
    ],
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
    autoplay: true,
    whitelist: [""],
    // plugins: [HlsPlugin],
    // autoplay: props.autoplay, // 自动播放
    // muted: false, // 开启声音
    preload: "auto", // 自动加载
  };
  if (HlsPlugin.isSupported()) {
    params.plugins = [HlsPlugin];
  }
  player = new Player(params);
  props.time && (player.currentTime = Number(props.time));
  player.play();
  // 播放器结束时候调用
  player.on(Events.ENDED, () => {
    emits("playOver");
  });
  player.on(Events.PLAYER_FOCUS, () => {
    emits("focus");
  });
  player.on(
    Events.PLAYER_BLUR,
    debounce(() => {
      emits("blur");
    }, 2500)
  );
  player.on(Events.PAUSE, () => {
    emits("pause");
  });
  player.on(Events.PLAY, () => {
    emits("play");
  });
  player.on(Events.AUTOPLAY_PREVENTED, () => {
    emits("pause");
  });
  // 监听播放时间更新事件
  player.on("timeupdate", function () {
    // 获取当前播放时间
    var currentTime = player.currentTime;

    // 在控制台打印当前播放时间
    // console.log('当前播放时间：', currentTime);
    emits("time", currentTime);
  });
  player.on(Events.LOADED_DATA, () => {
    showImage.value = false;
    emits("load");
  });
  player.on(Events.USER_ACTION, (data) => {
    console.warn("点击", data);
    // if (player.paused) {
    //   player.play(); // 单击播放
    // } else {
    //   player.pause(); // 单击暂停
    // }
  });
  // 监听结束事件
  // player.on("ended", () => {
  //   player.currentTime = time;
  //   player.play();
  // });
  // player.on('ready', () => {
  //   const firstFrame = player.videoFrame.get();
  //   console.log('First frame:', firstFrame);
  //   // 可以将 firstFrame 设置为组件的数据或者传递给其他方法处理
  // });
  // player.on('canplay', () => {
  //   // 调用 captureImage() 方法截取封面第一帧
  //   player.captureImage().then((url) => {
  //     console.log('截取的封面图片地址:', url);
  //     // 可以将截取的封面图片地址存储起来或者进行其他处理
  //   });
  // });
  function debounce(func, delay) {
    let timerId;

    return (...args) => {
      const context = this;

      clearTimeout(timerId);

      timerId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
};

defineExpose({
  pause,
  play,
  togglePlay,
  destroy,
  initPlayer,
  id: props.id,
});
</script>
