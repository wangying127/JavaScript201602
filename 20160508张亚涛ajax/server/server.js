/**
 * Created by zhufengpeixun on 2016/5/7.
 */
// 架设http服务器
var http = require('http');
// 处理request中url的
var url = require('url');
// 处理文件读写的
var fs = require('fs');

var server = http.createServer(function (request, response) {
    // 把请求的url解析为一个对象
    var queryString = url.parse(request.url, true);
    // 往响应主体中写数据
    if (queryString.pathname === '/getJiaYao') {
        var listName = queryString.query.listName;
        //response.write('var ' + listName + '="十全大补丸"');
        response.write(listName + '("十全大补丸")');
        // console.log("韩梅梅返回的接口开始执行");test("十全大补丸")
    }
    else if(queryString.pathname==='/cors'){
        response.writeHead(200,{
            'Access-Control-Allow-Origin':'http://localhost:63342',
            'Access-Control-Allow-Credentials':'true'
        });
        response.write('hello cors');
    }
    else {
        response.write('request wrong');
    }
    var randomSeconds = Math.random() * 10 | 0;
    setTimeout(function () {
        response.end();
    }, randomSeconds * 100);

});
server.listen(8080, function () {
    console.log('server start at port:8080');
});
