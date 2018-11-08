class DebugInput extends game.BaseWindow {
    private static instance:DebugInput;

    public static getInstance() {
        if (!this.instance) this.instance = new DebugInput();
        return this.instance;
    }

    private  cancelBtn: eui.Button;
    private  okBtn: eui.Button;
    private  inputText: eui.TextInput;
    private  titleText: eui.Label;

    private fun
    private title
    private input

    public constructor() {
        super();
        this.skinName = "DebugInputSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide);
        this.addBtnEvent(this.okBtn,this.onClick);
    }

    public show(fun?,title?,input?)
    {
        this.fun = fun;
        this.title = title || '';
        this.input = input || '';
        super.show();
    }

    public onShow(){
        this.titleText.text = this.title;
        this.inputText.text = this.input;
    }

    public onClick()
    {
        if(this.fun)
        {
            this.fun(this.inputText.text);
        }
        this.hide();
    }


}