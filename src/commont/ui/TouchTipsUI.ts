class TouchTipsUI extends game.BaseContainer{
    private static instance:TouchTipsUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TouchTipsUI();
        return this.instance;
    }

    private text: eui.Label;

    private timer;

    public constructor() {
        super();
        this.skinName = 'TouchTipsSkin';
    }

    public show(e?,str?){
        if(!str)
            return;
        GameManager.container.addChild(this);
        MyTool.setHtml(this.text,str);
        this.validateNow();

        //var rect = mc.getBounds();
        //var p1 = mc.localToGlobal(rect.x,rect.y);
        //var p2 = mc.localToGlobal(rect.x + rect.width,rect.y + rect.height);

        this.y =  e.stageY - this.height - 100;
        if(this.y < 0)
        {
            this.y = e.stageY + 120;
        }

        this.x = e.stageX - this.width/2;
        if(this.x < 10)
        {
            this.x = 10;
        }
        else if(this.x + this.width > 630)
        {
            this.x = 630 - this.width;
        }

        GameManager.stage.once(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)

    }

    public hide(){
        MyTool.removeMC(this);
    }
}
