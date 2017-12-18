var choosed_adx_id = null;
var choosed_adx_name = null;
var adx_list = null;
//function func is what will do when choose a user
function initAdxList(func){
    function ecb(){
        console.log("获取adxlist失败");
    }
        
    function scb(data){
        if(data.size == 0){
            console.log("adxlist为空");
        }else{
            adx_list = data.list;
            var adx_list_tree = new Array();
            adx_list_tree.push({text:"ADX列表"});
            for(var i = 0; i < data.size; i++){
                var adx_item = new Object();
                var adx = data.list[i];
                adx_item.text = adx.name;
                adx_list_tree.push(adx_item);
            }
                
            $('#adxtreeview').treeview({data:adx_list_tree});
            //bind nodeSelected funtion for each li
            $('#adxtreeview').on('nodeSelected',function(event,node){
                if(node.nodeId>0){
                    choosed_adx_id = adx_list[node.nodeId - 1].id;
                    choosed_adx_name = adx_list[node.nodeId - 1].name;
                    func();
                }else{
                    choosed_adx_id = null;
                    choosed_adx_name = null;
                    return;
                }
                
            });
            mTreeViewLi = $("#adxtreeview li");
            mTreeViewLi[1].click();
        }
    }
        
    var param = {
        sinterface : SERVERCONF.ADX.LIST,
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
