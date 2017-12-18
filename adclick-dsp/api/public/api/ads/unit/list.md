
# (??按条件)获取广告单元列表（包含投放数据）
---
### 简要描述：
> ?? 条件举例:按广告主,按广告计划,按广告单元出价,按单元名称,按出价方式,渠道类型,状态,创建时间,更新时间等
> dsp_adlib:units

### 请求地址：```/v3/ads/unit/list```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BigInt|用户id
|plan_id|是|BigInt|计划id
|index|是|int|单元页面索引
|count|是|int|每页数据条目
|sort|否|String|optional, 创建时间增序, 创建时间减序，更新时间减序

### 返回示例
```
{
    "code": 0,
    "message": "",
    "size":"int",广告单元个数
    "data":{
        unit_list:[
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

　
　
　


