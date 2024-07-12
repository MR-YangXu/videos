import web from './web';

type HandleRequest = <T>(requestPromise: Promise<T>, isShowLoading?: boolean, isShowErrorMsg?: boolean) => Promise<T>;

// const handleRequest =  web;

export default web as HandleRequest;
