var fs = require("fs")
    path = require("path");

function scanFolder(path){
    var fileList = [],
        folderList = [],
        walk = function(path, fileList, folderList){
            files = fs.readdirSync(path);
            files.forEach(function(item) {
                var tmpPath = path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {
                    walk(tmpPath, fileList, folderList);
                } else {

                    var $file = fs.readFileSync(tmpPath, 'utf-8');

                    //读取每个文件的compatibility
                    var $start = $file.indexOf("<compatibility>"),
                        $end = $file.indexOf("</compatibility>");

                    //读取每个文件的模版文件
                    var $tempStart = $file.indexOf("<template>"),
                        $tempEnd = $file.indexOf("</template>");


                    var $com = null,
                        $temp = null,
                        $line = null;

                    if ($start > -1 && $end > -1) {
                        $com = $file.slice($start + 15, $end);
                    }

                    if ($tempStart > -1 && $tempEnd > -1) {
                        $temp = $file.slice($tempStart + 10, $tempEnd);
                        $line = $temp.match(/>\s+?/g).length;
                    }

                    fileList.push({
                        path: tmpPath,      //文件名
                        template: $temp,
                        line: $line,
                        compatibility: $com //兼容性情况
                    });
                }
            });
        };

    walk(path, fileList, folderList);

    return {
        'files': fileList,
        'folders': folderList
    }
}

var list = scanFolder("../../src/animation/").files;
var result = [];
var exclude = ["base"];
var exclude2 = [".DS_"];

//将文件名处理成效果名
//result里返回效果名，和兼容性情况
list.forEach(function (el,i){
    var b = el.path.search(/\/(\w+)\.less/),
        r = el.path.slice(b+1,-5);

    if( exclude.indexOf(r) > -1 || r.indexOf(exclude2) > -1 ) return;
    result.push({
        "effect" : r,
        "compatibility" : el.compatibility
    });
});

//处理为less 文件
var lessResult = "";
result.forEach(function (el,i){
    lessResult += "." + el.effect + "{ \n  ."+ el.effect +"(); \n}\n";
});

fs.writeFile(path.join(__dirname, 'effect.less'), lessResult, function (err) {
    if (err) throw err;
    console.log("Export effect.less Success!");
});

//处理为effect_list.js
var effectExplain = "var effect_list = {\n",
    len = result.length;

result.forEach(function (el,i){
    effectExplain +=
        '    \"'+ el.effect + '\" : {\n'+
        '       "compatibility" : '    +
            el.compatibility            +
        '    \n    }'                   +
        (len - 1 == i ? "\n" : ",\n")
});

effectExplain += "};";

fs.writeFile(path.join(__dirname, 'effectExplain.js'), effectExplain, function (err) {
    if (err) throw err;
    console.log("Export effectExplain.js Success!");
});

var components = scanFolder("../../src/components").files;
var componentsArr = [];

components.forEach(function (el,i){
    var b = el.path.search(/\/\w+\.html/);
    if( b > -1 ){
        console.log(el);
        componentsArr.push({
            "name" : el.path.slice(b+1,-5),
            "compatibility" : el.compatibility,
            "line" : el.line
        });
    }
});

//components format
var componentsBegin = "var component_list = { \n";
var componentStr = "";
var cal = componentsArr.length;
componentsArr.forEach(function (el,i){
    componentStr += "    " + el.name;
    componentStr += ":{\n";
    componentStr += "        compatibility : " + el.compatibility + ",\n";
    componentStr += "        line : \'" + el.line + "\'\n";
    componentStr += "    }";
    componentStr += ((cal == (i + 1)) ? "" : ",") + "\n";
});
componentsEnd = "}; \n";

var componentsResult = componentsBegin + componentStr + componentsEnd;

fs.writeFile(path.join(__dirname, "components.js"), componentsResult, function (err){
    if (err) throw err;
    console.log("Export components.js Success!");
});

//components less
var componentsLess = "";

componentsArr.forEach(function (el){
    componentsLess += ".xless-" + el.name + "{\n";
    componentsLess += "    .xless-" + el.name + "()\n";
    componentsLess += "}\n";
});

fs.writeFile(path.join(__dirname, "components.less"), componentsLess, function (err){
    if (err) throw err;
    console.log("Export components.less Success!");
});










