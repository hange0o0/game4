class PKTopItem extends game.BaseItem {

    private heroBG: eui.Image;
    private heroMC: eui.Image;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private group: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private indexText: eui.Label;








    public removeAble = false;
    public constructor() {
        super();

        this.skinName = "PKTopItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.img.hideType = true;
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    private onLongTouch(){
        if(!this.data)
            return;
        var player = this.data.getOwner()
        PKCardInfoUI.getInstance().show({
            target:this,
            mid:this.data.mid,
            force:player.force,
            type:player.type,
            pos:this.data.id,
            rota:player.teamData.atkRota,
            teamDef:player.teamData.getTeamDef()
        })
    }


    public dataChanged(){
        this.removeAble = false
        this.group.alpha = 1;
        this.alpha = 1;


        if(this.data && this.data.isHero)
        {
            var mvo = MonsterVO.getObject(this.data.mid)
            this.heroMC.source = mvo.getImage(this.data.isLock)
            this.heroBG.source = mvo.getHeroBG(this.data.level);
            this.indexText.text = this.data.topIndex;
            this.currentState = 'hero'

            for(var i=0;i<5;i++)
                this['s' + i].source = this.data.level>i?'start1_png':'start2_png'
        }
        else if(this.data)
        {
            var vo:any = CM.getCardVO(this.data.mid)
            this.img.data = vo.id;
            this.bg.source = vo.getBG();
            this.indexText.text = this.data.topIndex;
            this.currentState = 'normal'
            if(this.data.isLock)
                this.img.changeGay(true)
        }
        else
            this.currentState = 'empty'
        //this.nameText.text = vo.name
    }

    public remove(){
        this.removeAble = true;
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.group);
        MyTool.removeMC(this);
    }

    public appear(){
        var tw = egret.Tween.get(this.group)
        this.group.alpha = 0;
        tw.wait(100).to({alpha:1},500)
    }
    public disAppear(){
        var tw = egret.Tween.get(this)
        tw.to({alpha:0},500).wait(500).call(function(){
            this.removeAble = true
        },this)
    }

    private onTimer(){

    }
}