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
                    folderList.push(tmpPath);
                } else {
                    fileList.push(tmpPath);
                }
            });
        };

    walk(path, fileList, folderList);

    return {
        'files': fileList,
        'folders': folderList
    }
}

var list = scanFolder("../../src/animation/");
var result = [];
var exclude = ["base"];

list.files.forEach(function (el,i){
    var b = el.search(/\/(\w+)\.less/),
        r = el.slice(b+1,-5);

    if( exclude.indexOf(r) > -1 ) return;

    result.push(r);
});

fs.writeFile(path.join(__dirname, 'effect.js') ,JSON.stringify(result), function (err) {
    if (err) throw err;
    console.log("Export effect.json Success!");
});

fs.writeFile(path.join(__dirname, 'effect.js'), "var effect_list = " + JSON.stringify(result), function (err) {
    if (err) throw err;
    console.log("Export effect.js Success!");
});

var lessResult = "";
result.forEach(function (el,i){
    lessResult += "." + el + "{ ."+ el +"(); }\n";
});

fs.writeFile(path.join(__dirname, 'effect.less'), lessResult, function (err) {
    if (err) throw err;
    console.log("Export effect.less Success!");
});































