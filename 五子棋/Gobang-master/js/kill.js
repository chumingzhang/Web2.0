importScripts("subworkers.js");
importScripts("const.js","evaluate.js","support.js");
//const.js
var debug=cdebug;
var boardsize=cboardsize;
var maxdepth=cmaxdepth;
//support.js
var mainz = new Zobrist(boardsize);
var ematch = new Array();
//棋盘
var chessboard = JSON.parse(JSON.stringify(cchessboard));
//其它
var historys = new Array();
var cpucolor=1;
var alle=0;
var one=0;
onmessage = function(e){
	var data=e.data;
	switch(data.type)
	{
		case "justchess"://直接落子
			chessboard[data.point[0]][data.point[1]]=data.turn;
			mainz.cal(data.point[0],data.point[1],data.turn);
			historys.push(data.point);
			break;
		case "clear":
			chessboard = JSON.parse(JSON.stringify(cchessboard))
			historys=[];
			ematch=[];
			break;
		case "calculate"://计算
			//计算
			cpucolor = data.turn;
			//console.log("111")
			var result=maxkill(chessboard,data.turn,1);
			console.log("message_return")
			//返回消息
			if(result)
			{
				self.postMessage({
					"type":"finish_calculate",
					"status":true,
					"point":result,
					"turn":data.turn
				});
			}
			else
			{
				self.postMessage({
					"type":"finish_calculate",
					"status":false,
					"turn":data.turn
				});
			}
			break
		case "retract"://悔棋
			var point1 = historys.pop();
			chessboard[point1[0]][point1[1]]=-1;
			mainz.cal(point1[0],point1[1],data.turn);

			point1 = historys.pop();
			chessboard[point1[0]][point1[1]]=-1;
			mainz.cal(point1[0],point1[1],1-data.turn);
			break;
		default:
			break;

	}
}

function killchoices(board,turn,main)
{
	var five=[]
	var hfour=[]
	var four=[]
	var tthree=[]
	var three=[]
	for (var p = 0; p < boardsize; p++)
		for (var q = 0; q < boardsize; q++)
		{
			if(board[p][q] ==-1)
			{
				if(!hasNeighbor(board,p,q,2,2))
					continue;
				if(main)
				{
					var score;
					board[p][q] = turn;
					mainz.cal(p,q,turn);
					score = new Evaluate(board).calculate(turn);
					mainz.cal(p,q,turn);
					board[p][q] = -1
					if(score>=100000)
						return [true,[p,q]];
					else if(score>=10000)
						four.unshift([p,q]);
					else if(score>=2000)
						tthree.unshift([p,q]);
					else if(score>=1000)
						three.unshift([p,q]);
				}
				else
				{
					var scores = new Array()
					var flag4 = false;
					board[p][q] = turn
					mainz.cal(p,q,turn);
					var temp = new Evaluate(board)
					scores[turn] = temp.calculate(turn)
					flag4 = temp.flag4[turn];
					mainz.cal(p,q,turn);
					mainz.cal(p,q,1-turn);
					board[p][q] = 1-turn
					scores[1-turn] = new Evaluate(board).calculate(1-turn)
					mainz.cal(p,q,1-turn);
					board[p][q] = -1
					if(scores[turn]>=100000)
						return [true,[p,q]];
					else if(scores[1-turn]>=100000)
						five.push([p,q]);
					else if(scores[turn]>=10000)
						hfour.push([p,q]);
					else if(scores[1-turn]>=10000)
						four.push([p,q]);
					else if(flag4&&scores[turn]>=1000)
						three.push([p,q]);
				}
			}
		}
	if(!main&&five.length)
		return [false,five[0]];
	else if(!main&&hfour.length)
		return [true,hfour[0]];
	return [false].concat(four.concat(tthree.concat(three)));
}



function maxkill(board,turn,deep)
{

	if(deep>maxdepth)
		return false
	var childs = killchoices(board,turn,true)
	//console.log("max",childs,deep)
	if(childs[0]==true)
		return childs[1];
	if(childs.length==1)
		return false;
	for (var i = 1; i < childs.length; i++) {

		board[childs[i][0]][childs[i][1]] = turn;
		mainz.cal(childs[i][0],childs[i][1],turn);
		var result = minkill(board, 1 - turn, deep+1);
		board[childs[i][0]][childs[i][1]] = -1;
		mainz.cal(childs[i][0],childs[i][1],turn);

		if(result)
			return childs[i];
	}
	return false;
}

function minkill(board,turn,deep)
{
	if(deep>maxdepth)
		return false
	var childs = killchoices(board,turn,false)
	//console.log("min",childs,deep);
	if(childs[0]==true)
		return false;
	if(childs.length==1)
		return false;
	for (var i = 1; i < childs.length; i++) {

		board[childs[i][0]][childs[i][1]] = turn;
		mainz.cal(childs[i][0],childs[i][1],turn);
		var result = maxkill(board, 1 - turn, deep+1);
		board[childs[i][0]][childs[i][1]] = -1;
		mainz.cal(childs[i][0],childs[i][1],turn);

		if(!result)
			return false;
	}
	return true;
}