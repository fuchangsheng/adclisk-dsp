　
# 获取广告主行业资质信息
---
### 简要描述：
>获取广告主行业资质信息

　　　　

### 请求地址：```/v3/settings/account/qinfo/view```

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
        categories:1,
        subcategories:20,
        qualification:"资质文件url",
        qualification_type:资质类型,
        qualification_name:"资质名称",
        qualification_number:"资质编号",
        valid_date_begin:"2017-10-12",
        valid_date_end:"2027-10-12",
        audit_status:"审核中",
        audit_message:"",
        site_name:"网站名",
        site_url:"网址"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|varchar|广告主id
categories|int|广告主行业分类
subcategories|int|广告主行业子分类
audit_status|String|行业审核状态
audit_message|String|行业审核失败的消息
qualification|varchar|广告主行业资质url
qulification_type|int|资质类型
qualification_name|String|资质名称
qualification_number|String|资质编号
valid_date_begin|String|资质有效期
valid_date_end|String|资质有效期
site_name|varchar|网站名称
site_url|varchar|网页地址
　

### 备注
>更多返回请求码请看错误代码描述