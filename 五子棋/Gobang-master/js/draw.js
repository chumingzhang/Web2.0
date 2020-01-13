function initdraw(chessboard)
{
    var n0 = 0;
    var n1 = 0;
    for(var i=0;i<boardsize;i++)
        for(var j=0;j<boardsize;j++)
        {
            if(chessboard[i][j]!=-1)
            {
                if(chessboard[i][j]==0)
                    n0+=1
                else
                    n1+=1
                dochess(j,i,chessboard[i][j]);
            }
        }
    return n1<n0?1:0;
}

function playonchess()
{
    musics[Math.floor(Math.random()*3)].play();
}

function successdraw(from,to,color)
{
    var cxt=document.getElementById("background").getContext("2d");
    cxt.lineWidth = 3;
    cxt.beginPath();
    cxt.moveTo(from[1]*35+22,from[0]*35+22)
    cxt.lineTo(to[1]*35+22,to[0]*35+22);
    cxt.closePath();
    cxt.stroke();
    cxt.font = "25px MicrosoftYaHei";
    cxt.fillStyle = "red";
    cxt.fillText("第"+historys.length+"手，"+(color==0?"黑":"白")+"方成五获胜！",135,150);
}
function dochess(x,y,c){ //落子 c=黑0:白1
    //赋值
    playonchess();
    chessboard[y][x]=c;
    historys.push([y,x]);
    started=true;

    //绘画
    var color;
    if (c)
        color="white";
    else
        color="black";
    var core=[x*35+22,y*35+22];
    var cxt=document.getElementById("background").getContext("2d");
    cxt.beginPath();
    cxt.arc(core[0],core[1],12,0,360);
    cxt.fillStyle=color;
    cxt.fill();
    cxt.closePath();

    if(historys.length>1)
    {
        var his = historys[historys.length-2];
        cxt.beginPath();
        cxt.arc(his[1]*35+22,his[0]*35+22,12,0,360);
        cxt.fillStyle=color=="white"?"black":"white";
        cxt.fill();
        cxt.closePath();

    }
    //胜利判定
    var from =[[y,x],[y,x],[y,x],[y,x]];
    var fromflag=[true,true,true,true];
    var to = [[y,x],[y,x],[y,x],[y,x]];
    var toflag=[true,true,true,true];
    for(var i=1;i<5;i++)
    {
        //横
        if(fromflag[0]&&from[0][0]-1>=0&&chessboard[from[0][0]-1][from[0][1]]==c)
            from[0][0]-=1;
        else
            fromflag[0]=false;
        if(toflag[0]&&to[0][0]+1<boardsize&&chessboard[to[0][0]+1][to[0][1]]==c)
            to[0][0]+=1;
        else
            toflag[0]=false;
        //竖
        if(fromflag[1]&&from[1][1]-1>=0&&chessboard[from[1][0]][from[1][1]-1]==c)
            from[1][1]-=1;
        else
            fromflag[1]=false;
        if(toflag[1]&&to[1][1]+1<boardsize&&chessboard[to[1][0]][to[1][1]+1]==c)
            to[1][1]+=1;
        else
            toflag[1]=false;
        //   \
        if(fromflag[2]&&from[2][0]-1>=0&&from[2][1]-1>=0&&chessboard[from[2][0]-1][from[2][1]-1]==c)
        {
            from[2][1]-=1;
            from[2][0]-=1;
        }
        else
            fromflag[2]=false;
        if(toflag[2]&&to[2][1]+1<boardsize&&to[2][0]+1<boardsize&&chessboard[to[2][0]+1][to[2][1]+1]==c)
        {
            to[2][1]+=1;
            to[2][0]+=1;
        }
        else
            toflag[2]=false;
        //   /
        if(fromflag[3]&&from[3][0]-1>=0&&from[3][1]+1<boardsize&&chessboard[from[3][0]-1][from[3][1]+1]==c)
        {
            from[3][1]+=1;
            from[3][0]-=1;
        }
        else
            fromflag[3]=false;
        if(toflag[3]&&to[3][0]+1<boardsize&&to[3][1]-1>=0&&chessboard[to[3][0]+1][to[3][1]-1]==c)
        {
            to[3][1]-=1;
            to[3][0]+=1;
        }
        else
            toflag[3]=false;
    }
    //横
    if(to[0][0]-from[0][0]>=4)
    {
        successdraw(from[0],[from[0][0]+4,from[0][1]],c)
        finished=true;
        return;
    }
    //竖
    if(to[1][1]-from[1][1]>=4)
    {
        successdraw(from[1],[from[1][0],from[1][1]+4],c)
        finished=true;
        return
    }
    //  \
    if(to[2][0]-from[2][0]>=4)
    {
        successdraw(from[2],[from[2][0]+4,from[2][1]+4],c)
        finished=true;
        return;
    }
    //  /
    if(to[3][0]-from[3][0]>=4)
    {
        successdraw(from[3],[from[3][0]+4,from[3][1]-4],c)
        finished=true;
        return;
    }

    cxt.strokeStyle = "red";
    cxt.lineWidth = 2;
    cxt.beginPath();
    cxt.moveTo(core[0]-6, core[1]);
    cxt.lineTo(core[0]-2, core[1]);
    cxt.moveTo(core[0]+2, core[1]);
    cxt.lineTo(core[0]+6, core[1]);
    cxt.moveTo(core[0], core[1]-6);
    cxt.lineTo(core[0], core[1]-2);
    cxt.moveTo(core[0], core[1]+2);
    cxt.lineTo(core[0], core[1]+6);
    cxt.closePath();
    cxt.stroke();




/*
    var rows = flat(chessboard);
    var len=0;
    for(var j=0;j<rows.length;j++)
    {
        for(var k=0;k<rows[j].length;k++)
        {
            if(rows[j][k]!=c)
                continue
            len=0;
            for(;k<rows[j].length;k++)
            {
                if(rows[j][k]==c)
                    len++;
                else
                    break;
            }
            if(len>=5)
            {
                finished=true;
                return;
            }
        }
    }
    */
}

/*
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,0,-1,0,1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,0,-1,1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,0,1,1,0,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],

*/