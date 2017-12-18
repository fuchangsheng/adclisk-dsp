<template>
<div class="invoice">
	<!--operation_log list -->
	<div class="_mt29">
	<div></div>
	<div></div>
	<div class="caption">
	    操作日志
	    <div class="fr">
            <button type = "button"  class = "ad-btn ad-btn-primary" @click = "loadOperationLogList()">搜索</button>
        </div>
        <div class="fr">
            <div class="date">
             <DatePicker v-model="start_time" type="datetime"   placement="bottom-end" placeholder="开始日期"></DatePicker>
            </div>
            <span>至</span>
            <div class="date">
                <DatePicker v-model="end_time" type="datetime"  placement="bottom-end" placeholder="结束日期"></DatePicker>
            </div>
        </div>
	    <div class="fr">
	        <select class="ad-form-control" v-model="origin" >
	            <option value="">选择发起人</option>
                <option v-for = "item in origin_list" :value="item">
                {{item.name}}
                </option>
	        </select>
	    </div>
	    <div class="fr">
	        <select class="ad-form-control" v-model="type" >
                <option value="">选择活动类型</option>
                <option v-for = "item in type_list" :value="item">
                {{item.name}}
                </option>
            </select>
        </div>
	</div>
	<div class="content">
	    <table class="table" v-cloak>
	        <thead>
	            <tr>
	            <th>操作时间</th>
	            <th>发起人</th>
	            <th>对象</th>
	            <th>活动</th>
	            <th>活动详情</th>
	        </tr>
	        </thead> 
	        <tbody>
	            <tr v-for="(operation_log,index) in operation_log_list">
	            <td>{{operation_log.create_time}}</td>
	            <td>{{operation_log.origin}}</td>
	            <td>{{operation_log.obj}}</td>
	            <td>{{operation_log.action}}</td>
	            <td>{{operation_log.result}}</td>
	        </tr>
	        </tbody>
	        <tfoot v-if = "operation_log_list_msg">
	            <tr><td colspan="7" class="no-data">{{operation_log_list_msg}}</td></tr>
	        </tfoot>
	    </table>
	</div>
	<page v-on:on-change="changeOperationLogList" v-bind = "operation_log_list_option" v-if="operation_log_list_option.total != 0"></page>
	</div>
</div>
</template>

<script>
import Page from '../global/Page'
import {SERVERCONF,getErrMsg,AUDITTYPE} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import {isMobile,isEmail,isPassword} from '@/public/tools'
import {stringLoadFail} from '@/public/component'
import {todayStartTime,currentTime} from '@/public/time'
export default{
    name : 'operation_log',
    data(){
        return{
            start_time : '',
            end_time : '',
            origin_list : {},
            origin : '',
            operation_log_list : {},
            operation_log_list_option : {
                index: 1,
                range: 10,
                total: 0    
            },
            operation_log_list_msg : '',
            operation_log_list_count : 10,
            type : '',
            type_list : AUDITTYPE,
        }
    },
    components:{
        Page
    },
    mounted(){
        this.$nextTick(function(){
            this.start_time = todayStartTime();
            this.end_time = currentTime();
            this.loadTeamWorkerList();
            this.loadOperationLogList();
        });
    },
    methods:{
        loadTeamWorkerList(){
            let audit_status = '审核通过';
            let param = {
                sinterface: SERVERCONF.TEAMWORKER.LIST,
                data: {
                    audit_status: audit_status,
                }
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                let origin_list = res.list;
                if(res.size == 0){
                    _self.origin = '';
                }
                _self.origin_list = origin_list;
                console.log(AUDITTYPE);
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable:true
                });
            });
        },
        loadOperationLogList(){
            let type = this.type.name;
            let origin = this.origin.name;
            let index =this.operation_log_list_option.index - 1;
            let count = this.operation_log_list_count;
            let start_time = this.start_time==''?todayStartTime():this.start_time;
            let end_time = this.end_time==''?currentTime():this.end_time;
            let param = {
                sinterface: SERVERCONF.OPEARTION.OPERATELOG,
                data: {
                    start_time : start_time,
                    end_time : end_time,
                    index : index,
                    count : count,
                }
            };
            if(type!=null&&type!=""){
                param.data.type = type;
            }
            if(origin!=null&&origin!=""){
                param.data.origin = origin;
            }
            let _self = this;
            this.operation_log_list_msg = '';
            ajaxCallPromise(param).then(res => {
                if(res.size == 0){
                    _self.operation_log_list_msg = "没有数据";
                }
                _self.operation_log_list = res.list;
                _self.operation_log_list_option.total = Math.ceil(res.total / _self.operation_log_list_count);
            }).catch(err => {
                _self.operation_log_list_msg = stringLoadFail(err.msg);
            });
            
        },
        changeOperationLogList(page){
            this.operation_log_list_option.index = page;
            this.loadOperationLogList();
        },  
    },
}
</script>
<style>
.invoice-nav {
    padding-left: 3.65%; 
    font-size: 18px;
    border-bottom: 1px solid #cccccc;
    background-color: #fff;
}
.invoice-nav li{
    float: left;
}

.invoice-nav ul>li>a{
    display: inline-block;
    font-weight: bold; 
    line-height: 50px;
    width: 114px;
    color: #4b4f56;
    /* padding: 10px 0; */
    border-bottom: 6px solid transparent;
    text-align: center;
}


.invoice-nav ul>li>a.selected{
    border-bottom: 6px solid #3a72bf;
}

.invoice{
    width: 92.7%;
    max-width: 1780px;
    min-width: 928px;
    margin: 29px auto;
}

._mt29{
    margin-top: 29px;
}

.c_red{
    color: #f00;
    font-size: 16px;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;
}
/*
 * select{ text-transform: none; text-decoration: none; }
 */
	._inline50{
    display: inline-block;
    width: 45%;
    vertical-align: top;
    padding-top: 40px;
    padding-bottom: 40px;
}
.invoice .sp{
    display: inline-block;
    width: 20px;
}
.invoice form ._inline50:nth-child(1){
    padding-left: 12%;
}
.invoice form ._inline50:nth-child(2){
     padding-left: 8%;
}
._inline50 ._br{
    border-right: 1px solid #ccc;
}
._inline50 ._br .form-item:last-child{
    padding-left: 82px;
}
.invoice .form-item{
    line-height: 1.42857143;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 24px;
}
.invoice .form-item label{
    text-align: right;
    display: inline-block;
    padding-right: 15px;
    width: 88px;
}

.invoice .form-item input[type=radio]{
    margin-right: 5px;
    vertical-align: middle;
}
.invoice .form-item .ad-form-control{
    width: 254px;
    margin-right: 15px;
}
.invoice .content{
    background-color: #fff;
    margin-top: 0;
}
._money{
    font-size: 20px;
    font-weight: bold;
    color: #ed2f2f;
}
.im-notice{
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: #838b97;
    
}
.date{
    display: inline-block;
    font-size: 14px;
    color: #4b4f56;
}
</style>