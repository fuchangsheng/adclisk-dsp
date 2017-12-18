
# 用户登录接口
---
### 简要描述：
> 用户登录接口

### 请求地址：```/v3/user/login```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|name|是|String|用户名|
|password|是|String|SHA1加密过的用户密码|
|token|是|String|获取验证码接口返回的token，用来标志验证码|
|code|是|String|图片验证码|
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "auth": {
            "user_id":"string",
            "oper_id":"string",
            "user_name":"string",
            "role":int,
            "audit_status":int
        }
    }
}
```
### 返回参数说明
参数名 | 数据类型 | 说明
:--    |   :--:   | :--
code|int|请求码
message|String|如果请求失败，message为消息说明
data.auth.user_id|String|广告主id
data.auth.oper_id|String|当前角色id
data.auth.user_name|String|用户名
data.auth.role|int|用户角色类型 1-管理员 2-操作员...
data.auth.audit_status|int|审核状态

### 备注
>具体的返回码见错误代码描述

>具体的role、status定义见ADCONSTANTS
　
　
　