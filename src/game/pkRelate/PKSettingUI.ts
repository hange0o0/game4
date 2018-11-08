class PKSettingUI extends game.BaseWindow {

    private static _instance: PKSettingUI;
    public static getInstance(): PKSettingUI {
        if(!this._instance)
            this._instance = new PKSettingUI();
        return this._instance;
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private des: eui.Label;


    public constructor() {
        super();
        this.skinName = "PKSettingUISkin";
        this.canBGClose = false;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.onClose)
    }

    private onClose(){
        PKingUI.getInstance().setStop(false)
        this.hide();
    }

    private onClick(){
        var PD = PKData.getInstance();
        PD.isGameOver = true
        PD.myPlayer.teamData.hp = 0;
        this.onClose();

        if(PKingUI.getInstance().counting)
        {
            PKingUI.getInstance().callFail()
        }
    }

    public show(){
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
        var PD = PKData.getInstance();
        if(PD.isReplay)
        {
            this.des.text = '确定要退出观看吗？'
            this.okBtn.label = '退出'
            this.cancelBtn.label = '继续'
        }
        else if(PKManager.getInstance().pkType == PKManager.TYPE_TEST)
        {
            this.des.text = '确定要结束本轮测试吗？'
            this.okBtn.label = '结束'
            this.cancelBtn.label = '继续'
        }
        else
        {
            this.des.text = '确定要认输退出吗？'
            this.okBtn.label = '认输'
            this.cancelBtn.label = '继续'
        }
    }
}