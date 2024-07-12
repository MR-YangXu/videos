import type { App, Plugin } from 'vue';
import { encryptAES } from '@/utils/AES';

export const isNull = (val: any) => val === null || val === '' || val === undefined;

export const isNotNull = (val: any) => !isNull(val);

const ua = navigator.userAgent;
export const IS_ANDROID = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
export const IS_IOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const isByteDance = /\b(BytedanceWebview|NewsArticle)\b/gi.test(navigator.userAgent);

/**
 * 获取浏览器的名称
 * @returns string
 */
export const getBrowserName = () => {
  let browerName: any;
  if (isByteDance) {
    browerName = navigator.userAgent.match(/BytedanceWebview|NewsArticle/);
    browerName = browerName[0] === 'NewsArticle' ? 'News' : 'Bytedance';
  } else if (/\b(MicroMessenger)\b/gi.test(navigator.userAgent)) {
    browerName = navigator.userAgent.match(/MicroMessenger\/\d+.\d+.\d+/);
    browerName = browerName[0];
  } else {
    browerName = navigator.userAgent.match(/(\W+|\w+)Browser/);
    browerName = isNull(browerName) ? '' : browerName[0];
  }
  return browerName;
};

export const isAndroidOrIOS = () => {
  if (IS_ANDROID) {
    return 'android';
  }
  if (IS_IOS) {
    return 'ios';
  }
  return false;
};

export const isIOS = /\b(iPad|iPhone)\b/gi.test(navigator.userAgent);

/**
 * 判断当前机型系统版本
 * @returns
 */
export const isCheckVersionInfo = () => {
  let checkVersion: any;
  if (isAndroidOrIOS() === 'android') {
    checkVersion = navigator.userAgent.match(/Android \d+/);
    return Number(checkVersion[0].split(' ')[1] || '0') > 7;
  }
  if (isAndroidOrIOS() === 'ios') {
    checkVersion = navigator.userAgent.match(/\d+_\d+/);
    return Number(checkVersion[0].replace('_', '.')) > 14.3;
  }
  return false;
};

export const getImageCyle = (url: any) => {
  const Img = new Image();
  Img.crossOrigin = 'anonymous';
  Img.src = url;
  return { width: Img.width, height: Img.height };
};

export const getBase64 = (url: any, callback: FuncType) => {
  const Img = new Image();
  Img.crossOrigin = 'anonymous';
  Img.src = url;
  Img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = Img.width;
    canvas.height = Img.height;
    const ctx: any = canvas.getContext('2d');
    ctx.drawImage(Img, 0, 0);
    const IconURL = canvas.toDataURL('image/png');
    callback ? callback(IconURL) : null;
  };
};

const getBase64Size = (base64: string) => {
  // 获取base64字符串的大小
  if (base64) {
    // 获取base64图片byte大小
    base64 = base64.split(',')[1].split('=')[0];
    const strLength = base64.length;
    const fileLength = strLength - (strLength / 8) * 2;
    return Math.floor(fileLength); // 向下取整
  }
  return 0;
};

export const getCompressBase64 = (url: any, callback: FuncType) => {
  const Img = new Image();
  Img.crossOrigin = 'anonymous';
  Img.src = url;
  Img.onload = function () {
    const { width } = Img;
    const targetWidth = Math.min(width, 800);
    const targetHeight = (targetWidth / width) * width;
    const size = getBase64Size(url);
    if (size < 1024 * 1024) {
      callback(url);
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx: any = canvas.getContext('2d');
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(Img, 0, 0);
    const IconURL = canvas.toDataURL('image/png');
    const size2 = getBase64Size(IconURL);
    console.log(size2);
    callback ? callback(IconURL) : null;
  };
};

export const isWeiXin = () => {
  const ua = navigator.userAgent.toLowerCase();
  // eslint-disable-next-line eqeqeq
  const isWXWork = /wxwork/i.test(ua);
  // eslint-disable-next-line eqeqeq
  const isPC = /macwechat/i.test(ua) || /windowswechat/i.test(ua);
  // eslint-disable-next-line eqeqeq
  return !isPC && !isWXWork && /micromessenger/i.test(ua);
};

export function openUrl(url: string, replace?: boolean) {
  const open = () => {
    if (replace) {
      window.location.replace(url);
      return;
    }
    window.location.href = url;
  };
  setTimeout(() => {
    open();
  }, 0);
}

// 0812版本 中文数字对照展示
export function chineseNumChange(num: any) {
  const chinsesNum = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '佰', '仟'];
  let chineseValue = '';
  switch (num.length) {
    case 1:
      chineseValue = num !== '0' ? chinsesNum[Math.floor(num)] : '';
      break;
    case 2:
      chineseValue =
        chinsesNum[Math.floor(num / 10)] + chinsesNum[10] + (Math.floor(num % 10) !== 0 ? chinsesNum[Math.floor(num % 10)] : '');
      break;
    case 3:
      chineseValue =
        chinsesNum[Math.floor(num / 100)] +
        chinsesNum[11] +
        (Math.floor((num % 100) / 10) !== 0
          ? chinsesNum[Math.floor((num % 100) / 10)] + chinsesNum[10]
          : Math.floor(num % 10) !== 0
          ? chinsesNum[0]
          : '') +
        (Math.floor(num % 10) !== 0 ? chinsesNum[Math.floor(num % 10)] : '');
      break;
    default:
      chineseValue = '';
      break;
  }
  return chineseValue;
}

// 后端数据解析高亮内容
export function splitHightFont(str: string | null | undefined) {
  if (isNull(str)) return '';
  const reg = /(.*)\[(.*)\](.*)/;
  let result = '';
  while (reg.exec(str!)) {
    str = RegExp.$1;
    result = `<span style="color:#2F66FF;">${RegExp.$2}</span>${RegExp.$3}` + result;
  }
  return str + result;
}

export function mergeUrl(...args: string[]) {
  let url = '';
  let cacheMatch = '';

  args.forEach((arg) => {
    if (typeof arg !== 'string') {
      console.error('arg should be string, but get ', typeof arg);
      return;
    }

    let i = url.length - 1;
    let match = '';
    while (i >= 0) {
      match = url.substr(i--);
      if (arg.indexOf(match) === -1) break;
      cacheMatch = match;
    }

    url += arg.replace(new RegExp('^' + cacheMatch), '');
  });

  return url;
}

export const HOST_URL = mergeUrl(window.location.origin, (import.meta.env.VITE_BASE_URL as string) ?? '');

/**
 * 获取URL地址参数
 * @param name
 * @returns
 */
export function getUrlParam(name: string, url?: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
  let search: string[];
  if (url) {
    search = url.split('?');
  } else {
    search = window.location.href.split('?');
  }

  if (search.length === 3) {
    search[1] = search[2] + '&' + search[1];
  }

  const r = search.length >= 2 ? search[1].replace('#/', '&').match(reg) : null;
  if (r != null) return decodeURIComponent(r[2]);
  return null; // 返回参数值
}

/**
 *
 * @param data
 * @param isPrefix
 * @returns
 */
export function toChangeURLParams(data: any, isPrefix = false) {
  isPrefix = isPrefix || false;
  const prefix = isPrefix ? '?' : '';
  const _result: any = [];
  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    const value = data[key];
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }

  return _result.length ? prefix + _result.join('&') : '';
}

export const withInstall = <T>(component: any, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 ** base64转为文件流
 * @param base64Str : base64图片格式字符串
 * @param fileName : 文件名称
 * @returns
 */

export const base64toFile = function (base64Str: string, fileName: string) {
  const dataArr = base64Str.split(',');
  const byteString = atob(dataArr[1]);
  const options: FilePropertyBag = {
    type: 'image/jpg',
    endings: 'native',
  };
  const u8Arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i);
  }
  return new File([u8Arr], fileName + '.jpg', options); // 返回文件流
};

/**
 * 获取数据来源
 * 
 */
export const getSource = () => {
  if (isStandalone()) {
    return 'pwa';
  }
  const s = {
      'facebook': 0,
      'google': 0,
      'bing': 0,
      'yandex': 0,
      'snapchat': 0,
      'instagram': 0,
      'pinterest': 0,
      'email': 0,
      'outbrain': 0,
      'taboola': 0,
      'tiktok': 0,
      'yahoo': 0,
      'spider': 0,
      // 'kol': 0,
      'baidu': 0,
      'DuckDuckGo': 0,
      'mediago': 0,
      'Twitter': 0,
      'ShareASale': 0,
      'kwai': 0,
      "Thinla":0,
      'direct': 0
     
  }
  var ref = document.referrer //来源url
  var url = window.location.href //当前页面url
  var ua = navigator.userAgent //
  s.direct = ref == '' ? 1 : 0;
  s.outbrain = url.indexOf('dicbo=') > -1 || ref.indexOf('outbrain.') > -1 ? 1 : 0;
  s.facebook = url.indexOf('fbclid=') > -1 || ref.indexOf('facebook.') > -1 || ua.indexOf('FBID/phone') > -1 ? 1 : 0;
  s.google = url.indexOf('gclid=') > -1 || url.indexOf('wbraid=') > -1 || url.indexOf('gbraid=') > -1 || ref.indexOf('google.') > -1 || ref.indexOf('com.google.android.gm') > -1 || ref.indexOf('com.google.android.googlequicksearchbox') > -1 ? 1 : 0;
  s.bing = url.indexOf('msclkid=') > -1 || ref.indexOf('bing.') > -1 || ua.indexOf('BingWeb') > -1 ? 1 : 0;
  s.yandex = url.indexOf('yclid=') > -1 || ref.indexOf('yclid') > -1 || ref.indexOf('yandex') > -1  ? 1 : 0;
  s.snapchat = ua.indexOf('Snapchat') > -1 || url.indexOf('ScCid=') > -1 ? 1 : 0;
  s.instagram = ua.indexOf('Instagram') > -1 || ref.indexOf('instagram.') > -1 ? 1 : 0;
  s.pinterest = ua.indexOf('Pinterest') > -1 || ref.indexOf('pinterest.') > -1 || ref.indexOf('pp=') > -1 || ref.indexOf('epik') > -1 || url.indexOf('?cid=') > -1 || url.indexOf('&cid=') > -1 || url.indexOf('pp=') > -1 || url.indexOf('epik') > -1 ? 1 : 0;
  s.yahoo = url.indexOf('vmcid=') > -1 ||ref.indexOf('yahoo.') > -1 || ua.indexOf('yahoo.') > -1 ? 1 : 0;
  s.baidu = ref.indexOf('baidu.') > -1 ? 1 : 0;
  s.DuckDuckGo = ref.indexOf('duckduckgo.') > -1 ? 1 : 0;
  s.email = url.indexOf('source=email') > -1 || url.indexOf('validate-email?code=') > -1 || url.indexOf('com.google.android.gm') > -1 ? 1 : 0;
  s.taboola = url.indexOf('tblci=') > -1 || ref.indexOf('taboola.') > -1 || ua.indexOf('utm_source=taboola') > -1 ? 1 : 0;
  s.tiktok = ref.indexOf('tiktok.') > -1 || url.indexOf('ttclid=') > -1 || ua.indexOf('musical_ly') > -1 || ua.indexOf('ByteLocale') > -1 || ua.indexOf('ByteFullLocale') > -1 || ref.indexOf('adsintegrity.') > -1 ? 1 : 0;
  s.spider = ua.indexOf('Baiduspider') > -1 || ua.indexOf('360Spider') > -1 || ua.indexOf('Yisouspider') > -1 ||
      ua.indexOf('Sogouspider') > -1 || ua.indexOf('Yeti') > -1 || ua.indexOf('Yandex') > -1 || ua.indexOf('Bot') > -1 ||
      ua.indexOf('Crawler') > -1 || ua.indexOf('BingPreview') > -1 || ua.indexOf('bot') > -1 ? 1 : 0;
  s.mediago = ref.indexOf('mediago.') > -1 || ref.indexOf('acid.') > -1 || url.indexOf('tracking_id=') > -1 ? 1 : 0;
  s.Twitter = url.indexOf('twclid=') > -1 || ref.indexOf('twclid') > -1 || ref.indexOf('twitter.') > -1 ? 1 : 0;
  s.ShareASale = url.indexOf('sscid=') > -1 || url.indexOf('xrdrm=') > -1 || ref.indexOf('sscid') > -1 || ref.indexOf('xrdrm') > -1 || ref.indexOf('shareasale.') > -1 ? 1 : 0;
  s.kwai = url.indexOf('click_id=') > -1 || url.indexOf('pixel_id=') > -1 || ref.indexOf('click_id') > -1 || ref.indexOf('pixel_id') > -1 || ref.indexOf('kwai.') > -1 ? 1 : 0;
  s.Thinla = url.indexOf('tlref=') > -1 ||url.indexOf('thinla.') > -1;
  // s.kol = url.includes('utm_source') || url.includes('utm_medium') || url.includes('utm_campaign') || url.includes('utm_content') ||
  //     url.includes('utm_term') ? 1 : 0
  for (var k in s) {
      if (s[k] == 1) {
          return k;
      }
  }
  // if (direct) {
  //     return 'direct';
  // }

  return 'other';

};
/**
 *  获取URL参数
 * @param length 
 * @returns 
 */
export function query () {
  var theRequest = new Object() as any;
  if (window.location.search) {
      var str = window.location.search.substr(1);
      var strs = str.split("&");
      strs.forEach(function (v, i) {
          theRequest[v.split('=')[0]] = v.split('=')[1]
      });
  }
  return theRequest;
}

export const generateRandomNumber = (length) => {
  let randomNumber = '';
  for (let i = 0; i< length; i++) {
      randomNumber += Math.floor(Math.random() * 10);
  }
  return parseInt(randomNumber, 10);
}

export function escapeHtml(str: string) {
  let temp = '';
  if (str.length === 0) return '';
  temp = str.replace(/&amp;/g, '&');
  temp = temp.replace(/&lt;/g, '<');
  temp = temp.replace(/&gt;/g, '>');
  temp = temp.replace(/&nbsp;/g, ' ');
  temp = temp.replace(/&#39;/g, "'");
  temp = temp.replace(/&quot;/g, '"');
  return temp;
}

export function isArray(str: unknown) {
  return Object.prototype.toString.call(str) === '[object Array]';
}

export function setTimeExpires() {
  // 获取一年后的时间戳
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  return expirationDate.toUTCString()
}

export function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export function getUrlParams(url) {
  // 创建一个新的URL对象
  const urlObj = new URL(url);

  // 使用URLSearchParams接口获取查询参数
  const params = new URLSearchParams(urlObj.search);

  // 返回包含所有参数的对象
  return Object.fromEntries(params.entries());
}

// 设置cookies
export function setCookie(c_name, value, expiretimes) {
  var exdate = new Date();
  exdate.setTime(exdate.getTime() + (expiretimes * 24 * 60 * 60 * 1000));
  document.cookie = c_name + "=" + value + ";path=/" + ((expiretimes == null) ? "" : ";expires=" + exdate.toString());
}
//读取cookies  
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
      return (arr[2]);
  else
      return null;
}
export function isStandalone() {
  return navigator?.standalone || (window?.matchMedia('(display-mode: standalone)')?.matches);
}
export function setManifest(site_name) {
  const origin = window.location.origin;
  // base64加密，防止空格无法解密
  const u = localStorage.getItem('UUID') || '';
  const myDynamicManifest = {
    name: site_name || 'realshotr',
    short_name: site_name || 'realshotr',
    description: site_name || 'realshotr',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    scope: origin + '/',
    start_url: origin + '/?uc=pwa&u='+u,
    icons: [
        {
          src: origin + '/android-chrome-logo.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: origin + '/android-chrome-logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: origin + '/android-chrome-logo.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: origin + '/android-chrome-logo.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: origin + '/android-chrome-logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
    ],
  }
  // const link = document.createElement("link");
  // link.rel = "manifest";    
  // const stringManifest = JSON.stringify(myDynamicManifest);
  // link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest))
  // document.head.appendChild(link);

  // const arr = Array.from(document.querySelectorAll('link')).filter(val => val.rel === 'manifest');
  // const lastElement = arr[arr.length - 1];
  // lastElement.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(myDynamicManifest)))

  const stringManifest = JSON.stringify(myDynamicManifest);
  const blob = new Blob([stringManifest], { type: 'application/json' });
  const manifestURL = URL.createObjectURL(blob);
  document.querySelector('#manifest')?.setAttribute('href', manifestURL);
}