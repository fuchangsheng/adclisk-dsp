
# 获取定向模板list
---
### 简要描述：
> 获取定向模板list接口

### 请求地址：```/v3/utils/tt/list```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|index|否|int|第几页|
|count|否|int|每页条数|
|sort|否|String|排序方式|
|tag|否|String|标签|
　
### post数据实例

```
{
    index: 0,
    count: 8,
    sort: '创建时间增序',
    tag: 'tag1,tag2,tag3'   
}
```

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "total": 132,
        "size": 8,
        "list":[
            {
                template_id:"template_id",
                template_name:"name",
                tag:"tag1,tag2,tag3",
                update_time:"datetime"
                },
            ...
        ]
    }
}
```

### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
data.total|int|总条数
data.size|int|本次请求返回条数
data.list|array|模板列表

### 备注
>具体的返回码见错误代码描述

>具体的role、status定义见ADCONSTANTS
　
　
　