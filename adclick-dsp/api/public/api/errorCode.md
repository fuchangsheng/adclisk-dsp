## ErrorCode 说明
---
>**ErrorCode**是指在进行http请求时，接口返回的数据中code字段的值，具体说明见下表
　　
　　　　

### ErrorCode 说明
code值 | 名称 | 说明
 :--:  | :--: | :--
10001|PARAM_INVALID|非法的参数
10002|NEED_LOGIN|需要登录
10003|NOLOGIN|未登录
10004|NOVIEW|没有视图
20001|INVALID_VERIFYCODE|验证码错误
20002|SMSCODE_SEND_FAILED|短信发送失败
20003|SMSCODE_TOOMANY|短信发送太频繁
20004|SMSCODE_INVALID|短信验证码错误
20005|SMSCODE_OUTOFDATE|短信验证码过期
20006|TOKEN_OUTOFDATE|token过期
30001|INVALID_USER_PASSWD|密码错误
30001|PASSWORD_TOO_SIMPLE|密码太简单
30003|INVOICE_UNEDITABLE|发票不可编辑
30004|DATA_INVALID|数据格式错误
30005|INVOICE_REQUIRE_AMOUNT_TOOLARGE|开票金额过大
30006|WECHATPAY_CREATEORDER_FAILED|微信支付失败
30007|ALIPAY_VERIFY_FAILED|支付宝验证失败
30008|PERMISSIONS_LIMITED|没有权限
30009|BUDGET_OVERFLOW|预算不足
40001|DB_ERROR|数据库错误
40002|DB_NO_MATCH_DATA|没有匹配数据
40003|DB_CONNECTION_FAIL|数据库连接失败
40004|DB_PARAMS_INVALID|数据库参数错误
40005|DB_VALUES_INVALID|数据值格式错误
40006|DB_QUERY_FAIL|数据库操作失败
40007|DB_NO_MORE_DATA|没有更多数据
40008|DB_TRANSACTION_ERR|数据库错误
40009|DB_SQL_EMPTY|sql语句为空
40010|DB_DATADUPLICATED|数据重复
40011|DB_CREATEDATAFAILED|创建数据失败
50001|REQUEST_FAILED|请求失败
50002|REQUEST_INVALID|请求非法
50003|REQUEST_DENIED|请求被拒绝
60001|ASSET_BEINGUSED|素材正被使用