
function choices(board,turn) {
	var five=[]
	var four=[]
	var tthree=[]
	var three=[]
	var two=[]
	var one=[]
	var zero=[]

	for (var p = 0; p < boardsize; p++)
		for (var q = 0; q < boardsize; q++)
		{
			if(!hasNeighbor(board,p,q))
			{
				zero.push([p,q])
				continue
			}
			var scores = new Array()
			board[p][q] = 0
			mainz.cal(p,q,0);
			scores[0] = evaluate(board)[0]
			mainz.cal(p,q,0);
			mainz.cal(p,q,1);
			board[p][q] = 1
			scores[1] = evaluate(board)[1]
			mainz.cal(p,q,1);
			board[p][q] = -1
			if(scores[cpucolor]>=100000)
			{
				return [[p,q]];
			}
			if(scores[1-cpucolor]>=100000)
				five.push([p,q])
			else if(scores[cpucolor]>=10000)
			{
				four.unshift([p,q])
			}
			else if(scores[1-cpucolor]>=10000)
				four.push([p,q])
			else if(scores[cpucolor]>=2000)
				tthree.unshift([p,q])
			else if(scores[1-cpucolor]>=2000)
				tthree.push([p,q])
			else if(scores[cpucolor]>=1000)
				three.unshift([p,q])
			else if(scores[1-cpucolor]>=1000)
				three.push([p,q])
			else if(scores[cpucolor]>=100)
				two.unshift([p,q])
			else if(scores[1-cpucolor]>=100)
				two.push([p,q])
			else
				one.push([p,q])
		}
	if(five.length)
	{
		return [five[0]]
	}
	if(four.length)
	{
		return four
	}
	if(tthree.length)
	{
		return tthree
	}
	return three.concat(two.concat(one.concat(zero)))
}

function getfrommax(ary, max) {
	if (max)
		return Math.max.apply(null, ary)
	else
		return Math.min.apply(null, ary)
}


function calnext(board, turn) {
	console.time("1")
	var childs = choices(board,turn)
	console.timeEnd("1")
	flag=false
	var besti = 0;
	var best = -99999999;
	for (var i = 0; i < childs.length; i++) {
		board[childs[i][0]][childs[i][1]] = turn;
		mainz.cal(childs[i][0],childs[i][1],turn);
		var score = callayer(board, 1 - turn, false, 1, best);
		if (score > best) {
			besti = i;
			best = score
		}
		board[childs[i][0]][childs[i][1]] = -1;
		mainz.cal(childs[i][0],childs[i][1],turn);
	}
	return childs[besti]
}

function callayer(board, turn, max, count, alpha) {
	if (count == depth)
	{
		return evaluate(board)[2]
	}
	var childs = choices(board,turn)
	var best=max?-99999999:99999999;
	for (var i = 0; i < childs.length; i++) {
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