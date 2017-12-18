
# 查看广告计划信息
---
### 简要描述：
> 查看广告计划信息
> 数据库

### 请求地址：```/v3/ads/plan/view```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|plan_id|是|Int|计划id

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
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
}
```

总请求，点击等需要计算
### 备注
>具体的返回码见错误代码描述
