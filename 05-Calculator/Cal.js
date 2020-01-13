/*
    姓名：张楚明   学号：18342125
	Cal.js
*/
function get(key)
{
    var str = document.getElementById("text").value;
    str += key;
    document.getElementById("text").value = str;
}

function goBack()
{
    var str = document.getElementById("text").value;
    str = str.substring(0, str.length - 1);
    document.getElementById("text").value = str;
}

function myClear()
{
    var str = "";
    document.getElementById("text").value = str;
}

function myEqual()
{
    var str = document.getElementById("text").value;
    var answer = "";
    if(str.indexOf("//") != -1 || str.indexOf("/*") != -1 || str.indexOf("*/") != -1)
    {
        alert("输入有误,请重新输入!");
        document.getElementById("text").value = answer;
    }

    else{
        try{
            answer = eval(str);
        }
        catch(err){
            alert("输入有误,请重新输入!");
        }
    }
    
    document.getElementById("text").value = answer;
}