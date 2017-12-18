安装adclick_dsp_dashboard.sql之后需要确认事件是否开启
执行event_on.sql
按照install_sendmail.txt安装邮件服务器,把email.sh置于check_table.py同级目录
数据库服务器定时执行分表，集合操作，并定时检查表是否存在
1.bidding_single.py是分表任务,延时一分钟执行
2.data_integration.py是统计归纳任务.延时两分钟执行
3.check_table.py是检查表任务。每天执行一次，如果没有建表成功，发送email通知管理员


crontab -e
*/1 * * * * /usr/bin/python /root/cron/bidding_single.py
*/1 * * * * /usr/bin/python /root/cron/data_integration.py
10 23 * * * /usr/bin/python /root/check_table.py



