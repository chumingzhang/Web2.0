/*
    姓名：张楚明   学号：18342125
    S1：人工交互->index.js
*/

$(document).ready(function() {
    var count = 0;

    //click the big cycle
    $("#info-bar").click(function(e) {
        var me = $(this);

        if(!me.attr("valid"))
            return;
        
        //put li into array
        $("#sum").text(
            $("#control-ring li .unread")
                .toArray()
                .map(x => parseInt($(x).text()))
                .reduce((a, b) => a + b)
        );
        me.removeAttr("valid");
    });

    //Clear
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

    $("#control-ring li").click(function(e) {
        var me = $(this);
        var pre = count;

        if(me.attr("value") || $("#control-ring").attr("calculating"))
            return;

        //set calculating and keep others stop
        me.find(".unread").text("...");
        me.attr("calculating", "calculating").attr("value", "...");
        $("#control-ring").attr("calculating", "calculating");

        fetch("http://localhost:3000/api")
            .then(res => res.text())
            .then(data => {
                if (count !== pre)
                    return;
                //after getting the random number, relase others
                me.find(".unread").text(data);
                me
                    .removeAttr("calculating")
                    .attr("calculated", "calculated")
                    .attr("value", data);
                $("#control-ring").removeAttr("calculating");

                var left = $("#control-ring li")
                    .toArray()
                    .filter(x => $(x).attr("value") === "..." || !$(x).attr("value"));
                
                //if each li is calculated, then show the sum
                if (left.length == 0)
                    $("info-bar").attr("valid", "valid");
            })
            .catch(err => console.log(err));
    });
});