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

                    var $com = null;

                    if( $start > -1 && $end > -1 ){
                        $com = $file.slice($start+15,$end);
                    }

                    fileList.push({
                       path : tmpPath,      //文件名
                       compatibility : $com //兼容性情况
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

//将文件名处理成效果名
//result里返回效果名，和兼容性情况
list.forEach(function (el,i){
    var b = el.path.search(/\/(\w+)\.less/),
        r = el.path.slice(b+1,-5);

    if( exclude.indexOf(r) > -1 ) return;
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