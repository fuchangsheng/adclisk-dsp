　
# 支付宝支付结果查询
---
### 简要描述：
>支付宝支付结果查询

　　　　

### 请求地址：```/v3/settings/finance/pay/ali-pay-return```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
out_trade_no|是|String|在支付接口返回的表单里

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        html:"/pub/pay_done.html?status=0"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
html|String|支付结果页面地址

### 备注
>更多返回请求码请看错误代码描述