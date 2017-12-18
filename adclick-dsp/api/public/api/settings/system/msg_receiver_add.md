　
# 新增消息接收人
---
### 简要描述：
>为广告主添加新的消息接收人

　　　　

### 请求地址：```/v3/settings/system/msg-receiver/add```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
type|否|string|接受消息类型,手机短信，邮件
receiver|否|string|email或mobile


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        id: "receiver_id",
        status: "审核中"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
id|string|消息接受者id
audit_status|string|审核状态的中文描述


### 备注
>更多返回请求码请看错误代码描述