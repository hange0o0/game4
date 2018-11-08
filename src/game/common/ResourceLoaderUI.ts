class ResourceLoaderUI extends game.BaseWindow {

    private static _instance:ResourceLoaderUI;

    public static getInstance():ResourceLoaderUI {
        if (!this._instance)
            this._instance = new ResourceLoaderUI();
        return this._instance;
    }

    private finishFun;
    public show(arr?,fun?){
        this.LoadFiles = arr;
        this.finishFun = fun;
        super.show();
    }
    public onShow(){
        this.finishFun && this.finishFun();
        egret.callLater(this.hide,this);
    }
}