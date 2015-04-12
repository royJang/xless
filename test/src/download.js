//gh-download
(function (){

    var downloadLock = false;
    var downloadMsg = $(".download-msg");
    var download_less_btn = $(".download_less");
    var download_css_btn = $(".download_css");
    var animateList = $(".download-channel-animate-list"),
        componentsList = $(".download-channel-components-list");

    var getDownloadFileList = function ( callback ){
        downloadMsg.html("开始分析文件...");
        //所需要下载的文件列表
        var $$file = [
            'src/basic/mixins/animation.less',
            'src/basic/mixins/transform.less',
            'src/basic/mixins/transition.less',
            'src/animation/base.less'
        ];
        var downloadArr = [].concat($$file);
        var $fileList = [];

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

                $fileList.push(t);
            }
        });

        componentsList.find("li").each(function (i, el){
            var $el = $(el),
                v = $el.find("input").prop("checked");

            if( v ){
                var t = $el.find("label>span").text();

                downloadArr.push(
                    "src/components/" + t + "/" + t + ".less"
                );

                $fileList.push(t);
            }
        });

        if($fileList.length < 1){
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
                    callback(null, data);
                })
            })
        });

        async.series(ajaxTasks, function (err,result){
            return callback && callback(err,{
                    data : result,
                    fileList : $fileList
                });
        });
    };

    var timer = null;
    var createDownloadLink = function ( result, fileName ){
        downloadMsg.html("分析完毕, 准备开始下载...");
        if( downloadLock ){
            downloadMsg.html("正在准备中...");
            return;
        }
        downloadLock = true;
        var blob = new Blob( result, { type : "text/css" });
        var link = window.URL.createObjectURL(blob);
        var atag = document.createElement("a");
        atag.href = link;
        atag.download = fileName;
        document.body.appendChild(atag);
        atag.click();
        downloadMsg.html("下载完毕...");
        clearTimeout(timer);
        timer = setTimeout(function (){
            downloadLock = false;
            downloadMsg.html("");
            window.URL.revokeObjectURL(blob);
        },1000)
    };

    //less文件下载
    download_less_btn.on("click", function (){
        getDownloadFileList(function (err,result){
            createDownloadLink(result.data, "xless.less");
        });
    });

    //css文件下载
    download_css_btn.on("click", function (){
        getDownloadFileList(function (err,result){
            var $str = "";
            //链接所有less内容
            result.data.forEach(function (el){
                $str += el;
            });
            //添加对less的执行，这样才可以编译出来
            result.fileList.forEach(function (el){
                $str += ( "\n.xless-" + el + "{ ." + el + "(); }" );
            });
            //编译less文件
            less.render($str, function (e, output) {
                createDownloadLink([output.css], "xless.css");
            });
        });
    });

    //scss文件下载
})();