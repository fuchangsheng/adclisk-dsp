
# 新建定向模板
---
### 简要描述：
> 新建定向模板接口

### 请求地址：```/v3/utils/tt/add```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|template_name|是|String|定向模板名称|
|targets|是|array|每个定向的内容组成的数组|
|tag|否|String|可选，由英文逗号分隔的标签|
　
### post数据实例

```
{
    template_name："定向模板-测试",
    tag: "男性,ios,MGTV",
    targets: [
        {
            type: "adx",
            status: "启用",
            content: "BES,BCH,ADX_MGTV"
        },
        {
            type: "流量类型",
            status: "启用",
            content: "app"
        }
    ]
}
```

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "template_id": "id"
    }
}
```

### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
data.template_id|String|定向模板id

### 备注
>具体的返回码见错误代码描述

>具体的role、status定义见ADCONSTANTS
　
　
　