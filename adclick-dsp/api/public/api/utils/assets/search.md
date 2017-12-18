　
# 按名称搜索素材
---
### 简要描述：
>获取素材详情

　　　　

### 请求地址：```/v3/utils/assets/search```

### 请求方式：POST

### 格式 ：x-www-form-urlencoded
　

### 参数列表

 参数名 | 必选 | 数据类型 | 说明 
 :------ | :----:| :--------: |:---- 
 name_alike|是|String|可能素材名称
 index|否|int|第几页
 count|否|int|每页数量
 type|否|String|筛选素材类型


　

### 返回示例
```
{
    "code": 0,
    "message": "",
    "data": {
        total: 15,
        size:6,
        list: [
            {
                asset_id: "id"
                asset_name:"素材名称",
                url: "素材地址",
                thumbnail: "缩略图地址",
                width: 736,
                height: 208,
                duration: 0,//视频素材时长
                ratio；3.52,
                asset_type: 图片,
                asset_tag:"",
                update_time:"datetime"
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
total|int|满足条件的数量
size|int|本次请求返回数量
asset_id|String|素材id
asset_name|String|素材名称
url|String|素材地址
thumbnail|String|缩略图地址
width|int|宽
height|int|高
duration|int|视频素材时长
ratio|varchar|宽高之比
asset_type|String|素材类型
asset_tag|String|素材标签
update_time|String|创建/更新时间
　

### 备注
>更多返回请求码请看错误代码描述