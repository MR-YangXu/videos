// import getH5TraceId from '@/utils/getH5TraceId';
// import pkg from '../../../package.json';

import { useUserInfoStore } from '@/store/index';

export function ComParams(key: string) {
  const userInfo = useUserInfoStore();
  const Common = {
    // method: '',
    // bizContent: {},
    // productNo: userInfo.productNo,

    // pageName: userInfo.pageName,
    // channelCode: userInfo.channelCode || '',
    // h5TraceId: getH5TraceId(),
    // timestamp: new Date().getTime(),
    // h5Version: `${pkg.version}`,
    // extendField: { actCode: '' },
    // userNo: userInfo.userNo || '',
  };

  const ChannelParams: any = {
    WX: {
      // deviceInfo: '',
      // channelType: 'H5',
      // hostApp: 'WECHAT',
      // channelNo: 'WECHAT_H5',
      // token: userInfo.token || '',
      // userNo: userInfo.userNo || '',
    },
  };

  return Object.assign({}, ChannelParams[key], Common);
}
