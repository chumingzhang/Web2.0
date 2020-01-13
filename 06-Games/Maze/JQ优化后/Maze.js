/*
    张楚明 18342125
    Maze.js
*/
var isLose = false;
var isCheat = false;
var isWin = false;
var isBegin = false;

$("#walls").children($("div")).mousemove(function(){
    if(isBegin == true){
        $(this).css("background-color", "red");
        $("#lose").css("display", "block");
        isLose = true;
    }
});

$("#main").mouseleave(function(){
    if(isLose == false && isCheat == false && isWin == false)
        isCheat = true;
});

$("#E").mousemove(function{
    if(isCheat == true)
        $("#cheat").css("display", "block");
    else if(isLose == false && isCheat == false && isWin == false)
    {
        $("#win").css("display", "block");
        isWin = true;
    }
});

$("#S").mousemove(function(){
    isBegin = true;
    isLose = false;
    isCheat = false;
    isWin = false;

    $("#result").children($("p")).hide();
    $("#walls").children($("div")).css("background-color", "#D3D3D3");
});