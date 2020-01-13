var se, djs, message, point, obj, i;
var click_time = 0;
var total_time;          //总时间
var start_time;          //开始时间
var rest_time;           //剩下的时间
var djs_id;              //倒计时的计时器
var score = 0;

window.onload = function()
{
    se = document.getElementById("SE");
    djs = document.getElementById("djs");
    message = document.getElementById("message");
    point = document.getElementById("point");
    obj = document.getElementsByClassName("get");

    se.onclick = function()
    {
        // alert("hhh"+click_time);
        if(click_time == 0)
        {
            click_time = 1;
            Start();
        }
        else
            Stop();
    }
}

function Start()
{
    total_time = 30;
    start_time = new Date();
    message.value = "Playing"
    score = 0;
    Tita();     //开始倒计时
    mouse_show();
}

function Stop()
{
    click_time = 0;
    message.value = "Game Over";
    clearTimeout(djs_id);
    djs.value = 0;
    for(var j = 0; j < 60; ++j)
    {
        obj[j].checked = false;
    }
    alert("Game Over.\nYour Score is: " + score);
}

function Tita()
{
    var game_time = new Date();
    rest_time = total_time - parseInt((game_time - start_time) / 1000);
    djs.value = rest_time;
    point.value = score;
    if(rest_time < 1)
    {
        Stop();
        return;
    }

    djs_id = setTimeout("Tita()", 1000);
}


function mouse_show()
{
    i = parseInt(Math.random() * 60);
    obj[i].checked = true;
}

function check(temp1)
{
    temp1.checked = false;
    if(temp1 == obj[i])
    {
        score++;
        point.value = score;
        mouse_show();
        return;
    }
    else
    {
        score--;
        point.value = score;
    }
}
