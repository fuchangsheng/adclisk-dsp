
# 复制广告单元
---
### 简要描述：
> 复制广告计划
> 前端采用复制unit+编辑方式
> 前端请求要复制的unit_id，返回新的unit_id，若有保存，前端调用编辑接口

> dsp_adlib:units

### 请求地址：```/v3/ads/unit/copy```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
unit_id_src|是|Int|源广告单元id

### 返回示例
```
{
    "code": 0,
    "message": "",
    "unit_id":"int",新unit_id
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　