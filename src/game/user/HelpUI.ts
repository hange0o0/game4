class HelpUI extends game.BaseWindow {

    private static _instance: HelpUI;
    public static getInstance(): HelpUI {
        if(!this._instance)
            this._instance = new HelpUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private closeBtn: eui.Group;


    private dataIn;
    private fun;

    public constructor() {
        super();
        this.skinName = "HelpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer =HelpItem
        this.scroller.viewport = this.list
        this.list.useVirtualLayout = false;
        this.addBtnEvent(this.closeBtn,this.hide)
    }

    public show(v?,fun?){
        this.dataIn = v;
        this.fun = fun;
        super.show()
    }

    public hide() {
        super.hide();
        this.fun && this.fun()
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.titleText.text = this.dataIn.title;
        var arr = [];
        for(var i=0;i<this.dataIn.list.length;i++)
        {
            arr.push({text:this.dataIn.list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}