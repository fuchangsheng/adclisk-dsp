　
# 删除协作者
---
### 简要描述：
>删除协作者

　　　　

### 请求地址：```/v3/settings/system/operator/del```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
target_oper_id|是|String|要删除的协作者id

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        target_oper_id: "deleted_operator_id"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
target_oper_id|string|删除的协作者id


### 备注
>更多返回请求码请看错误代码描述