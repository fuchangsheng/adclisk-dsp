　
# 上传flash素材
---
### 简要描述：
>上传flash素材接口

　　　　

### 请求地址：```/v3/utils/assets/flash```

### 请求方式：POST

### 格式 ：multipart-form
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 upload-file|是|File|素材文件


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "file": "/idea/flash/53ffe2b8be115843/2017-05-15/c8621910f.flash"
    "url":"http://dsp.adclick.com.cn/idea/flash/53ffe2b8be115843/2017-05-15/c8621910f.flash"
}
```
　

### 返回参数说明

参数名 | 类型 | 说明
:---   |:---: |:---
code | int | 请求码，请求成功则code=0
message | String | 错误消息，请求成功则消息为空
file|String|文件路径
url|String|完整文件路径
　

### 备注
>更多返回请求码请看错误代码描述