<template>
    <div>
       this materialbox's view pic
       <page></page>
    </div> 
</template>
<script>
import Page from '../../global/Page'
import {SERVERCONF} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import {stringLoadFail} from '@/public/component'
export default {
    name: 'picview',
    data(){
        return {
            index:1,
            count:10,
            type:0,
            sort:0,
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.loadPicList();
        });
    },
    components:{
        Page
    },
    methods:{
        loadPicList(){
            let sort = this.sort == 0 ? '创建时间减序' : '创建时间增序';
            let type = '图片';
            let param = {
                sinterface: '/v3/utils/assets/search',
                data: {
                    type: type,
                    index: this.index - 1,
                    count: this.count,
                    sort: sort
                }
            };
            this.resultMsg = '';
            let _slef = this;
            ajaxCallPromise(param).then(res => { 
                _slef.records_list = res.list;
                let total = res.total;//返回的为总条数
                _slef.total = Math.ceil(total / _slef.count);
                if(res.size == 0){
                    _slef.resultMsg = stringLoadFail("没有数据");
                }
            }).catch(err => {
                _slef.resultMsg = stringLoadFail(err.msg);
            });
        }
    }
}
</script>