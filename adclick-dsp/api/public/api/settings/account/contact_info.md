　
# 获取广告主联系人信息
---
### 简要描述：
>获取广告主联系人信息

　　　　

### 请求地址：```/v3/settings/account/cinfo/view```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表:　```无```

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:"user_id",
        contacts_name:"zhangsan",
        contacts_mobile:"15527941456",
        contacts_eamil:"con@dmtec.cn"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|String|广告主id
contacts_name|String|联系人姓名
contacts_mobile|String|联系人电话
contacts_eamil|String|联系人邮箱
　

### 备注
>更多返回请求码请看错误代码描述