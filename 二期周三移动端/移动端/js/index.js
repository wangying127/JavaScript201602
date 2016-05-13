/**
 * Created by xiao lei on 2016/5/11.
 */
$(document).on('touchmove',function(ev){
    ev.preventDefault();
});
$(function(){
    //处理高度的兼容性问题；
    var viewHeight=$(window).height();
    //var $li=$('#list').find('>li');
    //var $li=$('#list').children('li');
    var $li=$('#list>li');
    $('#main').css('height',viewHeight);
    slidePage();
    function slidePage(){
        var touchY=0;
        var step=1/4;
        var nowIndex=0;
        var nextorprevIndex=0;
        var bOk=true;
        $li.on('touchstart',function(ev){
            if(bOk==false) return;
            bOk=false;
            nowIndex=$(this).index();
            //touch事件
            var touch=ev.originalEvent.changedTouches[0];
            touchY=touch.pageY;//保留按下的位置；
            //Math.abs(touch.pageY-touchY)/viewHeight*step  0~0.25 1~0.75
            $li.on('touchmove.move',function(ev){
                var touch=ev.originalEvent.changedTouches[0];
                $(this).siblings('li').hide();
                if(touch.pageY<touchY){//up
                    nextorprevIndex=nowIndex==$li.length-1?0:nowIndex+1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(viewHeight+touch.pageY-touchY)+'px)');
                }else if(touch.pageY>touchY){//down
                    nextorprevIndex=nowIndex==0?$li.length-1:nowIndex-1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(-viewHeight+touch.pageY-touchY)+'px)');
                }else{
                    bOk=true;
                }
                //实现位移： transform-translate; 实现缩放： transform-scale
                $(this).css('transform','translate(0,'+(touch.pageY-touchY)*step+'px) scale('+(1-Math.abs(touch.pageY-touchY)/viewHeight*step)+')');
                $li.eq(nextorprevIndex).addClass('zIndex').show();
            })
            $li.on('touchend.move',function(ev){
                var touch=ev.originalEvent.changedTouches[0];
                if(touch.pageY<touchY) {//up
                    $(this).css('transform','translate(0,'+(-viewHeight*step)+'px) scale('+(1-step)+')')
                }else if(touch.pageY>touchY) {//down
                    $(this).css('transform','translate(0,'+(viewHeight*step)+'px) scale('+(1-step)+')')
                }else{
                    bOk=true;
                }
                $li.eq(nextorprevIndex).css('transform','translate(0,0)');
                $li.eq(nextorprevIndex).css('transition','.3s');
                $li.eq(nowIndex).css('transition','.3s');
                $li.off('.move');
            })

        })
        $li.on('transitionend webkitTransitionend',function(ev){
            if(!$li.is(ev.target)){
                return;
            }
            resetFn();
        })
        function resetFn(){
            $li.css('transition','');
            $li.css('transform','');
            $li.eq(nextorprevIndex).siblings('li').hide();
            $li.eq(nextorprevIndex).removeClass('zIndex');
            bOk=true;
        }
    }

})