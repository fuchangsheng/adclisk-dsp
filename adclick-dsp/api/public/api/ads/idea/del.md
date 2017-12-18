
#彻底删除广告创意
---
### 简要描述：
> 彻底删除广告创意
> dsp_adlib:ideass

### 请求地址：```/v3/ads/idea/del```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|unit_id|是|BigInt|单元id
|idea_id|是|BigInt|创意id

### 返回示例
```
{
    "code": 0,
    "message": "",
    "status":"int" 成功：0，失败：-1
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　