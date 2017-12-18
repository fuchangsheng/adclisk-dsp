# 获取广告主数据接口
---
### 简要描述：
> 获取广告主数据接口
> 输入起止时间，输出该时间段内广告主投放的所有广告的统计数据（请求，展示，点击次数，点击率等）
> dsp_palo:dsp_daily_info

### 请求地址：```/v3/ads/summary/dailylist```

### 请求方式：GET

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|begin_date|是|String|统计开始时间（YYYY-MM-DD）|
|end_date|是|String|统计结束时间（YYYY-MM-DD），统计结果包含结束时间|（若要统计一天24小时数据，只需将end_time跟start_time设为同一天）
|index|否|String|页面索引（非必填）|
|count|否|String|页面数据条数（非必填）|


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "count":"int"，页面数据条数
        "item_total":"int"， 总共数据条数（包括未返回数据）
        "all_request": "int",所有广告请求
        "all_imp": "int",所有广告展示
        "all_click": "int",所有广告点击
        "all_download": "int",所有广告转换
        "all_bid": "int",所有广告竞价
        "all_cost": "float(5位精确小数)",所有广告总花费，单位：元
        "cpm_total": "float(5位精确小数)",总cpm
        "cpc_total": "float(5位精确小数)",总cpc
        "cpa_total": "float(5位精确小数)",总cpa
        "ctr_total": "float(5位精确小数)",总ctr
        list [
            {
                "date":"string(YYYY-MM-DD)",时间
                "imp": "int",当天展示量
                "cpm": "int",当天cpm
                "click":"int",当天点击量
                "ctr":"float",当天点击率
                "cpc":"int",当天cpc
                "action":"int",当天激活数
                "atr":"float",当天单次转化花费
                "cpa":"int",当天转化率
                "cost":"int"，当天花费
            }
        ]
    }
}
```
### 返回参数说明
见返回示例


### 备注
>具体的返回码见错误代码描述

　
　
　