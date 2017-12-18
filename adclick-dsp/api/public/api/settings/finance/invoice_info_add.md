　
#  新增发票信息
---
### 简要描述：
>新增发票信息

　　　　

### 请求地址：```/v3/settings/finance/invoice-info/add```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
type|是|int|发票类型|1-普票，2-专票
title|是|String|发票抬头
tax_no|否|String|税号
address|否|String|公司地址
phone|否|String|联系电话
bank|否|String|开户行
bank_account_no|否|String|开户行账号
receiver_name|是|String|收件人姓名
receiver_address|是|String|收件人地址
receiver_email|是|String|收件人邮箱
receiver_mobile|是|String|收件人电话
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:"user_id",
        id:'id',
        audit_status:1
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|varchar|广告主id
id|String|发票信息id
audit_status|int|审核状态
　

### 备注
>更多返回请求码请看错误代码描述