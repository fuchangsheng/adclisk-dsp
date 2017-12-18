　
# 编辑广告主行业资质信息
---
### 简要描述：
>编辑广告主行业资质信息,如果要修改资质文件需要先调用资质文件上传接口，获取到url再来修改

　　　　

### 请求地址：```/v3/settings/account/qinfo/edit```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
categories|否|string|行业分类  
subcategories|否|string|子行业分类
site_name|否|String|网站名称
site_url|否|String|网址
qualification|否|String|资质文件url
qualification_name|否|String|资质文件
qualification_number|否|String|资质编号
valid_date_begin|否|date|资质有效期  
valid_date_end|否|date|资质有效期  

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        user_id:"user_id"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
user_id|varchar|广告主id
　

### 备注
>更多返回请求码请看错误代码描述