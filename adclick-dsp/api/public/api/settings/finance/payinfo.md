
# web端查询支付宝支付结果
---
### 简要描述：
> 传入out_trade_no,返回支付结果

### 请求地址：```/v3/pay/payinfo```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|out_trade_no|是|String|支付订单号|
　


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "out_trade_no":"支付宝订单号",
        "charge_type":"支付宝充值",
        "charge_status":"充值成功"
    }
}
```
### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
out_trade_no|String|订单号
charge_type|String|充值类型，见**AdConstants**
charge_status|String|充值状态，见**AdConstants**

### 备注
>具体的返回码见错误代码描述
　
　
　