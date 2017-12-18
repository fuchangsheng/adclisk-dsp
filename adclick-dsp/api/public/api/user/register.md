　
# 用户注册接口
---
### 简要描述：
>用户注册接口，新用户注册
　　

　　　　

### 请求地址：```/v3/user/regist```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
  name  | 是   | String |主账号用户名，全局唯一
  company_name|是|String|广告主对应的公司名
  mobile|是|String|手机号
  smscode|是|String|短信验证码
  password|是|String|SHA1加密后的密码
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "user_id": "string"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
data.user_id|String|广告主id
　

### 备注
>更多返回请求码请看错误代码描述

　
　
　
