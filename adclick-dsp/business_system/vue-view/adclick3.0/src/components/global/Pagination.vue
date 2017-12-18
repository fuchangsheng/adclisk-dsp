<template>
    <div class="pagination clearfix">
        <ul class="fr">
            <li rel="prev"><button type="button" @click.prevent="prevPage" :disabled="prevDis">&lt;</button></li>
            <li v-for="index in total" v-if="index <= lastPage && index>=firstPage">
                <button type="button" @click.prevent="changePage(index)" :class="{selected:isSelected(index)}">{{index}}</button>
            </li>
            <li rel="next"><button type="button" @click.prevent="nextPage" :disabled="nextDis">&gt;</button></li>
            <li>
                <input type="text" class="form-control" v-model="skipPage">
            </li>
            <li><button type="button" @click.prevent="skipChange">跳转</button></li>
        </ul>

    </div>
</template>

<script>

var count = 1;
export default {
    name: 'pagination',
    props:{
        index:{
            type:Number,
            default:1,
        },
        total:{
            type: Number,
            default:1,
        },
        range:{
            type: Number,
            default: 5,
        },
    },
    watch:{
        index(val){
            this.currentPage = val;
        },
        total(val){
            if(this.currentPage > val && val>0){
                this.changePage(val);
            }
        },

    },
    data(){
        return{
            currentPage: this.index,
            skipPage:1,
            
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
            if(!this.total ||this.currentPage==this.total ){
                return true;
            }else{
                return false;
            }
        },
        firstPage(){
            var first = this.currentPage - Math.floor((this.range - 1) / 2);
            first = this.total - this.range < first ? this.total - this.range : first;
            first = first <= 0 ? 1 : first;
            return first;
        },
        lastPage(){
            var last = this.firstPage + this.range;
            last = last > this.total ? this.total : last;
            return last;
        },
    },
    methods: {
        changePage(page){
            if(this.currentPage!=page){
                this.currentPage = page;
                this.$emit('on-change',page);
            }
        },
        isSelected(index){
           return this.currentPage == index;
        },
        prevPage(){
            var page = this.currentPage -1;
            if(page >= 1){
                this.changePage(page);
            }
        },
        nextPage(){
            var page = this.currentPage + 1;
            if(page <= this.total){
                this.changePage(page);
            }
        },
        skipChange(){
            var page = this.skipPage;
            //TODO
            page = parseInt(page);
            if(!page){
                page = 1; 
            }else if(page>this.total){
                page = this.total;
            }else if (page < 1) {
                page = 1;
            }
            this.changePage(page);
        }
    }
    
}
</script>
<style>
.pagination{
    margin-top: 10px;
}
.pagination li{
    margin-right: 8px;
}
.pagination li:last-child{
    margin-right: 0;
}

.pagination li button{
    display: inline-block;
    width: 38px;
    height: 38px;
    padding: 0;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
    border: 1px solid #ccc;
    color: #4b4f56;
    background-color: #fff;
    cursor: pointer;
    outline: 0;
}
/*
.pagination li button:hover {
    color: #fff;
    background-color: #bbb;
}
.pagination li button[disabled]:hover {
    color: #4b4f56;
    background-color: #fff;
    cursor: not-allowed;
}*/
.pagination li button:not([disabled]):hover {
    color: #fff;
    background-color: #bbb;
}

.pagination li button.selected{
    color: #fff;
    background-color: #3a72bf;
}
.pagination li input{
    width: 70px;
    height: 38px;
    border-radius: 0;
    text-align: center;
}

</style>