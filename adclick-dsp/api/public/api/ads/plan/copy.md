
# 复制
---
### 简要描述：
> 复制广告计划
> 前端采用复制plan+编辑方式
> 前端请求要复制的plan_id，返回新的plan_id，若有保存，前端调用编辑接口

> dsp_adlib:plans

### 请求地址：```/v3/ads/plan/copy```

### 请求方式：POST

### 格式： x-www-form-urlencoded

### 参数列表

|参数名 | 必选 | 数据类型 | 说明|
|:---   | :--: | :------: | :---|
plan_id_src|是|Int|源广告计划id

### 返回示例
```
{
    "code": 0,
    "message": "",
    "plan_id":"int",新plan_id
}
```
### 备注
>具体的返回码见错误代码描述

　
　
　