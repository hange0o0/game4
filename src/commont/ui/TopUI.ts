class TopUI extends game.BaseContainer {
    public constructor() {
        super();
    }

    //private closeBtn: eui.Button;
    private titleText: eui.Label;
    private helpBtn: eui.Image;



    private helpKey
    public childrenCreated() {
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.helpBtn.visible = false;
    }

    public onHelp(){
         HelpManager.getInstance().showHelp(this.helpKey)
    }

    public setTitle(name:string,helpKey?):void{
        this.titleText.text = name;
        this.helpKey = helpKey
        this.helpBtn.visible = helpKey;
    }
    //private backBtnClick(event:egret.TouchEvent):void {
    //    this.dispatchEventWith("hide");
    //}
}