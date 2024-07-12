export interface Params {
  /** userNo	用户编号	N	N	String	登录后返回给前端 */
  userNo?: string;
  /** token	用户token	N	N	String	登录后返回给前端 */
  token?: string;
  /** channelSource	宿主渠道编号	Y	N	String	分配给宿主的渠道编号，需提前沟通，例如：KCB_001 */
  channelType?: string;
  channelNo?: string;
  /** hostApp	宿主APP	Y	N	String	WECHAT，BROWSER */
  hostApp?: string;
  /** productCode	产品编码	Y	N	String	默认为KCBEPLOAN */
  productNo?: string;
  /** h5Version	H5版本号	Y	N	String	H5版本号 */
  h5Version?: string;
  /** pageName	页面名称	Y	N	String	页面名称 */
  pageName?: string;
  /** timestamp	时间戳	Y	N	String	格式：yyyy-mm-dd hh24:mi:ss */
  timestamp?: number;
  /** deviceInfo	设备信息	Y	N	Json	json格式的设备信息，包括设备id，os等等 */
  deviceInfo?: any;
  /** method	接口名称	Y	N	String	com+kcb+sme+系统+名称+子名称+动作 */
  method?: string;
  /** bizContent	业务信息	Y	N	Json	业务相关信息 */
  bizContent?: any;

  [key: string]: any;
}

export interface HttpRequest {
  path: string;
  params?: Params;
}

export interface HttpConfig {
  baseURL: string;
}
