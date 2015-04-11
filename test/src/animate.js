//gh-animate
(function (){
    var cube = $(".stage").find("div.cube");
    var logo = $(".title").find("span");
    var i = 0;
    var j = 0;
    var k = 0;
    var timer = null;
    var timer2 = null;
    var max = 4;

    var fb = function (e1,e2,e3){
        if(j>max) return;
        clearTimeout(timer);
        timer = setTimeout(function (){
            if(j == max ){
                logo.eq(j).addClass(e3);
                logo.eq(j).show();
                j = 0;
            }else {
                logo.eq(j).addClass(j % 2 == 0 ? e1 : e2);
                logo.eq(j).show();
            }
            j++;
            fb(e1,e2,e3);
        },300)
    };

    var fb2 = function (e1,e2,e3){
        if(k>max) return;
        clearTimeout(timer2);
        timer2 = setTimeout(function (){
            if(k == max ){
                cube.eq(k).addClass(e3);
                cube.eq(k).show();
                k = 0;
            }else {
                cube.eq(k).addClass(k % 2 == 0 ? e1 : e2);
                cube.eq(k).show();
            }
            k++;
            fb2(e1,e2,e3);
        },300)
    };

    fb("zoomInLeft","zoomInRight","zoomInDown");
    fb2("","","");

    var bc = $(".browserCompatibility");
    var chrome = bc.find(".chrome"),
        ie = bc.find(".ie"),
        ff = bc.find(".ff"),
        safari = bc.find(".safari"),
        opera = bc.find(".opera");

    $(".effect-list").find("li").on("click", function (){
        var val = $(this).attr("effect-name");
        if( i > max) i = 0;
        cube.eq(i).attr("class","cube cube"+ (i+1));
        cube.eq(i).addClass(val);
        var cbl = effect_list[val].compatibility;

        if( cbl ){
            ie.html( cbl.ie || "10+" );
            chrome.html( cbl.chrome || "ok" );
            ff.html( cbl.ff || "ok" );
            safari.html( cbl.safari || "ok" );
            opera.html( cbl.opera || "ok" );
        }else{
            bc.find("li").html("ok");
            bc.find("li.ie").html("10+");
        }

        i++;
    });
})();