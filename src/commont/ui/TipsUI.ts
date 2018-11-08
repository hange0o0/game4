class TipsUI extends game.BaseContainer{
	private static instancePool = [];
	private static showTips = [];
	public static getInstance() {
		var instance = this.instancePool.pop()
		if (!instance)
			instance = new TipsUI();
		return instance;
	}

    private text: eui.Label;

	private timer;
	public toY

	public constructor() {
		super();
		this.skinName = 'TipsUISkin';
	}

	public show(v?,cd?){
		for(var i=0;i<TipsUI.showTips.length;i++)
		{
			var item =  TipsUI.showTips[i];
			item.toY -= 70
			egret.Tween.removeTweens(item);
			var tw = egret.Tween.get(item);
			tw.to({y:item.toY},Math.abs(item.toY - item.y)*2);
		}
		TipsUI.showTips.push(this)
		egret.clearTimeout(this.timer);


		//this.verticalCenter = 0;
		GameManager.stage.addChild(this);
		MyTool.setColorText(this.text,v);
		if(this.text.numLines > 1)
			this.text.textAlign = 'left'
		this.visible = false
		this.timer = egret.setTimeout(this.onTimer,this,cd + (TipsUI.showTips.length-1)*100);
		egret.setTimeout(function(){
			this.visible = true
		},this,(TipsUI.showTips.length-1)*100);

		this.validateNow();
		this.x =  (GameManager.stage.stageWidth -this.width)/2
		this.y =  GameManager.stage.stageHeight * 0.2;
		this.toY =  this.y;
	}

	private onTimer(){
		this.hide();
	}

	public hide(){
		egret.clearTimeout(this.timer);
		MyTool.removeMC(this);
		PopUpManager.testShape();
		TipsUI.instancePool.push(this)
		var index = TipsUI.showTips.indexOf(this)
		if(index != -1)
			TipsUI.showTips.splice(index,1)
	}


}
