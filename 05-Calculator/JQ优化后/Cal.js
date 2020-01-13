/*
    姓名：张楚明   学号：18342125
	Cal.js
*/

$("li").not(".special").click(function(){
    $("#txt").val($("#txt").val() + $(this).text());
});

$("#goback").click(function(){
    var str = $("#txt").val();
    str = str.substring(0, str.length - 1);
    $("#txt").val(str);
});

$("#clear").click(function(){
    $("#txt").val("");
});

$("#equal").click(function(){
    var str = $("#txt").val();
    var answer = "";
    if(str.indexOf("//") != -1 || str.indexOf("/*") != -1 || str.indexOf("*/") != -1)
        alert("输入有误,请重新输入!");
    else{
        try{
            answer = eval(str);
        }
        catch(err){
            alert("输入有误,请重新输入!");
        }
    }
    $("#txt").val(answer);
});


