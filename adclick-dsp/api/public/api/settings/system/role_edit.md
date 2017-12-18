　　
# 修改协作者
---
### 简要描述：
>修改角色

　　　　

### 请求地址：```/v3/ad/account/role/edit```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
role_id|yes|int|要修改的role_id
role_name|yes|string|角色名称
targets|yes|array|权限列表
targets[i].category|yes|string|权限组名称,ADCONSTANTS.ROLECATEGORIES
targets[i].subcategory|yes|string|权限名称,ADCONSTANTS.ROLESUBCATEGORIES
targets[i].channel|yes|string|权限值,ADCONSTANTS.ROLECONTENTSTATUS

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        role_id:"roleId"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
role_id|int|修改的权限id


### 备注
>更多返回请求码请看错误代码描述
