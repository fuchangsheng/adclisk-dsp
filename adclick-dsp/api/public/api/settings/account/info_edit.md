　
# 编辑广告主信息
---
### 简要描述：
> 编辑广告主信息接口,如果要修改营业执照，需要先调用上传营业执照接口，拿到url后再调用本接口

　　　　

### 请求地址：```/v3/settings/account/info/edit```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 edit_user_name|否|String|新的广告主名
 company_name|否|String|新的公司名
 company_license|否|String|营业执照URL
 license_number|否|String|营业执照编号
 license_valid_date_begin|否|String|营业执照有效期
 license_valid_date_end|否|String|营业执照有效期
 qualification_type|否|int|行业资质类型
 address|否|String|公司地址
 telephone|否|String|公司联系电话
 contacts_name|否|String|联系人名字
 contacts_mobile|否|String|联系人电话
 contacts_email|否|String|联系人邮箱

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:'user_id',
        user_name:"user_name"//if user_name changed
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|String|广告主id
user_name|String|新的广告主名,如果发生了修改,否则无此字段
　

### 备注
>更多返回请求码请看错误代码描述