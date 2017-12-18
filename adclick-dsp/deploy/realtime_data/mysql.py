#!/usr/bin/python

import MySQLdb

def open(host, user, passwd, port, db):
    try:
        conn = MySQLdb.connect(host = host, user = user, passwd = passwd, port = port)
        conn.select_db(db)
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
        conn = None
    return conn

def close(conn):
    try:
        conn.cursor().close()
        conn.close()
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])

def select(conn, query):
    if query.upper().find("SELECT") == -1:
        print "invalid query string"
        return None
    try:
        cur = conn.cursor()
        cur.execute(query)
        rows = cur.fetchall()
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
        rows = None
    return rows

def insert(conn, query):
    ret = False
    if query.upper().find("INSERT") == -1:
        print "invalid query string"
        return ret
    try:
        cur = conn.cursor()
        cur.execute(query)
        conn.commit()
        ret = True
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return ret

def update(conn, query):
    ret = False
    if query.upper().find("UPDATE") == -1:
        print "invalid query string"
        return ret
    try:
        cur = conn.cursor()
        cur.execute(query)
        conn.commit()
        ret = True
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return ret

def delete(conn, query):
    ret = False
    if query.upper().find("DELETE") == -1:
        print "invalid query string"
        return ret
    try:
        cur = conn.cursor()
        cur.execute(query)
        conn.commit()
        ret = True
    except MySQLdb.Error, e:
        print "Mysql Error %d: %s" % (e.args[0], e.args[1])
    return ret
