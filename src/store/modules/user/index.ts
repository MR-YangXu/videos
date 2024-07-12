import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { getUseInfo, initSite } from '@/apis/common';

export const useUserInfoStore = defineStore('userInfo', () => {
  const id = ref('');
  const uuid = ref('');
  const site_id = ref('');
  const avatar = ref('');
  const last_login_time = ref('');
  const user_name = ref('');
  const userInfo = reactive({
    id: '',
    uuid: '',
    site_id: '',
    avatar: '',
    last_login_time: '',
    user_name: '',
    expire_time: '',
    subscribe_status: '',
    login_type: '',
    show_discount_txt: '',
    show_card_form: '',
    show_mode_once: '',
    show_unlock_history: '',
  })
  const siteInfo = reactive({})

  function setUUID(data?: { uuid: string }) {
    uuid.value = data?.uuid || '';
  }

  function setUserInfo(data: any) {
    id.value = data.id;
    uuid.value = data.uuid;
    site_id.value = data.site_id;
    avatar.value = data.avatar;
    last_login_time.value = data.last_login_time;
    user_name.value = data.user_name;
    Object.assign(userInfo, data);
  }

  function initUserInfo() {
    // setUserInfo({
    //   id: '',
    //   uuid: '',
    //   site_id: '',
    //   avatar: '',
    //   last_login_time: '',
    //   user_name: '',
    //   expire_time: '',
    //   subscribe_status: '',
    //   login_type: '',
    // });
    userInfo.id = '';
    userInfo.uuid = '';
    userInfo.site_id = '';
    userInfo.avatar = '';
    userInfo.last_login_time = '';
    userInfo.user_name = '';
    userInfo.expire_time = '';
    userInfo.subscribe_status = '';
    userInfo.login_type = '';
    userInfo.show_discount_txt = '';
    userInfo.show_card_form = '';
    userInfo.show_mode_once = '';
    userInfo.show_unlock_history = '';
  }

  async function getUser() {
    const rst = await getUseInfo({});
    if (String(rst?.code) !== '0') {
      return Promise.reject(rst);
    }
    return rst;
  }

  async function getUserInfos() {
    // if (userInfo.site_id && userInfo.uuid) {
    //   return userInfo;
    // }
    const userInfos: any = await getUser();
    console.log(userInfos);

    if (!userInfos) {
      return;
    }

    if (String(userInfos?.code) === '0') {
      // TODO
      setUserInfo(userInfos?.data || {});
      return userInfos.data;
    }
    return Promise.reject();
  }

  function setSiteInfo(data: any) {
    Object.assign(siteInfo, data);
  }

  async function getSite() {
    const rst = await initSite({});
    if (String(rst?.code) !== '0') {
      return Promise.reject(rst);
    }
    return rst;
  }

  async function getSiteInfo() {
    // if (userInfo.site_id && userInfo.uuid) {
    //   return userInfo;
    // }
    const siteInfo: any = await getSite();
    console.log(siteInfo);

    if (!siteInfo) {
      return;
    }

    if (String(siteInfo?.code) === '0') {
      // TODO
      setSiteInfo(siteInfo?.data || {});
      return siteInfo.data;
    }
    return Promise.reject();
  }

  return { id, uuid, userInfo, siteInfo, getUser, getUserInfos, setUserInfo, initUserInfo, setUUID, getSiteInfo, setSiteInfo };
});
