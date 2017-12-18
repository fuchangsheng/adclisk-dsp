　
# 获取发票列表
---
### 简要描述：
>获取本账户的发票列表

　　　　

### 请求地址：```/v3/settings/finance/invoice/list```

### 请求方式：GET

### 格式 ：x-www-form-urlencoded
　

### 参数列表

参数名 | 必选 | 数据类型 | 说明 
:------ | :----:| :--------: |:---- 
index|否|int|页码
count|否|int|每页数量
sort|否|int|排序方式

　

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
            id: 'invocie_oper_id',
            date:'2017-12-15 13:25:56'
            title: '上海数凹文化传媒有限公司',
            type: "增值税专票",
            amount:10000,
            item:"广告费",
            status:"已开票"
            operator:"操作员账户名",
            message:",
            notes:''
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
id|string|发票记录id
date|datetime|开票时间
title|varchar|发票抬头
type|string|发票类型
amount|string|开票金额
item|string|开票项目
stauts|string|发票的状态
operator|string|操作员账户名
message|string|拒绝开票的理由
notes|string|备用

### 备注
>更多返回请求码请看错误代码描述