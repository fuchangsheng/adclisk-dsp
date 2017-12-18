　
# 新建素材
---
### 简要描述：
> 上传素材文件到文件接口后，会返回文件url，拿url调用本创建素材接口

　　　　

### 请求地址：```/v3/utils/assets/add```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
asset_name|是|String|素材名称
url|是|String|素材地址
width|是|int|宽
height|是|int|高
duration|否|int|视频素材时长
asset_type|是|String|素材类型
asset_tag|否|String|素材标签


　

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