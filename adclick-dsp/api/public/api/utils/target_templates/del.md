
# 删除定向模板
---
### 简要描述：
> 删除定向模板接口

### 请求地址：```/v3/utils/tt/del```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|template_id|是|String|要删除的定向模板id|


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "template_id": "id",
        "user_id":"userid"
    }
}
```

### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
data.template_id|String|定向模板id
data.user_id|String|广告主id

### 备注
>具体的返回码见错误代码描述

>具体的role、status定义见ADCONSTANTS
　
　
　