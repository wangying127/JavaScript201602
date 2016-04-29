function down(e){
	this.x=this.offsetLeft;
	this.y=this.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	if(this.setCapture){
		this.setCapture();
		on(this,"mousemove",move);
		on(this,"mouseup",up);	
	}else{
		this.MOVE=move.bind(this);
		this.UP=up.bind(this);
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
	
	//通知此行为发生了，让定阅此行为的其它行为来执行
	selfFire.call(this,"selfdragstart");//“通知”方法需要一个参数，是表示down这个行为的标识符。
	//"selfdragstart"其实就是规定了事件类型
}
function move(e){
	this.style.left=this.x+(e.pageX-this.mx)+"px";
	this.style.top=this.y+(e.pageY-this.my)+"px";
	
	//通知绑定此件事的其它行为来执行
	//selfFire("selfdrag");
	selfFire.call(this,"selfdrag",e);
	//selfdrag来表示move行为。为什么能表示这个行为呢？分析selfFire在执行的时候干什么了就可以：
	//on保存，selfFire执行on保存的那些方法 -->它如何知道去那个数组里找保存的那些方法呢？就是靠这个"selfdrag"字符串;
	
	
	
}
function up(e){
	if(this.releaseCapture){
		this.releaseCapture();
		off(this,"mousemove",move);
		off(this,"mouseup",up);
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
	}
	//通知、发布
	selfFire.call(this,"selfdragend",e);
}