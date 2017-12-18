　
# 验证码请求接口
---
### 简要描述：
>进行登录时，获取图片验证码的token，token用于下载验证码图片

- 如果post不带参数，则返回验证码图片的token
- 如果post携带参数token(上一次图片token)，则会删除掉上一次图片验证码，返回一个新的token
　　

　　　　

### 请求地址：```/v3/captha/request```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 token|否|String|可以填写上一次的请求码，用于刷新验证码
　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        "token": "token to download img"
    }
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
data.token|String|图片验证码token
　

### 备注
>更多返回请求码请看错误代码描述