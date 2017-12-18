　
# 获取广告主信息
---
### 简要描述：
>获取广告主信息

　　　　

### 请求地址：```/v3/settings/account/info/view```

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
        user_name:"user_name",
        company_name:"company_name",
        company_license:"营业执照url",
        license_number:"营业执照号码",
        license_valid_date_begin:"2017-10-15",
        license_valid_date_end:"2027-10-15",
        telephone:"021-68580710",
        address:"居里路123号",
        contacts_name:"zhangsan",
        contacts_mobile:"15527941456",
        contacts_eamil:"con@dmtec.cn",
        rbalance:"实际账户余额",
        vbalance:"虚拟账户余额",
        user_audit_status:"审核中",
        user_audit_message:"",
        categories:1,
        subcategories:20,
        qualification:"资质文件url",
        qualification_type:资质类型,
        categories_audit_status:"审核通过",
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
user_name|varchar|用户名
company_name|varchar|广告主公司名
company_license|varchar|广告主公司营业执照
license_number|varchar|营业执照编号
license_valid_date_begin|datetime|营业执照有效期开始
license_valid_date_end|datetime|营业执照有效期结束
address|varchar|公司地址
telephone|varchar|公司联系电话
contacts_name|varchar|联系人姓名
contacts_mobile|varchar|联系人电话
contacts_email|varchar|联系人邮箱
rbalance|bigint|实际账户
vbalance|bigint|虚拟账户
user_audit_status|int|广告主审核状态 0-通过，1-未审核，2审核中，3-审核失败
user_audit_message|varchar|审核失败原因
categories|int|广告主行业分类
subcategories|int|广告主行业子分类
categories_audit_status|int|行业审核状态
qualification|varchar|广告主行业资质url
qulification_type|int|资质类型
site_name|varchar|网站名称
site_url|varchar|网页地址
　

### 备注
>更多返回请求码请看错误代码描述