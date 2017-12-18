<template>
    <div class="invoice">
        <!-- 开票记录 -->
        <div>
            <div></div>
            <div class="caption">开票记录</div>
            <div class="content">
                <table class="table" v-cloak>
                    <thead>
                        <tr>
                        <th>开票日期</th>
                        <th>发票抬头</th>
                        <th>开票人</th>
                        <th>发票类型</th>
                        <th>金额</th>
                        <th>发票联系人</th>
                        <th>开票状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in invoice_records" >
                        <td>{{record.date}}</td>
                        <td>{{record.title}}</td>
                        <td>{{record.operator}}</td>
                        <td>{{record.type}}</td>
                        <td>￥{{record.amount}}</td>
                        <td>{{record.operator}}</td>
                        <template v-if = "record.status == '已发送'">
                            <td><span class="mark mark-primary"></span>{{record.status}}</td>
                            <td><button class="ad-btn ad-btn-primary" @click="sign(record.id)">签收</button></td>
                        </template>
                        <template v-else-if ="record.status == '提交中'">
                            <td><span class="mark mark-warning"></span>{{record.status}}</td>
                            <td>--</td>
                        </template>
                        <template v-else-if ="record.status == '已开票'">
                            <td><span class="mark mark-default"></span>{{record.status}}</td>
                            <td>--</td>
                        </template>
                        <template v-else-if ="record.status == '已签收'">
                            <td><span class="mark mark-info"></span>{{record.status}}</td>
                            <td>--</td>
                        </template>
                        <template v-else-if ="record.status == '完成'">
                            <td><span class="mark mark-default"></span>{{record.status}}</td>
                            <td>--</td>
                        </template>
                        <template v-else-if ="record.status == '开票拒绝'">
                            <td><span class="mark mark-error"></span>{{record.status}}</td>
                            <td>--</td>
                        </template>

                    </tr>
                    </tbody>
                    <tfoot v-if="invoice_records_msg">
                        <tr><td colspan="8" class="no-data">{{invoice_records_msg}}</td></tr>
                    </tfoot>
                </table>
            </div>
            <page v-bind="invoice_records_options" v-on:on-change="changeRecordsPage" v-if = "invoice_records_options.total != 0"></page>
        </div>
        
        <!-- 申请开票 -->
        <div class="_mt29">
            <div></div>
            <div></div>
            <div class="caption">申请开票</div>
            <div class="content">
                <form>
                    <div class="_inline50">
                        <div class="_br">
                            <h2>发票信息</h2>
                            <div class="form-item">
                                <label>选择发票</label>
                                <select class="ad-form-control" v-model = "can_invoice">
                                    <option value="">请选择</option>
                                    <option v-for = "item in can_invoice_list" :value="item">
                                        {{item.title}}
                                    </option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label>发票类型</label>
                                <input  type="radio" v-model = "can_invoice.type" value="增值税普票" disabled><span>增值税普票</span>
                                <span class="sp"></span>
                                <input  type="radio" v-model = "can_invoice.type" value="增值税专票" disabled><span>增值税专票</span>
                            </div>
                            <div class="form-item">
                                <label>选择项目</label>
                                <select class="ad-form-control" v-model="project">
                                    <option value="">请选择</option>
                                    <option v-for = "item in can_invoice_project" :value="item">{{item}}</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label>发票金额</label>
                                <input class="ad-form-control" type="text" v-model.trim="can_invoice_amount">元
                            </div>
                            <div class="form-item">
                                可开票金额<span class="c_red" v-text ="can_invoice_banlance"></span>元
                            </div>   
                        </div>                     
                    </div>   
                    <div class="_inline50">
                        <div>
                            <h2>联系人列表</h2>
                            <div class="form-item">
                                <label>联系人</label>
                                <span>{{can_invoice.receiver_name}}</span>
                            </div>
                            <div class="form-item">
                                <label>电子邮件</label>
                                <span>{{can_invoice.receiver_email}}</span>
                            </div>
                            <div class="form-item">
                                <label>联系电话</label>
                                <span>{{can_invoice.receiver_mobile}}</span>
                            </div>
                            <div class="form-item">
                                <label>联系地址</label>
                                <span>{{can_invoice.receiver_address}}</span>
                            </div>
                        </div>
                        <div v-if="can_invoice_msg != ''">
                            <Alert type = "warning" show-icon>{{can_invoice_msg}}</Alert>
                        </div>
                    </div>   
                    <button class="ad-btn ad-btn-primary" type="button" @click="submitNewInvoiceForm" style="vertical-align: bottom;margin-bottom: 40px;">申请开票</button>
                </form>
            </div>
                
        </div>
        
        <!-- 我的发票 -->
        <div class="_mt29">
            <div></div>
            <div></div>
            <div class="caption">
                我的发票
                <div class="fr">
                    <button type="button" class="ad-btn ad-btn-primary" @click="newInvoice">新建发票信息</button>
                </div>
            </div>
            <div class="content">
                <table class="table" v-cloak>
                    <thead>
                        <tr>
                        <th>发票抬头</th>
                        <th>税号</th>
                        <th>地址</th>
                        <th>联系人电话、姓名</th>
                        <th>开票状态</th>
                        <th>拒绝原因</th>
                        <th>操作</th>
                    </tr>
                    </thead> 
                    <tbody>
                        <tr v-for="(invoice,index) in my_invoice">
                        <td>{{invoice.title}}</td>
                        <td>{{invoice.tax_no}}</td>
                        <td>{{invoice.receiver_address}}</td>
                        <td>{{invoice.receiver_mobile}} {{invoice.receiver_name}}</td>
                        <td>{{invoice.audit_status}}</td>
                        <td>{{invoice.audit_message == null || invoice.audit_message == '' ?'--':invoice.audit_message}}</td>
                        <td>
                            <a href="javascript:;" @click.prevent = "editInvoice(index)">编辑</a>
                            <a href="javascript:;" @click.prevent = "delInvoice(index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot v-if = "my_invoice_msg">
                        <tr><td colspan="7" class="no-data">{{my_invoice_msg}}</td></tr>
                    </tfoot>
                </table>
            </div>
            <page v-on:on-change="changeMyInvoice" v-bind = "my_invoice_options" v-if="my_invoice_options.total != 0" ></page>
        </div>
        <!-- 我的发票模态框 -->
        <Modal v-model="invoiceModal" :title="modalType.title" :transfer = "false" @on-cancel="cancel" width="615">
            <Form :model="invoiceModalData" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="*发票类型">
                            <select v-model = "invoiceModalData.type" style="width:200px" class="ad-form-control" :disabled="modalType.type == 1">
                            <option value="增值税普票">增值税普票</option>
                            <option value="增值税专票">增值税专票</option>
                            </select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <span class="im-notice">发票类型一经创建，无法修改</span>
                    </Col>
                </Row>
                <FormItem  label="*发票抬头">
                    <input v-model.trim = "invoiceModalData.title" class="ad-form-control"></input>
                </FormItem>
                <FormItem label="公司地址">
                    <input type="text" v-model.trim = "invoiceModalData.address" class="ad-form-control"></input>
                </FormItem>
                <Row :gutter="16">
                    <Col span="12">
                        <FormItem label="税号">
                            <input type="text" v-model.trim = "invoiceModalData.tax_no" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="开户银行">
                            <input type="text" v-model.trim = "invoiceModalData.bank" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="16">
                    <Col span="12">
                        <FormItem label="银行卡卡号">
                            <input type="text" v-model.trim = "invoiceModalData.bank_account_no" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <div style="width:100%;height: 25px;">
                            <hr style="background-color:rgb(233, 234, 236);height: 1px;border: none;">
                        </div>
                    </Col>
                </Row>

                <FormItem label="*收票地址">
                    <input type="text" v-model.trim = "invoiceModalData.receiver_address" class="ad-form-control"></input>
                </FormItem>
                <Row :gutter="16">
                    <Col span="12">
                        <FormItem label="*收票姓名">
                            <input type="text" v-model.trim = "invoiceModalData.receiver_name" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="*收票邮箱">
                            <input type="text"  v-model.trim = "invoiceModalData.receiver_email" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="16">
                    <Col span ="12">
                        <FormItem label="*收票电话">
                            <input type="text" v-model.trim = "invoiceModalData.receiver_mobile" class="ad-form-control"></input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <!-- alert提示 -->
            <div v-if="modal_err_msg != ''">
                <Alert type = "warning" show-icon >{{modal_err_msg}}</Alert>
            </div>
            <div slot = 'footer'>
                <button type = "button" class = "ad-btn ad-btn-default" @click.stop='cancel'>取消</button>
                <button type = "button"  class = "ad-btn ad-btn-primary" @click.stop = "ok(modalType.type)">确定</button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Page from '../global/Page'
import {SERVERCONF,getErrMsg} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import {isMobile,isEmail,isMoney} from '@/public/tools'
import {stringLoadFail} from '@/public/component'
// const ck_status = ["通过", "提交中", "审查中", "审查失败"];
export default {
    name: 'invoice-management',
    data(){
        return {
            //开票记录
            invoice_records:[],
            invoice_records_count: 5,
            invoice_records_sort: 0,
            invoice_records_options:{
                index: 1,
                range: 5,
                total: 0
            },
            invoice_records_msg:'',
            //申请开票
            can_invoice_list: [],
            can_invoice: '',
            can_invoice_banlance: 0,//可开票金额
            can_invoice_project: ['广告费','广告服务费'],
            project: '',
            can_invoice_amount: '',//需要开票金额
            can_invoice_msg: '',
            //我的发票
            invoiceModalData:{},
            my_invoice_sort: 0,
            my_invoice_count: 5,
            my_invoice_options:{
                index:1,
                range:5,
                total: 0 
            },
            my_invoice_msg: '',
            //控制模态框
            my_invoice: [],
            modal_err_msg: '',
            modalLoading: true,
            invoiceModal: false,
            modalType:{
                title: '新建发票',
                type: 0 ,//0为新建 1为编辑
            }
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.loadInvoiceRecords();
            this.loadMyInvoiceList();
            this.loadCanInvoiceBanlance();
        });
    },
    filters:{
        // auditStatusFilter(val){
        //     return ck_status[val];
        // },
        invoiceBanlanceFilter(val){
            return val;
        },
    },
    components:{
        Page
    },
    methods:{
         //发票记录相关
        changeRecordsPage(page){
            this.invoice_records_options.index = page;
            this.loadInvoiceRecords();
        },
        loadInvoiceRecords(){
            let sort = this.invoice_records_sort == 0 ? '创建时间减序' : '创建时间增序';
            let param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICERECORDS,
                data: {
                    index: this.invoice_records_options.index - 1,
                    count: this.invoice_records_count,
                    sort: sort,
                }
            };
            this.invoice_records_msg = '';
            let _self = this;
            ajaxCallPromise(param).then(res => {
                let invoice_records_list = res.list;
                if(res.size == 0){
                    _self.invoice_records_msg = "没有数据";
                }
                _self.invoice_records = invoice_records_list;
                _self.invoice_records_options.total = Math.ceil(res.total / _self.invoice_records_count);
            }).catch(err => {
                _self.invoice_records_msg = stringLoadFail(err.msg);
            });
        },  
        sign(id){
            console.log('签收');
            console.log(id);
        },
        //我的发票相关
        changeMyInvoice(page){
            this.my_invoice_options.index = page;
            this.loadMyInvoiceList();
        },
        loadMyInvoiceList(){
            this.my_invoice_msg = '';
            let my_invoice_sort;
            if(this.my_invoice_sort == 0){
                my_invoice_sort = '更新时间减序';
            }else if(this.my_invoice_sort == 1){
                my_invoice_sort = '创建时间减序';
            }else{
                my_invoice_sort = '创建时间增序';
            }
            let param = {
                sinterface: SERVERCONF.USERS.INVOICELIST,
                data: {
                    index: this.my_invoice_options.index - 1,
                    count: this.my_invoice_count,
                    sort: my_invoice_sort,
                }
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                let my_invoice_list = res.list;
                if(res.size == 0){
                    _self.my_invoice_msg = '没有数据';
                }
                _self.my_invoice = my_invoice_list;
                _self.my_invoice_options.total = Math.ceil(res.total / _self.my_invoice_count);
                //获取哪些是可以进行开票的
                my_invoice_list.forEach(function(k){
                    if(k.audit_status == '审核通过'){
                        _self.can_invoice_list.push(k);
                    };
                });
            }).catch(err => {
                _self.my_invoice_msg = stringLoadFail(err.msg);
            })
        },
        newInvoice(){
            this.modalType.title = "新建发票";
            this.modalType.type = 0;
            //默认为普票
            this.invoiceModalData.type = '增值税普票';
            this.invoiceModal = true;

        },
        editInvoice(index){
            this.modalType.title = "编辑发票";
            this.modalType.type = 1;
            //这是浅复制，使用Object.assign进行伪深拷贝
            Object.assign(this.invoiceModalData,this.my_invoice[index]);
            this.invoiceModal = true;
        },
        delInvoice(index){
            let id = this.my_invoice[index].id;
            let param = {
                sinterface: SERVERCONF.USERS.INVOICEDEL,
                data: {
                    id: id,
                },
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                _self.loadMyInvoiceList();
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration:2,
                    closable: true
                });
            })
        },
        ok(action){
            console.log(this.invoiceModalData)
            let type = this.invoiceModalData.type;
            let title = this.invoiceModalData.title;
            let address = this.invoiceModalData.address;
            let tax_no = this.invoiceModalData.tax_no;
            let bank = this.invoiceModalData.bank;
            let bank_account_no = this.invoiceModalData.bank_account_no;
            let receiver_address = this.invoiceModalData.receiver_address;
            let receiver_name = this.invoiceModalData.receiver_name;
            let receiver_email = this.invoiceModalData.receiver_email;
            let receiver_mobile = this.invoiceModalData.receiver_mobile;
            if(!title || title == ''){
                this.modal_err_msg = '请输入发票抬头';
            } else if (type == '增值税专票' && (!tax_no || tax_no == '')){
                this.modal_err_msg = '增值税专票需要填写发票税号';
            } else if ((type == '增值税专票') && (!bank || bank == '')){
                this.modal_err_msg = '增值税专票需填写开户银行';
            } else if ((type == '增值税专票') && (!bank_account_no || bank_account_no == '')){
                this.modal_err_msg = '增值税专票需填写开户银行卡号';
            } else if (!receiver_name || receiver_name == ''){
                this.modal_err_msg = '请输入收票人姓名';
            } else if (!receiver_address || receiver_address == ''){
                this.modal_err_msg = '请输入收票人地址';
            } else if (!isEmail(receiver_email)){
                this.modal_err_msg = '请输入正确邮箱地址';
            } else if (!isMobile(receiver_mobile)){
                this.modal_err_msg = '请输入正确收票人电话';
            } else if (action == 0){
                //新建发票
                console.log("新建发票");
                let param = {
                    sinterface: SERVERCONF.USERS.INVOICEADD,
                    data: {
                        type: type,
                        title: title,
                        address: address,
                        tax_no: tax_no,
                        bank: bank,
                        bank_account_no: bank_account_no,
                        receiver_address: receiver_address,
                        receiver_email: receiver_email,
                        receiver_mobile: receiver_mobile,
                        receiver_name: receiver_name
                    }
                };
                let _self = this;
                ajaxCallPromise(param).then(res =>{
                    _self.loadMyInvoiceList();
                    _self.invoiceModal = false;
                }).catch(err =>{
                    let msg = getErrMsg(err);
                    _self.$Message.error({
                        content: msg,
                        duration: 2,
                        closable: true
                    });
                });
                
            }else if (action == 1){
                console.log("编辑发票");
                let id = this.invoiceModalData.id;
                //编辑发票
                let param = {
                    sinterface: SERVERCONF.USERS.INVOICEEDIT,
                    data: {
                        id: id,
                        title: title,
                        address: address !=''? address: undefined,
                        tax_no: tax_no !='' ? tax_no : undefined,
                        bank: bank != ''? bank : undefined,
                        bank_account_no: bank_account_no != ''? bank_account_no: undefined,
                        receiver_address: receiver_address,
                        receiver_email: receiver_email,
                        receiver_mobile: receiver_mobile,
                        receiver_name: receiver_name
                    }
                };
                let _self = this;
                ajaxCallPromise(param).then(res => {
                    _self.loadMyInvoiceList();
                    _self.invoiceModal = false;
                }).catch(err => {
                    let msg = getErrMsg(err);
                    _self.$Message.error({
                        content: msg,
                        duration: 2,
                        closable: true
                    });
                });
                console.log(this.invoiceModalData.id);
            }          
        },
        cancel(){
            //清空数据
            this.invoiceModalData = {};
            this.modal_err_msg = '';
            this.invoiceModal = false;
        },
        //申请发票相关
        submitNewInvoiceForm(){
            let can_invoice_list = this.can_invoice_list;
            let can_invoice = this.can_invoice;
            let project = this.project;
            let can_invoice_amount = this.can_invoice_amount;
            if (can_invoice_list.length == 0){
                this.can_invoice_msg = '还没有审核通过的发票';
                return;
            } else if(!can_invoice){
                this.can_invoice_msg = '还未选择发票';
                return;
            } else if (!project){
                this.can_invoice_msg = '还未选择开票项目';
                return;
            } else if(!can_invoice_amount){
                this.can_invoice_msg = '还未输入开票金额';
                return;
            } else if (can_invoice_amount == '0'){
                this.can_invoice_msg = '发票金额不能为0元';
                return;
            } else if (!isMoney(can_invoice_amount)){
                this.can_invoice_msg = '发票金额有误，最高精确到0.01元';
                return;
            } 
            let param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICEREQUEST,
                data: {
                    invoice_id: can_invoice.id,
                    title: can_invoice.title,
                    invoice_type: can_invoice.type,
                    item_type: project,
                    amount: can_invoice_amount
                }
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                _self.can_invoice = '';
                _self.can_invoice_msg = '';
                _self.project = '';
                _self.can_invoice_amount = '';
                _self.loadCanInvoiceBanlance();
                _self.loadInvoiceRecords();
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable:true
                });
            });
            
            //执行成功，重新加载余额
        },
        loadCanInvoiceBanlance(){
            let param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICEBALANCE,
                data: {}
            };
            let _self = this;
            ajaxCallPromise(param).then(res => {
                this.can_invoice_banlance = res.uninvoice_amount;
            }).catch(err => {   
                let msg = getErrMsg(err);
                _self.can_invoice_banlance = 0;
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true,
                });
            });
        }
        
    }
}
</script>
<style>

</style>
