export enum LA_RESULT {
  /** 00 "核身处理中" */
  FACE_CHECK = '00',
  /** 01 "核身成功" */
  FACE_SUCCESS = '01',
  /** 02 "核身失败" */
  FACE_FAIL = '02',
}

/**
 * 刷脸场景业务类型
 */
export enum BIZ_TYPE {
  /** 实名场景刷脸, APP端用 */
  REAL_NAME = '1',
  /** 借款申请刷脸, 公众号端、APP端均用 */
  LOAN = '2',
  /** 修改手机号场景刷脸，公众号端 */
  CHANGE_PHONE = '3',
  /** 微信解绑场景刷脸， 公众号端 */
  CHANGE_WECHAT = '4',
  /** APP客户回流场景刷脸, 公众号端 */
  CUST_BACK = '5',
  /** 交易密码重置场景刷脸,  APP端 */
  PASSWORD_RESET = '6',
  /** 安全策略场景刷脸, APP端 */
  SAFE_SINCE = '8',
  /** APP端还款户退款刷脸 */
  DRAWBACK = '10',
  /** 延期还款刷脸 */
  DELAY_REPAY = '11',
  /** APP端开户刷脸 */
  ACCOUNT = '12',
  /** 还款计划修改 */
  RELOAN_REPAY = '13',
  /** 无还本续贷 */
  LOAN_REPAY = '14',
  /** 24-H5缓存过期刷脸 */
  CACHE_EXPIRE = '24',
  /** 25-H5渠道端互通刷脸  */
  CHANNEL_DATA_INTERWORKING = '25',
  /** 法人变更刷脸  */
  LEGAL_CHANGE = '26',
  /** 渠道客户回流场景刷脸, 公众号端 */
  QUDAO_BACK = '27',
  /** Wx端还款户退款刷脸 */
  REFUND_FACE = '28',
  /** 取消额度 */
  CANCEL_LIMIT_FACE = '30',
}

/**
 * 刷脸失败状态码
 */
export enum FACE_FAIL_CODE {
  /** 今日额度已用完，请明日再提交申请！ */
  B_KELP_0006 = 'B_KELP_0006',
  /** 今日额度已用完，请明日再提交申请！ */
  B_KELP_0008 = 'B_KELP_0008',
  /** 今日额度已用完，请明日再提交申请！ */
  B_KPCS_0019 = 'B_KPCS_0019',
  /** 业务请求号drawNo为空 */
  B_KELP_0013 = 'B_KELP_0013',
  /** 操作超时 */
  B_KELP_0009 = 'B_KELP_0009',
  /** 刷脸次数已用完，请明日再试 */
  B_KELP_0002 = 'B_KELP_0002',
  /** 本次手机号修改已核身成功，请勿重复操作 */
  B_KELP_0020 = 'B_KELP_0020',
}

/**
 * 刷脸场景
 */
export enum EBizType {
  /** 授信 */
  DETECT = 'DETECT',
}
export declare interface businessData {
  /** 授信申请号 */
  applyNo: string;
  /** 用信申请号 */
  drawNo: string;
  /** 客户编号 */
  custNo: string;
  /** 来源	来源：产品-kelp；营销-kums 来源：产品-kelp；营销-kums；产品变更手机号-mobile */
  source: 'kelp' | 'kums' | 'mobile' | 'wechat' | 'password' | '';
  /** 权限id 腾讯控制台申请，用于细分客户使用场景：0-kelp;1-kums */
  ruleId: 0 | 1;
  /** 业务编号 变更手机号专用，传kelp.user.bank.cert.revision返回的ReqNo */
  expandNo?: string;
  /** 业务类型 变更手机号专用，固定值3 */
  expandType?: string;
}

export declare interface BizTokenResult {
  /** URL	用于发起核身流程的URL，仅微信H5场景使用。 */
  Url: string;
  /** 核身流程标识	一次核身流程的标识，有效时间为7,200秒；完成核身后，可用该标识获取验证结果信息。 */
  BizToken: string;
  /** 唯一请求ID	每次请求都会返回。定位问题时需要提供该次请求的 RequestId。 */
  RequestId: string;
}

export declare interface reStatusParams {
  /** 核身流程标识	一次核身流程的标识，有效时间为7,200秒；完成核身后，可用该标识获取验证结果信息。 */
  BizToken: string;
}
