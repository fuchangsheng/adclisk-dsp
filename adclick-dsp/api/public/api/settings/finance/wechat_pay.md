　
# 微信支付接口
---
### 简要描述：
>微信支付接口，传入总金额，生成支付二维码和订单号

　　　　

### 请求地址：```/v3/settings/finance/pay/wechat-pay```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
amount|是|int|订单金额

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        content:"支付二维码的地址",
        id: "out_trade_no"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
content|String|生成的支付二维码的地址
id|String|订单号　

### 备注
>更多返回请求码请看错误代码描述