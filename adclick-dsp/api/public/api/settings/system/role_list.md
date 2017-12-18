　　
# 获取角色列表
---
### 简要描述：
>角色列表

　　　　

### 请求地址：```/v3/ad/account/role/list```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
index|no|int|页码 从0开始
count|no|int|每页数量
sort|no|string|ADCONSTANTS.DATASORT

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total:12,
        size:5,
        list:[
            {
                role_id:"role_id",
                role_name:"管理员",
                create_time:'2017-12-03 12:12:12',
                update_time:'2017-12-03 12:12:12'
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
total|int|所有数量
size|int|本次请求返回数量
role_id|int|role_id
name|string|角色名称


### 备注
>更多返回请求码请看错误代码描述
