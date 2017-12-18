<template>
    <div>
        <!-- 时间选择部分 -->
        <div class= "ac-common">
            <div class="clearfix">
                <DatePicker  
                    class= "common-date"  
                    v-bind = "pickerOption" 
                    v-model = "chooseDate"  
                    @on-ok = "updateDate" 
                    :options = "pickerOption.options" >
                </DatePicker> 
            </div>
        </div>
        <div class="account-main">
            <top-nav :date = "date"></top-nav>
            <div class="ac-mn-box">
                <router-view></router-view>
            </div>
        </div>
    </div>
    
</template>
<script>
import TopNav from './TopNav'
export default {
    name: 'accountmain',
    data(){
        return {
            date: {
                startDate : this.format(new Date(),'yyyy-MM-dd'),
                endDate : this.format(new Date(),'yyyy-MM-dd'),
            },
            chooseDate: [new Date(),new Date()],
            pickerOption: {
                type: 'daterange',
                format: 'yyyy年MM月dd日',
                placement: 'bottom-end',
                confirm: true,
                clearable: false,
                //自定义时间
                options: {
                    shortcuts: [
                        {
                            text: '今天',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                return [start,end];
                            },
                            // onClick:(picker) => {
                            //     console.log('今天')
                            // }
                        },
                        {
                            text: '昨天',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24);
                                return [start,end];
                            },
                            // onClick:(picker) => {
                            //     console.log('昨天')
                            // }
                        },
                        {
                            text: '过去7天',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start,end];
                            },
                            // onClick:(picker) => {
                            //     console.log('过去7天')
                            // }
                        },
                        {
                            text: '过去30天',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start,end];
                            },
                            // onClick:(picker) => {
                            //     console.log('过去30天')
                            // }
                        },
                        {
                            text: '自定义',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                return [start,end];
                            },
                            // onClick:(picker) => {
                            //     console.log('自定义')
                            // }
                        }

                    ]
                }
            },
            
        }
    },
    components: {
        TopNav
    },
    methods: {
        format(inputDate,format) {
            var date = {
                "M+" : inputDate.getMonth() + 1,
                "d+" : inputDate.getDate(),
                "h+" : inputDate.getHours(),
                "m+" : inputDate.getMinutes(),
                "s+" : inputDate.getSeconds(),
                "q+" : Math.floor((inputDate.getMonth() + 3) / 3),
                "S+" : inputDate.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (inputDate.getFullYear() + '')
                        .substr(4 - RegExp.$1.length));
            }
            for ( var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1,
                            RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
                                    .substr(("" + date[k]).length));
                }
            }
            return format;
        },
        updateDate(){
            let [startDate,endDate] = this.chooseDate;
            this.date.startDate = this.format(startDate,'yyyy-MM-dd');
            this.date.endDate = this.format(endDate,'yyyy-MM-dd');
        },
    }
}
</script>
<style>
.account-main{
    margin: 15px 55px auto 15px;
}
.ac-mn-box {
    padding: 0 12px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
}

.ac-common {
    width: 100%;
    height: 50px;
    background-color: #fff;
}
.common-date {
    width: 230px;
    float: right;
    margin-top: 9px;
}

</style>
