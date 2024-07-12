export interface openIdOutEntity {
  openId: string;
}

export interface signOutEntity {
  /** 公众号唯一标识 */ appId: string;
  /** 生成签名的时间戳 */ timestamp: string;
  /** 生成签名的随机串 */ nonceStr: string;
  /** 公众号端H5应用调用jsapi所需签名 */ signature: string;
}

export interface useInfoOutEntity {
  /** 路由页面 "授信续作：注册登录页、身份认证页、身份信息掩码页、工商信息页、税银认证页、授信额度页 用信不用续作 */
  routePage: string;
  /** token	鉴权，有效期 */ uuid?: string;
  /** 用户编号 */ userNo?: string;
}

export interface agreementSignEntity {
  /** 0-登录注册，1-个人认证，2-企业认证,4协议补签 */
  flowType: string;
  /**	扩展编号	expandType=1传授信申请号, expandType=2传动支申请号 */
  expandNo?: string;
  /**	扩展类型	0-注册，1-授信申请，2-动支申请，3-营销 */
  expandType?: string;
  /**	用户编码	公参有，可不传 */
  userNo?: string;
  /**	客户号 */
  custNo?: string;
  /**	协议列表  */
  templateList: any;
  /**	公司编号，动支阶段需要传递 */
  companyNo?: string;
  /**	授信申请，动支申请时必传 */
  applyNo?: string;
}

/** *****************************
  kelp.flow.unread.agreement
  */
export interface AgreementCheck {
  /** 流程编码 */
  flowNo: string;
  /**	扩展类型 0-注册，1-授信申请，2-动支申请，3-营销 */
  expandType: string;
  /**	授信申请 */
  applyNo: string;
  /**	动支编号 */
  drawNo?: string;

  capitalMode?: string;
  flowType: string;
  reqNo?: string; // 0512延期还款新增字段 其他模块可不传
}

/** *****************************
  kelp.base.area
  */
export declare interface Area {
  /** 代码	Y	N	String	地区码 */
  code: string;
  /** 上级代码	Y	N	String	上级代码 */
  parentCode: string;
  /** 地区简称	Y	N	String	地区简称 */
  shortName: string;
  /** 地区名称	Y	N	String	地区名称 */
  areaName: string;
  /** 是否开通产品业务	Y	N	String	0-开通，1-未开通 */
  status: string;
}

/** *****************************
    kelp.query.announcement
  */
export declare interface Announcement {
  /** id */
  id: string;
  /** 标题 String */
  title: string;
  /** 内容 String */
  content: string;
  /** 生效时间 Date */
  dateEffective: string;
  /** 失效时间 Date */
  dateExpired: string;
  /** 状态 String 状态0-有效，1-失效 */
  status: string;
}

/** *****************************
    kelp.query.notice
  */
export declare interface NoticeResult {
  /** id */ id: string;
  /** 通告内容 */ content: string;
  /** 生效：0，失效：1 */ status: string;
  /** 标题 */ title: string;
}

export declare interface FieldS3Id {
  /** 身份证正面ID */ certFrontId: string;
  /** 身份证反面ID */ certReverseId: string;
  /** 营业执照ID  */ businessLicenseId: string;

  /**
   * 身份证正面ID-加密，反显使用
   */
  secretCertFrontId: string;
  /**
   * 身份证反面ID-加密，反显使用
   */
  secretCertReverseId: string;
  /**
   * 营业执照ID-加密，反显使用
   */
  secretBusinessLicenseId: string;
}

/** *****************************
    ocr识别
  */
export declare interface userOcrPureReq {
  /** 
   * 身份证正面ID 
   * */ 
  s3FileId: string;
  /**
   * 业务类型 ACCOUNT:四要素认证。资料上传待定
   */
  bizType: string;
  /**
   * 正反面标识 FRONT：身份证有照片的一面（人像面）BACK：身份证有国徽的一面（国徽面）
   */
  cardSide: string;
  
  custName?: string
}

/** *****************************
    ocr识别
  */
export declare interface userOcrPureRes {
  /** 
   * 姓名 
   * */ 
  name: string;
  /**
   * 身份证号
   */
  idNum: string;
  /**
   * 身份证地址
   */
  cardSide: string;
  /**
   * 发证机构
   */
  authority: string;
  /**
   * 有效期
   */
  validDate: string;
  /**
   * 影像正面ID
   */
  frontS3FileId: string;
  /**
   * 影像反面ID
   */
  reverseS3FileId: string;

   /** 地址？ */
  address?: string
}

// 短视频
/** *****************************
  name
*/
export declare interface memberLoginRq {
  /** 
   * 用户名
   * */ 
  user_name: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 域名
   */
  domain: string;

}

/** *****************************
  name
*/
export declare interface memberRegisterRq {
  /** 
   * 用户名
   * */ 
  user_name: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 确认密码
   */
  repeat_password: string;
  /**
   * 页码
   */
  episode_num: number;
  /**
   * 视频id
   */
  video_id: number;
  /**
   * 站点
   */
  // site_id: string;
  /**
   * 域名
   */
  domain: string;

}
/** *****************************
  name
*/
export declare interface homeRecommendRq {
  /** 
   * 语言ID
   * */ 
  lang_id: number;
  /**
   * 每个分类下获取剧集数量
   */
  page_size: number;
}
/** *****************************
  name
*/
export declare interface recommendCategoryVideosRq {
  /** 
   * 分类ID
   * */ 
  category_id: number | string;
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页数量
   */
  page_size: number;
}
/** *****************************
  name
*/
export declare interface browsesRq {
  /** 
   * 标签名
   * */ 
  tag_name: string;
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页数量
   */
  page_size: number;
}

/** *****************************
  name
*/
export declare interface videoRecordsRq {
  /** 
   * 视频ID
   * */ 
  video_id: number | string;
  /**
   * 剧集ID
   */
  episode_id: number | string;
  /**
   * 观看时长（秒为单位，取整数）
   */
  watch_duration: number | string;
}

/** *****************************
  name
*/
export declare interface watchHistoryListRq {
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页数量
   */
  page_size: number;
}

/** *****************************
  name
*/
export declare interface favoriteListRq {
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页数量
   */
  page_size: number;
}

/** *****************************
  name
*/
export declare interface videoEpisodeRq {
  /**
   * 剧集ID
   */
  video_id: number | string;
  /**
   * 第几集， 可选，不传或传0，先查历史，历史有播放历史第几集，历史没有则会播放第一集
   */
  episode_num?: number | string;
}

/** *****************************
  name
*/
export declare interface userFavoriteRq {
  /**
   * 剧集ID
   */
  video_id?: number | string;
  /**
   * 第几集， 可选，不传或传0，先查历史，历史有播放历史第几集，历史没有则会播放第一集
   */
  episode_num?: number | string;
  /**
   * 是否收藏（1：收藏，2：取消收藏）
   */
  is_favorite?: number | string;
}

/** *****************************
  name
*/
export declare interface createSubscribeRq {
  /**
   * 信用卡卡号	
   */
  card_no?: string;
  /**
   * 过期日期，格式：yyyy-mm-dd或yyyy/mm/dd
   */
  expire_date?: string;	
  /**
   * CVV	
   */
  cvv?: string;
  /**
   * first name	
   */
  first_name?: string;
  /**
   * last name	
   */
  last_name?: string;
  /**
   * 发起订阅的video_id，没有则传0或空
   */
  video_id?: number | string;	

}

/** *****************************
  name
*/
export declare interface unlockListRq {
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页数量
   */
  page_size: number;
}

/** *****************************
  name
*/
export declare interface getVerificationCodeRq {
  /**
   * 邮箱账号
   */
  user_name: string;
  /**
   * 当前站点域名
   */
  domain: string;
}

/** *****************************
  name
*/
export declare interface resetPasswordRq {
  /**
   * 邮箱账号
   */
  user_name: string;
  /**
   * code 码
   */
  code: string;
  /**
   * 新密码
   */
  new_password: string;
  /**
   * 确认密码
   */
  confirm_password: string;
}

/** *****************************
  name
*/
export declare interface fbUserLoginRq {
  /**
   * email
   */
  user_name: string;
  /**
   * 授权用户ID
   */
  oauth_user_id: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 昵称
   */
  nickname: string;
}
