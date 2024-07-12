import {  showDialog } from 'vant';
// import { closePage } from '@/utils/nativeTools';

function errorHandle(err: any) {
  return showDialog({
    className: 'text-medium msg-dialog msg-dialog-prompt',
    message: err.msg,
    confirmButtonText: '确定',
  })
  .then(() => {
    // closePage();
  });
}

const handleErrorCodeMap = {
  B_KELP_0099: (err: any) => {
    err.isHandle = true;
    return errorHandle(err);
  },

  BKCGS9999: (err: any) => {
    err.isHandle = true;
    return errorHandle(err);
  },
  B_KCMS_6666: (err: any) => {
    err.isHandle = true;
    return errorHandle(err);
  },
};

const handleError = (err: any) => {
  // @ts-ignore
  handleErrorCodeMap[err?.code]?.(err);
  return err;
};

export default handleError;
