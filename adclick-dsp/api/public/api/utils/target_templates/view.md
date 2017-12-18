
# 查看定向模板
---
### 简要描述：
> 查看定向模板接口

### 请求地址：```/v3/utils/tt/view```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|template_id|是|String|要查看的定向模板id|


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "size": "2",
        "list":[
            {
                type: "adx",
                status:"启用",
                content:"ADX_MGTV,CLOUND_ADROI,BES"
            },
            {
                type: "流量类型"，
                status:"启用，
                content:"app"
            }
        ]
    }
}
```

### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
data.size|int|该定向模板所包含的定向选项的数量
data.list|array|该定向模板的定向内容列表

### 备注
>具体的返回码见错误代码描述

>具体的role、status定义见ADCONSTANTS
　
　
　