
# 剩余投放天数接口
---
### 简要描述：
> tb_dsp_aduser

### 请求地址：```/v3/settings/finance/balance```

### GET

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|String|广告主id|
　


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "balance":"int",
        "rbalance":"int",
        "vbalance":"int"
    }
}
```
### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
balance|int|账户余额
rbalance|int|实际账户余额
vbalance|int|虚拟账户余额

### 备注
>具体的返回码见错误代码描述
　
　
　