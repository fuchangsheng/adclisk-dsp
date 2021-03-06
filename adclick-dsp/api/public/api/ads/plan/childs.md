
# 获取某个广告计划下面的广告单元和广告创意
---
### 简要描述：
> 获取某个广告计划下面的所有广告单元和广告创意
> 用于复制广告计划
> dsp_adlib:plans units ideas

### 请求地址：```/v3/ads/plan/childs```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
user_id|是|int|用户id
|plan_id|是|BigInt|计划id
|unit_index|是|int|单元页面索引
|unit_count|是|int|每页条数

*不提供创意索引方式，请求时列出所有创意* 

### 返回示例
```
{
    "code": 0,
    "message": "",
    "unit_size":"int",广告单元个数
    "total_unit_size":"int",广告单元总个数
    "data":{
        unit_list:[
            {   
                "unit_id":"int", 广告单元id
                "unit_name":"string", 广告单元名称
                "bid":"int", 出价
                "bid_type":"int", 出价方式：0-CPM，1-CPC，2-CPD，3-CPT
                "adview_type"："int", 渠道类型：0-web，1-wap，2-app
                "unit_status":"int", 0-启动，1-未启动，2-暂停
                "create_time":"string", 创建时间
                "update_time":"string", 更新时间
                "idea_size":"string", 该广告单元下当前获取的广告创意个数
                "idea_total_size":"string", 该广告单元下总广告创意个数
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
        ]
    }
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　