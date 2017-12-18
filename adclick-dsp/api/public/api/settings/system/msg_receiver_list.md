　
# 获取消息接收人列表
---
### 简要描述：
>获取消息接收人列表

　　　　

### 请求地址：```/v3/settings/system/msg-receiver/list```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
type|否|string|接受消息类型,站内消息，手机短信，邮件

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        size: 3,
        list: [
           {
            id: 'msg_receiver_id',
            receiver: 15527941555,
            type:"手机短信",
            audit_status:"审核中"    
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
size|int|总记录数量
id|string|消息接受者id
receiver|String|type为手机短信或邮件时的联系方式
type|string|接受类型的中文描述
audit_status|string|审核状态的中文描述


### 备注
>更多返回请求码请看错误代码描述