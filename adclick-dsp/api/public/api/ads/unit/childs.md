
# 获取某个广告单元下面的广告创意
---
### 简要描述：
> 获取某个广告计划下面的所有广告创意
> dsp_adlib: units ideas

### 请求地址：```/v3/ads/unit/childs```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BigInt|用户id
|index|是|int|页面索引
|count|是|int|每页条数

### 返回示例
```
{
    "code": 0,
    "message": "",
    "size":"int",广告创意list中元素个数
    "total_size":"int",广告创意总个数
    "data":{
            idea_list:[
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

　
　
　