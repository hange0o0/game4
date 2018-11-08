class BottomUI extends game.BaseContainer {
    public constructor() {
        super();
    }

    public closeBtn: eui.Button;

    private hideFun;
    private thisObj;
    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.backBtnClick);
    }
    public setHide(fun,thisObj):void{
        this.hideFun = fun;
        this.thisObj = thisObj;
    }
    private backBtnClick(event:egret.TouchEvent):void {
        this.hideFun && this.hideFun.apply(this.thisObj);
    }
}