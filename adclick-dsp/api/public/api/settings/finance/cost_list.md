　
# 获取每日消费记录
---
### 简要描述：
>获取本账户的每日消费记录

　　　　

### 请求地址：```/v3/settings/finance/cost/list```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
start_time|否|YYYY-MM-DD HH:mm:ss|开始时间
end_time|否|YYYY-MM-DD HH:mm:ss|截止时间
index|否|int|页码
count|否|int|每页数量
order|否|string|排序方式

　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total:100,
        size: 8,
        list: [
           {    
                user_id:'id',            
                user_name: 'dmtec',
                cost:1000,
                imp:2000,
                click:3000
            },
            ... 
        ]
    }
}

```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
total|int|总记录数量
size|int|本次请求返回数量
date|datetime|消费日期
imp|int|展现量
click|int|点击量
cost|String|花费，单位元


### 备注
>更多返回请求码请看错误代码描述