
# 查看广告单元定向信息
---
### 简要描述：
> 查看广告单元定向信息
> unit_targeting

### 请求地址：```/v3/ads/unit/target_setting_view```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|unit_id|是|Int|单元id

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        list:[
            {
            "unit_id":"int",单元id
            "type":"int",定向类型
            "content":"String",定向内容
            "create_time":"String",计划开始时间
            "update_time":"String",计划结束时间
            "status":"int",定向状态0-启用
            }，
        ],
    }
}
```

### 备注
>具体的返回码见错误代码描述
