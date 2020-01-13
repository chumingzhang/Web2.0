/*
    张楚明 18342125
    Whac-a-mole.js
*/
var i;
var click_time = 0;      //判断开始或结束
var total_time;          //总时间
var start_time;          //开始时间
var rest_time;           //剩下的时间
var djs_id;              //倒计时的计时器
var score = 0;

$("#SE").click(function(){
    if(click_time == 0)
        Start();
    else
        Stop();
});

function Start()
{
    click_time = 1;
    total_time = 30;
    start_time = new Date();
    $("#message").attr("value", "Playing");
    score = 0;
    Tita();     //开始倒计时
    mouse_show();
}

function Stop()
{
    click_time = 0;
    $("#message").attr("value", "Game Over");
    clearTimeout(djs_id);
    $("#djs").attr("value", "0");
    $("input").prop("checked", false);
    alert("Game Over.\nYour Score is: " + score);
}

function Tita()
{
    var game_time = new Date();
    rest_time = total_time - parseInt((game_time - start_time) / 1000);
    $("#djs").attr("value", rest_time);
    $("#point").attr("value", score);
    if(rest_time < 1){
        Stop();
        return;
    }
    djs_id = setTimeout("Tita()", 1000);
}


function mouse_show()
{
    i = parseInt(Math.random() * 60);
    // alert(i);
    $("input").eq(i).prop("checked", true);
}

$("input").click(function(){
    $(this).prop("checked", false);
    if($("input").index(this) == i){
        score++;
        $("#point").attr("value", score);
        mouse_show();
        return;
    }
    else{
        score--;
        $("#point").attr("value", score);
    }
});