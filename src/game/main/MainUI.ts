class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }
    private topGroup: eui.Group;
    private coinGroup: eui.Group;
    private addCoinBtn: eui.Image;
    private coinText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private forceGroup: eui.Group;
    private scoreIcon: eui.Image;
    private scoreText: eui.Label;
    private map: HangUI;
    private pkBtn: eui.Button;
    private pairGroup: eui.Group;
    private cancelBtn: eui.Button;
    private cdText: eui.Label;
    private bottomGroup: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private tecBtn: eui.Group;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;



    private startTimer = 0;
    private callOffline = 0
    public constructor() {
        super();
        this.skinName = "MainUISkin";
        this.LoadFiles = ['guide']
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.coinGroup, this.onAddCoin)
        this.addBtnEvent(this.diamondGroup, this.onAddDiamond)

        this.addBtnEvent(this.pkBtn, this.onPK)
        this.addBtnEvent(this.shopBtn, this.onShop)
        this.addBtnEvent(this.cancelBtn, this.onStopPK)
        this.addBtnEvent(this.rankBtn, this.onRank)
        this.addBtnEvent(this.tecBtn, this.onTec)
        this.addBtnEvent(this.mailBtn, this.onMail)
        this.addBtnEvent(this.settingBtn, this.onSetting)


        if(_get['app'])
        {
            this.addDiamondBtn.visible = false;
        }
    }

    private onPK(){
        egret.Tween.removeTweens(this.topGroup)
        egret.Tween.removeTweens(this.bottomGroup)
        egret.Tween.removeTweens(this.cancelBtn)
        egret.Tween.get(this.topGroup).to({alpha:0},500)
        egret.Tween.get(this.bottomGroup).to({alpha:0},500)
        this.pkBtn.visible = false;
        this.pairGroup.visible = true;
        this.cancelBtn.visible = false;
        egret.Tween.get(this.cancelBtn).wait(3000).call(()=>{
            this.cancelBtn.visible = true;
        })

        this.startTimer = TM.now();
        this.onTimer();
        PVPManager.getInstance().pkOnLine();
        RES.loadGroup('pk');

        this.callOffline = 1;
    }

    private onStopPK(){
        egret.Tween.removeTweens(this.topGroup)
        egret.Tween.removeTweens(this.bottomGroup)
        egret.Tween.removeTweens(this.cancelBtn)
        this.topGroup.alpha = 1;
        this.bottomGroup.alpha = 1;
        this.pkBtn.visible = true;
        this.pairGroup.visible = false;

        this.startTimer = 0;
        PKServerManager.getInstance().close();
        this.callOffline = 0;
    }

    private onShop(){

    }

    private onRank(){

    }

    private onTec(){

    }

    private onMail(){

    }

    private onSetting(){

    }

    private onAddCoin(){
        //this.onBottomSelect(4);
        //TecUI.getInstance().setTab(2)
    }

    private onAddEnergy(){
         ShopUI.getInstance().show();
    }

    private onAddDiamond(){
        if(this.addDiamondBtn.visible)
            ShopUI.getInstance().show(true);
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }


    public onShow(){
        //this.bg.source = Config.localResRoot  + 'main_bg'+UM.type+'.jpg';
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.prop_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.hero_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.slave_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.red_change,this.renewRed)

        //GuideManager.getInstance().isGuiding = true;
        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().guideStep = 0;
            GuideManager.getInstance().reInit();
            GuideManager.getInstance().showGuide()
        }
        else if(!LoginManager.getInstance().logText.cb && LoginManager.getInstance().logText.text)
            LogUI.getInstance().show();

        SoundManager.getInstance().playSound(SoundConfig.bg);

        setTimeout(function(){
            SoundManager.getInstance().loadEffectSound();
        },1000)

        if(UM.pk_common.pkdata && UM.pk_common.pkdata.pkstarttime && TM.now() - UM.pk_common.pkdata.pkstarttime < 5*60)
        {
            PVPCtrl.getInstance().pkData = null;
            PKServerManager.getInstance().reConnect(PVPCtrl.getInstance());
        }

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    public onPairSuccess(){
        this.onStopPK();
    }

    private onTimer(){
        if(!this.startTimer)
            return;
        var cd = TM.now() - this.startTimer + 1
        this.cdText.text = DateUtil.getStringBySecond(cd).substr(-5)
        if(cd > 1) //25
        {
            if(this.callOffline == 1)
            {
                this.callOffline = 2
                PVPManager.getInstance().pkOffline(()=>{
                    this.callOffline = 0;
                })
            }
            if(this.callOffline)
                return;
            this.onStopPK();
            MyWindow.Confirm('很遗憾，没有匹配到玩家\n进群喊人一起匹配吧！',(b)=>{
                if(b==1)
                {
                    if(_get['app'])
                    {
                        AppManager.getInstance().joinQQ();
                    }
                }
            },['取消', 'QQ群'])
        }
    }

    public renewTop(){
        this.diamondText.text = UM.diamond + ''
        this.coinText.text = NumberUtil.addNumSeparator(UM.coin);
    }



    public onVisibleChange(){
        this.map.onVisibleChange(this.visible);
    }

    public renew(){
        this.renewTop();
        this.map.renew();

    }



    public renewRed(){
        //this.coinRedMC.visible = TecManager.getInstance().isCoinRed();

    }
}