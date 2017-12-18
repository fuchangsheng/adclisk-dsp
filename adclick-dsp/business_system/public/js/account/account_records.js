/*
 * @file  account_records.js
 * @description account information html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.17
 * @version 0.0.1 
 * @requires account/records.html
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
'use strict';

!function(argument) {
    //page element variables
    var mRAccountRadioBtn = null;
    var mVAccountRadioBtn = null;
    var mRecordList = null;
    var mSort = null;

    //page variables
    var mAccountType = null;
    var charge_status = ["充值成功", "充值中", "充值中", "充值失败"];

    /////////////////////////////////////////////////////////////////
    // on page load
    ////////////////////////////////////////////////////////////////
    $(function() {      
        initPageStaticElements();

        onPageload();

        registerCB();

        initContentOfRecord();
        
        mSort.change(loadRecordList);
    });
    
    function initContentOfRecord() {
        loadRecordList(0, 10);
    }

    /** @description init the page static element variables
     *  @memberOf module:account/records.html
     *
    */
    function initPageStaticElements() {
        mRAccountRadioBtn = $('#rAccount');
        mVAccountRadioBtn = $('#vAccount');
        mRecordList = $('#frecord-list');
        mSort = $('#sort');
    }

    /** @description do some work on page load
     *  @memberOf module:account/records.html
     *
    */
    function onPageload() {
        
    }

    /** @description register the callbacks of elements
     *  @memberOf module:account/records.html
     *
    */
    function registerCB() {
        mRAccountRadioBtn.click(reloadRecords);
        mVAccountRadioBtn.click(reloadRecords);
    }


    /////////////////////////////////////////////////////////////////
    // local functions
    ////////////////////////////////////////////////////////////////
    /** @description get the finacial operation records and render the page
     *  @memberOf module:account/records.html
     *  @param {int} index - page index; 
     *  @param {int} page item counts
    */
    function loadRecordList(index, count) {
        console.log('To request the account log');
        var tid = "#frecord-list";
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        var type = getAccountType();
       
        function scb(data) {
            if (data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            } else {
               try {
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        console.log('item:'+JSON.stringify(item));
                        var row = $("<tr></tr>");
                        row.append($("<td>" + item.date + "</td>"));
                        if (item.type==0) {
                            row.append($("<td>" + item.amount + "</td>"));
                            row.append($("<td>" + '-' + "</td>"));
                        }else {
                            row.append($("<td>" + '-' + "</td>"));
                            row.append($("<td>" + item.amount + "</td>"));
                        }
                        row.append($("<td>" + charge_status[item.charge_status] + "</td>"));
                        if (item.charge_type==0) {
                            row.append($("<td>" + '网银充值' + "</td>"));
                        }else if(item.charge_type==1) {
                            row.append($("<td>" + '支付宝充值' + "</td>"));
                        }else if(item.charge_type==2) {
                            row.append($("<td>" + '微信充值' + "</td>"));
                        }else if(item.charge_type==3) {
                            row.append($("<td>" + '后台充值' + "</td>"));
                        }
                           
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                           loadRecordList(parseInt(t.hash.replace("#", "")));
                    }));
                } catch(e) {
                    ecb();
                }
            }
        }
        function ecb() {
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }

        var param = {
            sinterface: SERVERCONF.ACCOUNT.RECHARGERECORDS,
            data : {
                type: type,
                index: index,
                count: count,
                sort: mSort.val()
            },
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            }else {
                scb(data);
            }
        });
    }

    /** @description read the type of account to view
     *  @memberOf module:account/records.html
    */
    function getAccountType() {
        if(mRAccountRadioBtn.is(':checked')){
            return '现金账户';
        }else {
            return '虚拟账户';
        }
    }

    function reloadRecords() {
        var newType = getAccountType();
        if (!mAccountType || mAccountType!=newType) {
            $('#frecord-list > tbody ').empty();
            $('#frecord-list > tfoot ').empty();
            loadRecordList();
        }
        mAccountType = newType;
    }
}();