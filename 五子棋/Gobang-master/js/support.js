//二维棋盘一维化
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
//提取一条--辅助flat
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

//查看在一定范围内是否有棋子
function hasNeighbor(board,i,j,x,y)
{
    for(var p=Math.max(i-x,0);p<=Math.min(i+x,boardsize-1);p++)
        for(var q=Math.max(j-y,0);q<=Math.min(j+y,boardsize-1);q++)
            if(board[p][q]>=0)
                return true
    return false
}

//深拷贝
function deepcopy(obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++)
    {
        if (obj[i] instanceof Array)
        {
            out[i] = deepcopy(obj[i]);
        }
        else
        	out[i] = obj[i];
    }
    return out;
}

//Zobrist哈希
var Zobrist = function(size)
{
    this.size=size;
    this.zero = [];
    this.one = [];
    for(var i=0;i<this.size*this.size;i++) {
        this.zero.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        this.one.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    }
    this.code = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

Zobrist.prototype.cal = function(x,y,color)
{
    var index = this.size*x+y;
    this.code ^= (color == 0 ? this.zero[index] : this.one[index]);
    return this.code;
}