<template>
  <!-- 播放视频 -->
  <div class="content">
    <Swipe
      ref="swipeRef"
      :initial-swipe="swipeIndex"
      @change="swiperChange"
      @drag-end="dragEnd"
      @drag-start="dragStart"
      :show-indicators="false"
      style="height: 100%"
      vertical
      :loop="false"
      :lazy-render="true"
    >
      <SwipeItem v-for="(item, i) in props.playsData.episode_list" :key="i">
        <div class="videos">
          <VideoPlayer
            v-if="(current_episode_num - 1) === i"
            :ref="'videos'+i"
            :class="'videoPlayer' + i + 1"
            :video-url="item.url"
            :poster="item.cover"
            :time="times"
            :id="'videoPlayer' + i + 1"
            :videoType="item.videoType"
            @playOver="handlePlayOver(i)"
            @focus="handleFocus"
            @blur="handleBlur"
            @time="handleTime"
            @load="handleLoad"
            @pause="handlePuase"
            @play="handlePlay"
          />
        </div>
        <div class="icon-main" v-if="showIcon || !item.url">
          <!-- 顶部返回 -->
          <div class="navBars">
            <Icon class="nav-back" name="arrow-left" @click="goBack"></Icon>
            <div class="nav-title">{{ playsData.title }}</div>
            <div>{{ current_episode_num }}/{{ playsData.episode_list.length }}</div>
          </div>
          <!-- 右侧边栏 -->
          <div class="right-info">
            <div class="icon-item">
              <Icon
                @click.stop="handlecollection(i)"
                name="star"
                size="36"
                :color="props.playsData.is_favorite ? '#ffb701' : '#fff'"
              />
              <p>{{ props.playsData.total_favorite_human }}</p>
            </div>
            <div class="icon-item">
              <Icon
                @click.stop="handleChat()"
                name="wap-nav"
                size="36"
                color="#fff"
              />
              <p>List</p>
            </div>
            <div class="icon-item">
              <Icon
                @click.stop="handleShare()"
                name="share"
                size="36"
                color="#fff"
              />
              <p>Share</p>
            </div>
          </div>
          <div class="popup" v-if="!item.url">
            <div class="error-btn" v-if="String(item.show_type) === '1'">
              <div class="popup-image">
                <Image class="image" :src="playsData.cover" :alt="playsData.title" />
              </div>
              <div class="title">{{ playsData.title }}</div>
              <div class="favorite">Collection quantity：<span class="num">{{ playsData.total_favorite_human }}</span></div>
              <div class="text">
                <div>Register and login to watch up to <span class="num">{{ playsData.register_watch_episodes }}</span> episodes for <span style="color: #F13A61">free</span></div>
              </div>
              <div class="watch-popup"><span>{{ watchNum }}</span>k people are watching</div>
              <div class="triangle"></div>
              <div class="btns" @click="handleRegister">Register for free viewing</div>
            </div>
            <!-- <div class="error-btn" v-else-if="String(item.is_locked) === '1' && String(userInfos?.message_type) === '1'">
              <div class="popup-image">
                <Image class="image" :src="playsData.cover" :alt="playsData.title" />
              </div>
              <div class="title">{{ playsData.title }}</div>
              <div class="favorite">Collection quantity：<span class="num">{{ playsData.total_favorite_human }}</span></div>
              <div class="text">
                <div>After unlocking, you can watch all the content under this short series.</div>
                <div>Unlocked this month {{ userInfos?.unlock_count }}/{{ userInfos?.total_unlock }}</div>
              </div>
              <div class="watch-popup"><span>{{ watchNum }}</span>k people are watching</div>
              <div class="triangle"></div>
              <div class="btns" @click="handleConfirm">Unlock Now</div>
            </div>
            <div class="error-btn" v-else-if="String(item.is_locked) === '1' && String(userInfos?.message_type) === '2'">
              <div class="popup-image">
                <Image class="image" :src="playsData.cover" :alt="playsData.title" />
              </div>
              <div class="title">{{ playsData.title }}</div>
              <div class="favorite">Collection quantity：<span class="num">{{ playsData.total_favorite_human }}</span></div>
              <div class="text">
                <div>Unlocked episodes have been released, please try again after March {{ userInfos?.expire_time }}</div>
              </div>
            </div> -->
            <div class="error-btn" v-else-if="String(item.is_locked) === '1'">
              <div class="popup-image">
                <Image class="image" :src="playsData.cover" :alt="playsData.title" />
              </div>
              <div class="title">{{ playsData.title }}</div>
              <div class="favorite">Collection quantity：<span class="num">{{ playsData.total_favorite_human }}</span></div>
              <div class="text">
                <div>Subscribe to unlock <span class="num">{{ playsData.episode_list.length }}</span> episodes of the current video</div>
              </div>
              <div class="watch-popup"><span>{{ watchNum }}</span>k sold recently</div>
              <div class="triangle"></div>
              <div class="btns" @click="handleSubscribe" v-if="item.show_type === 5">Unlocked for ${{ price }}</div>
              <div class="btns minimum" @click="handleSubscribe" v-if="item.show_type === 6">Subscribe now（Minimum ${{ price_avg }}/day）</div>
            </div>
          </div>
        </div>
        <!-- 暂停icon -->
        <div class="start-icon icon-main" v-if="isPause && item.url">
          <svg xmlns="http://www.w3.org/2000/svg" class="play xg-icon-play" width="35" height="48" viewBox="3 -4 28 40">
            <path fill="#fff" transform="scale(0.0320625 0.0320625)" d="M576,363L810,512L576,661zM342,214L576,363L576,661L342,810z"></path>
          </svg>
        </div>
        <!-- 首帧图 -->
        <div class="first-img icon-main" v-show="!item.url || (showImage && item.cover)">
          <img :src="item.cover"/>
        </div>
      </SwipeItem>
    </Swipe>
  </div>
  <!-- 列表窗口 -->
  <ActionSheet
    class="actionSheet"
    v-model:show="chatShow"
    :overlay="false"
    :title="`List Completed(${ playsData?.episode_list?.length })`"
    :overlay-style="{'background-color': '#222222'}"
  >
    <Tabs v-model:active="active" shrink>
      <Tab
        :title="i.name"
        v-for="(i, index) in treeSelect"
        :name="index"
        :disabled="i.disabled"
        :key="i"
        class="tree-tab"
      >
        <div class="p-content">
          <p v-for="(j, idx) in i.info" :key="j.episode_num" @click="handleSingle(j, index*50 + idx)">
            <img v-if="Number(current_episode_num) === j.episode_num" :src="player" alt="" />
            <span v-else>{{ j.episode_num }}</span>
            <div v-if="j.is_locked === 1" class="lock-box">
              <img class="lock" :src="lock" alt="" />
            </div>
          </p>
        </div>
      </Tab>
    </Tabs>
  </ActionSheet>

  <Overlay class="video-overlay" :show="shareShow" @click="() => shareShow = false">
    <div class="menu-box">
      <div class="share-title">Share</div>
      <div class="share-box">
        <img :src="props.playsData.cover" alt="">
        <div class="title">{{ props.playsData.title }}</div>
        <div class="desc">{{ props.playsData.desc }}</div>
      </div>
      <div class="btn-box">
        <!-- <div class="btn-item">
          <img :src="facebook" alt="">
          <div>facebook</div>
        </div>
        <div class="btn-item">
          <img :src="twitter" alt="">
          <div>twitter</div>
        </div> -->
        <div class="btn-item" @click="handleCopy">
          <img :src="link" alt="">
          <div>Link</div>
        </div>
      </div>
    </div>
  </Overlay>
  <Dialog v-model:show="showDialog" @confirm="handleConfirm" cancelButtonText="Reconsider" confirmButtonText="Confirm" confirmButtonColor="#e83a57" title="Unlocked" show-cancel-button>
    <div class="dialog-box">
      <div>Are you sure you want to unlock this short drama? After unlocking, you can watch all the content under this short series.</div>
      <div>Unlocked this month {{ userInfos?.unlock_count }}/{{ userInfos?.total_unlock }}</div>
    </div>
  </Dialog>
  <Dialog v-model:show="showDialogs" confirmButtonText="Confirm" confirmButtonColor="#e83a57" title="Unlocked">
    <div class="dialog-box">
      <div>Unlocked episodes have been released, please try again after March {{ userInfos?.expire_time }}</div>
    </div>
  </Dialog>
  <PayPopup :episodes_name="playsData.title" :initVideoPage="initVideoPage" :videoInfo="videoInfo" v-model="showPayPopup" />
  <AddToHomeScreen v-model="showAddToHomeScreen" />
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick } from "vue";
import { Icon, ShareSheet, ActionSheet, Tabs, Tab, Swipe, SwipeItem, showToast, Overlay, Dialog, Image } from 'vant';
import { useRouter } from "vue-router";
import { useUserInfoStore } from '@/store/modules/user';
// import { useVideoStore } from "../store/videos";
import { storeToRefs } from "pinia";
import VideoPlayer from "./videoPlayer.vue";
import player from '@/assets/images/movie/player.gif';
import lock from '@/assets/images/movie/lock.png';
import facebook from '@/assets/images/movie/facebook.png';
import twitter from '@/assets/images/movie/twitter.png';
import link from '@/assets/images/movie/link.png';
import { userFavorite, videoRecords, unlockVideo } from '@/apis/common';
import { handleLoadingNew, confirm } from '@/utils/handleResponse';
import PayPopup from '@/components/PayNow';
import AddToHomeScreen from '@/components/addToHomeScreen/index';

let props = defineProps({
  playsData: {
    type: Object,
    required: true,
  },
  treeSelect: {
    type: Array,
    default: []
  },
  total_favorite: {
    type: Number,
    default: 0
  },
  initVideoPage: {
    type: Function,
    default: () => {}
  }
});

// 路由
let router = useRouter();
// 获取当前组件实例
let { proxy } = getCurrentInstance();
const userInfo = useUserInfoStore();
const price = ref(0);
const price_avg = ref(0);
// 定义数据
let dbClick = ref(false); //判断是否是双击
let playMuted = ref(false); //控制是否静音
let playIndex = ref(-1); //切换视频后当前视频的索引
let shareShow = ref(false); //显示或隐藏分享面板
const isPause = ref(false); //判断是否是暂停状态
const showImage = ref(true);
const showPayPopup = ref(false);
const videoInfo = reactive({});
const options = [
  //分享面板数据
  [
    { name: "微信", icon: "wechat" },
    { name: "QQ", icon: "qq" },
    { name: "复制链接", icon: "link" },
  ],
];
let chatShow = ref(false); //显示或隐藏评论窗口
let chatIndex = ref(0); //当前视频的评论索引
let chatText = ref(""); //评论内容
let isFlag = ref(false); //是否是当前用户评论
const showIcon = ref(true);
const currentIndex = ref(0);
const active = ref(0);
// const total_favorites = ref(0);
const current_episode_num = ref(1)
const swipeIndex = ref(0)
const times = ref(0)
const watchNum = ref(1.1)

const showDialog = ref(false)
const showDialogs = ref(false)
const userInfos = reactive({})

const showAddToHomeScreen = ref(false);

// 手势滑动数据(左右滑动)
let touchStartX = ref(0);
let touchStartY = ref(0);
// const props.playsData.is_favorite = ref(false);
let delta = ref(50);
const currentTime = ref(0);
const handleSubscribe = () => {
  showPayPopup.value = true;
  videoInfo.id = props.playsData.id || '';
  videoInfo.current_episode_num = current_episode_num.value || 1;
  videoInfo.from = 'video';
  // router.push({
  //   name: 'shopping',
  //   query: {
  //     id: props.playsData.id || '',
  //     current_episode_num: current_episode_num.value || 1,
  //     from: 'video',
  //     return_url: window.location.href,
  //   }
  // })
}
const handleRegister = () => {
  router.push({
    name: 'register',
    query: {
      id: props.playsData.id || '',
      current_episode_num: current_episode_num.value || 1,
      from: 'video',
    }
  })
}
const getRandom = () => {
  const num = Math.random() * (9.9 - 1.1) + 1.1;
  return num.toFixed(1);
}
const checkLocked = () => {
  const index = (current_episode_num.value - 1) || 0
  const { is_locked, show_type } = props.playsData?.episode_list?.[index];
  if (Number(is_locked) === 1 && [5, 6].includes(Number(show_type))) {
    handleSubscribe();
  }
  // if (String(props.playsData?.episode_list?.[index]?.jmp_register) === '1') {
  //   showToast({
  //     message: 'Register and log in to watch this episode',
  //     forbidClick: true,
  //     onClose: () => {
  //       router.push({
  //         name: 'register',
  //         query: {
  //           id: props.playsData.id || '',
  //           current_episode_num: current_episode_num.value || 1,
  //           from: 'video',
  //         }
  //       })
  //     }
  //   });
  //   return;
  // }
  // if (String(props.playsData?.episode_list?.[index]?.is_locked) === '1') {
  //   if (String(userInfos?.message_type) === '1') {
  //     showDialog.value = true;
  //     return;
  //   } else if (String(userInfos?.message_type) === '2') {
  //     showDialogs.value = true;
  //     return;
  //   } else {
  //     showToast('Subscribe to unlock this episode')
  //     setTimeout(() => {
  //       router.push({
  //         name: 'shopping',
  //         query: {
  //           id: props.playsData.id || '',
  //           current_episode_num: current_episode_num.value || 1,
  //           from: 'video',
  //         }
  //       })
  //     }, 1000);
  //     return;
  //   }
  // }
}
const initPage = async ({ time }) => {
  // TODO: 待PWA一起上
  // 判断是否支付成功，如果支付成功，则弹窗指引用户添加到桌面
  const pay_success = localStorage.getItem('pay_success');
  const orderStatus = router.currentRoute.value.query?.orderStatus || '';
  // 判断支付成功或者3d支付成功
  // if (pay_success === '1' || (pay_success === '1' && ['-2', '-1', '1'].includes(String(orderStatus)))) {
  // 如果后端接口成功，进入页面清除成功标识
  pay_success === '1' && localStorage.removeItem('pay_success');
  if (pay_success === '1' && String(orderStatus) !== '0') {
      showAddToHomeScreen.value = true;
  }
  times.value = time;
  current_episode_num.value = props.playsData?.current_episode_num || 1;
  if (sessionStorage.getItem('CURRENTNUM')) {
    current_episode_num.value = sessionStorage.getItem('CURRENTNUM') || 1;
  }
  swipeIndex.value = current_episode_num.value - 1;
  currentIndex.value = swipeIndex.value; 
  // total_favorites.value = props.total_favorite || 0;
  // 进入记录一次
  await nextTick(() => {});
  Object.assign(userInfos, userInfo.userInfo);
  proxy.$refs[`videos${currentIndex.value}`]?.[0]?.initPlayer();
  handleHistory();
  watchNum.value = getRandom();
  // checkLocked();
}
// initPage();
onMounted(() => {
  // window.addEventListener('beforeunload', handleHistory);
  // proxy.$refs.videos[swipeIndex.value]?.initPlayer();
  price.value = userInfo?.siteInfo?.subscribe_mode?.subscribe_mode_once?.price || 0;
  const w_price_avg = userInfo?.siteInfo?.subscribe_mode?.subscribe_mode_week?.price_avg || 0;
  const m_price_avg = userInfo?.siteInfo?.subscribe_mode?.subscribe_mode_month?.price_avg || 0;
  const y_price_avg = userInfo?.siteInfo?.subscribe_mode?.subscribe_mode_year?.price_avg || 0;
  price_avg.value = Math.min(w_price_avg, m_price_avg, y_price_avg);
})
onUnmounted(() => {
  proxy.$refs[`videos${currentIndex.value}`]?.[0]?.destroy();
})
onBeforeUnmount(() => {
  // window.removeEventListener('beforeunload', handleHistory);
  handleHistory();
});

// 获取pinia里的数据
let videoStore = {} || useVideoStore();

const handleConfirm = async () => {
  try {
    const video_id = router.currentRoute.value.params?.video_id || '';
    await unlockVideo({ video_id })
    const res = (await userInfo.getUserInfos()) || {};
    Object.assign(userInfos, res);
    chatShow.value = false;
    props?.initVideoPage?.();
  } catch(err) {
    showToast(err.msg || '')
  }
}
const handleAuto = async () => {
  // proxy.$refs.videos[swipeIndex.value]?.initPlayer();
  // proxy.$refs[`videos${swipeIndex.value}`]?.[0]?.initPlayer();
};
const handleCopy = () => {
  const textToCopy = location.href;
  const input = document.createElement('textarea');
  input.style.opacity = 0;
  input.style.position = 'absolute';
  input.style.right = '9999';
  input.value = textToCopy;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
};
async function handleHistory() {
  try {
    sessionStorage.setItem('CURRENTNUM', '');
    const res = await videoRecords({
      video_id: props.playsData.id,
      episode_num: current_episode_num.value,
      watch_duration: Math.floor(currentTime.value),
    });
  } catch(err) {
    // showToast(err?.msg || '');
  }
}
const handlePlayOver = index => {
  if (String(props.playsData?.episode_list?.[index]?.is_locked) === '0') {
    if (proxy.$refs[`videos${currentIndex.value}`]) {
      // proxy.$refs.videos[currentIndex.value + 1]?.initPlayer();
      times.value = 0;
      // proxy.$refs[`videos${currentIndex.value}`]?.[0]?.initPlayer();
      if (current_episode_num.value + 1 < props.playsData.episode_list.length) {
        current_episode_num.value = current_episode_num.value + 1;
      }
      proxy.$refs.swipeRef?.next();
    }
  }
};
const swiperChange = (index) => {
  watchNum.value = getRandom();
  proxy.$refs[`videos${currentIndex.value}`]?.[0]?.destroy();
  // 每次切换记录一次
  currentIndex.value = index;
  current_episode_num.value = index + 1;
  handleHistory();
  checkLocked();
  times.value = 0;
  proxy.$refs[`videos${index}`]?.[0]?.initPlayer();
  // sessionStorage.setItem('CURRENTNUM', current_episode_num.value);
};
// 上下滑动开始触发
function dragStart(e) {
  // proxy.$refs.videos?.[e.index]?.destroy();
  // proxy.$refs[`videos${e.index}`]?.destroy();
  // proxy.$refs[`videos${e.index}`]?.[0]?.destroy();
}
// 上下滑动结束触发
function dragEnd(e) {
  proxy.$refs[`videos${currentIndex.value}`]?.[0]?.togglePlay();
}
// 点击列表图标
const handleChat = () => {
  chatShow.value = !chatShow.value;
};
// 是否收藏
async function handlecollection(i) {
  props.playsData.is_favorite = !props.playsData.is_favorite;
  let is_favorite = '';
  if (props.playsData.is_favorite) {
    is_favorite = '1';
    props.playsData.total_favorite = props.playsData.total_favorite + 1;
  } else {
    is_favorite = '2';
    props.playsData.total_favorite = props.playsData.total_favorite - 1;
  }
  try {
    const res = await handleLoadingNew(
      userFavorite({
        video_id: props.playsData.id,
        episode_num: current_episode_num.value,
        is_favorite,
      })
    );
  } catch(err) {
    props.playsData.is_favorite = !props.playsData.is_favorite;
    if (props.playsData.is_favorite) {
      props.playsData.total_favorite = props.playsData.total_favorite + 1;
    } else {
      props.playsData.total_favorite = props.playsData.total_favorite - 1;
    }
    showToast(err?.msg || '');
  }
}

// 点击分享图标
const handleShare = () => {
  shareShow.value = !shareShow.value;
};
// 复制链接
const select = (e) => {
  if (localStorage.getItem("Qy") !== null) {
    if (e.name === "复制链接") {
      let qwe = "https://snowcyans.github.io/QQShortVideo/#/";
      navigator.clipboard.writeText(qwe);
      showToast("复制成功");
      shareShow.value = false;
    } else {
      showToast("暂未开放");
    }
  } else {
    showToast("登录后才可以分享哦~");
  }
};
const handleSingle = (j, index) => {
  // if (j.jmp_register === 1) {
  //   showToast({
  //     message: 'Register and log in to watch this episode',
  //     forbidClick: true,
  //     onClose: () => {
  //       router.push({
  //         name: 'register',
  //         query: {
  //           id: props.playsData.id || '',
  //           current_episode_num: current_episode_num.value || 1,
  //           from: 'video',
  //         }
  //       })
  //     }
  //   });
  //   return;
  // }
  // if (j.is_locked === 1) {
  //   if (String(userInfos?.message_type) === '1') {
  //     showDialog.value = true;
  //     return;
  //   } else if (String(userInfos?.message_type) === '2') {
  //     showDialogs.value = true;
  //     return;
  //   } else {
  //     showToast('Subscribe to unlock this episode')
  //     setTimeout(() => {
  //       router.push({
  //         name: 'shopping',
  //         query: {
  //           id: props.playsData.id || '',
  //           current_episode_num: current_episode_num.value || 1,
  //           from: 'video',
  //         }
  //       })
  //     }, 1000);
  //     return;
  //   }
  // }
  // TODO: 如果需要做切页弹窗，这里的代码需要注释，放到swiperChange中
  if (j.is_locked === 1 && [5, 6].includes(j.show_type)) {
    handleSubscribe();
  }
  chatShow.value = false;
  // proxy.$refs.videos?.[current_episode_num.value - 1]?.destroy();
  proxy.$refs[`videos${current_episode_num.value - 1}`]?.[0]?.destroy();
  current_episode_num.value = j.episode_num;
  proxy.$refs.swipeRef?.swipeTo(index, { immediate: true });
  // proxy.$refs.videos?.[index]?.initPlayer();
  
  // sessionStorage.setItem('CURRENTNUM', current_episode_num.value);
}

const goBack = () => {
  // router.back();
  router.push({
    name: 'home',
    replace: true
  })
}
const handleFocus = () => {
  showIcon.value = true;
}
const handleBlur = () => {
  showIcon.value = false;
}
const handleTime = time => {
  currentTime.value = time;
}
const handleLoad = () => {
  showImage.value = false;
  // handleAuto();
}
const handlePuase = () => {
  isPause.value = true;
}
const handlePlay = () => {
  isPause.value = false;
}
defineExpose({
  handleAuto,
  initPage,
});
</script>

<style lang="less">
.actionSheet {
  background-color: #222222 !important;
  .van-action-sheet__header {
    color: #95928e;
  }
  .van-tabs__nav {
    background-color: #222222 !important;
  }
  .van-tabs__line {
    background-color: #e83a57;
  }
  .van-tab--active {
    color: #e83a57;
  }
}
.content {
  .xgplayer .bottom-controls .xg-right-grid {
    display: none;
  }
  .xgplayer-error-tips {
    display: none;
  }
  .xgplayer-loading, .xgplayer-enter {
    background-color: rgba(0, 0, 0, .4);
  }
  .xgplayer .xgplayer-start {
    display: none;
  }
  .xgplayer-controls {
    bottom: 20px;
  }
  .xgplayer video {
    height: var(--app-height);
    object-fit: cover;
  }
}
.van-tabs__content {
  max-height: 80vw;
  min-height: 80vw;
}
</style>
<style scoped lang="less">
.dialog-box {
  padding: 10px 20px;
  font-size: 14px;
  color: #646566;
}
.p-content {
  overflow: scroll;
  margin-top: 4.8vw;
  display: grid;
  max-height: 80vw;
  grid-template-columns: repeat(5,18.5%);
  grid-column-gap: 1.6vw;
  grid-row-gap: 2.66667vw;
  overflow-y: scroll;
  touch-action: pan-y;
  padding: 0px 4.8vw 0vw;
  margin-bottom: 3vw;
  p {
    margin: 0;
    position: relative;
    width: 16.8vw;
    height: 13.33333vw;
    line-height: 13.33333vw;
    text-align: center;
    background: #404040;
    border-radius: 1.6vw 1.6vw 1.6vw 1.6vw;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    .lock-box {
      position: absolute;
      right: 0;
      top: 0;
      width: 18px;
      height: 14px;
      font-size: 10px;
      background: #e83a57;
      border-radius: 0 6px;
      opacity: .5;
      .lock {
        width: 13px;
        vertical-align: top;
      }
    }
  }
}
.content {
  background-color: black;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  .start-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;;
    align-items: center;
    background: rgba(0, 0, 0, .4);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    .xg-icon-play {

    }
  }
  .first-img {
    position: absolute;
    z-index: 9999;
    img {
      height: var(--app-height);
      object-fit: cover;
    }
  }
}

.videos {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.videosize {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

// 控制播放
.conPlay {
  position: absolute;
  top: 0;
  left: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.icon-main {
  position: absolute;
  z-index: 99999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
.navBars {
  pointer-events: auto;
  padding: 0 4.8vw;
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  height: 13.33333vw;
  width: 100%;
  background-image: -webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.32)),to(transparent));
  background-image: linear-gradient(180deg,rgba(0,0,0,.32),transparent);
  font-size: 4.26667vw;
  color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  .nav-back {
    font-size: 24px;
  }
  .nav-title {
    margin-right: 16px;
    width: 200px;
    white-space: nowrap; /* 保持文本在一行内 */
    overflow: hidden; /* 隐藏溢出的文本 */
    text-overflow: ellipsis; /* 在溢出的文本处显示省略号 */
  }
}
.popup {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  pointer-events: auto;
  .error-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    .popup-image {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 159px;
      height: 212px;
      border: 1px solid;
      // border-image: linear-gradient(150.57deg, #D0B277 0, rgba(255, 255, 255, 0.2) 49.57%, #E6C18B 99.14%, rgba(255, 255, 255, 0.2)) 1 10;
      border-radius: 16px;
      overflow: hidden;
      .image {
        position: relative;
        z-index: 2;
        width: 155px;
        height: 208px;
        border-radius: 16px;
        overflow: hidden;
      }
      &::before {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(150.57deg, #D0B277 0, rgba(255, 255, 255, 0.2) 49.57%, #E6C18B 99.14%);
      }
    }
    .title {
      margin-top: 8px;
      text-align: center;
      color: #fff;
      width: 280px;
      font-size: 16px;
      line-height: 22.4px;
      font-weight: 500;
      white-space: nowrap; /* 保持文本在一行内 */
      overflow: hidden; /* 隐藏溢出的文本 */
      text-overflow: ellipsis; /* 在溢出的文本处显示省略号 */
    }
    .favorite {
      margin-top: 2px;
      text-align: center;
      color: hsla(0,0%,100%,.5);
      width: 280px;
      font-size: 13px;
      line-height: 18.2px;
      .num {
        font-size: 13px;
      }
    }
    .text {
      margin-top: 12px;
      margin-bottom: 12px;
      text-align: center;
      color: #ffffffcc;
      width: 280px;
      font-size: 13px;
      line-height: 16px;
      .num {
        font-size: 15px;
        color: #F13A61;
      }
    }
    .watch-popup {
      background: linear-gradient(270deg, #FFA756 0%, #FF6C19 100%);
      color: #FFFFFF;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      span {
        font-size: 12px;
      }
    }
    .triangle {
      width: 0;
      height: 0;
      margin-top: -1px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 6px solid rgb(240, 140, 35);
    }
    .btns {
      display: inline-block;
      width: 224px;
      // white-space: nowrap;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      background: linear-gradient(270deg, #F73A67 0%, #E1384E 100%);
      color: #fff;
      border: 1px solid #ff375f;
      border-radius: 8px;
      padding: 13px 20px;
    }
    .minimum {
      padding: 4.5px 24px;
    }
  }
}
// 右侧边栏
.right-info {
  position: absolute;
  z-index: 99;
  right: 10px;
  top: 40%;
  height: 300px;
  display: flex;
  flex-direction: column; //设置排列方向为纵向
  align-items: center;
  justify-content: flex-end;
  pointer-events: auto;
  .icon-item {
    margin-top: 30px;
  }

  img {
    border: 3px solid #fff;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
  }

  .addCol {
    position: absolute;
    top: 15%;
    left: 35%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    background-color: #f9476f;
    text-align: center;

    :deep(.van-icon-plus) {
      vertical-align: 15%;
    }
  }

  p {
    font-size: 12px;
    color: #fff;
    margin: 0;
    text-align: center;
  }
}

// 评论窗口内样式
.chatContent {
  padding: 10px 15px 20px;
  // margin-bottom: 40px;
  display: flex;
  justify-content: space-between;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    padding-left: 10px;
    font-size: 12px;

    span {
      margin-left: 5px;
      display: inline-block;
      width: 33px;
      height: 19px;
      line-height: 19px;
      border-radius: 5px;
      color: #fff;
      transform: scale(0.9);
      text-align: center;
      background-color: #f9476f;
    }

    p {
      width: 230px;
      font-size: 14px;
      word-wrap: break-word; //强制换行
    }
  }
}

.chatSplit {
  margin-bottom: 50px;
}

// 发布评论
.chatValue {
  text-align: center;
  background-color: #ffffff;
  padding: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  div {
    height: 50px;
    background-color: #f2f2f2;
    border-radius: 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    input {
      width: 240px;
      height: 30px;
      border: 0;
      background-color: #f2f2f2;
      font-size: 16px;
    }

    // placeholder颜色
    input::-webkit-input-placeholder {
      color: #aab2bd;
      font-size: 16px;
    }

    div {
      background-color: #f9476f;
      width: 60px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      font-size: 16px;
      color: #fff;
      text-align: center;
    }
  }
}

// 视频介绍
.video-text {
  position: absolute;
  left: 10px;
  bottom: 12%;
  color: #fff;
  font-size: 16px;

  .title {
    display: flex;
    align-items: baseline; //第一行文字基线对齐

    h4 {
      margin: 0 10px 10px 0;
    }

    i {
      color: gray;
    }
  }

  p {
    margin: 0;
    width: 250px;
    overflow: hidden;
    font-size: 14px;
    font-family: cursive; //草书字体
    word-wrap: break-word; //强制换行
  }
}

// 静音
.muted {
  position: absolute;
  bottom: 12%;
  right: 15px;
  width: 50px;
  height: 50px;
  line-height: 56px;
  border-radius: 50%;
  background-color: #fff;
  text-align: center;

  :deep(.van-icon-volume) {
    vertical-align: 4%;
  }

  // 静音图标空白符
  .moutedslash {
    position: absolute;
    left: -8px;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    line-height: 100px;
    width: 2px;
    height: 30px;
    transform: rotate(140deg);
    background-color: #fff;
  }

  // 静音图标斜线
  .moutedslashs {
    position: absolute;
    left: -4px;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    line-height: 100px;
    width: 2px;
    height: 33px;
    transform: rotate(140deg);
    background-color: #000000;
  }
}

// 模板
.temp {
  position: absolute;
  bottom: 12%;
  right: 15px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    animation: rotateImg 8s linear 0s infinite forwards;
    animation-play-state: paused;
  }
}

.workBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  input {
    // 透明背景
    background-color: rgba(0, 0, 0, 0, 1);
    border: 0;
    margin-right: 5px;
    color: #fff;
    font-size: 16px;
    width: 75%;
    padding: 8px 0;
  }

  input::-webkit-input-placeholder {
    color: #bababa;
    font-size: 14px;
  }

  :deep(.van-icon-guide-o) {
    vertical-align: middle;
  }
}

/* 旋转动画 */
@keyframes rotateImg {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}

/* 开启图片旋转动画 */
.roteActive {
  animation-play-state: running !important;
}
.video-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  .menu-box {
    width: 300px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #FFFFFF;
    color: #000000;
    .share-title {
      position: relative;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        transform: scaleY(.5);
        left: 0;
        border-bottom: 1px solid #f5f5f5;
      };
    }
    .share-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px 16px;
      text-align: center;
      img {
        margin: 20px 0;
        width: 102px;
        height: 136px;
      }
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .desc {
        font-size: 14px;
      }
    }
    .btn-box {
      display: flex;
      // justify-content: space-between;
      justify-content: center;
      padding: 20px 40px;
      background-color: #f5f5f5;
      .btn-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
        }
        div {
          font-size: 14px;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
