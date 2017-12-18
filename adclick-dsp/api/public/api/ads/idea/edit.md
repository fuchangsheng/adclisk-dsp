
# 编辑广告创意
---
### 简要描述：
> 编辑广告创意
> dsp_adlib:ideas

### 请求地址：```/v3/ads/idea/edit```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|

# 创建广告创意
---
### 简要描述：
> 创建广告创意
> dsp_adlib:ideas

### 请求地址：```/v3/ads/idea/add```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|unit_id|是|String|单元id
idea_id|是|int|
idea_name|是|string
idea_slots|是|array[String]|横幅-固定型，开屏，插屏，视频，信息流，横幅-悬浮型
idea_type|是|String|图片，flash，视频，原生，文字，图文
landing_page|是|String
assets|是|String
adview_type|是|string|WEB, WAP, APP
idea_trade|是|string
imp_monitor_urls|是|array[string]
click_monitor_urls|是|array[string]
### 返回示例
```
{
    "code": 0,
    "message": "",
    "status":int
}
```

### 备注
>具体的返回码见错误代码描述


　
　
　