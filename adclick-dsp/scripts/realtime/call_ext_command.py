#!/usr/bin/python

import subprocess
import time
import sys
import mysql
import ConfigParser
import getopt
from sys import argv



def call_ext_sync(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    errcode = process.returncode
    if errcode != 0:
        print "* %s: %s, %s" % (command, errcode, err)
        return False, err.strip()
    else:
        return True, out.strip()

def call_ext_async(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return process

def start_call(command,conn):
    try:
        while True :
            print "################"
            print "# call_ext_async"
            process = call_ext_async(command)
            while True:
                line = process.stdout.readline()
                if not line:
                    #time.sleep(1)
                    break
                lstr = line.strip()
                d=str2dic(lstr)
                if len(d)>0:
                    if 'bidding' in command :
                        isok=sid_insert(conn, d,'bidding')
                    elif 'imp' in command :
                        isok=sid_insert(conn, d,'imp')
                    elif 'click' in command :
                        isok=sid_insert(conn, d,'click')
                    elif 'action' in command :
                        isok=sid_insert(conn, d,'action')
                    else :
                        print 'wrong command'
                        break
                    
                    if isok:
                        print 'add ok'
                    else:
                        print 'add wrong'
    except:
        print "thread has error."
        
def test_ins(conn):
    print conn
    sql = "insert into realtime_bidding (sid,nad,idea,instime) values ('123','123','123','2016-12-22 17:01');"
    print mysql.insert(conn, sql)
    

def str2dic(str):
    d = {}
    if ']' in str:
        sp1=str.split(']')
        sp2=sp1[1].split(' ')
        for skv in sp2 :
            #print(skv)
            if '=' in skv:
                kv=skv.split('=')
                k=kv[0]
                v=kv[1]
                d[k]=v    
    else:
        print 'read a wrong statements'
    return d

def sid_insert(conn,dic,comm):
    sql = ''
    columns = []
    values = []
    if len(dic)>2:
        for key,value in dic.items() :
            columns.append(key)
            values.append("'"+value+"'")
    columns=','.join(columns)+',instime'
    values=','.join(values)+", '"+GetNowTime()+"'"
    sql = 'insert into realtime_'+comm+' ('+columns+') values ('+values+');'
    print sql
    return mysql.insert(conn, sql)

def stop_call(conn):
    close_db(conn)
    sys.exit()

def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))

def open_db():
    conn=None
    try :
        config = ConfigParser.ConfigParser()
        config.read("db.conf")
        dbhost=config.get('database','dbhost')
        dbport=config.get('database','dbport')
        dbname=config.get('database','dbname')
        dbuser=config.get('database','dbuser')
        dbpassword=config.get('database','dbpassword')
        conn = mysql.open(dbhost, dbuser, dbpassword, int(dbport), dbname)
    except Exception,e:
        print e
        print 'conn has error'
    finally:
        return conn

def close_db(conn):
    mysql.close(conn)
    
def sid_is_alive(conn,sid):
    sql="select sid from realtime_bidding where sid='"+sid+"';"
    res=mysql.select(conn,sql)
    if res:
        print res[0][0]
        return True
    return False

if __name__ == '__main__':
    conn=None
    argv = sys.argv[1:]
    inputfile=""
    try:
      
        opts, args = getopt.getopt(argv, "hi:o:",["infile="])
    except getopt.GetoptError:
        print 'Error: call_ext_command.py -i <inputfile> '
        print '   or: call_ext_command.py --infile=<inputfile> '
        sys.exit(2)

    for opt, arg in opts:
        if opt == "-h":
            print 'call_ext_command.py -i <inputfile>'
            print 'or: call_ext_command.py --infile=<inputfile>'
            sys.exit()
        elif opt in ("-i", "--infile"):
            inputfile = arg

    print 'Input file : ', inputfile
    try:
        conn=open_db()
        #command =input('print enter a right command : ')#'tail -f ../log/bidder.log.bidding'
        if inputfile!="":
            command = 'tail -F '+inputfile
            start_call(command,conn)
        #test_ins(conn)
    except Exception , e:
        print e
    finally:
        stop_call(conn)
