　
#  删除发票信息
---
### 简要描述：
>删除发票信息

　　　　

### 请求地址：```/v3/settings/finance/invoice-info/del```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
id|是|string|要删除的发票信息id
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:"user_id",
        id:'id'
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|varchar|广告主id
id|String|被删除的发票信息id
　

### 备注
>更多返回请求码请看错误代码描述