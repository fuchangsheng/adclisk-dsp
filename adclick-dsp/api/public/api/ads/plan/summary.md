
# 按条件获取广告计划列表
---
### 简要描述：
> 按条件获取广告计划列表
> 有哪些条件，需要返回什么数据
> plans，units，ideas

### 请求地址：```/v3/ads/plan/summary```

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
                "plan_id":"int",计划id
                "plan_name":"String",计划名称
                "start_time":"String",计划开始时间
                "end_time":"String",计划结束时间
                "budget":"int",广告投放预算
                "plan_status":"String"(投放状态：投放中，未启动，暂停)，
                "plan_cycle":"String",广告推广时段
                "update_time":"String",更新时间
                "create_time":"String"创建时间
            }
        ]
    }
}
```

### 备注
>具体的返回码见错误代码描述

　
　
　