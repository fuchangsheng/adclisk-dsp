
# 启动、暂停广告单元
---
### 简要描述：
> units

### 请求地址：```/v3/ads/unit/start```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id   ??为什么要user_id
|unit_id|是|BigInt|单元id
|action|是|string|操作方式:启动,暂停

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        status(string),
    }
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　