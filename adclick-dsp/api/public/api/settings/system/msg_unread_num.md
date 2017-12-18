　
# 获取未读消息数目
---
### 简要描述：
>获取未读消息数目

　　　　

### 请求地址：```/v3/settings/system/msg/unread-num```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表　　```无```


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        num: 10
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
num|int|未读消息数量


### 备注
>更多返回请求码请看错误代码描述