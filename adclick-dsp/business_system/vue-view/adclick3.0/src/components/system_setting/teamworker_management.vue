<template>
    <div class="invoice">
        <!-- 添加协作者 -->
        <div class="_mt29">
            <div></div>
            <div></div>
            <div class="caption">协作者</div>
            <div class="content">
                <form v-model="teamworkerData">
                    <div class="_inline50">
                        <div class="_br">
                            <h2>添加协作者</h2>
                            <div class="form-item">
                                <label>协作者姓名</label>
                                <input class="ad-form-control" type="text" v-model="teamworkerData.name" >
                            </div>
                            <div class="form-item">
                                <label>协作者密码</label>
                                <input class="ad-form-control" type="text" v-model="teamworkerData.password">
                            </div>
                            <div class="form-item">
                                <label>协作者电话</label>
                                <input class="ad-form-control" type="text" v-model="teamworkerData.mobile">
                            </div>
                            <div class="form-item">
                                <label>协作者邮箱(选填)</label>
                                <input class="ad-form-control" type="text" v-model="teamworkerData.email">
                            </div>
                            <div class="form-item">
                                <label>协作者角色</label>
                                <input  type="radio"  v-model="teamworkerData.edit_role" value="管理员" ><span>管理员</span>
                                <span class="sp"></span>
                                <input  type="radio"  v-model="teamworkerData.edit_role" value="操作员" ><span>操作员</span>
                                <span class="sp"></span>
                                <input  type="radio"  v-model="teamworkerData.edit_role" value="观察员" ><span>观察员</span>
                                <span class="sp"></span>
                                <input  type="radio"  v-model="teamworkerData.edit_role" value="财务人员" ><span>财务人员</span>
                            </div>
                            <div v-if="can_teamworker_msg != ''">
                                <Alert type = "warning" show-icon>{{can_teamworker_msg}}</Alert>
                            </div>
                            <button class="ad-btn ad-btn-primary" type="button" @click="submitNewTeamWorkerForm" style="vertical-align: bottom;margin-bottom: 40px;">添加</button>
                        </div>                     
                    </div>   
                    <div class="_inline50">
                    <div>
                        <h2>添加协作者流程</h2>
                        <div class="form-item">
                            <label >管理员指定协作者账户密码及角色</label>
                        </div>
                        <div class="form-item">
                            <label >管理员在系统中对受邀请人进行授权或拒绝</label>
                        </div>
                        <div class="form-item">
                            <label>授权成功，受邀请人成为协助者，登录AdClick投放系统</label>
                        </div>
                        <div class="form-item">
                            <label>管理员可以删除已授权的协作者</label>
                        </div>
                    </div>
                    </div>
                </form>
            </div>     
        </div>
        
        <!--teamworker list -->
        <div class="_mt29">
        <div></div>
        <div></div>
        <div class="caption">
            协作者管理
            <div class="fr">
                <select class="ad-form-control" v-model="teamworker_list_audit_status" @change='loadTeamWorkerList()'>
                    <option value="0">审核中</option>
                    <option value="1">审核通过</option>
                </select>
            </div>
        </div>
        <div class="content">
            <table class="table" v-cloak>
                <thead>
                    <tr>
                    <th>编号</th>
                    <th>协作者姓名</th>
                    <th>协作者角色</th>
                    <th>审核状态</th>
                    <th>操作</th>
                </tr>
                </thead> 
                <tbody>
                    <tr v-for="(teamworker,index) in teamworker_list">
                    <td>{{index}}</td>
                    <td>{{teamworker.name}}</td>
                    <td>{{teamworker.role}}</td>
                    <td>{{teamworker.audit_status}}</td>
                    <td>
                        <a href="javascript:;" @click.prevent = "editTeamWorker(index)">编辑</a>
                        <a href="javascript:;" @click.prevent = "delTeamWorker(index)">删除</a>
                    </td>
                </tr>
                </tbody>
                <tfoot v-if = "teamworker_list_msg">
                    <tr><td colspan="7" class="no-data">{{teamworker_list_msg}}</td></tr>
                </tfoot>
            </table>
        </div>
        <page v-on:on-change="changeTeamWorkerList" v-bind = "teamworker_list_option" v-if="teamworker_list_option.total != 0" ></page>
    </div>
    
    <!-- 我的发票模态框 -->
    <Modal v-model="teamworkerModal" title="编辑协作者" :transfer = "false" @on-cancel="cancel" width="615">
        <Form :model="teamworkerModalData" :label-width="80">
            <Row>
                <Col span="12">
                    <FormItem  label="协作者姓名">
                        <input v-model.trim = "teamworkerModalData.name" class="ad-form-control" disabled></input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="协作者电话">
                <input type="text" v-model.trim = "teamworkerModalData.mobile" class="ad-form-control"></input>
            </FormItem>
            <FormItem label="协作者邮箱">
                <input type="text" v-model.trim = "teamworkerModalData.email" class="ad-form-control"></input>
            </FormItem>
            <Row>
                <Col span="24">
                    <FormItem label="*协作者角色">
                        <RadioGroup v-model="teamworkerModalData.role">
                            <Radio value="1" label="1"></Radio>
                            <Radio value="操作员" label="操作员"></Radio>
                            <Radio value="观察员" label="观察员"></Radio>
                            <Radio value="财务人员" label="财务人员"></Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <!-- alert提示 -->
        <div v-if="modal_can_teamworker_msg != ''">
            <Alert type = "warning" show-icon >{{modal_can_teamworker_msg}}</Alert>
        </div>
        <div slot = 'footer'>
            <button type = "button" class = "ad-btn ad-btn-default" @click.stop='cancel'>取消</button>
            <button type = "button"  class = "ad-btn ad-btn-primary" @click.stop = "ok()">确定</button>
        </div>
    </Modal>
    
    </div>
</template>
<script>
import Page from '../global/Page'
import {SERVERCONF,getErrMsg} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import {isMobile,isEmail,isPassword} from '@/public/tools'
import {stringLoadFail} from '@/public/component'
// const ck_status = ["通过", "提交中", "审查中", "审查失败"];
export default {
    name: 'teamworker_management',
    data(){
        return {
            teamworker_list: {},
            teamworker_list_option:{
                index: 1,
                range: 5,
                total: 0
            },
            teamworker_list_audit_status:0,
            teamworker_list_count: 5,
            teamworker_list_msg: '',
            // 新建协作者
            teamworkerData: {},
            can_teamworker_msg: '',
            // 弹窗
            teamworkerModal : false,
            teamworkerModalData : {},
            modal_can_teamworker_msg:''
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.loadTeamWorkerList();
        });
    },
    filters:{
        
    },
    components:{
        Page
    },
    methods:{
        // 添加协作者
        submitNewTeamWorkerForm(){
            let teamworkerData = this.teamworkerData;
            let name = teamworkerData.name;
            let password = teamworkerData.password;
            let edit_role = teamworkerData.role;
            let email =  teamworkerData.email;
            let mobile = teamworkerData.mobile;
            console.log(edit_role);
            if(!name){
                this.can_teamworker_msg = '还未填写用户名';
                return;
            }else if(!password||!isPassword(password)){
                this.can_teamworker_msg = '密码未填写或格式不正确';
                return;
            }else if(!edit_role){
                this.can_teamworker_msg = '还未选择协作者类型';
                return;
            }else if(!mobile||!isMobile(mobile)){
                this.can_teamworker_msg = '手机为填写或格式不正确';
                return;
            }else if(!mobile&&!isEmail(email)){
                this.can_teamworker_msg = '邮箱格式不正确';
                return;
            }

            let param = {
                    sinterface: SERVERCONF.TEAMWORKER.ADD,
                    data: {
                        name: name,
                        password: password,
                        edit_role: edit_role,
                        email: email,
                        mobile: mobile
                    }
                };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                    console.log(123);
                    _self.can_teamworker_msg='';
                    _self.loadTeamWorkerList();
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable:true
                });
            });
        },
        loadTeamWorkerList(){
            let audit_status = this.teamworker_list_audit_status == 0 ? '审核中' : '审核通过';
            let param = {
                sinterface: SERVERCONF.TEAMWORKER.LIST,
                data: {
                    index: this.teamworker_list_option.index - 1,
                    count: this.teamworker_list_count,
                    audit_status: audit_status,
                }
            };
            this.teamworker_list_msg = '';
            let _self = this;
            ajaxCallPromise(param).then(res => {
                let teamworker_list = res.list;
                if(res.size == 0){
                    _self.teamworker_list_msg = "没有数据";
                }
                _self.teamworker_list = teamworker_list;
                _self.teamworker_list_option.total = Math.ceil(res.total / _self.teamworker_list_count);
            }).catch(err => {
                _self.teamworker_list_msg = stringLoadFail(err.msg);
            });
        },  
        changeTeamWorkerList(page){
            this.teamworker_list_option.index = page;
            this.loadTeamWorkerList();
        },
        delTeamWorker(index){
            let target_oper_id = this.teamworker_list[index].oper_id;
            let param = {
                sinterface: SERVERCONF.TEAMWORKER.DEL,
                data: {
                    target_oper_id: target_oper_id,
                },
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                _self.loadTeamWorkerList();
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration:2,
                    closable: true
                });
            })
        },
        editTeamWorker(index){
            Object.assign(this.teamworkerModalData,this.teamworker_list[index]);
            this.teamworkerModal = true;
        },
        cancel(){
            this.teamworkerModal = false,
            this.teamworkerModalData = {},
            this.modal_can_teamworker_msg = ''
        },
        ok(){
            console.log(this.teamworkerModalData);
            let teamworkerModalData = this.teamworkerModalData;
            let target_oper_id = teamworkerModalData.oper_id;
            let edit_role = teamworkerModalData.edit_role;
            let email = teamworkerModalData.email;
            let mobile = teamworkerModalData.mobile;
            if(!edit_role){
                this.can_teamworker_msg = '还未选择协作者类型';
                return;
            }else if(!mobile||!isMobile(mobile)){
                this.can_teamworker_msg = '手机为填写或格式不正确';
                return;
            }else if(!mobile&&!isEmail(email)){
                this.can_teamworker_msg = '邮箱格式不正确';
                return;
            }
            let param = {
                    sinterface: SERVERCONF.TEAMWORKER.EDIT,
                    data: {
                        target_oper_id : target_oper_id,
                        edit_role : edit_role,
                        email : email,
                        mobile : mobile
                    }
                };
                let _self = this;
                ajaxCallPromise(param).then(res => {
                    _self.loadTeamWorkerList();
                    _self.teamworkerModal = false;
                }).catch(err => {
                    let msg = getErrMsg(err);
                    _self.$Message.error({
                        content: msg,
                        duration: 2,
                        closable: true
                    });
                });
        }
    }
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
</style>
