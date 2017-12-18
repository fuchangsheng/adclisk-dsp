　
# 编辑素材名称
---
### 简要描述：
> 编辑素材，暂时只允许更改素材名称

　　　　

### 请求地址：```/v3/utils/assets/edit```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 asset_id|是|String|素材id
 asset_name|是|String|素材名称


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        asset_id:"素材id"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
asset_id|String|素材id
　

### 备注
>更多返回请求码请看错误代码描述