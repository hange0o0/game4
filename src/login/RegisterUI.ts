class RegisterUI extends game.BaseWindow {
    private static instance:RegisterUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "RegisterUISkin";
        this.canBGClose = false;
    }

    private nameText: eui.TextInput;
    private passwordText1: eui.TextInput;
    private passwordText2: eui.TextInput;
    private backBtn: eui.Button;
    private loginBtn: eui.Button;


    public noMV: boolean = true;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onClick);
        this.addBtnEvent(this.backBtn, this.onClose);

        this.nameText.restrict = "^\\\\\"\'"

    }

    public onClose(){
        this.hide();
        LoginUI.getInstance().show();
    }

    public show(v?){
        LoginUI.getInstance().hide();
        super.show();
    }

    public onShow(){
        this.nameText.text = ''
        this.passwordText1.text = ''
        this.passwordText2.text = ''
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        //if(!Config.isDebug && !LM.testName(this.nameText.text))
        //{
        //    return;
        //}
        if(!Config.isDebug &&!LM.testPassword(this.passwordText1.text))
        {
            return;
        }
        if(this.passwordText1.text != this.passwordText2.text)
        {
            MyWindow.Alert('两次输入密码不一致');
            return;
        }
        LM.register(this.nameText.text,this.passwordText1.text);
    }
}