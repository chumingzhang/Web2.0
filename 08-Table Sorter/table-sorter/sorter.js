/*
    张楚明 18342125
    Table Sorter.js
*/


var up_down = true;

$("th").click(function(){
    $(this).parent().children("th").css("background-color", "#191970");
    $(this).css("background-color", "#ADD8E6");
    var col = $(this).index();                      //比较的列
    //添加图片
    if(up_down == true)
        $(this).parent().children("th").children("img").attr("src", "ascend.png");
    else
        $(this).parent().children("th").children("img").attr("src", "descend.png");
                                                         
    var rows = $(this).parents("table").children("tbody").children("tr");            //tbody中的所有行
    var cols = [];
    for(var i = 0; i < 3; ++i)
        cols.push(rows.children()[i * 3 + col]);
    
    for(var i = 0; i < 3; ++i){
        for(var j = i + 1; j < 3; ++j){
            if(up_down == true && cols[i].textContent > cols[j].textContent){
                var temp = rows[i];
                rows[i] = rows[j];
                rows[j] = temp;
            }
            else if(up_down == false && cols[i].textContent < cols[j].textContent){
                var temp = rows[i];
                rows[i] = rows[j];
                rows[j] = temp;
            }
        }
    }
    var tbody = $(this).parents("table").children("tbody").empty();
    for(var i = 0; i < 3; ++i){
        tbody.append(rows[i]);
    }
    up_down = !up_down;
});