class PKAwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKAwardItemSkin";
    }

    private group: eui.Group;
    private img: eui.Image;
    private nameText: eui.Label;
    private numText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick() {

    }

    public dataChanged() {
        if(this.data.isHero)
        {
            this.img.source = this.data.img
            this.currentState = 's3'
        }
        else if(this.data.img)
        {
            this.img.source = this.data.img
            this.currentState = 's1'
        }
        else
        {
            this.currentState = 's2'
        }
        this.nameText.text = this.data.name
        this.numText.text = this.data.num
        egret.Tween.removeTweens(this.group)
        this.group.scaleX = this.group.scaleY =  0
        egret.Tween.get(this.group).to({scaleX:1.1,scaleY:1.1},200).to({scaleX:1,scaleY:1},200)
    }
}