/* eslint-disable @typescript-eslint/indent */
import httpClient from '@/sdk/request';
import type { Result } from './model/base.model';
import { handleLoading } from '@/utils/handleResponse';
import type {
  useInfoOutEntity,
  memberLoginRq,
  memberRegisterRq,
  homeRecommendRq,
  recommendCategoryVideosRq,
  browsesRq,
  videoRecordsRq,
  watchHistoryListRq,
  favoriteListRq,
  videoEpisodeRq,
  userFavoriteRq,
  createSubscribeRq,
  unlockListRq,
  getVerificationCodeRq,
  resetPasswordRq,
  fbUserLoginRq,
} from './model/common.model';

/**
 * OCR识别
 * @param data
 * @description
 * @returns
 */
export const queryUUID = (params: {}) =>
  handleLoading(
    httpClient.post<Result<any>>({
      path: '/guest/get-uuid',
      params,
    }),
  );

/**
 * OCR识别
 * @param data
 * @description
 * @returns
 */
export const memberLogin = (data: memberLoginRq) =>
  handleLoading(
    httpClient.post<Result<any>>({
      path: '/member/member-login',
      params: data
    }),
  );

/**
 * OCR识别
 * @param data
 * @description
 * @returns
 */
export const memberRegister = (data: memberRegisterRq) =>
  handleLoading(
    httpClient.post<Result<any>>({
      path: '/member/member-register',
      params: data
    }),
  );

/**
 * OCR识别
 * @param data
 * @description
 * @returns
 */
export const clientLogout = (data: memberRegisterRq) =>
  handleLoading(
    httpClient.get<Result<any>>({
      path: '/user/client-logout',
      params: data
    }),
  );

/**
 * 用户登录授权接口
 * @param openId
 * @param mid
 * @param source
 * @param
 * @returns
 */
export const getUseInfo = (data: any) =>
  handleLoading(
    httpClient.get<Result<useInfoOutEntity>>({
      path: '/user/get-member-info',
      params: data,
    }),
  );

/**
 * 隐私声明接口
 * @param
 * @returns
 */
export const privacys = (data: any) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/privacy',
      params: data,
    }),
  );

/**
 * 服务条款接口
 * @param
 * @returns
 */
export const serviceTerms = (data: any) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/service-terms',
      params: data,
    }),
  );

/**
 * Banner接口
 * @param
 * @returns
 */
export const bannerList = (data: {}) =>
  handleLoading(
    httpClient.post<Result<any>>({
      path: '/frontend/banner-list',
      params: data
    }),
  );
  
/**
 * 首页推荐接口
 * @param
 * @returns
 */
export const homeRecommend = (data: homeRecommendRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/recommend',
      params: data
    }),
  );

/**
 * 某个推荐分类列表接口
 * @param
 * @returns
 */
export const recommendCategoryVideos = (data: recommendCategoryVideosRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/recommend-category-videos',
      params: data,
    }),
  );

/**
 * 获取标签列表接口
 * @param
 * @returns
 */
export const tagLists = (data: {}) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/tag-list',
      params: data
    }),
  );

/**
 * Browses接口
 * @param
 * @returns
 */
export const browses = (data: browsesRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/browse',
      params: data,
    }),
  );

/**
 * 视频观看记录接口
 * @param
 * @returns
 */
export const videoRecords = (data: videoRecordsRq) =>
  httpClient.post<Result<useInfoOutEntity>>({
    path: '/user/video-record',
    params: data,
  });

/**
 * 历史观看列表接口
 * @param
 * @returns
 */
export const watchHistoryList = (data: watchHistoryListRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/user/watch-history-list',
      params: data,
    }),
  );

/**
 * 收藏列表接口
 * @param
 * @returns
 */
export const favoriteList = (data: favoriteListRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/user/favorite-list',
      params: data,
    }),
  );

/**
 * 视频播放接口
 * @param
 * @returns
 */
export const videoEpisode = (data: videoEpisodeRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/frontend/video/episode',
      params: data,
    }),
  );

/**
 * 收藏接口
 * @param
 * @returns
 */
export const userFavorite = (data: userFavoriteRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/user/favorite',
      params: data,
    }),
  );

/**
 * 订阅
 * @param
 * @returns
 */
export const createSubscribe = (data: createSubscribeRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/subscribe/create',
      params: data,
    }),
  );

/**
 * 取消订阅
 * @param
 * @returns
 */
export const cancelSubscribe = () =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/subscribe/cancel',
    }),
  );

/**
 * 站点初始化
 * @param
 * @returns
 */
export const initSite = (data: {}) =>
  handleLoading(
    httpClient.get<Result<useInfoOutEntity>>({
      path: '/subscribe/site-init',
      params: data
    }),
  );

/**
 * 解锁剧集
 * @param
 * @returns
 */
export const unlockVideo = (data: { video_id?: String | Number }) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/video/unlock',
      params: data
    }),
  );

/**
 * 已解锁列表
 * @param
 * @returns
 */
export const unlockList = (data: unlockListRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/user/unlock-list',
      params: data
    }),
  );

/**
 * 已解锁列表
 * @param
 * @returns
 */
export const getLanding = (data: { token?: String }) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/landingpage/get',
      params: data
    }),
  );

/**
 * 发送短信验证码
 * @param
 * @returns
 */
export const getVerificationCode = (data: getVerificationCodeRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/member/get-verification-code',
      params: data
    }),
  );

/**
 * 重置密码
 * @param
 * @returns
 */
export const resetPassword = (data: resetPasswordRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/member/reset-password',
      params: data
    }),
  );

/**
 * 重置密码
 * @param
 * @returns
 */
export const fbUserLogin = (data: fbUserLoginRq) =>
  handleLoading(
    httpClient.post<Result<useInfoOutEntity>>({
      path: '/member/fb-user-login',
      params: data
    }),
  );

