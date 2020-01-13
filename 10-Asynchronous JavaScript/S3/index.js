/*
    姓名：张楚明   学号：18342125
    S3：仿真机器人，并行（五指金龙）->index.js
*/

$(document).ready(function() {
    var count = 0;

    $("#apb").click(function(e) {
        if($("#sum").text())
            return;

        //put li into array
        var promises = $("#control-ring li")
            .toArray()
            .map(li => async($(li)));
        
        Promise.all(promises).then(() => onInfoBarClicked($("#info-bar")));
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
            if(ele.attr("value"))
                return;
            
            //set calculating and keep others stop
            ele.find(".unread").text("...");
            ele.attr("calculating", "calculating").attr("value", "...");
            $("#control-ring").attr("calculating", "calculating");
            
            var pre = count;

            //fetch all the cache at the same time
            fetch("http://localhost:3000/api", {
                hreaders: {
                    "Cache-Control": "no-cache"
                }
            })
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
                    
                    resolve();
                })
                .catch(err => reject(err));
        });
    }

    //click the big cycle
    function onInfoBarClicked(ele) {
        return new Promise(function(resolve, reject) {
            if(!ele.attr("valid"))
                return;
            
                $("#sum").text(
                    $("#control-ring li .unread")
                        .toArray()
                        .map(ele => parseInt($(ele).text()))
                        .reduce((a, b) => a + b, 0)
                );
                ele.removeAttr("valid");
        });
    }
});