　
#  开票
---
### 简要描述：
>开票请求接口

　　　　

### 请求地址：```/v3/settings/finance/invoice/add```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
invoice_type|是|int|发票类型|1-普票，2-专票
item_type|是|string|开票项目(广告费、广告服务费)
amount|是|int|开票金额
invoice_id|否|string|要使用的发票信息id
title|否|String|发票抬头
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        id:'id'
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
id|String|发票id
　

### 备注
>更多返回请求码请看错误代码描述