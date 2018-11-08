class MsgingUI extends egret.Sprite {

    private static instance:MsgingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MsgingUI();
        return this.instance;
    }
    private static instance2:MsgingUI;//PK服务器
    public static getInstance2() {
        if (!this.instance2) this.instance2 = new MsgingUI();
        return this.instance2;
    }

    public constructor() {
        super();
        this.createView();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(Config.isDebug)
                MyWindow.Alert(Net.getInstance().actionRecord.join('\n'));
            //else if(egret.getTimer() - this.showTimer > 10*1000)
            //{
            //    sendClientError('转圈ing:' + Net.getInstance().actionRecord.join('\n'))
            //    this.showTimer = egret.getTimer();
            //}
        },this)
    }

    private loadingMC
    private shape

    private timer
    private showTimer

    private createView():void {

        this.shape = new eui.Rect();
        this.shape.width = 640;
        this.shape.fillColor = 0;
        this.shape.fillAlpha = 0.3;
        this.shape.touchEnabled = true;
        this.addChild(this.shape)




        this.loadingMC = new eui.Image();
        //this.loadingMC.scaleX = this.loadingMC.scaleY = 1.5
        this.loadingMC.source = 'ui_loading_png'
        this.addChild(this.loadingMC);
        this.loadingMC.x = 320;
        this.loadingMC.anchorOffsetX = 70/2
        this.loadingMC.anchorOffsetY = 70/2



    }

    public show(){
        this.showTimer = egret.getTimer();
        GameManager.container.addChild(this);

        this.width = 640;
        this.height = GameManager.stage.stageHeight;
        this.shape.height = GameManager.stage.stageHeight;
        this.loadingMC.y = this.height/2 - 100;

        egret.Tween.removeTweens(this.loadingMC)
        var tw = egret.Tween.get(this.loadingMC,{loop:true})
        tw.to({rotation:0}).to({rotation:360},1000);

        this.alpha = 0;
        egret.clearTimeout(this.timer);
        this.timer = egret.setTimeout(function(){
            this.alpha = 1;
        },this,200)
    }


    public hide(){
        egret.Tween.removeTweens(this.loadingMC)
        MyTool.removeMC(this);
    }
}
