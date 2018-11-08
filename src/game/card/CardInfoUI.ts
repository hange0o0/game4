class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    private helpBtn: eui.Image;
    private likeCB: eui.CheckBox;
    private likeBar: eui.Rect;
    private likeText: eui.Label;
    private unlikeCB: eui.CheckBox;
    private unlikeBar: eui.Rect;
    private unlikeText: eui.Label;
    private r0: eui.RadioButton;
    private r1: eui.RadioButton;
    private coinText: eui.Label;
    private icon: eui.Image;
    public closeBtn: eui.Image;
    public okBtn: eui.Button;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;






    public openList
    public data;
    public sp;
    public upAble = false;
    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.r0,this.onCB)
        this.addBtnEvent(this.r1,this.onCB)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
        //this.r0.selected = true;


        this.addBtnEvent(this.closeBtn,this.hide)

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('card')
        })

        //this.touchEnabled = false;
    }

    private onLeft(){
        var lastStat = this.currentState
        var index = this.openList.indexOf(this.data);
        this.data = this.openList[index-1];
        this.renew();
        if(this.currentState != lastStat)
            this.validateNow()
        PopUpManager.setMiddle(this);


    }
    private onRight(){
        var lastStat = this.currentState
        var index = this.openList.indexOf(this.data);
        this.data = this.openList[index+1];
        this.renew();
        if(this.currentState != lastStat)
            this.validateNow()
        PopUpManager.setMiddle(this);
    }

    private onCB(){
        SharedObjectManager.getInstance().setMyValue('show_card_base',this.r0.selected);
        this.renew();
    }

    private onClick(){
        if(!this.upAble)
        {
            if(this.data.isMonster)
                MyWindow.ShowTips('金币不足')
            else if(this.sp.diamondShop)
            {
                UM.testDiamond(PayManager.getInstance().getShopDiamond(this.sp))
            }
            else
                MyWindow.ShowTips('远征秘石不足！')
            return
        }
        if(this.data.isMonster)
        {
            CardManager.getInstance().card_open(this.data.id,()=>{
                this.renew();
                GuideManager.getInstance().testShowGuide()
            })
        }
        else
        {
            if(this.sp.diamondShop)
            {
                PayManager.getInstance().buy_shop(this.sp.key,()=>{
                    MyWindow.ShowTips('购买成功！')
                    ShopUI.getInstance().renewList()
                    this.hide();
                })
                return;
            }
             //FightManager.getInstance().buy_shop(this.sp.key,()=>{
             //    this.sp = {};
             //    this.renew();
             //})
        }
    }

    public show(v?,sp?){
        this.data = v;
        this.sp = sp || {};
        super.show()
    }

    public hide() {
        super.hide();
        GuideManager.getInstance().testShowGuide()
    }

    public onShow(){
        if(this.sp.list)
            this.openList = this.sp.list;
        else
            this.openList = []
        this.r0.selected = SharedObjectManager.getInstance().getMyValue('show_card_base') || false;
        this.r1.selected = !this.r0.selected
        this.renew();

        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }


    public showFinish(){
        GuideManager.getInstance().testShowGuide()
    }

    public renew(){
        var CM = CardManager.getInstance()
        var homeLevel = 1//TecManager.getInstance().getLevel(1)
        this.upAble = true
        if(this.sp.force)
        {
            this.item.renew({
                mid:this.data.id,
                sp:this.sp,
                force:this.sp.force,
                type:this.sp.type
            });
        }
        else if(this.r0.selected)
        {
            this.item.renew({
                mid:this.data.id,
                sp:this.sp,
                force:0,
                type:0
            });
        }
        else
        {
            this.item.renew({
                mid:this.data.id,
                force:UM.tec_force,
                sp:this.sp,
                type:UM.type
            });
        }


        if(this.sp.force)
        {
            this.currentState = 'view'
            return;
        }
        else if(this.data.isMonster)
        {
            if(CM.monsterList[this.data.id] || this.data.level > homeLevel)
            {
                this.currentState = 'normal'
            }
            else
            {
                this.currentState = 'buy'
                var coin = CM.getUpCoin(this.data.id);
                this.coinText.text = NumberUtil.addNumSeparator(coin)
                this.upAble = coin <= UM.coin
                this.okBtn.label = '解锁'
                this.okBtn.skinName = 'Btn1Skin'
                this.icon.source = MyTool.getPropCoin();
            }
        }
        else
        {

            if(!this.sp.num)
            {
                this.currentState = 'normal'
            }
            else
            {
                this.currentState = 'buy'
                if(this.sp.diamondShop)
                {
                    var cost = PayManager.getInstance().getShopDiamond(this.sp)
                    this.coinText.text = cost + ''
                    this.upAble = cost <= UM.diamond
                    this.icon.source = MyTool.getPropDiamond();
                    this.okBtn.label = '购买'
                }
                //else
                //{
                //    this.coinText.text = this.sp.diamond + ''
                //    this.upAble = this.sp.diamond <= FightManager.getInstance().value
                //    this.icon.source = MyTool.getPropFight();
                //    this.okBtn.label = '兑换'
                //}


                this.okBtn.skinName = 'Btn1Skin'

            }
        }
        this.coinText.textColor = this.upAble?0xFFFFFF:0xFF0000;

        var index = this.openList.indexOf(this.data);
        this.leftBtn.visible = index > 0
        this.rightBtn.visible = index < this.openList.length - 1;
    }


}