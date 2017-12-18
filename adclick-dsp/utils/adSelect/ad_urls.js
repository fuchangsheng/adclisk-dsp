/*
 * @file  ad_urls.js
 * @description ad urls config
 * @copyright dmtec.cn reserved, 2017
 * @author Andy.zhou
 * @date 2017.5.12
 * @version 0.1.1 
 */
'use strict';

exports.ADTAGS = {
    upload_ad: '/v1/ad/upload',
    delete_ad: '/v1/ad/delete',
    list_ad: '/v1/ad/list',
    query_ad: '/v1/ad/query',
    upload_all_tag: '/v1/tag/upload_all',
    add_tag: '/v1/tag/add',
    list_tag:'/v1/tag/list',
    delete_tag: '/v1/tag/delete', 
};

exports.ADOPTS = {
    select_ad: '/v1/ad/select',
    select_batch:'/v1/ad/select_batch',
    query_ad_user_sum:'/v1/ad/user_sum',
    query_tag_user_sum:'/v1/tag/user_sum',
    query_tag_update_time: '/v1/tag/up_time',
};