class MailItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MailItemSkin";
    }

    private nameGroup: eui.Group;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private headMC: HeadMC;
    private timeText: eui.Label;
    private desText: eui.Label;
    private redMC: eui.Image;
    private awardMC: eui.Image;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.headMC,this.onHead)
    }

    private onHead(e){
        e.stopImmediatePropagation()
        if(this.data.from_gameid == 'sys')
            return;
        OtherInfoUI.getInstance().show(this.data.from_gameid);
    }
    private onClick(){
        MailInfoUI.getInstance().show(this.data)
    }

    public dataChanged(){
         var content = JSON.parse(this.data.content);
        if(this.data.from_gameid == 'sys')
        {
            this.nameText.text =  '系统消息'
            if(content.title)
                this.nameText.text = Base64.decode(content.title);
            this.headMC.setData('sys');
            MyTool.removeMC(this.typeMC)
        }
        else
        {
            var nameStr = MailManager.getInstance().getMailTitle(this.data)
            this.setHtml(this.nameText,nameStr)
            MyTool.setTypeImg(this.typeMC,content.type)
            this.nameGroup.addChildAt(this.typeMC,0)
            this.headMC.setData(content.head,content.type);
        }

        this.timeText.text = DateUtil.getStringBySeconds(Math.max(TM.now() - this.data.time,1),false,2) + '前'
        this.desText.text = StringUtil.getString(MailManager.getInstance().getMailDes(this.data),this.desText)

        this.redMC.visible = this.data.type > 100 && !parseInt(this.data.stat);
        this.awardMC.visible = this.data.type > 100 && !!parseInt(this.data.stat)
    }

}