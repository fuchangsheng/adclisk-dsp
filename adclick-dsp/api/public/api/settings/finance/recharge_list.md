　
# 获取充值记录
---
### 简要描述：
>获取本账户的充值记录

　　　　

### 请求地址：```/v3/settings/finance/recharge/list```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
type|否|int|账户类型
index|否|int|页码
count|否|int|每页数量
sort|否|int|排序方式

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total:100,
        size: 8,
        list: [
           {
                date:"2017-12-15 13:12:23",
                account_type:0,
                type:0,
                amount:1000,
                charge_type:2,
                charge_status:0,
                notes:''
            },
            ... 
        ]
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
total|int|总记录数量
size|int|本次请求返回数量
date|datetime|交易日期
account_type|int|1-现金账户，2-虚拟账户
type|int|0，保留字段
notes|String|'',保留字段
amount|int|充值金额
charge_type|int|2-微信支付，1-支付宝，0-网银
charge_status|int|0-充值完成，1-充值中，2-充值失败

### 备注
>更多返回请求码请看错误代码描述