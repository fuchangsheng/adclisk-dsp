<template>
<div class="style">

    <div class="msg">
        <div class="msg-heading">
            添加手机号码<span class="msg-dismiss">X</span>
        </div>
        <div class="msg-body">
            <div><label class="label">手机号码</label><input type="text"  maxlength="13"class="ad-form-control _wd1"></div>
            <div><label class="label">验证码</label><input type="text" maxlength="6" class="ad-form-control _wd2">
                <input type="button" class="ad-form-control _pr" value="获取验证码">
            </div>
        </div>
        <div class="msg-footer">
            <div class="inline fr clearfix">
                <input type="button" class="ad-btn ad-btn-default" value="取消">
                <input type="button" class="ad-btn ad-btn-primary" value="确认">
            </div>
        </div>
    </div>
    <!-- 删除广告计划 -->
    <div class="msg">
        <div class="msg-heading">
            删除广告计划<span class="msg-dismiss">X</span>
        </div>
        <div class="msg-body">
            确定要删除广告计划吗？此操作无法撤销
        </div>
        <div class="msg-footer">
            <div class="inline fr clearfix">
                <input type="button" class="ad-btn ad-btn-default" value="取消">
                <input type="button" class="ad-btn ad-btn-primary" value="确认">
            </div>
        </div>
    </div>
    <div>
        <span class="switch selected"></span><span class="switch"></span><span class="switch switch-sm"></span><span class="switch selected switch-sm"></span>
    </div>
    <div>
        <span class="mark mark-default"></span><span class="mark mark-info"></span><span class="mark mark-warning"></span><span class="mark mark-error"></span>
    </div>
</div>
</template>
<script>
export default {
    name: 'style'
}
</script>
<style scoped>
    .style{
        padding-left: 60px;
    }
    .label{
        display: inline-block;
        width: 60px;
        text-align: right;
        margin-right: 20px;
    }
    ._wd1{
        width: 266px;
    }
    ._wd2{
        width: 135px;
    }
    ._pr{
        margin-left: 31px;
        background: #ffa200;
        color: #ffffff;
        font-weight: bold;
    }
</style>