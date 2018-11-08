class ChangeHeadUI extends game.BaseWindow {

    private static _instance: ChangeHeadUI;
    public static getInstance(): ChangeHeadUI {
        if(!this._instance)
            this._instance = new ChangeHeadUI();
        return this._instance;
    }

    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;


   //private cost = 60;
    public constructor() {
        super();
        this.skinName = "ChangeHeadUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeHeadItem;
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    private onClick(){
        var newHead = this.list.selectedItem
        if(newHead == UM.head)
        {
            this.hide();
            return;
        }
        //if(!UM.testDiamond(this.cost))
        //    return;
        InfoManager.getInstance().change_head(newHead,()=>{
            this.hide();
            MyWindow.ShowTips('更换成功')
        })
    }

    public show(){
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var arr = InfoManager.getInstance().getHeadList();
        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.list.selectedIndex = arr.indexOf(UM.head);
    }
}