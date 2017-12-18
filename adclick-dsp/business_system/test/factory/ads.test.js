/*
 * @file  ads.test.js
 * @description ads basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads.fac.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');

//model
var plan_create = require('../model/ads/ads_plan_create.test').create();
var plan_edit = require('../model/ads/ads_plan_edit.test').create();
var plan_op = require('../model/ads/ads_plan_op.test').create();
var plan_search = require('../model/ads/ads_plan_search.test').create();
var plan_list = require('../model/ads/ads_plan_list.test').create();
var plan_view = require('../model/ads/ads_plan_view.test').create();
var plan_delete = require('../model/ads/ads_plan_del.test').create();

var unit_create = require('../model/ads/ads_unit_create.test').create();
var unit_edit = require('../model/ads/ads_unit_edit.test').create();
var unit_op = require('../model/ads/ads_unit_op.test').create();
var unit_search = require('../model/ads/ads_unit_search.test').create();
var unit_list = require('../model/ads/ads_unit_list.test').create();
var unit_view = require('../model/ads/ads_unit_view.test').create();
var unit_target_edit = require('../model/ads/ads_unit_target_edit.test').create();
var unit_target_detail = require('../model/ads/ads_unit_target_detail.test').create();
var unit_delete = require('../model/ads/ads_unit_del.test').create();

var idea_create = require('../model/ads/ads_idea_create.test').create();
var idea_edit = require('../model/ads/ads_idea_edit.test').create();
var idea_op = require('../model/ads/ads_idea_op.test').create();
var idea_list = require('../model/ads/ads_idea_list.test').create();
var idea_view = require('../model/ads/ads_idea_view.test').create();
var idea_delete = require('../model/ads/ads_idea_del.test').create();
var idea_submit = require('../model/ads/ads_idea_submit_audit.test').create();

var asset_list = require('../model/ads/ads_asset_list.test').create();

var target_template_create = require('../model/ads/ads_target_template_create.test').create();
var target_template_edit = require('../model/ads/ads_target_template_edit.test').create();
var target_template_list = require('../model/ads/ads_target_template_list.test').create();
var target_template_view = require('../model/ads/ads_target_template_view.test').create();
var target_template_delete = require('../model/ads/ads_target_template_del.test').create();

var msg;

msg = 'to test interfaces of ads module.';
mLogger.debug('try '+msg);

var idea_create_model = require('../model/ads/ads_idea_create.test');
var unit_create_model = require('../model/ads/ads_unit_create.test');
var plan_create_model = require('../model/ads/ads_plan_create.test');
var plan_delete_model = require('../model/ads/ads_plan_del.test');

describe('idea part', function(){

    it(idea_create.description, function(done){
        idea_create.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });

    var idea_create_param_invalid = idea_create_model.createParamInvalid();
    it(idea_create_param_invalid.description, function(done) {
        idea_create_param_invalid.test({}, function(data) {
            done();
        });
    });

    var idea_create_db_duplicated = idea_create_model.createDataDuplicated();
    it(idea_create_db_duplicated.description, function(done) {
        idea_create_db_duplicated.test({}, [
            function(cb) {
                idea_list.test({}, function(data) {
                    idea_create_db_duplicated.param.idea_name = data.data.list[0].idea_name;
                    idea_create_db_duplicated.param.unit_id = data.data.list[0].unit_id;
                    console.error(idea_create_db_duplicated.param);
                    cb();
                });
            }, function(data) {
                done();
            }
        ]);
    });

    it(idea_edit.description, function(done){
        var idea_create = require('../model/ads/ads_idea_create.test').create();
        var idea_edit = require('../model/ads/ads_idea_edit.test').create();
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        idea_edit.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_edit.param.idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });
  
    var idea_edit_param_invalid =require('../model/ads/ads_idea_edit.test').createParamInvalid();
    it(idea_edit_param_invalid.description,function(done){
        idea_edit_param_invalid.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_edit_param_invalid.param.idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });
   
    var idea_edit_db_duplicated = require('../model/ads/ads_idea_edit.test').createDataDuplicated();
    it(idea_edit_db_duplicated.description,function(done){
        idea_edit_db_duplicated.test({}, [
            function(cb){
                idea_list.test({}, function(data) {
                    console.error('unit_id:'+data.data.list[0].unit_id);
                    idea_create.param.unit_id = data.data.list[0].unit_id;
                    idea_create.test({}, function(data2){
                        idea_delete.param.idea_id=data2.data.idea_id;
                        idea_edit_db_duplicated.param.idea_name = data.data.list[0].idea_name;
                        idea_edit_db_duplicated.param.idea_id = data2.data.idea_id;
                        console.error(idea_edit_db_duplicated.param);
                        cb();
                    });
                });
            },
            function(data){
                idea_delete.test({},function(data2){
                    done();
                })
            }
        ]);
    });

    
    var idea_edit_db_nomatchdata = require('../model/ads/ads_idea_edit.test').createDbNoMatchData();
    it(idea_edit_db_nomatchdata.description,function(done){
        idea_edit_db_nomatchdata.test({},function(data){
            done();
        });
    });


    it(idea_op.description, function(done){
        var idea_create = require('../model/ads/ads_idea_create.test').create();
        var idea_op = require('../model/ads/ads_idea_op.test').create();
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        idea_op.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_op.param.idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });

    it(idea_view.description, function(done){
        var idea_create = require('../model/ads/ads_idea_create.test').create();
        var idea_view = require('../model/ads/ads_idea_view.test').create();
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        idea_view.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_view.param.idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });
    
    var idea_view_param_invalid=require('../model/ads/ads_idea_view.test').createParamInvalid();
    it(idea_view_param_invalid.description,function(done){
        idea_view_param_invalid.test({},function(cb){
            done();
        })
    });
    
    var idea_view_db_nomatchdata=require('../model/ads/ads_idea_view.test').createDbNoMatchData();
    it(idea_view_db_nomatchdata.description,function(done){
        idea_view_db_nomatchdata.test({},function(cb){
            done();
        })
    });

    it(idea_delete.description, function(done){
        var idea_create = require('../model/ads/ads_idea_create.test').create();
        var idea_delete = require('../model/ads/ads_idea_del.test').create();
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        idea_delete.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_delete.param.idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });

    it(idea_submit.description, function(done){
        var idea_create = require('../model/ads/ads_idea_create.test').create();
        var idea_submit = require('../model/ads/ads_idea_submit_audit.test').create();
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        idea_submit.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.param.plan_id = data.data.plan_id;
                    idea_submit.param.ideas[0].plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        idea_create.param.unit_id = data2.data.unit_id;
                        idea_submit.param.ideas[0].unit_id = data2.data.unit_id;
                        idea_create.test({}, function(data3){
                            idea_submit.param.ideas[0].idea_id = data3.data.idea_id;
                            cb();
                        });
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data2){
                    done();
                });
            }
        ]);
    });

    it(idea_list.description, function(done){
        idea_list.test({}, function(data){
            done();
        });
    })
    
    var idea_list_param_invalid=require('../model/ads/ads_idea_list.test').createParamInvaild();
    it(idea_list_param_invalid.description, function(done){
        idea_list_param_invalid.test({}, function(data){
            done();
        });
    })

});

describe('asset part', function(){
    it(asset_list.description, function(done) {
        asset_list.test({}, function(data) {
            done();
        });
    });
});

describe('unit part', function(){
    it(unit_create.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_create.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_create_param_invalid = require('../model/ads/ads_unit_create.test').createParamInvalid();
    it(unit_create_param_invalid.description,function(done){
        unit_create_param_invalid.test({},[
            function(cb){
                plan_create.test({}, function(data){
                    unit_create_param_invalid.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ])
    });
    
    var unit_create_data_duplicated = require('../model/ads/ads_unit_create.test').createDataDuplicated();
    it(unit_create_data_duplicated.description,function(done){
        unit_create_data_duplicated.test({}, [
            function(cb){
                unit_list.test({},function(data2){
                    unit_create_data_duplicated.param.plan_id = data2.data.list[0].plan_id;
                    unit_create_data_duplicated.param.unit_name = data2.data.list[0].unit_name;
                    cb();
                });
            },
            function(data) {
                done();
            }
        ]
            
        );
    });

    it(unit_edit.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_edit = require('../model/ads/ads_unit_edit.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_edit.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_edit.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_edit_param_invalid = require('../model/ads/ads_unit_edit.test').createParamInvalid();
    it(unit_edit_param_invalid.description,function(done){
        unit_edit_param_invalid.test({},[
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_edit_param_invalid.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            } 
        ]);
    });

    var unit_edit_db_nomatchdata = require('../model/ads/ads_unit_edit.test').createDbNoMatchData();
    it(unit_edit_db_nomatchdata.description,function(done){
        unit_edit_db_nomatchdata.test({},[
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            } 
        ]);
    });
    
    var unit_edit_data_duplicated = require('../model/ads/ads_unit_edit.test').createDataDuplicated();
    it(unit_edit_data_duplicated.description,function(done){
        unit_edit_data_duplicated.test({},[
            function(cb){
                unit_list.test({},function(data){
                    unit_create.param.plan_id = data.data.list[0].plan_id;
                    unit_edit_data_duplicated.param.unit_name = data.data.list[0].unit_name;
                    unit_create.test({},function(data2){
                        unit_edit_data_duplicated.param.unit_id=data2.data.unit_id;                        
                        unit_delete.param.unit_id=data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                unit_delete.test({}, function(data){
                    done();
                });
            } 
        ]);
    });
    
    it(unit_op.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_op = require('../model/ads/ads_unit_op.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_op.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_op.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    it(unit_view.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_view = require('../model/ads/ads_unit_view.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_view.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_view.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_view_param_invalid = require('../model/ads/ads_unit_view.test').createParamInvalid();
    it(unit_view_param_invalid.description,function(done){
        unit_view_param_invalid.test({},function(data){
            done();
        });
    });
    
    var unit_view_db_nomatchdata = require('../model/ads/ads_unit_view.test').createDbNoMatchData();
    it(unit_view_db_nomatchdata.description,function(done){
        unit_view_db_nomatchdata.test({},function(data){
            done();
        });
    });
    

    it(unit_delete.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_delete = require('../model/ads/ads_unit_del.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_delete.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_delete.param.unit_id = data2.data.unit_id;
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_delete_param_invalid =  require('../model/ads/ads_unit_del.test').createParamInvalid();
    it(unit_delete_param_invalid.description,function(done){
        unit_delete_param_invalid.test({},function(data){
            done();
        });
    });

    it(unit_list.description, function(done){
        var unit_list = require('../model/ads/ads_unit_list.test').create();

        unit_list.test({}, function(data){
            done();
        });
    });
    
    var unit_list_param_invalid = require('../model/ads/ads_unit_list.test').createParamInvalid();
    it(unit_list_param_invalid.description,function(done){
        unit_list_param_invalid.test({},function(data){
            done();
        });
    });

    it(unit_search.description, function(done){
        var unit_search = require('../model/ads/ads_unit_search.test').create();

        unit_search.test({}, function(data){
            done();
        });
    });
    
    var unit_serch_param_invalid = require('../model/ads/ads_unit_search.test').createParamInvalid();
    it(unit_serch_param_invalid.description,function(done){
        unit_serch_param_invalid.test({},function(data){
            done();
        });
    });

    it(unit_target_edit.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_target_edit = require('../model/ads/ads_unit_target_edit.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_target_edit.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_target_edit.param.unit_id = data2.data.unit_id+'';
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_target_edit_param_invalid = require('../model/ads/ads_unit_target_edit.test').createParamInvalid();
    it(unit_target_edit_param_invalid.description,function(done){
        unit_target_edit_param_invalid.test({},
            function(data){
                done();
            });
    });
    
    var unit_target_edit_db_nomatchdata = require('../model/ads/ads_unit_target_edit.test').createDbNoMatchData();
    it(unit_target_edit_db_nomatchdata.description,function(done){
        unit_target_edit_db_nomatchdata.test({},
            function(data){
                done();
            });
    }); 

    it(unit_target_detail.description, function(done){
        var unit_create = require('../model/ads/ads_unit_create.test').create();
        var unit_target_detail = require('../model/ads/ads_unit_target_detail.test').create();
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        unit_target_detail.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    unit_create.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    unit_create.test({}, function(data2){
                        unit_target_detail.param.unit_id = data2.data.unit_id+'';
                        cb();
                    });
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var unit_target_detail_param_invalid = require('../model/ads/ads_unit_target_detail.test').createParamInvalid();
    it(unit_target_detail_param_invalid.description,function(done){
        unit_target_detail_param_invalid.test({},function(data){
            done();
        });
    });
    
});

var plan_create_model = require('../model/ads/ads_plan_create.test');
var plan_delete_model = require('../model/ads/ads_plan_del.test');
var plan_edit_model = require('../model/ads/ads_plan_edit.test');
var plan_search_model = require('../model/ads/ads_plan_search.test');
var plan_list_model = require('../model/ads/ads_plan_list.test');
var plan_view_model = require('../model/ads/ads_plan_view.test');
var plan_op_model = require('../model/ads/ads_plan_op.test');

describe('plan part', function(){
    var plan_create_invalid_param = plan_create_model.createParamInvalid();
    var plan_create_db_duplicated = plan_create_model.createDataDuplicated();
    it(plan_create.description, function(done){
        plan_create.test({}, function(data){
            plan_delete.param.plan_id = data.data.plan_id;
            plan_delete.test({}, function(data2){
                done();
            });
        });
    });

    it(plan_create_invalid_param.description, function(done) {
        plan_create_invalid_param.test({}, function(data) {
            done();
        });
    });

    it(plan_create_db_duplicated.description, function(done) {
        plan_create_db_duplicated.test({}, [
            function(cb) {
                plan_list.test({}, function(data) {
                    plan_create_db_duplicated.param.plan_id = data.data.list[0].plan_id;
                    plan_create_db_duplicated.param.plan_name = data.data.list[0].plan_name;
                    cb();
                });
            },
            function(data) {
                done();
            }
        ]);
    });

    it(plan_edit.description, function(done){
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();
        var plan_edit = require('../model/ads/ads_plan_edit.test').create();
        
        plan_edit.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_edit.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    var plan_edit_invalid_param = plan_edit_model.createParamInvalid();
    it(plan_edit_invalid_param.description, function(done) {
        plan_edit_invalid_param.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_edit_invalid_param.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    it(plan_op.description, function(done){
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();
        var plan_op = require('../model/ads/ads_plan_op.test').create();

        plan_op.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_op.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    var plan_op_invalid_param = plan_op_model.createParamInvalid();
    it(plan_op_invalid_param.description, function(done) {
        plan_op_invalid_param.test({}, function(data) {
            done();
        });
    });

    var plan_op_budget_over = plan_op_model.createParamInvalid();
    it(plan_op_budget_over.description, function(done) {
        plan_op_budget_over.test({}, [
            function(cb) {
                var create_param = {
                    plan_name : mUtils.createRandomTestName(),
                    start_time : '2016-12-1 00:00:00',
                    end_time : '2018-12-6 00:00:00',
                    budget : 5000000,
                    plan_cycle : 'ffffffffffffffffffffffffffffffffffffffffff',
                };
                plan_create.test(create_param, function(data){
                    plan_op_budget_over.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(resData) {
                plan_delete.test({}, function(data) {
                    done();
                });
            },
        ]);
    });

    var plan_view_no_matched_data = plan_view_model.createNoMatchData();
    it(plan_view.description, function(done){
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();
        var plan_view = require('../model/ads/ads_plan_view.test').create();

        plan_view.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_view.param.plan_id = data.data.plan_id;
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                plan_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    it(plan_view_no_matched_data.description, function(done) {
        plan_view_no_matched_data.test({}, function(resData) {
            done();
        });
    });

    it(plan_list.description, function(done){
        var plan_list = require('../model/ads/ads_plan_list.test').create();
        plan_list.test({}, function(data){
            done();
        });
    });

    var plan_list_invalid_param = plan_list_model.createParamInvalid();
    it(plan_list_invalid_param.description, function(done) {
        plan_list_invalid_param.test({}, function(data) {
            done();
        });
    });

    it(plan_search.description, function(done){
        var plan_search = require('../model/ads/ads_plan_search.test').create();

        plan_search.test({}, function(data){
            done();
        });
    });

    it(plan_delete.description, function(done){
        var plan_create = require('../model/ads/ads_plan_create.test').create();
        var plan_delete = require('../model/ads/ads_plan_del.test').create();

        plan_delete.test({}, [
            function(cb){
                plan_create.test({}, function(data){
                    plan_delete.param.plan_id = data.data.plan_id;
                    cb();
                });
            },
            function(data){
                done();
            }
        ]);
    });
});

describe('target template part', function(){
    it(target_template_create.description, function(done){
        target_template_create.test({}, function(data){
            target_template_delete.param.template_id = data.data.template_id;
            target_template_delete.test({}, function(data2){
                done();
            });
        });
    });
    
    var target_template_create_param_invalid = require('../model/ads/ads_target_template_create.test').createParamInvalid();
    it(target_template_create_param_invalid.description,function(done){
        target_template_create_param_invalid.test({}, 
            function(data){
                done();
            }
        );
    });
    
    var target_template_create_data_duplicated = require('../model/ads/ads_target_template_create.test').createDataDuplicated();
    it(target_template_create_data_duplicated.description,function(done){
        target_template_create_data_duplicated.test({},[function(cb){
            target_template_list.test({}, function(data){
                console.error(data.data.list[0]);
                target_template_create_data_duplicated.param.template_name = data.data.list[0].template_name;
                cb();
            });
        },
        function(data){
            done();
        }
        ]);
    });
    
    it(target_template_edit.description, function(done){
        target_template_edit.test({}, [
            function(cb){
                target_template_create.test({}, function(data){
                    target_template_edit.param.template_id = data.data.template_id;
                    target_template_delete.param.template_id = data.data.template_id;
                    cb();
                });
            },
            function(data){
                target_template_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var target_template_edit_param_invalid = require('../model/ads/ads_target_template_edit.test').createParamInvalid();
    it(target_template_edit_param_invalid.description,function(done){
        target_template_edit.test({}, [
            function(cb){
                target_template_create.test({}, function(data){
                    target_template_edit_param_invalid.param.template_id = data.data.template_id;
                    target_template_delete.param.template_id = data.data.template_id;
                    cb();
                });
            },
            function(data){
                target_template_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var target_template_edit_data_duplicated = require('../model/ads/ads_target_template_edit.test').createDataDuplicated();
    it(target_template_edit_data_duplicated.description,function(done){
        target_template_edit.test({}, [
            function(cb){
                target_template_create.test({}, function(data){
                    target_template_edit_data_duplicated.param.template_id = data.data.template_id;
                    target_template_delete.param.template_id = data.data.template_id;
                    cb();
                });
            },
            function(data){
                target_template_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });

    it(target_template_view.description, function(done){
        target_template_view.test({}, [
            function(cb){
                target_template_create.test({}, function(data){
                    target_template_view.param.template_id = data.data.template_id;
                    target_template_delete.param.template_id = data.data.template_id;
                    cb();
                });
            },
            function(data){
                target_template_delete.test({}, function(data){
                    done();
                });
            }
        ]);
    });
    
    var target_template_view_param_invalid = require('../model/ads/ads_target_template_view.test').createParamInvalid();
    it(target_template_view_param_invalid.description,function(done){
        target_template_view_param_invalid.test({},function(data){
            done();
        });
    });
    
    var target_template_view_db_nomatchdata = require('../model/ads/ads_target_template_view.test').createDbNoMatchData();
    it(target_template_view_db_nomatchdata.description,function(done){
        target_template_view_db_nomatchdata.test({},function(data){
            done();
        });
    });

    it(target_template_list.description, function(done){
        target_template_list.test({}, function(data){
            done();
        });
    });
    
    var target_template_list_param_invalid = require('../model/ads/ads_target_template_list.test').createParamInvalid();
    it(target_template_list_param_invalid.description, function(done){
        target_template_list_param_invalid.test({}, function(data){
            done();
        });
    });

    it(target_template_delete.description, function(done){
        target_template_delete.test({}, [
            function(cb){
                target_template_create.test({}, function(data){
                    target_template_delete.param.template_id = data.data.template_id;
                    cb();
                });
            },
            function(data){
                done();
            }
        ]);
    });
    
    var target_template_delete_param_invalid = require('../model/ads/ads_target_template_del.test').createParamInvalid();
    it(target_template_delete_param_invalid.description,function(done){
        target_template_delete_param_invalid.test({},function(data){
            done();
        });
    });
    
    var target_template_delete_db_nomatchdata = require('../model/ads/ads_target_template_del.test').createDbNoMatchData();
    it(target_template_delete_db_nomatchdata.description,function(done){
        target_template_delete_db_nomatchdata.test({},function(data){
            done();
        });
    });
    
});
