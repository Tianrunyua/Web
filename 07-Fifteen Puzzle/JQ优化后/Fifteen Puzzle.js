/*
    张楚明 18342125
    Fifteen Puzzle.js
*/
var click_times;

$("#begin").click(function(){
    click_times = 0;
    $("#main").empty();
    renew();
});

//重新排列
function renew(){
    var x = [100]
    var y;
    for(var i = 1; i <= 16; ++i){
        var img = document.createElement('img');    //动态创建img标签
        var p = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        var j = Math.round(Math.random() * 15);
        for(var u = 0; u < x.length; ++u){
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
            img.id = "img" + p[j];
        }
        $("#main").append(img);
        x.push(p[j]);
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

$("img").click(function(){
    click_times++;
    var pos;
    var blank;
    for(var i = 0; i < 16; ++i){
        if($(this).attr("id") == $("img").eq(i).attr("id"))
            pos = i;
        if($("img").eq(i).attr("id") == "img16")
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
});

function swap(pos, blank) {
    // var temp1 = $("img").eq(pos).prop("cloneNode", true);
    // var temp2 = $("img").eq(blank).prop("cloneNode", true);
    // $("#main").replaceChild(temp1, $("img").eq(blank));
    // $("#main").replaceChild(temp2, $("img").eq(pos));
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
