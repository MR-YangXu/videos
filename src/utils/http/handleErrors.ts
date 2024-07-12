import { useUserInfoStore } from '@/store/index';
import { Result } from '@/apis/model/base.model';

let promise: Promise<any> | undefined;

export function handleErrors<T>(result: Result<T>) {
  switch (result.code) {
    case 'B_KCMS_6666':
    case 'BKCGS9999':
      // handleError BKCGS9999
      if (!promise) {
        const userInfo = useUserInfoStore();
        promise = userInfo.getUser().then(() => {
          setTimeout(() => {
            promise = undefined;
          }, 100);

          return {};
        });
      }
      return promise;
    default:
      return Promise.resolve();
  }
}
