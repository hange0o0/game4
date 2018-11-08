class PKSkillItem extends game.BaseItem {

    private img: CardImg;
    private nameText: eui.Label;



    public index;
    public constructor() {
        super();

        this.skinName = "PKSkillItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = this.touchEnabled = false;
        this.img.hideType = true;
    }


    public dataChanged(){
        //var skillVO = SkillVO.getObject(this.data.mid);
        ////if(this.data.mid < 500)
        ////    this.setHtml(this.userText, this.createHtml(this.data.getOwner().nick,0xffff00) + '使用');
        ////else
        ////    this.setHtml(this.userText, this.createHtml(this.data.getOwner().nick,0xffff00) + '触发');
        //this.img.data = this.data.mid
        ////this.icon.source = skillVO.getTypeIcon()
        //this.nameText.text = skillVO.name
        //this.nameText.textColor = skillVO.getTypeColor()
        //
        //egret.Tween.removeTweens(this);
        //var tw = egret.Tween.get(this);
        //var w = 200;
        //this.y = 180 + this.index * 55
        //if(this.currentState == 'left')
        //{
        //    this.x = -w
        //    tw.to({x:20},150).to({x:0},150).wait(2000).to({x:20},150).to({x:-w},150)
        //}
        //else
        //{
        //    this.x = 640
        //    tw.to({x:640-w-20},150).to({x:640-w},150).wait(2000).to({x:640-w-20},150).to({x:640},150)
        //}
        //tw.call(function(){
        //    PKTopUI.getInstance().removeSkillItem(this)
        //},this);
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }
}