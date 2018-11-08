class AwardUI extends game.BaseWindow {

    private static _instance: AwardUI;
    public static getInstance(): AwardUI {
        if(!this._instance)
            this._instance = new AwardUI();
        return this._instance;
    }

    private btnGroup: eui.Group;
    private okBtn: eui.Button;
    private btn2: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private desText: eui.Label;



    private dataIn;
    private title;
    private des;
    private fun;
    private secLabel;
    private secFun;
    public constructor() {
        super();
        this.skinName = "AwardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = AwardItem;
        this.addBtnEvent(this.okBtn,this.hide)
        this.addBtnEvent(this.btn2,this.onBtn2)
    }

    private onBtn2(){
        this.secFun && this.secFun();
        this.hide();
    }

    public show(v?,title?,des?,fun?,secLabel?,secFun?){
        if(!v)
            return;
        this.dataIn = v;
        this.title = title;
        this.des = des;
        this.fun = fun;
        this.secLabel = secLabel;
        this.secFun = secFun
        super.show()
    }

    public hide() {
        super.hide();
        this.fun && this.fun();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        this.titleText.text = this.title || '恭喜获得'
        var arr = MyTool.getAwardArr(this.dataIn);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        if(this.des)
        {
            this.currentState = 'des'
            this.desText.text = this.des;
        }
        else
        {
            this.currentState = 'normal'
        }

        if(this.secLabel)
        {
            this.btnGroup.addChild(this.btn2);
            this.btn2.label = this.secLabel
        }
        else
            MyTool.removeMC(this.btn2)
    }
}