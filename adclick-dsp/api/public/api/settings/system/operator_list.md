　
# 获取协作者列表
---
### 简要描述：
>获取协作者列表

　　　　

### 请求地址：```/v3/settings/system/operator/list```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
index|是|int|页码
count|是|int|每页条数
audit_status|是|String|'审核中'或者'审核通过'
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total:120,
        size:8,
        list:[
            {
                oper_id:'oper_id',
                user_id:'user_id',
                portrait:'portrait',
                role:2,
                name:'张三',
                mobile:'15527984556',
                email:'1026561323@qq.com',
                audit_status:'审核中'
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
total|int|记录总数
size|int|本次请求返回数
user_id|String|协作者所属广告主id
oper_id|string|协作者id
portrait|String|头像url
role|int|角色种类
name|String|协作者姓名
mobile|String|电话
email|String|邮箱
audit_status|string|审核状态的中文描述


### 备注
>更多返回请求码请看错误代码描述