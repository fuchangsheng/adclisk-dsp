#!/usr/bin/python

import subprocess
import sys
import mysql
import db
import datetime


def call_ext_sync(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    errcode = process.returncode
    if errcode != 0:
        print "* %s: %s, %s" % (command, errcode, err)
        return False, err.strip()
    else:
        return True, out.strip()

def time_str():
    now_time = datetime.datetime.now()
    tom_time = now_time + datetime.timedelta(days=+1)
    tom_time = tom_time.strftime('%Y%m%d')
    return tom_time
    



def stop_call(conn):
    if conn!=None:
        close_db(conn)
    sys.exit()


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
        print e
        print 'conn has error'
    finally:
        return conn

def close_db(conn):
    mysql.close(conn)
    
def is_alive(tom):
    sql="select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='adclick_dsp_dashboard' and TABLE_NAME='realtime_action_"+tom+"' ;"
    res=mysql.select(conn,sql)
    if not res:
        return False
    
    sql="select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='adclick_dsp_dashboard' and TABLE_NAME='realtime_bidding_"+tom+"' ;"
    res=mysql.select(conn,sql)
    if not res:
        return False
    
    sql="select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='adclick_dsp_dashboard' and TABLE_NAME='realtime_bidding_single_"+tom+"' ;"
    res=mysql.select(conn,sql)
    if not res:
        return False
    
    sql="select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='adclick_dsp_dashboard' and TABLE_NAME='realtime_imp_"+tom+"' ;"
    res=mysql.select(conn,sql)
    if not res:
        return False
    
    sql="select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='adclick_dsp_dashboard' and TABLE_NAME='realtime_click_"+tom+"' ;"
    res=mysql.select(conn,sql)
    if not res:
        return False
        
    return True

if __name__ == '__main__':
    conn=open_db()
    try:
        tom=time_str();
        res=is_alive(tom)
        if res==False:
            command='/root/email.sh'
            call_ext_sync(command);
            
    except Exception , e:
        print e
    finally:
        stop_call(conn)
