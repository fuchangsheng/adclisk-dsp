/*
 * @file idea.js
 * @description idea page js logic fix version
 * @copyright dmtec.cn reserved, 2017
 * @author jiangtu
 * @date 2017.02.28
 * @version 1.0.1
 */
'use strict';
!function(){
    $(function(){
        var href = location.href;
        var a_active = href.split("#")[1];
        if($("a[href='#" + a_active +"']").length == 1){
            var f_a_active = "menu" + a_active.substring(a_active.indexOf("q")+1,a_active.indexOf("-"));
            $("a[href='#" + f_a_active + "']").click();
            $("a[href='#" + a_active +"']").click();
        }else{
            $("a[href='#menu1']").click();
            $("a[href='#q1-01']").click();
        }
    });
    $(".nav>li>a").click(function(e){
        $(".nav>li>a").removeClass("active");
        $(this).addClass("active");
        var href = $(this).attr("href");
        var id = "#item-" + href.substring(1);
        
        $(id).removeClass("hidden").siblings().addClass("hidden");
        $(document).scrollTop(0);
        
    });
    
    $(".sidebar-menu>a").click(function(e){
        var status = $(this).attr("aria-expanded");
        if(status == "true"){
            $(this).removeClass("active");
            $(this).children("i").addClass("glyphicon-chevron-right").removeClass("glyphicon-chevron-down");
        }else{
            $(this).addClass("active");
            $(this).children("i").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
        }
    })
}();