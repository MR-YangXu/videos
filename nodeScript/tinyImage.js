/* eslint-disable camelcase */
/* eslint-disable no-void */
const path = require('path');
const imagemin = require('imagemin');
const imagemin_gifsicle = require('imagemin-gifsicle');
const imagemin_Pngquant = require('imagemin-pngquant');
const imagemin_optipng = require('imagemin-optipng');
const imagemin_mozjpeg = require('imagemin-mozjpeg');
const imagemin_svgo = require('imagemin-svgo');
const imagemin_webp = require('imagemin-webp');
const imagemin_Jpegtran = require('imagemin-jpegtran');
const fs = require('fs');
const chalk = require('chalk');

console.log('提交前压缩');
// console.log('运行脚本', process.argv, process.argv.slice(2));

// 获取插件列表
const isBoolean = (arg) => typeof arg === 'boolean';
const isNotFalse = (arg) => !(isBoolean(arg) && !arg);
function getImageminPlugins(
  options = {
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  },
) {
  const { gifsicle = true, webp = false, mozjpeg = false, pngquant = false, optipng = true, svgo = true, jpegTran = true } = options;
  const plugins = [];
  if (isNotFalse(gifsicle)) {
    const opt = isBoolean(gifsicle) ? void 0 : gifsicle;
    plugins.push((0, imagemin_gifsicle)(opt));
  }
  if (isNotFalse(mozjpeg)) {
    const opt = isBoolean(mozjpeg) ? void 0 : mozjpeg;
    plugins.push((0, imagemin_mozjpeg)(opt));
  }
  if (isNotFalse(pngquant)) {
    const opt = isBoolean(pngquant) ? void 0 : pngquant;
    plugins.push((0, imagemin_Pngquant)(opt));
  }
  if (isNotFalse(optipng)) {
    const opt = isBoolean(optipng) ? void 0 : optipng;
    plugins.push((0, imagemin_optipng)(opt));
  }
  if (isNotFalse(svgo)) {
    const opt = isBoolean(svgo) ? void 0 : svgo;
    plugins.push((0, imagemin_svgo)(opt));
  }
  if (isNotFalse(webp)) {
    const opt = isBoolean(webp) ? void 0 : webp;
    plugins.push((0, imagemin_webp)(opt));
  }
  if (isNotFalse(jpegTran)) {
    const opt = isBoolean(jpegTran) ? void 0 : jpegTran;
    plugins.push((0, imagemin_Jpegtran)(opt));
  }
  return plugins;
}

// 说明是 git commit 提交
let allFiles = process.argv.slice(2) || [];

console.log('realFiles', allFiles);
const localRecordPath = path.resolve(__dirname, 're-commend.json');
console.log('localRecordPath', localRecordPath);
const isExsit = fs.existsSync(localRecordPath);
console.log('isExsit', isExsit);
const curList = isExsit ? JSON.parse(fs.readFileSync(localRecordPath).toString('utf-8')) || [] : [];
console.log('curList', curList);
allFiles = allFiles.filter((item) => !curList.includes(item));
console.log('真实的压缩allFiles', allFiles);
if (allFiles.length <= 0) {
  console.log('暂无压缩文件');
  process.exit(0);
}
function formatSize(size) {
  if (!size || typeof size !== 'number') {
    return 0;
  }
  return Math.ceil(size / 1024);
}
// 获取本地记录路径
allFiles = allFiles.map((item) => {
  const beforeContent = fs.readFileSync(item);
  const beforeSize = beforeContent.length;
  return imagemin([item], {
    destination: path.dirname(item),
    plugins: getImageminPlugins(),
  }).then(async (result) => {
    console.log('压缩完毕', item, formatSize(beforeSize) + 'kb  ==> ' + formatSize(result[0].data.length) + 'kb');
    curList.push(item);
    fs.writeFileSync(localRecordPath, JSON.stringify(curList));
  });
});

Promise.all(allFiles).then((res) => {
  console.log('全部压缩完毕');
  process.exit(1);
});
