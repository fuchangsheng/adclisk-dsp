
# 查看广告单元信息
---
### 简要描述：
> 查看广告单元信息
> 数据库

### 请求地址：```/v3/ads/unit/view```

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
        "unit_id":int 单元id
        "unit_name":String	单元名称
        "bid":int	出价
        "bid_type":int	出价方式0-CPM,1-CPC,2-CPD,3-CPT
        "adview_type":int	渠道类型0-web，1-wap，2-app
        "unit_status":int	0-启动，1-未启动，2-暂停
        "create_time":string	创建时间
        "update_time":string	更新时间
    }
}
```

总请求，点击等需要计算
### 备注
>具体的返回码见错误代码描述
