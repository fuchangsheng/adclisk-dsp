function loadConversionList(index, count) {
    var tid = "#conversion";
    emptyTbody(tid);
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 10;
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }
    function scb(data) {
        if (data.size === 0) {
            setTfoot(tid, stringLoadFail("没有数据"));
        } else {
            try {
                var total = data.total;
                var list = data.list;
                var pagenumber = Math.ceil(total / count);
                var rows = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var row = $("<tr></tr>");
                    row.append($("<td>" + item.user_name + "</td>"));
                    row.append($("<td>" + item.idea_name + "</td>"));
                    row.append($("<td>" + item.conversion + "</td>"));
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadConversionList(parseInt(t.hash.replace("#", "")));
                }));
            } catch (e) {
                ecb();
            }
        }
    }

    var param = {
        sinterface : {
            path: '/v1/ad/conversion/listall',
            method: 'GET'
        },
        data : {
            index : index,
            count : count,
            date: $('#date').val()
        }
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
}

$(function(){
    var date = new Date();
    $('#date').val(date.format('YYYY-MM-dd'));
    $('#conversion-btn').click(function(){
        loadConversionList();
    });
    loadConversionList();
});
