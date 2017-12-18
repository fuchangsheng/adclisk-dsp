
# 创建广告单元
---
### 简要描述：
> 创建广告单元
> dsp_adlib:units

### 请求地址：```/v3/ads/unit/add```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|plan_id|是|String|计划id
|unit_name|是|String|单元名称
|bid|是|int|出价
|bid_type|是|int	出价方式0-CPM,1-CPC,2-CPD,3-CPT
|adview_type|是|int	渠道类型0-web，1-wap，2-app
|create_time|是|string 创建时间 (??前端传输还是自己生成)
|?? imp/click
### 返回示例
```
{
    "code": 0,
    "message": "",
    "unit_id":int
}
```

### 备注
>具体的返回码见错误代码描述

　
　
　