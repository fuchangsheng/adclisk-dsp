<template>
<div class="page clearfix">
<div class="fr">
    <span  @click="prevPage" :disabled = "prevDis" class="prev">
         <Icon type="arrow-left-b"/>
    </span>
   
    <input type="text" autocomplete="off" class="number" :value="currentPage" @keyup="keyUp" @keydown="keyDown">
    <span>/</span>{{total}}
    <span  @click="nextPage" :disabled = "nextDis" class="next">
        <Icon type="arrow-right-b"/>
    </span>
    
</div>
   
</div>
</template>
<script>
export default {
    name: 'page',
    props:{
        index: {
            type: Number,
            default: 1
        },
        total: {
            type:Number,
            default: 1
        },
        range: {
            type: Number,
            default:5
        }
    },
    watch:{
        index(val){
            this.currentPage = val;
        },
        total (val){
            if(this.currentPage > val && this.currentPage != 1){
                this.changePage(val);
            }
        },
        
    },
    data(){
        return {
            currentPage: this.index,
            skipPage: 1
        }
    },
    computed:{
         prevDis(){
            if(this.currentPage == 1){
                return true;
            }else{
                return false;
            }
        },
        nextDis(){
            if(!this.total || this.currentPage==this.total){
                return true;
            }else{
                return false;
            }
        },
    },
    methods:{
        changePage(page){
            if(this.currentPage!=page){
                this.currentPage = page;
                this.$emit('on-change',page);
            }
        },
        prevPage(){
            let page = this.currentPage -1;
            if(page >= 1){
                this.changePage(page);
            }
        },
        nextPage(){
            let page = this.currentPage + 1;
            if(page <= this.total){
                this.changePage(page);
            }
        },
        skipChange(){
            let page = this.skipPage;
            page = parseInt(page);
            if(!page || page == ''){
                page = 1; 
            }else if(page>this.total){
                page = this.total;
            }else if (page < 1) {
                page = 1;
            }
            this.changePage(page);
        },
        keyUp(e){
            const key = e.keyCode;  
            const val = parseInt(e.target.value);
            if(key === 38){
                this.prevPage();
            } else if(key === 40){
                this.nextPage();
            } else if(key === 13){
                this.skipPage = val;
                this.skipChange();
                e.target.value = this.currentPage;
            }
        },
        keyDown(e){
            const key = e.keyCode;
            const condition = (key >=48 && key < 58) || (key >= 96 && key < 106) || key === 8 || key === 37 || key === 39;
            if(!condition){
                e.preventDefault();
            }
        },
    }
}
</script>
<style>
.page{
    margin-top: 10px;
}
.page .number{
    display: inline-block;
    width: 41px;
    height: 36px;
    box-shadow: inset 0 0 1px  #bbb;
    outline: 0;
}
.page .prev,.page .next{
    display: inline-block;
    width: 20px;
    height: 34px;
    line-height: 34px;
    font-size: 20px;
    color: #3a72bf;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
}
.page .prev[disabled],.page .next[disabled]{
    cursor: not-allowed;
}

</style>