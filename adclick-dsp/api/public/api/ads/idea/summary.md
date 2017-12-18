
# 按条件获取广告创意列表
---
### 简要描述：
> 按条件获取广告创意列表
> 有哪些条件，需要返回什么数据
> plans，units，ideas

### 请求地址：```/v3/ads/idea/summary```

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
                "idea_id":int
                "user_id":int	广告主id
                "plan_id":int	计划id
                "unit_id":int	单元id
                "idea_name":string	创意名称
                "idea_slots":string	创意可投放的广告位类型
                "idea_type":int	创意类型，见AdConstants.IDEATYPE
                "landing_page":string	落地页
                "assets	text":	素材信息
                "adview_type":int	渠道类型0-web，1-wap，2-app
                "idea_trade":string	创意行业
                "idea_status":int	创意状态，0-启动，1-未启动，2-暂停
                "imp_monitor_urls":string	展现监控地址，空格分隔
                "click_monitor_urls":string	点击监控地址，空格分隔
                "signature":string	签名
                "audit_status":int	审核状态，0-审核通过，1-审核中，2-审核失败
                "failure_message":string	审核失败的消息
                "create_time":string	创建时间
                "update_time":string	更新时间
            }
        ]
    }
}
```

### 备注
>具体的返回码见错误代码描述

　
　
　


