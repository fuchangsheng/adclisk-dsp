　　
# 删除角色
---
### 简要描述：
>删除角色

　　　　

### 请求地址：```/v3/ad/account/role/del```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
role_id|yes|int|要删除的role_id

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        role_id:"roleId",
        name:'删除的rolename'
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
role_id|int|删除的权限id
name|string|被删除的权限名，用作操作日志


### 备注
>更多返回请求码请看错误代码描述
