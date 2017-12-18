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
    except Exception, e:
        print "open_db has error"
        print e
    finally:
        return conn

def close_db(conn):
    mysql.close(conn)
    
def GetSETime():
    #return (datetime.datetime.now()-datetime.timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M"),(datetime.datetime.now()-datetime.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M")
    return (datetime.datetime.now()-datetime.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M"),(datetime.datetime.now()).strftime("%Y-%m-%d %H:%M")
    #return '2017-01-01 00:00:00', '2017-01-05 00:00:00'

def GetColumn(conn):
    tablename='realtime_bidding_'+time.strftime("%Y%m%d",time.localtime(time.time()))
    sql="select column_name from Information_schema.columns where table_Name='"+tablename+"' and table_schema ='adclick_dsp_dashboard'"
    items=mysql.select(conn, sql)
    return items
    
    
def b2single(conn,items):
    itemstr=""
    for i in items :
        itemstr=itemstr+i[0]+','
    itemstr=itemstr.rstrip(',')
    print itemstr
    stime,etime = GetSETime()
    tablename='realtime_bidding_'+time.strftime("%Y%m%d",time.localtime(time.time()))
    singletablename='realtime_bidding_single_'+time.strftime("%Y%m%d",time.localtime(time.time()))
    sql = "select * from "+tablename+" where instime between '"+stime+"' and '"+etime+"'"
    print sql
    res=mysql.select(conn,sql)
    if res:
        for r in res :           
            if r[47]!= None:
                num=r[47].split(',')
                if len(num)==1 :
                    rstr=""
                    for ir in range(len(r)) :
                        if ir==len(r)-1:
                            rstr=rstr+"'"+r[ir].strftime("%Y-%m-%d %H:%M:%S")+"'"
                        else :
                            if r[ir]==None:
                                rstr=rstr+"'',"
                            else:   
                                rstr=rstr+"'"+ r[ir]+"',"
                    rstr=rstr.rstrip(',')
                    isql="insert into "+singletablename+" ("+itemstr+") values ("+rstr+")"
                    print isql
                    print mysql.insert(conn, isql)
                else :
                    for i in range(len(num)):
                        rstr=""
                        for ir in range(len(r)) :
                            if ir<=46:
                                if r[ir]==None:
                                    rstr=rstr+"'',"
                                else:   
                                    rstr=rstr+"'"+ r[ir]+"',"
                            elif 46<ir<len(r)-1:
                                sub=r[ir].split(',')
                                rstr=rstr+"'"+sub[i]+"',"
                            else:
                                rstr=rstr+"'"+r[ir].strftime("%Y-%m-%d %H:%M:%S")+"'"
                        rstr=rstr.rstrip(',')
                        isql="insert into "+singletablename+" ("+itemstr+") values ("+rstr+")"
                        print isql
                        print mysql.insert(conn, isql)



    
if __name__ == '__main__':
    conn=None
    try:
        conn=open_db()
        items=GetColumn(conn)
        b2single(conn,items)
        
    except Exception , e:
        print e
    finally:
        close_db(conn)