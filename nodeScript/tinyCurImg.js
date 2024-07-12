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

/** 读取目录下的所有文件 返回文件列表 */
const isFunction = (arg) => typeof arg === 'function';
const isRegExp = (arg) => Object.prototype.toString.call(arg) === '[object RegExp]';

const filter = /\.(png|jpeg|gif|jpg|bmp|svg)$/i;
// 过滤非图片
function filterFile(file) {
  if (filter) {
    const isRe = isRegExp(filter);
    const isFn = isFunction(filter);
    if (isRe) {
      return filter.test(file);
    }
    if (isFn) {
      return filter(file);
    }
  }
  return false;
}
function readAllFiles(root, reg) {
  let resultArr = [];
  try {
    if (fs.existsSync(root)) {
      const stat = fs.lstatSync(root);
      if (stat.isDirectory()) {
        const files = fs.readdirSync(root);
        files.forEach((file) => {
          const t = readAllFiles(path.join(root, '/', file), reg);
          resultArr = resultArr.concat(t);
        });
        // eslint-disable-next-line no-void
      } else if (reg !== void 0) {
        if (isFunction(reg.test) && reg.test(root)) {
          resultArr.push(root);
        }
      } else {
        resultArr.push(root);
      }
    }
  } catch (error) {
    console.log('error', error);
  }
  return resultArr;
}
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

const allFiles = [path.resolve(__dirname, '../src/assets'), path.resolve(__dirname, '../public')]
  .reduce((pre, item) => [...pre, ...readAllFiles(item)], [])
  .filter(filterFile);

if (allFiles.length <= 0) {
  console.log('暂无压缩文件');
  process.exit(0);
}
console.log(chalk.green.bgBlack('压缩中...,总个数：' + allFiles.length));
const maxlength = allFiles.reduce((pre, next) => (next.length > pre ? next.length : pre), 0);

function formatSize(size) {
  if (!size || typeof size !== 'number') {
    return 0;
  }
  return Math.ceil(size / 1024);
}
// 获取本地记录路径
let success = 0;
let failed = 0;
Promise.all(
  allFiles.map((item) => {
    const beforeContent = fs.readFileSync(item);
    const beforeSize = beforeContent.length;

    return imagemin([item], {
      destination: path.dirname(item),
      plugins: getImageminPlugins(),
    })
      .then((res) => {
        const ratio = (beforeSize - res[0].data.length) / beforeSize;
        success++;
        console.log(
          chalk.blue.bgBlack(item.split(process.cwd())[1]),
          ' '.repeat(maxlength - item.length + 2),
          chalk.gray(`${ratio < 0 ? chalk.red(`+${Math.ceil(ratio * 100)}%`) : chalk.green(`-${Math.ceil(ratio * 100)}%`)}`),
          ' '.repeat(5),
          chalk.green.bgBlack(formatSize(beforeSize) + 'kb / ' + formatSize(res[0].data.length) + 'kb'),
        );
      })
      .catch(() => {
        console.log('error', chalk.red.bgBlack(item));
        failed++;
      });
  }),
).then(() => {
  if (failed > 0) {
    console.log(chalk.green.bgBlack('压缩完毕。总文件： ' + allFiles.length, '\tsuccess:' + success), chalk.red.bgBlack('fail:' + failed));
  } else {
    console.log(chalk.green.bgBlack('压缩完毕, 总文件：' + allFiles.length, 'success:' + success));
  }
});
