class PKFaceItem extends game.BaseItem {

    private static pool = [];

    public static createItem():PKFaceItem {
        var item:PKFaceItem = this.pool.pop();
        if (!item) {
            item = new PKFaceItem();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        this.pool.push(item);
    }


    private mc = new eui.Image()

    public constructor() {
        super();
        this.addChild(this.mc)
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 30
        this.mc.scaleX = -1;
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public remove(){
        egret.Tween.removeTweens(this.mc)
        MyTool.removeMC(this);
    }

    public show(id,rota){
        egret.Tween.removeTweens(this.mc)
        this.scaleX = rota;
        this.mc.x = 0;
        this.mc.y = 0
        this.mc.alpha = 1
        this.mc.source =  'pk_e_'+id+'_png'

        if(rota == PKConfig.ROTA_LEFT)
        {
            this.x = 0
        }
        else
        {
            this.x = 640
        }

        this.y = PKingUI.getInstance().displayY + 50 + (PKingUI.getInstance().displayCon - 100)*Math.random();


        egret.Tween.get(this.mc).to({x:100 + 50*Math.random()},2000,egret.Ease.sineOut).call(()=>{
            PKFaceItem.freeItem(this);
        })
        egret.Tween.get(this.mc).wait(1700).to({alpha:0},300)
        egret.Tween.get(this.mc).to({y:-30 - 20*Math.random()},2000)
        GameManager.stage.addChild(this);
    }
}