　
#  获取可开票余额
---
### 简要描述：
>获取可开票余额

　　　　

### 请求地址：```/v3/settings/finance/invoice/amount```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表　　```无```
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:'id',
        invoiced_amount:1000,
        uninvoiced_amount:20000
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|String|广告主id
invoiced_amount|string|已开票金额
uninvoiced_amount|string|可开票金额
　

### 备注
>更多返回请求码请看错误代码描述