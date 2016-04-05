var oTab=document.getElementById("tab");
//获取数据和数据的解析
var jsonData=null;
~function(){
    var xhr=new XMLHttpRequest;
    xhr.open("get","json/userInfo.txt",false);
    xhr.onreadystatechange=function(){
        if(xhr.readyState===4 && /^2d{2}$/.test(xhr.status)){
            var str=xhr.responseText;
            jsonData=utils.formatJSON(str);
        }
    };
    xhr.send(null);
}();
//绑定数据
~function(){

}();