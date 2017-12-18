# 数据导出接口
---
### 简要描述：
> 数据导出接口
> 输入起始时间，时间粒度，要获取的数据类型；
> 输出文件名，文件名对应的文件内含有
> 该时间段内广告主投放的广告的统计数据（请求，展示，点击次数，点击率等）,
> 数据按时间粒度分类，统计请求中包含类型的数据
> dsp_palo:dsp_daily_info

### 请求地址：```/v3/ads/summary/download```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
|user_id|是|BidInt|广告主id
|begin_date|是|String|统计开始时间（YYYY-MM-DD HH:mm:ss）|
|end_time|是|String|统计结束时间（YYYY-MM-DD HH:mm:ss），统计结果包含结束时间|
|unit|是|String|当前可选项：小时，天，月；分别按小时，天，月份为粒度拉取数据
|data_type|是|String|逗号分隔的字符串，当前可选项：所有（返回所有项目），请求，竞价， 展现，点击，点击率，单次点击花费，千次展现花费，花费，激活，单次激活花费


### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "filename": "http://dsp.adclick.com.cn:6190/2017-06-23-2017-07-25.csv"
    }
}
```
### 返回参数说明
见返回示例


### 备注
>具体的返回码见错误代码描述

　
　
　