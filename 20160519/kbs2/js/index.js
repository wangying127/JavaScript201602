~function (pro) {
    //myTrim:Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub:Intercept string, this method is distinguished in English
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime:Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?: +)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日{3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter:Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
}(String.prototype);


/*--下载区域的展示和隐藏--*/
$(function () {
    var $downLoad = $(".downLoad"), $downLoadBg = $downLoad.children(".downLoadBg"), $downLoadImg = $downLoad.children(".downLoadImg"), $downLoadLink = $downLoad.children("a");
    $downLoad.on("mouseenter", function () {
        $downLoadBg.stop().slideDown(300);
        $downLoadImg.stop().slideDown(300);
        $downLoadLink.css("borderTopColor", "#1c90f2");
    }).on("mouseleave", function () {
        $downLoadBg.stop().slideUp(300);
        $downLoadImg.stop().slideUp(300);
        $downLoadLink.css("borderTopColor", "transparent");
    });
});

/*--计算中间区域的高度--*/
$(function () {
    auto();
    $(window).on("resize", auto);
    function auto() {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var curH = winH - 76 - 40;
        $("#sectionContent").css("height", curH).attr("curH", curH);
        $(".conLeft").css("height", curH - 2);
        $(".matchList").css("height", curH - 82);
    }
});

/*--让左侧区域实现局部滚动--*/
$(function () {
    var $scrollLeft = new IScroll("#conLeft", {
        mouseWheel: true,
        scrollbars: true,
        bounce: false
    });
});

/*--让右侧区域实现局部滚动--*/
$(function () {
    var $scrollRight = new IScroll("#matchList", {
        mouseWheel: true,
        scrollbars: true,
        bounce: false
    });
    window.$scrollRight = $scrollRight;
});

/*--日期列表区域的相关处理--*/
$(function () {
    var $calendarList = $(".calendarList"), $inner = $calendarList.children(".inner");
    //通过事件委托实现数据的绑定
    $(".calendar").on("click", function (e) {
        var tar = e.target, $tar = $(tar), tarTagName = tar.tagName.toUpperCase();
        //事件源是A或者是A中的span
        var $pars = $tar.parents().add($tar);
        if ($pars.hasClass("inner") && /^(A|SPAN)$/i.test(tarTagName)) {
            //数据列表
            tarTagName === "A" ? scrollToDate($tar.attr("date")) : scrollToDate($tar.parent().attr("date"));
            return;
        }

        if($pars.hasClass("calendarLeft") || $pars.hasClass("calendarRight")){
            var curLeft = parseFloat($inner.css("left")), tarLeft = null;
            if ($pars.hasClass("calendarLeft")) {
                if ($inner.attr("isMove") === "false") {
                    //左按钮
                    //边界判断
                    tarLeft = curLeft + 105 * 7;
                    tarLeft > 0 ? tarLeft = 0 : null;
                    $inner.attr("isMove","true");
                    $inner.stop().animate({
                        left: tarLeft
                    }, 500, function () {
                        $inner.attr("isMove","false")
                    });
                }
            }
            if ($pars.hasClass("calendarRight")) {
                if ($inner.attr("isMove") === "false") {
                    //右按钮
                    //边界判断
                    var maxLeft = parseFloat($inner.width()) - 105 * 7;
                    tarLeft = curLeft - 105 * 7;
                    Math.abs(tarLeft) >= maxLeft ? tarLeft = -maxLeft : null;
                    $inner.attr("isMove","true")
                    $inner.stop().animate({
                        left: tarLeft
                    }, 500,function(){
                        $inner.attr("isMove","false")
                    })
                }
            }
            //无论左按钮还是右按钮我们都要重新绑定数据 我们都要获得起始索引
            var strIndex = Math.abs(parseFloat($inner.css("left"))) / 105;
            var endIndex = Math.abs(parseFloat($inner.css("left"))) / 105 + 6;
            bindDate($calenderLink.eq(strIndex).attr("date"), $calenderLink.eq(endIndex).attr("date"));
        }
    });

    function callBack(jsonData) {
        if (jsonData) {
            var data = jsonData["data"], today = data["today"];
            data = data["data"];
            //数据绑定
            var str = '';
            if (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var curData = data[i];
                    //console.log(curData);
                    str += '<a ="javascript:;" date="' + curData["date"] + '">';
                    str += '<span class="week">' + curData["weekday"] + '</span>';
                    str += '<span class="data">' + curData["date"].myFormatTime("{1}-{2}") + '</span>';
                    // console.log(curData["date"]);
                    str += '</a>';
                }
            }
            $inner.html(str).css("width", len * 105);

            //->开始需要把当天的日期选中
            var $calenderLink = $inner.children("a");
            var $curDateLink = $calenderLink.filter("[date='" + today + "']");
            //filter在当前的容器中过滤
            $curDateLink.addClass("bg").children(".week").html("今天");
            $inner.css("left", -$curDateLink.index() * 105 + 315);
            //绑定比赛区域的数据
            //当前日期展示区域开始项的索引=当前inner的left/105，当前日期展示区域结束的索引=当前inner的left值/105+6
            var strIndex = Math.abs(parseFloat($inner.css("left"))) / 105;
            var endIndex = Math.abs(parseFloat($inner.css("left"))) / 105 + 6;
            bindDate($calenderLink.eq(strIndex).attr("date"), $calenderLink.eq(endIndex).attr("date"));
            //让比赛列表区域滚动到当前日期这一项
        }
    }


    //JSONP请求我们一般都是使用异步请求
    var columnId = getMatchNum();
    $.ajax({
        url: "http://matchweb.sports.qq.com/kbs/calendar?columnId=" + columnId + "&_=" + Math.random(),
        type: "get",
        dataType: "jsonp",
        success: callBack
    })
});

function getMatchNum() {
    return 100000;
}

//根据起始日期和结束的日期获取到比赛数据，进行数据的绑定
function bindDate(strDtae, endDate) {

}