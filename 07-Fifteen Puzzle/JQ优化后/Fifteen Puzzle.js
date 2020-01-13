/*
    张楚明 18342125
    Fifteen Puzzle.js
*/
var click_times;

$("#begin").click(function(){
    click_times = 0;
    renew();
});

//生成随机数组
function random_num(){
    var judge;
    var randoms = new Array;
    for(var i = 0; i < 16; ++i){
        judge = 0;
        var j = Math.round(Math.random() * 15) + 1;
        for(var k = 0; k < randoms.length; ++k){
            if(j == randoms[k]){
                judge = 1;
                i--;
                break;
            }
        }
        if(judge == 0)
            randoms.push(j);
    }
    return randoms;
}

//重新排列
function renew(){
    $("#main").empty();
    var arr = random_num();
    for(var i = 0; i < arr.length; ++i){
        var img = document.createElement('img');    //动态创建img标签
        img.setAttribute("src", "images/slice_" + arr[i] + ".png");
        img.id = "img" + arr[i];
        img.setAttribute("onclick", "move(this)");
        $("#main").append(img);
    }
    is_capable();
}

//保证拼图是可以完成的
function is_capable(){
    var is_capable = 0;
    for(var i = 0; i < 16; ++i)
    {
        for(var j = i + 1; j < 16; ++j)
            if($("img").eq(i).attr("id.length") > $("img").eq(j).attr("id.length") || ($("img").eq(i).attr("id.length") == $("img").eq(j).attr("id.length") && $("imgn").eq(i).attr("id") > $("img").eq(j).attr("id")))
                is_capable++;

        if($("img").eq(i).attr("id") == "img16"){
            var row = Math.floor((i / 4) + 1);
            var col = (i % 4) + 1;
            is_capable = is_capable + row + col;
        }
    }
    if(is_capable % 2 != 0)
        renew();
}

function move(obj){
    click_times++;
    var pos;
    var blank;
    for(var i = 0; i < 16; ++i){
        if(obj.id == $("img").eq(i).attr("id"))
            pos = i;
        if($("img").eq(i).attr("id") == "img16")
            blank = i;
    }
    if(pos != blank){
        if(pos + 4 == blank || pos - 4 == blank)
            swap(pos, blank);
        else if(pos + 1 == blank && blank != 4 && blank != 8 && blank != 12)
            swap(pos, blank);
        else if(pos - 1 == blank && blank != 3 && blank != 7 && blank != 11 && blank != 15)
            swap(pos, blank);
    }
}

function swap(pos, blank) {
    var arr = $("#main").find('img').toArray();
    var temp = arr[pos];
    arr[pos] = arr[blank];
    arr[blank] = temp;
    $("#main").html(arr);
    isFinish();
}

function isFinish() {
    var judge = 1;
    for(var i = 0; i < 16; ++i){
        if($("img").eq(i).attr("id") != ("img" + (i + 1))){
            judge = 0;
            break;
        }
    }
    if(judge == 1)
        alert("恭喜你完成了拼图!\n共用次数: " + click_times + " 次");
}
