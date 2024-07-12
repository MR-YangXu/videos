import { showDialog, showLoadingToast } from 'vant';
/** ******************************
 * 功能: 请求的公用处理，给业务代码用的
 * 创建日期: 2020-09-16
 ****************************** */
import { Result } from '@/apis/model/base.model';

import handleError from '../handleError';

/**
 * @param requestPromise 请求的promise
 * @param isShowLoading 请求前是否显示loading
 * @param isShowErrorMsg  请求失败后，是否自动Toast文案
 */
export default async function <T>(requestPromise: Promise<Result<T>>, isShowLoading = true, isShowErrorMsg = true): Promise<Result<T>> {
  const toast = isShowLoading &&
    showLoadingToast({
      duration: 0,
      message: 'loading...',
      forbidClick: true,
      loadingType: 'spinner',
      className: 'loading',
    });

  try {
    const data: Result<T> = await requestPromise;

    if (data?.flag === 'S' ) {
      if(isShowLoading && toast!==false){
        toast?.close()
      }
      return data;
    }

    throw data;
  } catch (e) {
    console.error(e);
    if(isShowLoading && toast!==false){
      toast?.close()
    }
    const err = handleError(e);
    !err.isHandle &&
      isShowErrorMsg &&
      showDialog({
        className: 'text-medium msg-dialog msg-dialog-prompt',
        message: err.msg,
        confirmButtonText: '确定',
      });
    throw err;
  }
}
