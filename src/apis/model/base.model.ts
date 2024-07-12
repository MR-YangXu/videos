export interface Result<T> {
  flag: string,
  code?: string;
  msg?: string;
  data?: T;
}

export declare type stringValue = string | null;
export declare type numberValue = number | null;
export declare type mapValue = Record<string, any> | null;

export declare interface PageResult {
  /** 总页数 */
  pageTotal: string;
}

export declare type NonNull<T> = {
  [K in keyof T]: NonNullable<T[K]>;
}

/**
 * 分页公参数
 */
export declare interface Page {
  /** pageRow	单页数据量	Y	N	String	 */
  pageRow: string;
  /** 偏移值	N	N	String	如果第二次查询，则必须传 */
  pageNum: string;
}

export declare interface IdPage {
	 /** 续传交易ID	Y	N	String	首次查询不用传，后续查询必填，取值为上一次查询到的列表里的最后一个id */
	 pageNum?: string;
	 /** 查询记录量	Y	N	String	公司编号 */
	 pageSize: string;
}

export declare interface IdPageResult<T> {
	 /**	还款交易列表	 */
	 list: T[];
	 /**	是否查询完毕标识 */
	 queryOverFlag: string;
}