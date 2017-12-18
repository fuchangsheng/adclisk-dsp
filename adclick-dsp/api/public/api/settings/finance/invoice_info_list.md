　
# 获取发票信息列表
---
### 简要描述：
>获取本账户的发票信息列表

　　　　

### 请求地址：```/v3/settings/finance/invoice-info/list```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
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
            id: 'invocie_account_id',
            title: '上海数凹文化传媒有限公司',
            tax_no: invoices[i].tax_no,
            address: invoices[i].address,
            phone: invoices[i].phone,
            bank: invoices[i].bank,
            bank_account_no: invoices[i].bank_account_no,
            receiver_name: invoices[i].receiver_name,
            receiver_address: invoices[i].receiver_address,
            receiver_email: invoices[i].receiver_email,
            receiver_mobile: invoices[i].receiver_mobile,
            qualification: invoices[i].qualification,
            audit_status: invoices[i].audit_status,
            audit_message: invoices[i].audit_message,
            type: ADCONSTANTS.INVOICETYPE.format(invoices[i].type),
            create_time: mMoment(invoices[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
            update_time: mMoment(invoices[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT),
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
id|varchar|发票信息id
user_id|bigint|广告主id
title|varchar|发票抬头
type|int|发票类型：1-增值税普票 2-增值税专票
tax_no|varchar|税号
address|varchar|地址
phone|varchar|公司电话
bank|varchar|开户行
bank_account_no|varchar|开户行银行账号
receiver_name|varchar|收件人姓名
receiver_address|varchar|收件人地址
receiver_email|varchar|收件人邮箱
receiver_mobile|varchar|收件人电话
qualification|varchar|资质文件
audit_status|int|审核状态 0-通过 1-正在提交 2-审核中 3-审核失败
audit_message|varchar|审核失败的原因
status|int|记录状态 0-有效 其它-无效
create_time|datetime|创建时间
update_time|datetime|更新时间

### 备注
>更多返回请求码请看错误代码描述