class LogUI extends game.BaseWindow {

    private static _instance: LogUI;
    public static getInstance(): LogUI {
        if(!this._instance)
            this._instance = new LogUI();
        return this._instance;
    }

    private titleText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private closeBtn: eui.Group;


    public constructor() {
        super();
        this.skinName = "HelpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.itemRenderer =HelpItem
        this.list.useVirtualLayout = false;
        this.titleText.text = '更新日志';
        this.height = 800
        this.addBtnEvent(this.closeBtn,this.hide)

    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        if(!LoginManager.getInstance().logText.cb)
        {
            LoginManager.getInstance().logText.cb = true;
            LoginManager.getInstance().saveLogText();
        }

    }

    public renew(){
        var logText = LoginManager.getInstance().logText;
        var list = logText.text.split('|')
        var arr = [];
        for(var i=0;i<list.length;i++)
        {
            arr.push({text:list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}