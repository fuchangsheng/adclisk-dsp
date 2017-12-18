
# 按条件获取广告单元列表
---
### 简要描述：
> 按条件获取广告单元列表
> 有哪些条件，需要返回什么数据
> plans，units，ideas

### 请求地址：```/v3/ads/unit/summary```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|index|是|BigInt|页面索引，start from 0
|count|是|BigInt|每页项目数，默认为10
|sort|否|String|optional, 创建时间增序, 创建时间减序，更新时间减序
|options|否|String|各种条件选项

### 返回示例
```
{
    "code": 0,
    "message": "",
    "list_size":"int",
    "total_size":"int"
    "data": {
        list [
           {   
                "plan_id":int
                "plan_name":string   
                "unit_id":int	单元id
                "user_id":int	广告主id
                "plan_id"int	计划id
                "unit_name":string  单元名称
                "bid":int	出价
                "bid_type":int  出价方式0-CPM,1-CPC,2-CPD,3-CPT
                "adview_type":int	渠道类型0-web，1-wap，2-app
                "unit_status":int	0-启动，1-未启动，2-暂停
                "create_time":string	创建时间
                "update_time":string	更新时间
            }
        ]
    }
}
```

### 备注
>具体的返回码见错误代码描述

　
　
　