import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        overviewLoading: false,
        dailyList:{},
        currentBasic:'impression'
    },
    mutations: {
        overviewLoadingOn(state){
            state.overviewLoading = true;
        },
        overviewLoadingOff(state){
            state.overviewLoading = false;
        },
        setDailyList(state,list){
            state.dailyList = {...state.dailyList,...list};
        },
        setCurrentBasic(state,payLoad){
            //为了使用keep-alive
            state.currentBasic = payLoad.view;
        }
    },
    getters: {
        hasRecords: state => {
            let list = state.dailyList.list;
            if(list && list.length){
                return true;
            }
            return false;
        },
    }
});

export default store;