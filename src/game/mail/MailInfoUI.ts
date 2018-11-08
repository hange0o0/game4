class MailInfoUI extends game.BaseWindow {

    private static _instance: MailInfoUI;
    public static getInstance(): MailInfoUI {
        if(!this._instance)
            this._instance = new MailInfoUI();
        return this._instance;
    }

    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private list: eui.List;
    private titleText: eui.Label;
    private desText: eui.Label;
    private timeText: eui.Label;
    private scroller: eui.Scroller;



    private btnState = '';
    public dataIn
    public constructor() {
        super();
        this.skinName = "MailInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = AwardItem;
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.scroller.viewport = this.list
    }

    public onClick(){
        //if(this.btnState == 'pk')
        //{
        //    var content = JSON.parse(this.dataIn.content);
        //    SlaveManager.getInstance().showSlaveVideo(content.pkdata)
        //    return;
        //}
         MailManager.getInstance().get_mail_award(this.dataIn,()=>{
              this.hide();
         })
    }

    public show(v?){
        this.dataIn = v
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var content = JSON.parse(this.dataIn.content);
        if(this.dataIn.from_gameid == 'sys')
        {
            this.titleText.text = '系统消息'
            if(content.title)
                this.titleText.text = Base64.decode(content.title);
        }
        else
        {
            this.titleText.text = '【'+Base64.decode(content.nick) + '】的消息'
        }

        this.timeText.text = DateUtil.formatDate('MM-dd hh:mm',DateUtil.timeToChineseDate(this.dataIn.time))
        this.desText.text = '　　' + MailManager.getInstance().getMailDes(this.dataIn);
        //this.timeText.text = DateUtil.getStringBySeconds(Math.max(TM.now() - this.dataIn.time,1),false,2) + '前'

        var haveAward = this.dataIn.type > 100

        this.currentState = haveAward?'award':'normal';
        if(haveAward)
        {
            var canAward = haveAward && !parseInt(this.dataIn.stat);
            var arr = MyTool.getAwardArr(content.award);
            this.list.dataProvider = new eui.ArrayCollection(arr)
            //this.scroller.viewport.scrollV = 0;
            if(canAward)
            {
                this.btnGroup.addChild(this.okBtn)
                this.okBtn.label = '领取'
                this.btnState = 'award'
            }
            else
                MyTool.removeMC(this.okBtn);
        }
        else if(content.pkdata)
        {
            this.btnGroup.addChild(this.okBtn)
            this.okBtn.label = '战斗过程'
            this.btnState = 'pk'
        }
        else
        {
            this.list.dataProvider = new eui.ArrayCollection([])
            MyTool.removeMC(this.okBtn);
        }
    }
}
