importScripts("subworkers.js");
importScripts("const.js","support.js");
//const.js
var debug=cdebug;
var boardsize=cboardsize;
var depth=cdepth;
//support.js
var mainz = new Zobrist(boardsize);
var ematch = new Array();
//棋盘
var chessboard = JSON.parse(JSON.stringify(cchessboard));
//其它
var historys = new Array();
var cpucolor=1;
var killer = new Worker("./kill.js");
var cresult=new Array()

importScripts("evaluate.js");

killer.onmessage = function(e)
{
	var data = e.data;
	var target=new Array()
	if(data.type=="finish_calculate")
	{
		if(data.status)
			target=data.point;
		else
			target=cresult;
		self.postMessage({
			"type":"finish_calculate",
			"point":target,
			"turn":data.turn
		});
		//落子
		killer.postMessage({
			"type":"justchess",
			"point":target,
			"turn":data.turn
		});
		chessboard[target[0]][target[1]]=data.turn;
		mainz.cal(target[0],target[1],data.turn);
		historys.push(target);
	}
}
onmessage = function(e){
	var data=e.data;
	switch(data.type)
	{
		case "justchess"://直接落子
			killer.postMessage(data);
			chessboard[data.point[0]][data.point[1]]=data.turn;
			mainz.cal(data.point[0],data.point[1],data.turn);
			historys.push(data.point);
			break;
		case "clear":
			killer.postMessage(data);
			chessboard = JSON.parse(JSON.stringify(cchessboard))
			historys=[];
			ematch=[];
			break;
		case "calculate"://落子并计算
			//落子
			killer.postMessage({
				"type":"justchess",
				"point":data.point,
				"turn":data.turn
			})
			chessboard[data.point[0]][data.point[1]]=data.turn;
			mainz.cal(data.point[0],data.point[1],data.turn);
			historys.push(data.point);
			//计算
			cpucolor = 1-data.turn;
			cfinished=false;
			var targets = calnext(chessboard,1-data.turn);
			var target = targets[1]
			if(targets[0])
			{
				self.postMessage({
					"type":"finish_calculate",
					"point":target,
					"turn":1-data.turn
				});
				//落子
				killer.postMessage({
					"type":"justchess",
					"point":target,
					"turn":1-data.turn
				});
				chessboard[target[0]][target[1]]=1-data.turn;
				mainz.cal(target[0],target[1],1-data.turn);
				historys.push(target);
			}
			else
				cresult=target;
			break;
		case "retract"://悔棋
			killer.postMessage(data);
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

function choices(board,turn) {
	var five=[]
	var four=[]
	var wfour=[]
	var tthree=[]
	var three=[]
	var two=[]
	var one=[]
	var zero=[]
	var turntthree=false;

	for (var p = 0; p < boardsize; p++)
		for (var q = 0; q < boardsize; q++)
		{
			if(board[p][q] ==-1)
			{
				if(!hasNeighbor(board,p,q,2,2))
				{
					continue
				}
				var scores = new Array()
				var flag4=false;
				board[p][q] = turn
				mainz.cal(p,q,turn);
				var temp = new Evaluate(board)
				scores[turn] = temp.calculate(turn);
				flag4=temp.flag4[turn];
				mainz.cal(p,q,turn);
				mainz.cal(p,q,1-turn);
				board[p][q] = 1-turn;
				scores[1-turn] = new Evaluate(board).calculate(1-turn)
				mainz.cal(p,q,1-turn);
				board[p][q] = -1
				if(scores[turn]>=100000)
					return [true,[p,q]];
				if(scores[1-turn]>=100000)
					five.push([p,q])
				else if(scores[turn]>=10000)
					four.unshift([p,q])
				else if(scores[1-turn]>=10000)
					four.push([p,q])
				else if(scores[turn]>=2000)
					tthree.unshift([p,q])
				else if(scores[1-turn]>=2000)
					tthree.push([p,q]);
				else if(flag4)
					wfour.push([p,q]);
				else if(scores[turn]>=1000)
					three.unshift([p,q])
				else if(scores[1-turn]>=1000)
					three.push([p,q])
				else if(scores[turn]>=100)
					two.unshift([p,q])
				else if(scores[1-turn]>=100)
					two.push([p,q])
				else if(hasNeighbor(board,p,q,1,1))
					one.push([p,q])
				else
					zero.push([p,q]);
			}
		}
	if(five.length)
	{
		return [true,five[0]];
	}
	if(four.length)
	{
		return [false].concat(four.concat(wfour));
	}
	if(tthree.length)
	{
		return [false].concat(tthree.concat(wfour))
	}
	return [false].concat(three.concat(wfour.concat(two.concat(one.concat(zero)))));
}

function calnext(board, turn) {
	switch(historys.length)
	{
		case 0:
			if(!debug)
				return [true,[7,7]];
			break
		case 1:
			if(debug)
				break;
			var ch = [-1,1,0];
			return [true,[historys[0][0]+ch[Math.floor(Math.random()*3)],historys[0][1]+ch[Math.floor(Math.random()*2)]]];
		case 2:
		case 3:
		case 4:
			depth=2;
			break;
		default:
			depth=cdepth;
	}
	var childs = choices(board,turn)
	//console.log(childs);
	if(childs[0]==false)
	{
		//传递信息
		kstatus=false;
		killer.postMessage({
			"turn":turn,
			"type":"calculate"
		});
	}
	else
	{
		return childs;
	}
	var besti = [];
	var best = -99999999;
	for (var i = 1; i < childs.length; i++) {
		board[childs[i][0]][childs[i][1]] = turn;
		mainz.cal(childs[i][0],childs[i][1],turn);
		var score = callayer(board, 1 - turn, false, 1, best);
		if (score > best)
		{
			besti = [i];
			best = score;
		}
		else if(score==best)
		{
			besti.push(i)
		}
		board[childs[i][0]][childs[i][1]] = -1;
		mainz.cal(childs[i][0],childs[i][1],turn);
	}
	return [childs[0],childs[besti[Math.floor(Math.random()*besti.length)]]]
}

function callayer(board, turn, max, count, alpha) {
	if (count == depth)
	{
		return (new Evaluate(board).calculate(2));
	}
	var childs = choices(board,turn)
	var best=max?-99999999:99999999;
	for (var i = 1; i < childs.length; i++) {
		//回溯法
		board[childs[i][0]][childs[i][1]] = turn;
		mainz.cal(childs[i][0],childs[i][1],turn);
		var ascore = callayer(board, 1 - turn, !max, count + 1,best);
		if (max&&ascore>alpha)
		{
			board[childs[i][0]][childs[i][1]] = -1;
			mainz.cal(childs[i][0],childs[i][1],turn);
			return ascore
		}
		if(!max&&ascore<alpha)
		{
			board[childs[i][0]][childs[i][1]] = -1;
			mainz.cal(childs[i][0],childs[i][1],turn);
			return ascore
		}
		if(max&&ascore>best)
			best=ascore;
		else if (!max&&ascore<best)
			best=ascore;
		board[childs[i][0]][childs[i][1]] = -1;
		mainz.cal(childs[i][0],childs[i][1],turn);
	}
	return best

}