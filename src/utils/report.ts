import { useUserInfoStore } from '@/store';

import httpClient from '@/sdk/request';
// import queryString from 'query-string';

import { eventDetail } from '@/directive/track.event.detail';
// import { processStackMsg } from './log';
import { getSource, generateRandomNumber, setCookie, getCookie, getUrlParams } from './util';

export interface IArgs {
  // 业务定义的事件编号
  eventId: string

  // 事件名称
  eventName?: string

  // 事件操作
  eventOperate?: string

  // 事件成功标识节点
  eventFlag?: string

  // 事件中需要收集的业务参数
  customAttributes?: any
}

const browserName = getSource()
async function report({ eventId, customAttributes = {} }: IArgs) {
  const path = '/sl.png'
  const userInfo = useUserInfoStore() || ({} as any)
  let utm_json = JSON.parse(getCookie('ga_utm')) || {};
  const query = getUrlParams(window.location.href) || {};
  const channelCommon = {
    // 页面url
    ul: window?.location?.href,
    // host
    ht: window?.location?.host,
    // 是否落地页 TODO:
    lp: "" as any, 
    // 广告来源
    sr: sessionStorage?.getItem?.("advertis_ource"), 
    // 来源url TODO:
    rl: document.referrer, 
    // 站点id
    si: userInfo.userInfo.site_id ? `${generateRandomNumber(8)}${userInfo.userInfo.site_id}-${generateRandomNumber(8)}` : '',
    // 用户id，系统生成
    u: userInfo.userInfo.uuid,
    // 事件名称
    ev: eventId,
    // 页面名称 TODO:
    p: 'shortvedio', 
    // 客户端时间戳
    ts: new Date().getTime(), 
    // 用户行为数据 TODO:
    cd: JSON.stringify(customAttributes),
    // 落地页来源 TODO:
    latest_ref: sessionStorage?.getItem?.("latest_ref") || "",
    // 落地页 url TODO:
    latest_url: sessionStorage?.getItem?.("latest_url") || "",
    //   可变参数    不同事件对应不同参数
    // 来源
    utmso: "",
    // 系列id
    utmmd: "",
    // 广告组id
    utmcp: "",
    // 广告id
    utmct: "",
    // 账号id
    utmtm: "",
  }

  // 判断是否为落地页
  if (sessionStorage?.getItem?.("landing_page")) {
    channelCommon.lp = false
  } else {
    channelCommon.lp = true
    channelCommon.sr = browserName
    // TODO: 待后端提供落地页来源字段
    channelCommon.latest_ref = document.referrer || ''
    channelCommon.latest_url = window.location.href
    sessionStorage?.setItem?.("advertis_ource", channelCommon.sr)
    sessionStorage?.setItem?.("landing_page", new Date().getTime() as any)
    sessionStorage?.setItem?.("latest_ref", channelCommon.latest_ref)
    sessionStorage?.setItem?.("latest_url", channelCommon.latest_url)
  }

  //进入页面，判断是否有GA相关的utm,若有则取新的utm参数
  if (query.utm_source || query.utm_medium || query.utm_campaign || query.utm_content || query.utm_term) {
    utm_json = query;
  } else {
    utm_json = Object.keys(utm_json).length > 0 ? utm_json : query;
  }
  setCookie('ga_utm', JSON.stringify(utm_json), 7);
  // 获取 utm 参数
  if (utm_json) {
    channelCommon.utmso = utm_json.utm_source || ""
    channelCommon.utmmd = utm_json.utm_medium || ""
    channelCommon.utmcp = utm_json.utm_campaign || ""
    channelCommon.utmct = utm_json.utm_content || ""
    channelCommon.utmtm = utm_json.utm_term || ""
  }

  const params = Object.assign({}, channelCommon, customAttributes)

  // 本地开发环境不发送埋点
  // if (__DEV__) return false;
  await httpClient.logsReport({ path, params })
}

export default report;

export function reportByEventId(eventId: any) {
  if (!eventId) {
    console.warn('eventId is undefined');
    return Promise.resolve();
  }
  const detail = eventDetail[eventId];
  if (!detail) {
    return Promise.reject(new Error('report event detail is undefined!'));
  }
  return report({
    eventId,
    ...detail,
  });
}
