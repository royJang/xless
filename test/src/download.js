//gh-download
(function (){

    var downloadLock = false;
    var downloadMsg = $(".download-msg");
    var download_less_btn = $(".download_less");
    var animateList = $(".download-channel-animate-list"),
        componentsList = $(".download-channel-components-list");

    download_less_btn.on("click", function (){
        downloadMsg.html("开始分析文件...");
        if( downloadLock ){
            downloadMsg.html("正在分析下载...");
            return;
        }
        downloadLock = true;

        //所需要下载的文件列表
        var downloadArr = ['src/basic/mixins/animation.less',
            'src/animation/base.less'];

        animateList.find("li").each(function (i, el){
            var $el = $(el),
                v = $el.find("input").prop("checked");
            if ( v ){
                var t = $el.find("label>span").text();
                var dirName = "seeker";

                ["bounce", "circular", "fade", "flip", "lightspeed", "rotate", "slide", "zoom"].forEach(function (el, i){
                    if(t.indexOf(el) > -1){
                        dirName = el;
                    }
                });
                downloadArr.push(
                    "src/animation/" + dirName + "/" + t + ".less"
                );
            }
        });

        if(downloadArr.length < 3){
            downloadMsg.html("请选择至少一个文件");
            downloadLock = false;
            return;
        }

        //拿到最终需要下载文件列表
        var ajaxTasks = [];
        //遍历下载目录，下载文件
        downloadArr.forEach(function ( el ){
            ajaxTasks.push(function (callback){
                $.get(el, function (data){
                    callback(null,data);
                })
            })
        });

        async.series(ajaxTasks, function (err,result){
            var blob = new Blob(result, { type : 'text/less' });
            var link = window.URL.createObjectURL(blob);
            var atag = document.createElement("a");
            atag.href = link;
            atag.download = "xless.less";
            document.body.appendChild(atag);
            atag.click();
            downloadMsg.html("下载完毕...");
            setTimeout(function (){
                downloadLock = false;
                downloadMsg.html("");
                window.URL.revokeObjectURL(blob);
            },1000)
        });
    });
})();