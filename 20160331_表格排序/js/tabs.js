var oTab=document.getElementById("tab");
//��ȡ���ݺ����ݵĽ���
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
//������
~function(){

}();