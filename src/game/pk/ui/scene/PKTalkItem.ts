class PKTalkItem extends game.BaseContainer {
    private static pool = [];
    public static createItem():PKTalkItem{
        var item:PKTalkItem = this.pool.pop();
        if(!item)
        {
            item = new PKTalkItem();
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        this.pool.push(item);
    }

    public constructor() {
        super();
        this.skinName = "PKTalkItemSkin";
    }

    private text: eui.Label;
    private bg: eui.Image;

    public active = false
    private h = 110;
    private w = 161;
    private relateItem:PKMonsterItem;
    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;
        this.anchorOffsetY = 110
    }


    public setData(data) {
        this.active = true;


        this.text.text = PKManager.getInstance().pkWord[Math.floor(Math.random()*PKManager.getInstance().pkWord.length)];
        this.relateItem = data;


        this.x = 50;
        if(this.relateItem.data.atkRota == PKConfig.ROTA_RIGHT)
        {
            this.bg.scaleX = -1
            this.anchorOffsetX = 0.4*this.w;
        }
        else
        {
            this.bg.scaleX = 1
            this.anchorOffsetX = 0.6*this.w;
        }
        this.y = data.barGroup.y+10;


        egret.Tween.removeTweens(this);
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 1;
        var tw = egret.Tween.get(this);
        tw.to({scaleX:1,scaleY:1},200).to({scaleX:0.9,scaleY:0.9},200).wait(2500).to({scaleX:0,scaleY:0},100).call(function(){
             this.remove();
        },this);
    }

    public remove(){
        egret.Tween.removeTweens(this);
        this.active = false;
        MyTool.removeMC(this);
        this.relateItem.talkItm = null;
    }



}