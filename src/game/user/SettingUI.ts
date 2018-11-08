class SettingUI extends game.BaseWindow {

    private static _instance: SettingUI;
    public static getInstance(): SettingUI {
        if(!this._instance)
            this._instance = new SettingUI();
        return this._instance;
    }

    private headMC: HeadMC;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private idText: eui.Label;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private loginBtn: eui.Button;
    private effectCB: eui.CheckBox;
    private musicCB: eui.CheckBox;
    private modeCB: eui.CheckBox;
    private qqText: eui.Label;
    private versionText: eui.Label;
    private logBtn: eui.Label;



    public constructor() {
        super();
        this.skinName = "SettingUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC,this.onHead)

        this.addBtnEvent(this.musicCB,this.onMusic);
        this.addBtnEvent(this.effectCB,this.onSound);
        this.addBtnEvent(this.modeCB,this.onMode);
        this.addBtnEvent(this.cancelBtn,this.hide);
        this.addBtnEvent(this.loginBtn,this.onLoginOut);
        this.addBtnEvent(this.logBtn,this.onLog);
        this.addBtnEvent(this.qqText,this.onQQ);
        //this.modeCB.visible = false
    }

    private onQQ(){
        if(_get['app'])
        {
            AppManager.getInstance().joinQQ();
        }
    }

    private onMode(){
        var oldMode = SharedObjectManager.getInstance().getValue("renderMode") || 'webgl'
        if(oldMode == 'webgl')
            var str = '切换成兼容模式，会对游戏性能有一些影响，是否继续'
        else
            var str = '停用兼容模式后，游戏在部分机型上可能会出现异常，是否继续'
        MyWindow.Confirm(str,(value)=>{
            if(value == 1)
            {
                SharedObjectManager.getInstance().setValue("renderMode",oldMode=='webgl'?'canvas':'webgl')
                MyTool.refresh();
            }
            else
            {
                this.modeCB.selected = !this.modeCB.selected
            }
        },['取消','继续'])
    }

    private onLog(){
        LogUI.getInstance().show();
    }

    private onLoginOut(){
        LoginManager.getInstance().quickPassword = null
        LoginManager.getInstance().writeDB();
        MyTool.refresh();
    }

    private onMusic(){
        SoundManager.getInstance().bgPlaying = this.musicCB.selected
    }

    private onSound(){
        SoundManager.getInstance().soundPlaying = this.effectCB.selected
    }

    private onHead(){
        ChangeHeadUI.getInstance().show();
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.head_change,this.renew)
    }

    public renew(){
        this.musicCB.selected = SoundManager.getInstance().bgPlaying
        this.effectCB.selected = SoundManager.getInstance().soundPlaying
        this.modeCB.selected = SharedObjectManager.getInstance().getValue("renderMode") == 'canvas';
        this.headMC.setData(UM.head,UM.type);
        MyTool.setTypeImg(this.typeMC,UM.type)
        this.nameText.text = UM.nick
        this.idText.text = '游戏ID：'+UM.uid
        //this.idText.textFlow = <Array<egret.ITextElement>>[
        //    {text: UM.gameid + "", style: {"underline": true}}
        //];
        if(FromManager.getInstance().isQunHei)          //群号 246970435
        {
            this.qqText.textFlow = <Array<egret.ITextElement>>[
                {text: "246970435", style: {"underline": true}}
            ];
        }
        else
        {
            this.qqText.textFlow = <Array<egret.ITextElement>>[
                {text: "347331204", style: {"underline": true}}
            ];
        }


        this.versionText.textFlow = <Array<egret.ITextElement>>[
            {text:  Config.displayVersion, style: {"underline": true}}
        ];

        this.logBtn.visible = LoginManager.getInstance().logText.text;
        if(FromManager.getInstance().h5Form)
            MyTool.removeMC(this.loginBtn)
    }
}