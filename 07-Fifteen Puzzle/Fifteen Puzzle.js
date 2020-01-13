/*
    张楚明 18342125
    Fifteen Puzzle.js
*/
var div;
var click_times;

window.onload = function() {
    document.getElementById("begin").addEventListener("click", starts);
};


function starts(){
    click_times = 0;
    var x = [100]
    var y;
    div = document.getElementById("main");
    
    //删除div里所有子节点
    var length = div.children.length;
    for(var i = 0; i < length; ++i){
        div.removeChild(div.children[0]);
    }

    //重新把拼图块随机排列放入div
    for(var i = 1; i <= 16; ++i){
        var img = document.createElement('img');    //动态创建img标签
        var p = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        var j = Math.round(Math.random() * 15);
        for(var u = 0; u < x.length; ++u)
        {
            if(x[u] == p[j]){
                y = p[j];
                break;
            }
        }
        
        if(p[j] == y){
            i -= 1;
            continue;
        }
        else{
            img.setAttribute("src", "images/slice_" + p[j] + ".png");
            img.setAttribute("onclick", "move(this)");
            img.id = "img" + p[j];
        }
        div.appendChild(img);
        x.push(p[j]);
    }

    //以下用来保证拼图是可以完成的
    var is_capable = 0;
    for(var i = 0; i < 16; ++i)
    {
        for(var j = i + 1; j < 16; ++j)
        {
            if(div.children[i].id.length > div.children[j].id.length || (div.children[i].id.length == div.children[j].id.length && div.children[i].id > div.children[j].id))
            {
                // alert(i + "  " + div.children[i].id + "  " + j + "   " + div.children[j].id)
                is_capable++;
            }
        }
        if(div.children[i].id == "img16")
        {
            var row = Math.floor((i / 4) + 1);
            var col = (i % 4) + 1;
            is_capable = is_capable + row + col;
        }
        // alert(is_capable);
    }
    if(is_capable % 2 != 0)
        starts();
}

function move(obj){
    click_times++;
    var pos;
    var blank;
    for(var i = 0; i < 16; ++i){
        if(obj.id == div.children[i].id)
            pos = i;
        if(div.children[i].id == "img16")
            blank = i;
    }
    if(pos == blank)
        return;
    else{
        if(pos + 4 == blank || pos - 4 == blank){
            swap(pos, blank);
        }
        else if(pos + 1 == blank && blank != 4 && blank != 8 && blank != 12){
            swap(pos, blank);
        }
        else if(pos - 1 == blank && blank != 3 && blank != 7 && blank != 11 && blank != 15){
            swap(pos, blank);
        }
    }
}



function swap(pos, blank) {
    var temp1 = div.children[pos].cloneNode(true);
    var temp2 = div.children[blank].cloneNode(true);;
    div.replaceChild(temp1, div.children[blank]);
    div.replaceChild(temp2, div.children[pos]);
    isFinish();
}

function isFinish() {
    var judge = 1;
    for(var i = 0; i < 16; ++i){
        if(div.children[i].id != ("img" + (i + 1))){
            judge = 0;
            break;
        }
    }
    if(judge == 1){
        alert("恭喜你完成了拼图!\n共用次数: " + click_times + " 次");
    }
}
