　
# 编辑消息接收配置
---
### 简要描述：
>编辑消息接收配置

　　　　

### 请求地址：```/v3/settings/system/msg-settings/edit```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
list|是|array|配置数组，格式见如下

```
list: [
        {
            id: 'msg_setting_id',
            categories: "系统消息",
            subcategories: "广告审核不通过""
            channel:"手机短信，邮件"    
        },
        {
            id: 'msg_setting_id',
            categories: "财务消息",
            subcategories: "账户消耗达到日限额""
            channel:"手机短信"    
        },
        ... 
]
```

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {}
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空


### 备注
>更多返回请求码请看错误代码描述