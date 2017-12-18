/*
 * @file  init-user-list.js
 * @description init user-list
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.10
 * @version 0.0.1 
 */
 

var choosed_user_id = null;
var choosed_user_name = null;
var user_list = null;
//function func is what will do when choose a user
function initUserList(func){
    function ecb(){
        console.log("获取用户list失败");
    }
        
    function scb(data){
        if(data.size == 0){
            console.log("用户list为空");
        }else{
            user_list = data.list;
            var user_list_tree = new Array();
            user_list_tree.push({text:"广告主列表"});
            for(var i = 0; i < data.size; i++){
                var user_item = new Object();
                var user = data.list[i];
                user_item.text = user.user_name;
                user_list_tree.push(user_item);
            }
                
            $('#treeview').treeview({data:user_list_tree});
            //bind nodeSelected funtion for each li
            $('#treeview').on('nodeSelected',function(event,node){
                if(node.nodeId>0){
                    choosed_user_id = user_list[node.nodeId - 1].user_id;
                    choosed_user_name = user_list[node.nodeId - 1].user_name;
                    func();
                }else{
                    choosed_user_id = null;
                    choosed_user_name = null;
                    return;
                }
                
            });
            mTreeViewLi = $("#treeview li");
            mTreeViewLi[1].click();
        }
    }
        
    var param = {
        sinterface : SERVERCONF.ADMIN.ADUSERLIST,
        data : {
            index: 0,
        }
    }
        
    ajaxCall(param, function(err, data){
        if(err){
            ecb;
        }else{
            scb(data);
        }
    })
}
