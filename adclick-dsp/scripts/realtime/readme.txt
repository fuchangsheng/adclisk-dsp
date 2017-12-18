安装adclick_dsp_dashboard.sql之后需要确认事件是否开启
执行event_on.sql

1: yum install MySQL-python
2: pip install pymysql
3: python collect_rawdata.py

数据库服务器定时执行分表，集合操作，并定时检查表是否存在
	*/1 * * * * /usr/bin/python /root/cron/bidding_single.py
	*/1 * * * * /usr/bin/python /root/cron/data_integration.py
	10 23 * * * /usr/bin/python /root/check_table.py



