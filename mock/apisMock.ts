import { MockMethod } from 'vite-plugin-mock';
import * as fs from 'fs';
import path from 'path';
import getMemberInfo from './api/get-member-info';
import clientLogout from './api/client-logout';
import getUUID from './api/get-uuid';
// const { Random } = require('mockjs');

import mockjs from 'mockjs';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
console.log('wo shi mock');


// const dotenv = require('dotenv');
// const dotenvExpand = require('dotenv-expand');

// const dotenvExpand = require('dotenv-expand');

const myEnv: Record<string, string> = {};
const envFiles = [
  /** mode local file */ `.env.development.local`,
  /** mode file */ `.env.development`,
  /** local file */ `.env.local`,
  /** default file */ `.env`,
];

for (const file of envFiles) {
  // const channel = process.env.channel || 'wx';
  const filePath = path.resolve(process.cwd(), 'build', 'env', file);
  const isExist = fs.existsSync(filePath);
  if (isExist) {
    const parsed = dotenv.parse(fs.readFileSync(filePath));

    dotenvExpand.expand({ ignoreProcessEnv: true, parsed });
    // dotenvExpand({ parsed, ignoreProcessEnv: true } as any);

    // only keys that start with prefix are exposed to client
    for (const [key, value] of Object.entries(parsed)) {
      if (myEnv[key] === undefined) {
        // @ts-ignore
        myEnv[key] = value;
      } else if (key === 'NODE_ENV') {
        // NODE_ENV override in .env file
        // @ts-ignore
        process.env.VITE_USER_NODE_ENV = value;
      }
    }
  }
}

const createApiUrl = (url: string) => url;

export default [
  {
    url: createApiUrl('/user/get-member-info'),
    method: 'get',
    response: () => {
      return getMemberInfo;
    },
  },
  {
    url: createApiUrl('/user/client-logout'),
    method: 'get',
    response: () => {
      return clientLogout;
    },
  },
  {
    url: createApiUrl('/guest/get-uuid'),
    method: 'get',
    response: () => {
      return getUUID;
    },
  },
  ...[
    createApiUrl('/member/member-login'),
    createApiUrl('/member/member-register'),
    createApiUrl('/user/client-logout'),
    createApiUrl('/frontend/privacy'),
    createApiUrl('/frontend/service-terms'),
    createApiUrl('/frontend/banner-list'),
    createApiUrl('/frontend/recommend'),
    createApiUrl('/frontend/recommend-category-videos'),
    createApiUrl('/frontend/tag-list'),
    createApiUrl('/frontend/browse'),
    createApiUrl('/user/video-record'),
    createApiUrl('/user/watch-history-list'),
    createApiUrl('/user/favorite-list'),
    createApiUrl('/frontend/video/episode'),
    createApiUrl('/user/favorite'),
  ].map((url) => ({
    url,
    method: 'post',
    // 只有使用原始响应才能实现异步导入mock
    rawResponse: async (req, res) => {
      let body = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      const parseBody = JSON.parse(body) as any;
      console.log('path.resolve', path.resolve('mock', `api`));
      
      const idx = String(url).lastIndexOf('/');
      const methods = idx !== -1 ? String(url).slice(idx + 1) : '';
      let data = await getResultData(path.resolve('mock', `api`), methods, parseBody.bizContent);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = data?.statusCode || 200
      delete data?.statusCode
      if(String(data?.code) === '0'){
        return res.end(JSON.stringify(data))
      }
      res.end(JSON.stringify({
        code: '0',
        message: 'ok',
        flag: 'S',
        data:data ||{}
      }))
    }
  })),
  // ...[
  //   createApiUrl('/user/get-member-info'),
  // ].map((url) => ({
  //   url,
  //   method: 'get',
  //   // 只有使用原始响应才能实现异步导入mock
  //   rawResponse: async (req, res) => {
      
  //     let body = ''
  //     await new Promise((resolve) => {
  //       req.on('data', (chunk) => {
  //         body += chunk
  //       })
  //       req.on('end', () => resolve(undefined))
  //     })
  //     const parseBody = JSON.parse(body) as any;
  //     console.log('path.resolve', path.resolve('mock', `api`));
      
  //     const idx = String(url).lastIndexOf('/');
  //     const methods = idx !== -1 ? String(url).slice(idx + 1) : '';
  //     let data = await getResultData(path.resolve('mock', `api`), methods, parseBody.bizContent);
  //     res.setHeader('Content-Type', 'application/json');
  //     res.statusCode = data?.statusCode || 200
  //     delete data?.statusCode
  //     if(data?.flag){
  //       return res.end(JSON.stringify(data))
  //     }
  //     res.end(JSON.stringify({
  //       code: '200',
  //       message: 'ok',
  //       flag: 'S',
  //       data:data ||{}
  //     }))
  //   }
  // })),
] as MockMethod[];

function getAllFiles(fp: string): string[] {
  const target = fs.statSync(fp);
  if (target.isDirectory()) {
    const children = fs.readdirSync(fp).map((_fp) => getAllFiles(path.resolve(fp, _fp)));
    return ([] as string[]).concat(...children);
  } else {
    return [path.resolve(fp)];
  }
}

function findMethod(baseFolder: string, filename: string) {
  const allFiles = getAllFiles(baseFolder);
  return allFiles.find((file) => file.endsWith(filename));
}

async function getMethod(...paths: string[]) {
  for (const methodPath of paths) {
    const isExist = fs.existsSync(methodPath);
    if (isExist) {
      try {
        const result = await (import(`file:///${methodPath}`) as Promise<{default:Function | Object}>);
        return result.default
      } catch (e) {
        console.log("e",e);
        return;
      }
    }
  }
}

const getResultData = async (baseFolder: string, method: string, bizContent: object | string): Promise<any> => {
  const methodFile = findMethod(baseFolder, `${method}.js`);
  console.log(methodFile, 'file');
  if (!methodFile) {
    return null;
  }

  const handleMethod =await  getMethod(methodFile);

  if (handleMethod) {
    if (typeof handleMethod === 'function') {
      const bizContentObj = typeof bizContent === 'string' ? JSON.parse(bizContent) : bizContent;
      return handleMethod(bizContentObj);
    } else {
      return handleMethod;
    }
  }
};
