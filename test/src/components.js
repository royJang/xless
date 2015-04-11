//gh-components
(function (){

    var ghComponents = $(".gh-components .right-nav .stage");
    var demo = ghComponents.find(".demo");
    var htmlCode = ghComponents.find(".html-code");

    var format = function ( template ){
        var e = template.match(/<(\/?)\w+.+?(?:>)/g),
            len = e.length;

        var str = "";
        var tag = "";
        e.forEach(function (el,i){
            str += el + "\n";
        });

        return str;
    };

    var componentsList = $(".components-list").find("li");

    componentsList.on("click", function (){

        componentsList.find("span").removeClass("active");
        $(this).find("span").addClass("active");

        var r = $(this).attr("effect-name");
        var $r = component_list[r];

        $.get('src/components/' + r + '/' + r + '.html', function (data){
            var s = data.indexOf("<template>"),
                e = data.indexOf("</template>");
            var $data = data.slice(s+10,e).replace(/^\s+?|\s+?$/g,"");
            demo.html($data);
            htmlCode.css("height", 25 * $r.line + 20);
            htmlCode.html($data);
        });
    });

    componentsList.eq(0).trigger("click");
})();
