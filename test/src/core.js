(function(){
    var downloadAnimateArr = [],
        downloadComponentsArr = [],
        downloadFormat = function ( el ){
            return "<li><label><input type='checkbox'><span>" + el + "</span></label></li>";
        },
        channelFormat = function ( el ){
            return "<li effect-name="+ el +"><span>" + el + "</span></li>";
        };
    //添加animate.effect列表进入dom
    var arr = [];
    Object.keys(effect_list).forEach(function ( el ){
        arr.push(
            channelFormat(el)
        );
        downloadAnimateArr.push(
            downloadFormat(el)
        );
    });

    //添加components列表进入dom
    var componentsArr = [];
    Object.keys(component_list).forEach(function ( el ){
        componentsArr.push(
            channelFormat(el)
        );
        downloadComponentsArr.push(
            downloadFormat(el)
        );
    });

    $(".effect-list").html(arr.join(""));
    $(".components-list").html(componentsArr.join(""));
    $(".download-channel-animate-list").html(downloadAnimateArr.join(""));
    $(".download-channel-components-list").html(downloadComponentsArr.join(""));
    //页面间切换
    var navigator = $(".navigator-func"),
        ghAnimate = $(".gh-animate");

    var In = "zoomInLeft",
        Out = "zoomOutRight";

    var afterChannel = ghAnimate,
        animating = false;
    var jumpTo = function ( channel ){
        if( channel.attr("id") === afterChannel.attr("id") || animating ) return;
        animating = true;
        channel.removeClass(Out).addClass(In).show();
        afterChannel.removeClass(In).addClass(Out);
        setTimeout(function (){
            afterChannel.hide();
            afterChannel = channel;
            animating = false;
        }, 500)
    };

    navigator.find(".jump-animate, .jump-components, .jump-download").on("click", function (e){
        var v = e.currentTarget.className.replace(/jump-/,"");
        jumpTo($(".gh-"+v));
    });

})();