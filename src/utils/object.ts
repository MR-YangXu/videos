/* eslint-disable guard-for-in */
// eslint-disable-next-line no-useless-escape
const delimiterReg = /([^\.\[\]])+/g;
export function setter(obj: any, properties: string, value: any) {
  const props = properties.match(delimiterReg);
  const lastProp = props?.pop();
  if (!lastProp) {
    console.error('properties is wrong, please check it', properties);
    return obj;
  }
  let target = obj;

  props?.forEach((prop) => {
    if (!target[prop]) {
      target[prop] = {};
    }
    target = target[prop];
  });
  target[lastProp] = value;

  return obj;
}

export function merge(...args: any[]) {
  const rst: any = {};

  for (const arg of args)
    for (const key in arg) {
      rst[key] = arg[key];
    }

  return rst;
}

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export function deepMerge<T extends Record<string, any>[]>(...args: T): UnionToIntersection<T[number]> {
  const rst = {} as any;

  for (const arg of args)
    for (const key in arg) {
      // eslint-disable-next-line no-use-before-define
      if (type(arg[key]) === 'object') {
        rst[key] = deepMerge(rst[key], arg[key]);
      } else {
        rst[key] = arg[key];
      }
    }

  return rst;
}

const { toString } = Object.prototype;
const replaceReg = /(^\[object\s|\]$)/g;
export function uncapitalizeFirstLetter([first, ...rest]: string, locale = navigator.language) {
  return first.toLocaleLowerCase(locale) + rest.join('');
}
export function capitalizeFirstLetter([first, ...rest]: string, locale = navigator.language) {
  return first.toLocaleUpperCase(locale) + rest.join('');
}
export function type(obj: any): string {
  return uncapitalizeFirstLetter(toString.call(obj).replace(replaceReg, ''));
}

export function replacer(input: string | null | undefined, data: { [index: string]: string | number | null | undefined }) {
  if (!input) return input;
  return input.replace(/\$\{.+?\}/g, (substring) => {
    // let key = substring.replace(/(\$\{|\})/g, '').trim();
    const key = substring;
    return (data[key] ?? '') + '';
  });
}

/**
 * 这是一个重置对象的方法
 * @param {*} srcobj  需要重置的对象 默认{}
 * @param {*} resetobj  重置成什么样的对象 默认{}
 * @return 返回一个重置成 resetobj 对象的对象
 * @example
 *      emptyObj({a:2,b:3})==>{}
 *      emptyObj({a:2,b:3},{b:4})==>{b:4}
 *      emptyObj(1,{b:4})==> 报错  参数必须都为对象，可以不传 传了必须为对象
 */
export function emptyObj(srcobj = {}, resetobj = {}) {
  if (typeof srcobj !== 'object' || typeof resetobj !== 'object') {
    throw new TypeError('srcobj or  resetobj not object type');
  }
  Object.keys(srcobj).forEach((item) => {
    if (item in srcobj && item in resetobj) {
      srcobj[item] = resetobj[item];
    } else {
      delete srcobj[item];
    }
  });
  return srcobj;
}
