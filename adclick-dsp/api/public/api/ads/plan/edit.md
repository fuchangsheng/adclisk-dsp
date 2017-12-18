
# 编辑广告计划
---
### 简要描述：
> 编辑广告计划
> dsp_adlib:plans

### 请求地址：```/v3/ads/plan/edit```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|plan_id|是|BigInt|计划id
|plan_name|是|String|计划名称
|start_time|是|String|开始时间
|end_time|是|String|结束时间
|budget|是|int|预算
|plan_circle|是|String|投放周期，42位
|plan_status|是|int|0-启动，1-未启动，2-暂停


### 返回示例
```
{
    "code": 0,
    "message": "",
    "status":"int" 成功：0，失败：-1
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　