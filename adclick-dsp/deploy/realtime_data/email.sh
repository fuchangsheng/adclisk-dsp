#!/bin/sh
#send report
from_name="adclick_dsp_dashboard"
from="service@dsp.com.cn"
to="fusheng@dmtec.cn"
email_content="<p>表没有建成功</p>"
email_subject="表有重大错误"
echo -e "To: ${to}\nFrom: \"${from_name}\" <${from}>\nSubject: ${email_subject}\nContent-type : text/html\n\n  ${email_content}" | /usr/sbin/sendmail -t


