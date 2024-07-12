# 短视频系统

vue3.0 + vite + typescript

## 项目结构

## 风格指南

   <https://vant-contrib.gitee.io/vant/v3/#/zh-CN/style-guide>
   <https://v3.cn.vuejs.org/style-guide/#%E8%A7%84%E5%88%99%E7%B1%BB%E5%88%AB>

## Husky使用指北

   <https://github.com/typicode/husky>
## 代码运行 

下载依赖包： yarn 

### 本地MOCK 数据
- 方法1. 配置本地环境  .env.development.local, 参照 .env.development.local.example 指引 （建议这种）
- 方法2. 配置浏览器sessionStorage  global_openId, 然后配置浏览器手机模式 UserAgent 如： 
Mozilla/5.0 (Linux; Android 10; BRQ-AN00 Build/HUAWEIBRQ-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/045811 Mobile Safari/537.36 MMWEBID/2687 MicroMessenger/8.0.16.2040(0x28001057) Process/tools WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64
以及屏幕 宽，高 和像素比



## git提交规则
- Git:Commit message 和 Change log 编写指南参考连接
    - [阮一峰](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

| 规范名   | 描述                                                    |
| -------- | ------------------------------------------------------- |
| docs     | 仅仅修改了文档，比如 README, CHANGELOG, CONTRIBUTE 等等 |
| chore    | 改变构建流程、或者增加依赖库、工具等                    |
| feat     | 新增 feature                                            |
| fix      | 修复 bug                                                |
| merge    | 合并分之                                                |
| perf     | 优化相关，比如提升性能、体验                            |
| refactor | 代码重构，没有加新功能或者修复 bug                      |
| revert   | 回滚到上一个版本                                        |
| style    | 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑      |
| test     | 测试用例，包括单元测试、集成测试等                      |
| build     | 构建生成代码


