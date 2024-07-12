import WxUploader from './wx-uploader';
// import NativeUploader from './native-uploader';
// import webUploader from './web-uploader';
// import store from '@/store';

// const uploader = __HOST_ENV__  === 'APP'
//   ? NativeUploader
//   : store.getters.getHostEnv === 'WX' ? WxUploader : webUploader;
export default WxUploader;
