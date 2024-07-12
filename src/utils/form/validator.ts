/**
 * 手机号码验证
 */
export const telValidator = (val: string) => /^1+\d{10}$/.test(val);

/**
 * 手机号掩码校验
 */
export const telCodeValidator = (val: string) => /^1\d{2}(\*){4}\d{4}$/.test(val);

/**
 * 手机号全校验（包含掩码和其他）
 */
export const telRealValidator = (val: string) => telValidator(val) || telCodeValidator(val);

/**
 * 短信验证码
 */
export const codeValidator = (input: string): boolean => /^\d{6}$/.test(input);

/**
 * 中文字验证
 */
// export const chineseValidator  = (val: string) =>  /^[\u2E80-\u9FFF]+$/.test(val) && val.length>=2;
export const chineseValidator = (val: string) =>
  /^[\u4e00-\u9fa5]+([\u4e00-\u9fa5]|·(?!·|•)|•(?!•|·))*[\u4e00-\u9fa5]+$/.test(val) && val.length >= 2;

export const includeXing = (val: string) => val.includes('*');
/**
 * 数字验证
 */
export const numberValidator = (val: string, length?: number) => /^\d+$/.test(val) && (!length || String(val).length <= length);

/**
 * 数字验证,且保留2位小数
 */
export const amtValidator = (val: string, length?: number) => {
  const amt = val.replace(/,/g,'')
  return /^[0-9]+(\.[0-9]{1,2})?$/.test(amt) && (!length || String(amt).length <= length);
}  

/**
  * 
 只能输入数字跟字母
  */
export const numberAlphabetValidator = (val: string, length?: number) =>
  /^[A-Za-z0-9]+$/.test(val) && (!length || String(val).length <= length);

/**
 * 密码验证
 */
export const passwordValidator = (num: string): boolean => {
  let ncontinuity = 0; // 用于连续个数的统计
  let sameCount = 0;
  for (let i = 1; i < num.length; i++) {
    if (parseInt(num[i], 10) - parseInt(num[i - 1], 10) === 0) {
      sameCount += 1;
    }
    if (parseInt(num[i], 10) - parseInt(num[i - 1], 10) === 1 || parseInt(num[i], 10) - parseInt(num[i - 1], 10) === -1) {
      // 等于1代表升序连贯   等于-1代表降序连贯
      ncontinuity += 1; // 存在连贯：计数+1
    }
  }
  if (sameCount === num.length - 1) {
    return true;
  }
  if (ncontinuity > num.length - 2) {
    return true;
  }
  return false;
};

/**
 * 校验银行卡规则
 */
export function bankNumberValidator(input: string | undefined | null) {
  return /^\d{1,30}$/.test(input ?? '');
}

export const emailValidator = (input: string): boolean =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(input);

export const taxIdValidator = (input: string): boolean => /^\d[\dA-Z]{14,19}$/.test(input);

export const companyNameValidator = (input: string): boolean => !!input.length && input.length <= 42;

export const cardValidator = (input: string): boolean => /^\d{13,16}$/.test(input);

export const dateValidator = (input: string): boolean => {
  if (!input) return false;
  return Number(input.slice(0, 2)) <= 12;
};

export const cvvValidator = (input: string): boolean => /^\d{3,4}$/.test(input);

