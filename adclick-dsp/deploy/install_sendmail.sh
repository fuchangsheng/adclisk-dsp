#!/bin/sh
#Install sendMail on CentOS

yum -y install sendmail
chkconfig sendmail on
service sendmail start
