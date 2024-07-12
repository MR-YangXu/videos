import router from './index'
// globalMiddleware.ts
import { useUserInfoStore } from '@/store/modules/user'
import { queryUUID } from '@/apis/common'
import { handleLoadingNew } from '@/utils/handleResponse'
import report from '@/utils/report'
import { getUrlParams, getSource, isStandalone, setManifest } from '@/utils/util'
import { encryptAES, decryptAES } from '@/utils/AES';
import { fbLoad, fbInit, fbTrack } from '@/utils/facebook.js';

function handleReport(_to) {
  if (!['videos'].includes(_to.name)) {
    report({
      eventId: '1',
      customAttributes: {
        p: _to.name
      },
    })
  }
}

function handleFB() {
  console.warn('===============FB注入')
  const UserStore = useUserInfoStore()
  const { country, client_ip_address, client_user_agent, pixel_id } = UserStore?.siteInfo || {} as any
  fbInit({
    country,
    client_ip_address,
    client_user_agent,
    pixel_id,
  })
  fbTrack({
    eventName: 'PageView'
  })
}
async function loginFree() {
  const token = await sessionStorage.getItem('XTOKEN') || '';
  if (!token) {
    const { xtoken } = getUrlParams(location.href);
    await sessionStorage.setItem('XTOKEN', xtoken || '')
  }
  // TODO: 待确定后端做了支付uuid的判断，是否需要去掉存储XTOKEN的逻辑
  // 判断是否是桌面端过来或者是安卓支付成功的
  if(isStandalone() || localStorage.getItem('ANDROID_PAY_SUCCESS') === 'Y') {
    await sessionStorage.setItem('XTOKEN', 'HiEoAeIwFq6vW6Dk2ZgHFPv12k-OVpMdWobb9EPDGUGJHa0t1V33bKr9oYrxWUY9')
  }
}
function getAdvertisOurce () {
  const source = sessionStorage.getItem("ADVERTIS_OURCE") || '';
  if (!source) {
    sessionStorage.setItem("ADVERTIS_OURCE", getSource() || '')
  }
}
async function initSiteInfo(to, next) {
  try {
    const UserStore = useUserInfoStore()
    // 如果刷新页面没有
    if (!UserStore.uuid) {
      // 判断是不是从facebook复制链接过来的，是的话，把uuid存起来，放在请求头里面
      let uuid = decryptAES((to.query.u || '') as string)
      // 如果从pwa进入的，需要解密base64
      if (to.query.uc === 'pwa') {
        uuid = to.query.u;
      }
      console.warn(uuid, '===uuid', to.query.u)
      // // 判断可能从ios的桌面pwa进入的
      // const query = getUrlParams(location.href);
      // const u = decryptAES((query?.u || '') as string);
      // console.warn(u, '======u')
      if (to.query.u && uuid) {
        await localStorage.setItem('UUID', uuid);
        await localStorage.setItem('ANDROID_PAY_SUCCESS', 'Y');
        await loginFree();
        await UserStore.getUserInfos() || {};
        await UserStore.getSiteInfo() || {}
        const { pixel_id, site_name } = UserStore?.siteInfo || {} as any
        fbLoad({ pixel_id })
        // 设置网站标题
        document.title = site_name || 'realshotr';
        setManifest(site_name);
        return;
      }
      await UserStore.getUserInfos() || {}
      localStorage.setItem('UUID', UserStore.uuid)
      await UserStore.getSiteInfo() || {}
      const { pixel_id, site_name } = UserStore?.siteInfo || {} as any
      fbLoad({ pixel_id })
      // 设置网站标题
      document.title = site_name || 'realshotr';
      setManifest(site_name);
    }
  }
  catch (err: any) {
    if (err.toString().indexOf('Network Error') >= 0 || err.toString().indexOf('404') >= 0) {
      next('/404')
    }
  }
}

// 判断是否支付成功，成功在链接后面增加uuid参数，否则next()
function nextUUID(to, next) {
  // 判断是否支付成功，成功在链接后面增加uuid参数
  if (localStorage.getItem('ANDROID_PAY_SUCCESS') === 'Y') {
    const u = encryptAES(localStorage.getItem('UUID') || '');
    next({
      name: to.name,
      query: { ...to.query, u },
      params: to.params,
    })
  } else {
    next()
  }
}

router.beforeEach(async (to, from, next) => {
  // 判断是否是404页面，直接next
  if (to.name === '404') {
    next()
    return
  }
  // 获取广告来源
  getAdvertisOurce()
  // 在这里编写你的中间件逻辑
  console.warn(to, from, '全局中间件')
  // 获取免登录token
  await loginFree();
  const UserStore = useUserInfoStore()
  await initSiteInfo(to, next);
  // 链接内是否存在uuid，如果是则直接next
  if(to.query.u && localStorage.getItem('ANDROID_PAY_SUCCESS') === 'Y') {
    next()
    return
  }
  const uuid = localStorage.getItem('UUID') || '';
  // 确定用户是否已登录过，存在Token
  if (uuid) {
    // 如果有uuid，再更新一遍到pinia
    UserStore.setUserInfo({ uuid })
    handleReport(to)
    handleFB()
    nextUUID(to, next);
    return
  }
  const domain = import.meta.env.VITE_DOMAIN || (window.location.hostname ? window.location.hostname.replace(/www./g, '') : '');
  const { data } = await handleLoadingNew(
    queryUUID({ isClient: false, domain }),
  ).catch(() => {
    const isReload = sessionStorage.getItem('RELOAD') || '';
    if (!isReload) {
      sessionStorage.setItem('RELOAD', 'Y')
      window.location.reload()
    }
  })
  console.warn(data, 'Userid');
  await localStorage.setItem('UUID', data?.user_info?.uuid || '')
  await initSiteInfo(to, next);
  UserStore.setUserInfo(data?.user_info || {})
  UserStore.setUUID({ uuid: data?.user_info?.uuid || '' })
  handleReport(to)
  handleFB()
  nextUUID(to, next);
})
