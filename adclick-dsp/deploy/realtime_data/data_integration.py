#!/usr/bin/python
import mysql
import time
import datetime
import db


def open_db():
    conn=None
    try :
        dbhost=db.dbhost
        dbport=db.dbport
        dbname=db.dbname
        dbuser=db.dbuser
        dbpassword=db.dbpassword
        conn = mysql.open(dbhost, dbuser, dbpassword, int(dbport), dbname)
    except Exception,e:
        print 'conn has error'
        print e
    finally:
        return conn

def close_db(conn):
    mysql.close(conn)
    
def GetSETime():
    #return (datetime.datetime.now()-datetime.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M"),(datetime.datetime.now()).strftime("%Y-%m-%d %H:%M")
    #return '2016-12-21 15:13', '2016-12-22 17:01'
    return (datetime.datetime.now()-datetime.timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M"),(datetime.datetime.now()-datetime.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M")

def click2dsp(conn,stime,etime,suffix):
    sql="INSERT into adclick_dsp_realtime SELECT DATE_FORMAT(RC.instime,\"%Y-%m-%d %H:%i\") date, "\
    "RC. USER user_id,RC.plan plan_id,RC.unit unit_id,RC.idea idea_id,RB.ad_bid_type,RC.adx, "\
    "RB.ct creative_type,RB.adview_type,RB.prov,RB.city,RB.site,0 request,0 bid,0 imp,1 click, "\
    "0 download,IFNULL(RC.ad_bid,0) cost,IFNULL(RC.dsp_bid,0) revenue FROM realtime_click_"+suffix+" RC,"\
    " realtime_bidding_"+suffix+" RB WHERE RC.sid = RB.sid AND RC.instime >= '"+stime+"' AND RC.instime < '"+etime+"' "\
    "ON DUPLICATE KEY UPDATE click=click+1,cost=cost+VALUES(cost),revenue=cost+VALUES(revenue)"
    print sql
    print mysql.insert(conn, sql)
    
def imp2dsp(conn,stime,etime,suffix):
    sql="INSERT into adclick_dsp_realtime SELECT DATE_FORMAT(RI.instime,\"%Y-%m-%d %H:%i\") date, "\
    "RI. USER user_id,RI.plan plan_id,RI.unit unit_id,RI.idea idea_id,RB.ad_bid_type,RI.adx, "\
    "RB.ct creative_type,RB.adview_type,RB.prov,RB.city,RB.site,0 request,0 bid,1 imp,0 click, "\
    "0 download,IFNULL(RI.ad_bid,0) cost,IFNULL(RI.dsp_bid,0) revenue FROM realtime_imp_"+suffix+" RI, realtime_bidding_"+suffix+" RB "\
    "WHERE RI.sid = RB.sid AND RI.instime >= '"+stime+"' AND RI.instime < '"+etime+"' "\
    "ON DUPLICATE KEY UPDATE imp=imp+1,cost=cost+VALUES(cost),revenue=cost+VALUES(revenue)"
    print sql
    print mysql.insert(conn, sql)
    
def bid2dsp(conn,stime,etime,suffix):
    sql="INSERT into adclick_dsp_realtime SELECT DATE_FORMAT(instime,\"%Y-%m-%d %H:%i\") date, "\
    "user user_id,plan plan_id,unit unit_id,idea idea_id,ad_bid_type,adx,ct creative_type,adview_type, "\
    "prov,city,site,0 request,1 bid,0 imp,0 click,0 download,IFNULL(ad_bid,0) cost,IFNULL(dsp_bid,0) revenue "\
    "FROM realtime_bidding_single_"+suffix+" WHERE instime >= '"+stime+"' AND  instime < '"+etime+"' "\
    "ON DUPLICATE KEY UPDATE bid=bid+1,cost=cost+VALUES(cost),revenue=cost+VALUES(revenue)"
    print sql
    print mysql.insert(conn, sql)

if __name__ == '__main__':
    conn=None
    
    try:
        conn=open_db()
        stime,etime = GetSETime()
        suffix=time.strftime("%Y%m%d",time.localtime(time.time()))
        bid2dsp(conn, stime, etime,suffix)
        imp2dsp(conn, stime, etime,suffix)
        click2dsp(conn,stime,etime,suffix)
        
    except Exception , e:
        print e
    finally:
        close_db(conn)
