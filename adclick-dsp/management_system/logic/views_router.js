/*
 * @file  views_router.js
 * @description dsp management static views js router logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.11.24
 * @version 0.0.1 
 */

var express = require('express');
var router = express.Router();

router.get('/views/usercheck', function(req, res) {
    res.render('user_check');
});
router.get('/views/ideacheck', function(req, res) {
    res.render('idea_check');
});
router.get('/views/recharge', function(req, res) {
    res.render('recharge');
});
router.get('/views/payconfirm', function(req, res) {
    res.render('payment_confirm');
});
router.get('/views/invoice', function(req, res) {
    res.render('invoice');
});
router.get('/views/adx', function(req, res) {
    res.render('adx_data');
});
router.get('/views/income', function(req, res) {
    res.render('income_data');
});
router.get('/views/task', function(req, res) {
    res.render('task');
});
router.get('/views/overview/all', function(req, res) {
    res.render('overview_all');
});
router.get('/views/overview/user', function(req, res) {
    res.render('overview_user');
});
router.get('/views/overview/adx', function(req, res) {
    res.render('overview_adx');
});
router.get('/views/realtime/all', function(req, res) {
    res.render('realtime_all');
});
router.get('/views/realtime/allt', function(req, res) {
    res.render('realtime_allt');
});
router.get('/views/realtime/user', function(req, res) {
    res.render('realtime_user');
});
router.get('/views/realtime/adx', function(req, res) {
    res.render('realtime_adx');
});
router.get('/admin/login', function(req, res) {
    res.render('login');
});
router.get('/views/admin', function(req, res) {
    res.render('admin');
});
router.get('/views/admin/add', function(req, res) {
    res.render('admin_add');
});
router.get('/views/admin/update', function(req, res) {
    res.render('admin_update');
});
router.get('/views/admin/delete', function(req, res) {
    res.render('admin_delete');
});
router.get('/views/oplog', function(req, res) {
    res.render('opLog');
});

module.exports.router = router;
