　
# 增加协作者
---
### 简要描述：
>增加协作者

　　　　

### 请求地址：```/v3/settings/system/operator/add```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
name|是|string|协作者名称
password|是|String|密码
edit_role|是|String|要添加的协作者的角色名
email|是|String|邮件
mobile|是|String|电话

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        oper_id: "new_operator_id",
        audit_status: "审核中"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
oper_id|string|新增的协作者id
audit_status|string|审核状态的中文描述


### 备注
>更多返回请求码请看错误代码描述