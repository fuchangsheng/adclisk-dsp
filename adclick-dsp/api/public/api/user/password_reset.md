　
# 重置密码
---
### 简要描述：
>填写相关信息和新密码，返回密码重置结果

　　　　

### 请求地址：```/v3/password/reset```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 oper_id|是|String|角色id
 oldpassword|是|String|旧密码
 password|是|String|新密码


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "name":"String"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
data.name|String|角色用户名
　

### 备注
>更多返回请求码请看错误代码描述