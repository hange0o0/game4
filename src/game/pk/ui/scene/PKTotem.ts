class PKTotem extends game.BaseItem {
    private static pool = [];
    public static createItem():PKTotem{
        var item:PKTotem = this.pool.pop();
        if(!item)
        {
            item = new PKTotem();
        }
        //item.needRemove = false;
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        this.pool.push(item);
    }


    private topMC: eui.Image;
    public tw;

    //public needRemove
    public owner

    public constructor() {
        super();

        this.skinName = "PKTotemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.anchorOffsetY = 80
        this.anchorOffsetX = 15

        var tw = this.tw = egret.Tween.get(this.topMC, {loop: true});
        this.topMC.bottom = 58;
        tw.to({bottom: 63}, 500, egret.Ease.sineInOut).to({bottom: 58}, 500, egret.Ease.sineInOut)
        this.tw.setPaused(true)
    }

    public dataChanged(){
        this.topMC.source = 'totem_'+this.data+'_png'
        this.tw.setPaused(false)
    }

    public remove(){
        MyTool.removeMC(this);
        this.tw.setPaused(true)
    }
}