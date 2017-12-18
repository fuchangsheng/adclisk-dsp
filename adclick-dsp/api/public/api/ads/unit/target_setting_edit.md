
# 编辑广告单元定向信息
---
### 简要描述：
> 编辑广告单元定向信息
> unit_targeting

### 请求地址：```/v3/ads/unit/target_setting_edit```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|unit_id|是|Int|单元id
|list|是|list|定向单元list

### list参数列表

|type|是|Int|定向类型
|content|是|String|定向内容
|status|是|int|定向状态（另一个接口？）

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "res_status":"int"
    }
}
```

### 备注
>具体的返回码见错误代码描述
