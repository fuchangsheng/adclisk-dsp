　
# 获取消息列表
---
### 简要描述：
>获取消息列表

　　　　

### 请求地址：```/v3/settings/system/msg/list```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
index|是|int|第几页
count|是|int|每页数量
start_time|是|YYYY-MM-DD HH:mm:ss|开始时间
end_time|是|YYYY-MM-DD HH:mm:ss|截止时间
categories|是|string|消息分类的中文描述
sort|否|string|排序方式
notify_status|否|string|通知状态

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total:100
        size: 5,
        list: [
           {
            msg_id: 'msg_id',
            categories: 1,
            subcategories: 1001,
            title:".....",
            content:"......",
            notify_status:"通知状态的中文描述",
            create_time:"2017-10-15 18:32:45"
            },
            ... 
        ]
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
total|int|消息总数
size|int|本次请求返回数量
msg_id|string|消息id
categories|int|消息分类
subcategories|int|消息子分类
title|string|消息标题
content|string|消息内容
notify_status|string|通知状态的中文描述
create_time|date_time|创建时间


### 备注
>更多返回请求码请看错误代码描述