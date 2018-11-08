class ShopUI extends game.BaseUI {

    private static _instance: ShopUI;
    public static getInstance(): ShopUI {
        if(!this._instance)
            this._instance = new ShopUI();
        return this._instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private resourceBar: ResourceBar;
    private cdText: eui.Label;
    private list: eui.List;
    private diamondTitle: eui.Group;
    private diamondList: eui.List;
    private bottomUI: BottomUI;


    private getNextData = false
    private toBottom = false
    public constructor() {
        super();
        this.skinName = "ShopUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('商城')
        this.bottomUI.setHide(this.hide,this);
        this.list.itemRenderer = ShopItem
        this.diamondList.itemRenderer = ShopDiamondItem
        this.diamondList.dataProvider = new eui.ArrayCollection(PayManager.getInstance().diamondList)
        if(_get['app'] && !Config.isDebug)
        {
            MyTool.removeMC(this.diamondTitle)
            MyTool.removeMC(this.diamondList)
        }

    }

    public show(toBottom?){
        if(toBottom && _get['app'])
        {
            MyWindow.ShowTips('测试版本不支持钻石购买')
            return;
        }
        this.toBottom = toBottom;
        PayManager.getInstance().get_shop(()=>{
            super.show()
        })

    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.getNextData = false
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewList)
        if(this.toBottom)
        {
            this.once(egret.Event.ENTER_FRAME,()=>{
                this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
            },this)
        }
        else
            this.scroller.viewport.scrollV = 0;


        PayManager.getInstance().openShopTime = TM.now()
        SharedObjectManager.getInstance().setMyValue('open_shop_time',PayManager.getInstance().openShopTime)
        EM.dispatch(GameEvent.client.red_change)
    }

    public renewList(){
        MyTool.renewList(this.list);
    }

    private onTimer(){
        var PM = PayManager.getInstance();
        if(DateUtil.isSameDay(PM.shopTime))
        {
            var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
            this.cdText.text = DateUtil.getStringBySecond(cd);
        }
        else if(!this.getNextData)
        {
            this.getNextData = true
            PayManager.getInstance().get_shop(()=>{
                this.renew()
                this.getNextData = false
            })
        }

        this.resourceBar.onTimer()

    }

    public renew(){
        this.resourceBar.data = {showAdd:false}
        this.list.dataProvider = new eui.ArrayCollection(PayManager.getInstance().shopData)
        this.onTimer();
    }
}