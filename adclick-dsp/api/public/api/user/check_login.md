　
# 检查是否登录
---
### 简要描述：
>检查是否登录

　　　　

### 请求地址：```/v3/user/check-login```

### 请求方式：GET


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "oper_id":"oper_id",
        "role":0
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
data.oper_id|String|操作员id
data.role|int|操作员角色类型
　

### 备注
>更多返回请求码请看错误代码描述

>role的说明见AdConstants