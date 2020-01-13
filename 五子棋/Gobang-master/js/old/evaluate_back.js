
function getarow(board,i,j,changei,changej)
{
	var row = new Array()
	while(i>=0&&i<boardsize&&j>=0&&j<boardsize)
	{
		row.push((board[i][j]))
		i+=changei
		j+=changej
	}
	return row
}


function flat(board)
{
	var rows = new Array()
	var i,j;
	//横
	for(i=0;i<boardsize;i++)
	{
		rows.push(board[i])
	}
	//竖
	for(i=0;i<boardsize;i++)//第i列
	{
		var arow = new Array()
		for(j=0;j<boardsize;j++)
			arow.push(board[j][i])
		rows.push(arow)
	}
	//斜
	rows.push(getarow(board,0,0,1,1))//右下对角线
	rows.push(getarow(board,0,boardsize-1,1,-1))//左下对角线
	i=1;
	while(i<boardsize)
	{
		var row1 = getarow(board,i,0,1,1)
		if(row1.length>4)
			rows.push(row1)
		else
			break //一个不够，其它的肯定都不够，之后的也不可能够

		var row2 = getarow(board,0,i,1,1)
		if (row2.length>4)
			rows.push(row2)

		var row3 = getarow(board,0,boardsize-1-i,1,-1)
		if (row3.length>4)
			rows.push(row3)

		var row4 = getarow(board,i,boardsize-1,1,-1)
		if (row4.length>4)
			rows.push(row4)

		i++;
	}
	return rows;

}

function calscore(len,block)
{
	if(len>=5)
		return 100000;
	if(block==2)
		return 0
	var match=[1,10,100,1000,10000];
	return match[len-block]
}



function doscore(row,color)
{
	var len,block;
	var score=0;
	var flag=true;
	for(var j=0;j<row.length;j++)
	{
		if(row[j]!=color)
			continue
		if(j==0||row[j-1]!=-1)
			block=1
		else
			block=0
		len=0;
		flag=true
		for(;j<row.length;j++)//存在 00*00 隐患
		{
			if(row[j]==color)
				len++
			else if(len<=4&&(!block||len>1)&&row[j]==-1&&j!=row.length-1&&row[j+1]==color)
			{
				flag=false
				var tlen=len;
				for(var t=j+1;t<row.length;t++)
				{
					if(row[t]==color)
						tlen++;
					else
						break;
				}
				if(tlen>=4)
					if(block&&(t==row.length||row[t]!=-1))
						score+=calscore(3,1);
					else
						score+=calscore(4,1)
				else if(!block||(t!=row.length&&row[t]==-1))
					score+=calscore(tlen,1)

				if(t==row.length||row[t]!=-1)
					j=t;
				break;
			}
			else
				break;
		}
		if(j==row.length||row[j]!=-1)
			block++;
		if(flag)
			score+=calscore(len,block)
	}
	return score;
}


function evaluate(board)
{
	var rows = flat(board)
	var score0=0;
	var score1=0;
	var l = rows.length;
	for(var i=0;i<l;i++)
	{
		score0+=doscore(rows[i],0);
		score1+=doscore(rows[i],1);
	}
	//output("score:"+score0.toString()+" "+score1.toString(),board)
	return [score0,score1,cpucolor?score1-score0:score0-score1];
}