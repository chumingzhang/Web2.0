/*
    张楚明 18342125
    Maze.js
*/
var isLose = false;
var isCheat = false;
var isWin = false;
var isBegin = false;

function Lose(obj)
{
    if(isBegin == true){
        if(isLose == false && isCheat == false && isWin == false){
            obj.style.backgroundColor = "red";
            var lose = document.getElementById("lose");
            lose.style.display = "block";
            isLose = true;
        }
    }
}

function Cheat()
{
    if(isLose == false && isCheat == false && isWin == false)
        isCheat = true;
}

function Win()
{
    if(isCheat == true)
    {
        var cheat = document.getElementById("cheat");
        cheat.style.display = "block";
    }
    else if(isLose == false && isCheat == false && isWin == false)
    {
        var win = document.getElementById("win");
        win.style.display = "block";
        isWin = true;
    }
}

function Start()
{
    isBegin = true;
    isLose = false;
    isCheat = false;
    isWin = false;
    End();
}

function End()
{
    document.getElementById("lose").style.display = "none";
    document.getElementById("cheat").style.display = "none";
    document.getElementById("win").style.display = "none";
    var wall = document.getElementById("walls");
    var childs = wall.childNodes;
    for(var i = 0; i < childs.length; i++)
    {
        if(childs[i].id)
            childs[i].style.backgroundColor = "#D3D3D3";
    }
}