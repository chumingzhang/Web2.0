

var Evaluate = function(board)
{
	this.board = board;
	this.flag4 = [false,false];
	this.tempflag4 = false;
	this.calscore = function(len,block)
	{
		if(len>=5)
			return 100000;
		if(block==2)
			return 0
		if(len==4&&block==1)
			this.tempflag4=true;
		var match=[1,10,100,1000,10000];
		return match[len-block]
	}
	this.doscore = function(row,color)
	{
		var len,block;
		var score=0;
		var flag=true;
		var bflag=false
		var lastblack=-1;
		for(var j=0;j<row.length;j++)
		{
			if(row[j]!=color)
			{
				if(row[j]==1-color)
					lastblack=j;
				continue
			}
			if(j==0||row[j-1]!=-1||bflag)
				block=1
			else
				block=0
			len=0;
			flag=true;
			bflag=false;
			for(;j<row.length;j++)//存在 00*00 隐患
			{
				if(row[j]==color)
				{
					len++;
					if(len>=5)
					{
						score+=this.calscore(5,0);
						break;
					}
				}
				else if(row[j]==-1&&j!=row.length-1&&row[j+1]==color&&(len<=3||(block&&len==4)))
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
					var bblock=false;
					if(t==row.length||row[t]!=-1)
						bblock=true
					if(tlen-len>=5)
					{
						score+=this.calscore(5,0);//成五
						j=t;
					}
					else if(block&&bblock)//全堵
					{
						if(tlen>=4)
							score+=this.calscore(4,1);//伪四
						lastblack=t;
						j=t;
					}
					else if(!bblock&&tlen-len==4)//后活四
					{
						score+=this.calscore(4,0);//活四
						j=t;
					}
					else if(!bblock&&!block)//不堵
					{
						score+=this.calscore(Math.min(tlen,3),0)-2*this.calscore(tlen-len,1);//伪tlen+1
						bflag=true;
					}
					else//堵一个
					{
						score+=this.calscore(Math.min(tlen,4),1);
						if(bblock)
						{
							j=t;
							lastblack=t;
						}
						else
						{
							bflag=true;
							score-=2*this.calscore(tlen-len,1)
						}
					}
					break;
				}
				else
					break;
			}
			if(j==row.length||row[j]!=-1)
				block++;
			if(flag)
			{
				if(block<2&&j>lastblack&&j-lastblack<=6)
				{
					for(var k=1;k<=5;k++)
					{
						if(j+k==row.length||row[j+k]==1-color)
							break
					}
					if(j+k-lastblack<6)
						block=2
					else if(j+k-lastblack==6)
						block=1;
				}
				if(j==row.length||row[j]!=-1)
					lastblack=j;
				score+=this.calscore(len,block)
			}
		}
		return score;
	}
}


Evaluate.prototype.calculate = function(turn)
{
	if(ematch.hasOwnProperty(mainz.code)&&ematch[mainz.code][turn]!=undefined)
	{
		return ematch[mainz.code][turn];
	}
	var rows = flat(this.board)
	var score0=0;
	var score1=0;
	var l = rows.length;
	for(var i=0;i<l;i++)
	{
		if(turn!=1)
		{
			this.tempflag4=false;
			score0+=this.doscore(rows[i],0);
			if(this.tempflag4)
				this.flag4[0]=true;
		}
		if(turn!=0)
		{
			this.tempflag4=false;
			score1+=this.doscore(rows[i],1);
			if(this.tempflag4)
				this.flag4[1]=true;
		}
	}
	if(turn==0)
	{
		if(!ematch.hasOwnProperty(mainz.code))
			ematch[mainz.code]=new Array()
		ematch[mainz.code][0]=score0;
		return score0
	}
	if(turn==1)
	{
		if(!ematch.hasOwnProperty(mainz.code))
			ematch[mainz.code]=new Array()
		ematch[mainz.code][1]=score1;
		return score1;
	}
	if(!ematch.hasOwnProperty(mainz.code))
			ematch[mainz.code]=new Array()
	ematch[mainz.code] = [score0,score1,cpucolor?score1-score0:score0-score1];
	return ematch[mainz.code][2];
}