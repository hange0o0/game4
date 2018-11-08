class PKCardItem extends game.BaseItem {

    private loading: eui.Image;
    private bg: eui.Image;
    private img: CardImg;
    private img2: CardImg;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private skillType: eui.Image;
    private cdText: eui.Label;












    public con:PKCtrlCon;


    public defaultY = 30 +55
    public isDragMC = false;
    public stopDrag;
    public guideStopDrag = false;
    public stopMove = true;
    public tw:egret.Tween
    public loadingTimer
    public constructor() {
        super();

        this.skinName = "PKCardItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 90/2
        this.anchorOffsetY = 110/2

        this.img.hideType = true;
        this.img2.hideType = true;

        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onLongTouch,this)
        this.tw = egret.Tween.get(this.loading,{loop:true})
        this.tw.to({rotation:360},3000)
        this.tw.setPaused(true);
        this.loading.visible = false
    }

    private onLongTouch(){
        if(!this.data)
            return;
        var player = PKData.getInstance().myPlayer
        PKCardInfoUI.getInstance().show({
            target:this,
            mid:this.data.mid,
            force:player.force,
            rota:player.teamData.atkRota,
            teamDef:player.teamData.getTeamDef(),
            type:player.type
        })
        //if(this['longTouchTimer'] && egret.getTimer() - this['longTouchTimer'] < 200)
        //    return;
    }

    private onClick(){
        if(game.BaseUI.isStopEevent)
            return;
        if(PKData.getInstance().isView())
            return
        if(this.data && !this.data.waiting)
        {
            this.con.setChooseCard(this);
            if(GuideManager.getInstance().isGuiding  && GuideManager.getInstance().guideKey == "card")
                GuideManager.getInstance().showGuide();
        }
    }


    public dataChanged(){
        if(this.tw)
            this.tw.setPaused(true);
        if(!this.data)
        {
            this.stopDrag = true
            this.y = this.defaultY;
            this.currentState = 'empty'
            return;
        }

        if(this.data.waiting && !this.isDragMC)
        {
            this.stopDrag = true
            this.y = this.defaultY;
            this.currentState = 'waiting'
            this.tw.setPaused(false);
            clearTimeout(this.loadingTimer)
            this.loadingTimer = setTimeout(()=>{
                this.loading.visible = true
            },500)
            this.loading.visible = false
            return;
        }
        this.stopDrag = this.guideStopDrag
        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.mid)
        this.img.data = this.data.mid;
        this.img2.data = this.data.mid;
        this.img2.changeGay(true)
        this.bg.source = vo.getBG();
        //this.costText.textColor = 0xFFFFFF

        if(this.isDragMC)
        {
            this.img2.visible = false;
            this.cdText.visible = false;
        }


        this.skillType.visible = false
        this.spaceGroup.visible = false
        this.img2.visible = false;
        this.cdText.visible = false;
        //if(vo.isMonster)
        //{
        //    this.skillType.visible = false
        //    this.spaceGroup.visible = true
        //    this.spaceText.text = vo.space + '';
        //}
        //else
        //{
        //    this.skillType.visible = true
        //    this.spaceGroup.visible = false
        //    this.skillType.source = vo.getTypeIcon();
        //}

        this.costText.text = vo.cost;
        this.renewChoose();

        if(PKData.getInstance().isView())
            this.stopDrag = true
    }

    //前5张出现时的动画
    public appear(){
        var tw = egret.Tween.get(this);
        var cd = 0;
        this.currentState = 'waiting'
        clearTimeout(this.loadingTimer)
        this.loading.visible = false

        if(!this.data)
            cd = 500;
        else if(this.data.showTime && PKData.getInstance().actionTime<this.data.showTime)
            cd = this.data.showTime - PKData.getInstance().actionTime
        tw.wait(cd).to({scaleX:0},100).call(()=>{
            this.dataChanged();
        },this).to({scaleX:1},100)
    }


    private lastMPChangeTime = 0;
    public onMpTest(nowMp){
        if(!this.data)
            return;
        var vo:any = CM.getCardVO(this.data.mid)
        var mp = vo.cost
        var canvas = !GameManager.getInstance().isWebGL();

        var barW = 80
        var barH = 92
        if(nowMp < mp)
        {
            if(canvas && this.lastMPChangeTime && egret.getTimer() - this.lastMPChangeTime < 1000)
                return;
            //this.costText.textColor = 0xFF0000
            this.img2.visible = true;
            this.cdText.visible = true;

            this.lastMPChangeTime = egret.getTimer();
            var h = barH * (mp - nowMp)/mp;
            this.img2.mask = new egret.Rectangle(0,barH - h,barW,h)

            var PD = PKData.getInstance();
            var cd = ((PKTool.getMPTime(mp + PD.myPlayer.useMP) - PD.actionTime)/1000).toFixed(canvas?0:1);
            this.cdText.text = cd + 's';
            this.bg.source = 'border_16_png'
        }
        else
        {
            //this.costText.textColor = 0xFFFFFF
            this.img2.visible = false;
            this.cdText.visible = false;
            this.bg.source = vo.getBG();
            this.lastMPChangeTime = 0;
        }
    }

    public renewChoose(){
        if(this.isDragMC)
            return;
        this.y = this == this.con.chooseCard?this.defaultY-20:this.defaultY;
    }
}




