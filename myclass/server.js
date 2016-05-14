var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (request, response) {
     var urlObj=url.parse(request.url,true);
     var pathname=urlObj.pathname,query=urlObj.query;
    var reg=/\.(HTML|CSS|JS)/i;
   if(reg.test(pathname)){
       var suffix=reg.exec(pathname)[1].toUpperCase();
       var conType=suffix==="HTML"?"text/html":(suffix==="CSS"?"text/css":"text/javascript");
       var fileText=fs.readFileSync("."+pathname,"utf8");
       response.writeHead(200,{'context-type':conType});
       response.end(fileText);
       return;
   }
    //编写AJAX请求数据的API
    if(pathname==="/getData"){
      var data=fs.readFileSync("./json/data.json","utf8");
        data=JSON.parse(data);
        var total=Math.ceil(data.length/query.pageCount);
        var ary=[];
        for(var i=(query.pageNum-1)*query.pageCount; i<=(query.pageCount*query.pageNum)-1;i++){
        var cur=data[i];
            if(!cur){
                break;
            }
            ary.push(cur);
        }
        response.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        response.end(JSON.stringify({total:total,data:ary}));
        return;
    }
    response.writeHead(404,{'content-type':'text/html'});
    response.end(fs.readFileSync("./404.html","utf8"));
});

server.listen(8080, function () {
    console.log("服务启动成功了；")
});