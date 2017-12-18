　　
# 查看角色权限列表
---
### 简要描述：
>查看角色权限

　　　　

### 请求地址：```/v3/ad/account/role/view```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
role_id|yes|int|要查看的role_id

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        size:15,
        list:[
            {
                category:"ADCONSTANTS.ROLECATEGORIES",
                subcategory:"ADCONSTANTS.SUBROLECATEGORIES",
                channel:"读写"
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
size|int|该角色拥有的权限数量
category|string|ADCONSTANTS.ROLECATEGORIES
subcategory|string|ADCONSTANTS.SUBROLECATEGORIES
channel|string|ADCONSTANTS.ROLECONTENTSTATUS


### 备注
>更多返回请求码请看错误代码描述
