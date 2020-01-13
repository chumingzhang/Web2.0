function updatetime(role)
{
    if(role=="com")
    {
        timecom[3]+=timebit;
        if(timecom[3]>=1000)
        {
            timecom[3]-=1000;
            timecom[2]+=1;
            if(timecom[2]>=60)
            {
                timecom[2]-=60;
                timecom[1]+=1;
                if(timecom[1]>=60)
                {
                    timecom[1]-=60;
                    timecom[0]+=1;
                }
            }
            document.getElementById("comtime").value=(timecom[0]>9?timecom[0].toString():"0"+timecom[0])+":"+(timecom[1]>9?timecom[1].toString():"0"+timecom[1])+":"+(timecom[2]>9?timecom[2].toString():"0"+timecom[2]);

        }
    }
    else
    {
        timeusr[3]+=timebit;
        if(timeusr[3]>=1000)
        {
            timeusr[3]-=1000;
            timeusr[2]+=1;
            if(timeusr[2]>=60)
            {
                timeusr[2]-=60;
                timeusr[1]+=1;
                if(timeusr[1]>=60)
                {
                    timeusr[1]-=60;
                    timeusr[0]+=1;
                }
            }
            document.getElementById("usrtime").value=(timeusr[0]>9?timeusr[0].toString():"0"+timeusr[0])+":"+(timeusr[1]>9?timeusr[1].toString():"0"+timeusr[1])+":"+(timeusr[2]>9?timeusr[2].toString():"0"+timeusr[2]);

        }
    }
}

window.onload=function(){
    var background=document.getElementById("background");
    background.style.left=parseInt((document.body.clientWidth-background.width)/2).toString()+"px";
    var doback = document.getElementById("back");
    var doexport = document.getElementById("export");
    var youfirst = document.getElementById("youfirst");
    var calculater = new Worker("calculate.js");
    turn = initdraw(chessboard);


    youfirst.onclick = function(e)
    {
        started=false;
        finished=false;
        window.clearInterval(interval)
        calculater.postMessage({
            "type" : "clear"
        });
        timecom=[0,0,0,0];
        timeusr=[0,0,0,0];
        document.getElementById("usrtime").value="00:00:00"
        document.getElementById("comtime").value="00:00:00"
        chessboard = JSON.parse(JSON.stringify(cchessboard))
        historys=[];
        var cxt=document.getElementById("background").getContext("2d");
        cxt.clearRect(0,0,1000,1000);
        var comimg=document.getElementById("comchesspng")
        var usrimg=document.getElementById("usrchesspng")
        if(document.getElementById("com").checked)
        {
            calculater.postMessage({
                "type" : "justchess",
                "point" : [7,7],
                "turn" : 0
            });
            dochess(7,7,0);
            turn=1;
            comimg.style['background-image']="url(img/1.png)"
            comimg.style.height="50px"
            comimg.style.width="50px"

            usrimg.style['background-image']="url(img/2.png)"
            usrimg.style.height="50px"
            usrimg.style.width="50px"
        }
        else if(document.getElementById("user").checked)
        {
            comimg.style['background-image']="url(img/2.png)"
            comimg.style.height="50px"
            comimg.style.width="50px"

            usrimg.style['background-image']="url(img/1.png)"
            usrimg.style.height="50px"
            usrimg.style.width="50px"
            turn=0;
        }
    }

    //悔棋
    doback.onclick = function(e)
    {
        var ev = e || window.event;
        var cxt=document.getElementById("background").getContext("2d");
        var len = historys.length;
        if (finished||calculating||len<2)
            return

        calculater.postMessage({
            "type" : "retract",
            "turn" : 1-turn
        });

        var point1 = historys.pop()
        chessboard[point1[0]][point1[1]]=-1;
        cxt.clearRect(point1[1]*35+10,point1[0]*35+10,25,25)

        point1 = historys.pop()
        chessboard[point1[0]][point1[1]]=-1;
        cxt.clearRect(point1[1]*35+10,point1[0]*35+10,25,25)
        if(historys.length>0)
        {
            var core=[historys[historys.length-1][1]*35+22,historys[historys.length-1][0]*35+22];
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
        }

        finished=false;
    }

    //棋盘状态导出
    /*
    doexport.onclick = function(e)
    {
        var str="";
        for(var i=0;i<15;i++)
        {
            str+="["+chessboard[i].toString()+"],\n"
        }
        console.log(str);
    }
    */
    //消除棋盘右击菜单
    background.oncontextmenu = function(e){
        e.preventDefault();
    };

    /*DEBUG用，按键定位*/
    background.onmouseup = function(e)
    {
        var ev = e || window.event;
        if(ev.button!=2)
            return
        var x = ev.offsetX-22
        var y = ev.offsetY-22
        var tx = parseInt(x/35+0.5)
        var ty = parseInt(y/35+0.5)
        console.log(ty,tx)
    }

    //棋盘点击操作
    background.onclick=function(e){
        //判断是否可下棋
        if(calculating||finished)
            return;
        else
            calculating=true;
        if(started)
            window.clearInterval(interval)
        started=true;
        //点击定位
        var ev = e || window.event;
        var x = ev.offsetX-22
        var y = ev.offsetY-22
        var tx = parseInt(x/35+0.5)
        var ty = parseInt(y/35+0.5)
        if(chessboard[ty][tx]!=-1)
        {
            calculating=false;
            return;
        }
        console.log("clicked!");

        //下棋
        dochess(tx,ty,turn)
        turn=1-turn;
        if(finished)
        {
            calculating=false;
            return
        }
        //传递消息开始计算
        calculater.postMessage({
            "type" : "calculate",
            "point" : [ty,tx],
            "turn" : 1-turn
        });
        console.time("Runtime")
        interval = setInterval("updatetime('com')",timebit);
    }
    calculater.onmessage = function(e)
    {
        var data=e.data;
        if(data.type=="finish_calculate")
        {
            if(turn!=data.turn)
            {
                console.log("Turn ERROR!");
                return;
            }
            window.clearInterval(interval)
            console.timeEnd("Runtime")
            dochess(data.point[1],data.point[0],data.turn);
            turn=1-turn;
            calculating=false;
            if(!finished)
                interval = setInterval("updatetime('usr')",timebit);
        }
    };
}

window.onresize=function(){
    var background=document.getElementById("background")
    background.style.left=parseInt((document.body.clientWidth-background.width)/2).toString()+"px";
}