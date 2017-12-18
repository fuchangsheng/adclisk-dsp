
# 剩余投放天数接口
---
### 简要描述：
> tb_dsp_aduser

### 请求地址：```/v3/ads/summary/balance```

### 请求方式：POST

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
        "balance":"int",余额（实际账户+虚拟账户）
        "rbalance":"int",实际账户
        "vbalance":"int"，虚拟账户
    }
}
```
### 返回参数说明
见返回示例

### 备注
>具体的返回码见错误代码描述
　
　
　