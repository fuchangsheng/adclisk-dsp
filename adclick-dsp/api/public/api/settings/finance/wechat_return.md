　
# 微信支付结果查询
---
### 简要描述：
>微信支付结果查询

　　　　

### 请求地址：```/v3/settings/finance/pay/wechat-query```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
id|是|String|在支付接口返回的订单号

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        id:"out_trade_no",
        account_type:0,
        oper_id:"id",
        amount:10000,
        charge_type:2,
        charge_status:0,
        redirect:true,
        html:"/pub/pay_done.html?status=0"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
id|String|充值记录id
account_type|int|0-实际账户，1-虚拟账户
oper_id|String|操作员id
amount|int|金额（单位：元）
charge_type|int|0-网银，1-支付宝，2-微信
charge_status|int|0-充值完成，1-充值中，2-充值失败
redirect|bool|是否跳转页面
html|String|跳转页面的地址

### 备注
>更多返回请求码请看错误代码描述