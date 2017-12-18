# 获取操作日志
---
### 简要描述：
获取账户活动记录

### 请求地址：```/v3/records/operate-log```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

参数名 | 必选 | 数据类型 | 说明
:---   | :--: | :------: | :---
start_time|yes|YYYY-MM-DD HH:mm:ss|开始时间
end_time|yes|YYYY-MM-DD HH:mm:ss|结束时间
type|no|String|活动记录类型,例如账户、广告计划**ADCONSTANTS.AUDITTYPE**
origin|no|String|发起人,填操作员名字，不传返回全部
index|no|int|页码，从0开始
count|no|int|每页数量



### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total：120,
        size：10,
        list：[
            {
                action:活动,
                result:活动详情,
                obj:活动对象,
                origin:发起人,
                create_temi:时间
                },
            ...
        ]
    }
}
```
### 返回参数说明
见返回示例


### 备注
>具体的返回码见错误代码描述

　
　
　