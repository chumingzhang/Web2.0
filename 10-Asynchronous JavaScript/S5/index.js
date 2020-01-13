/*
    姓名：张楚明   学号：18342125
    S5：仿真机器人，独立行为（终极秘密）->index.js
*/

$(document).ready(function() {
    var count = 0;
    ChangeCss();
    $("#apb").click(function(e) {
        if($("#sum").text())
            return;

        //put li into array and show message
        var handlers = exchange([
            addComment(1, "这是个天大的秘密", ""),
            addComment(2, "我不知道", ""),
            addComment(3, "你不知道", ""),
            addComment(4, "他不知道", ""),
            addComment(5, "才怪", "")
        ]);

        //show result
        handlers.push(addHandler);
        //automatic calculate
        autoCal(handlers, 0, 0);
    });

    //clear
    $("#bottom-positioner").mouseenter(function(e) {
        count++;
        $("#sum").text("");
        $("#info-bar").removeAttr("valid");
        $("#control-ring").removeAttr("calculating");
        $("#control-ring li")
            .removeAttr("value")
            .removeAttr("calculating")
            .removeAttr("calculated");
        $("#control-ring li .unread").text("...");
    });

    $("#bottom-positioner").mouseleave(function(e) {
        count++;
    });

    //Asynchronous click
    function async(ele) {
        return new Promise(function(resolve, reject) {
            if(ele.attr("value") || $("#control-ring").attr("calculating"))
                return;
            
            //set calculating and keep others stop
            ele.find(".unread").text("...");
            ele.attr("calculating", "calculating").attr("value", "...");
            $("#control-ring").attr("calculating", "calculating");
            
            var pre = count;

            //fetch all the cache at the same time
            fetch("http://localhost:3000/api")
                .then(res => res.text())
                .then(data => {
                    if(count !== pre)
                        return;
                    
                    //after getting the random number, relase others
                    ele.find(".unread").text(data);
                    ele
                        .removeAttr("calculating")
                        .attr("calculated", "calculated")
                        .attr("value", data);
                    $("#control-ring").removeAttr("calculating");

                    //judge whether there is any li that haven't been clicked 
                    var left = $("#control-ring li")
                        .toArray()
                        .filter(x => $(x).attr("value") === "..." || !$(x).attr("value"));
                    
                    //if each li is calculated, then show the sum
                    if(left.length == 0)
                        $("#info-bar").attr("valid", "valid");
                    
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    }

    function addComment(i, a, b) {
        return function(currentSum, resolve, reject) {
            showResult(a);
            async($(`#control-ring li:nth-child(${i})`))
                .then(res => {
                    if(Math.random() >= 0.5)
                        throw "";
                    resolve(currentSum + parseInt(res));
                })
                .catch(err => reject({ message: b, currentSum }));
        };
    }

    function addHandler(currentSum, resolve, reject) {
        if(Math.random() >= 0.5) {
            return reject(currentSum);
        }
        showResult("楼主异步调用战斗力感人，目测不超过" + currentSum);
    }

    function autoCal(handlers, index, currentSum) {
        if(index >= handlers.length)
            return;
        
            var pre = count;
            handlers[index](
                currentSum,
                function(nextSum) {
                    if(count !== pre)
                        return;
                    //recursion
                    autoCal(handlers, index + 1, nextSum);
                },
                function(err) {
                    if(count !== pre)
                        return;
                    showResult(err.message);
                }
            );
    }

    function showResult(x) {
        $("#sum").text(x);
    }
});

//randomly exchange the index of the items
function exchange(arr) {
    for(var i = arr.length - 1; i >= 0; --i) {
        var randomIndex = Math.floor(Math.random() * (i + 1));

        var itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}

function ChangeCss() {
    $(".comment").removeAttr("style");
    $(".comment span").removeAttr("style");

    $(".page").css({
        "left": "8px",
        "top": "45px",
        "width": "120px"
    });

    $(".page span").css({
        "color": "white",
        "showResult": "inline-block",
        "font-size": "20px",
        "font-weight": "bold",
        "text-align": "center"
    })
}