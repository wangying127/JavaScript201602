function getEle(ele){
    return document.querySelector(ele);
}

var main=getEle("#main");
var winW=window.innerWidth;
var winH=window.innerHeight;

var desW=640;
var desH=1008;

if(winW/winH<=desW/desH){
    main.style.webkitTransform="scale("+winH/desH+")"
}else{
    main.style.webkitTransform="scale("+winW/desW+")"
}

function fnLoad(){
    var arr = ['phoneBg.jpg', 'cubeBg.jpg', 'cubeImg1.png', 'cubeImg2.png', 'cubeImg3.png', 'cubeImg4.png', 'cubeImg5.png', 'cubeImg6.png', 'phoneBtn.png', 'phoneKey.png', 'messageHead1.png', 'messageHead2.png', 'messageText.png', 'phoneHeadName.png'];
    var loading=getEle("#loading");
    var process=getEle(".process");

    var n=0;//用来记录加载图片的个数
    arr.forEach(function(){
        var oImg=new Image();
        oImg.src="images/"+arguments[0];
        oImg.onload=function(){
            n++;
            process.style.width=n/arr.length*100+"%";
            process.addEventListener("webkitTransitionEnd",function(){
                this.style.webkitTransition="";
            }, false);
            if(n==arr.length&&loading){
                window.setTimeout(function(){
                    main.removeChild(loading);
                    fnPhone.init();
                },1500);
            }
        }
    })

}
fnLoad();

var phone=getEle("#phone");
var speak=getEle(".speak");

var fnPhone={
    init:function(){
        phone.addEventListener("touchstart",this.touch,false);
    },
    touch:function(e){
        var target= e.target;
        if(target.className=="listenTouch"){
            //listen消失
            target.parentNode.style.display="none";
            speak.style.webkitTransform="translate(0,0)";
        }else if(target.className=="refuse"){
            phone.style.webkitTransform="translate(0,"+desH+"px)";
            phone.style.webkitTransition="1s";
            window.setTimeout(function(){
                main.removeChild(phone);
                fnMessage();
            },1000)
        }
    }
};

function fnMessage() {
    var msg = getEle("#message");
    var oLis = document.querySelectorAll("#message>ul>li");
    var oUl = getEle("#message>ul");
    var n = 0;//初始化li的索引
    var h = null;//存储出现的li的高度之和
    var timer = window.setInterval(function () {
        oLis[n].style.opacity = 1;
        oLis[n].style.webkitTransform = "translate(0,0)";
        h += oLis[n].offsetHeight - 20;
        n++;
        if (n > 3) {
            oUl.style.webkitTransform = "translate(0," + (-h) + "px)";
            oUl.style.webkitTransition = "1s";
        }
        if(n == oLis.length){
            window.clearInterval(timer);
            window.setTimeout(function(){
                main.removeChild(msg);
              fnCube();
            },1000)
        }
    }, 1000)
}

function fnCube(){
    var cubeBox = getEle("#cubeBox");
    cubeBox.style.webkitTransform = "scale(0.7) rotateX(-135deg) rotateY(-165deg)";
    //滑动的距离就是魔方转动的角度
    var startX = -135; /*记录初始X轴滑动的距离*/
    var startY = -145;/*记录初始y轴滑动的距离*/
    var x = null;/*记录x轴移动的距离*/
    var y = null;/*记录y轴移动的距离*/
    document.addEventListener("touchstart",start,false);
    document.addEventListener("touchmove",move,false);
    document.addEventListener("touchend",end,false);
    function start(e){
        this.startTouch = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
        }
    }
    function move(e){
        this.flag = true;
        e.preventDefault();
        var moveTouch = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
        }
        x = moveTouch.x-this.startTouch.x;
        y = moveTouch.y-this.startTouch.y;
        cubeBox.style.webkitTransform = "scale(0.7) rotateX("+(-startY-y)+"deg) rotateY("+(-startX-x)+"deg)";
    }
    function end(e){
        if(this.flag) {
            //重新初始化起始的值
            startX += x;
            startY += y;
            this.flag = false;
        }
    }

}

document.addEventListener("touchmove",function(){},false)






