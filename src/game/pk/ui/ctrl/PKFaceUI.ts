class PKFaceUI extends game.BaseContainer {
    private static _instance:PKFaceUI;
    public static getInstance():PKFaceUI {
        if (!this._instance)
            this._instance = new PKFaceUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKFaceSkin";
    }
    private con: eui.Group;

    private faceArr = [];
    public childrenCreated() {
        super.childrenCreated();
        for(var i=0;i<20;i++)
        {
            var mc:any = this.con.getChildAt(i);
            this.faceArr.push(mc);
            mc.index = i+1;
            mc.source = 'pk_e_'+mc.index+'_png'
            this.addBtnEvent(mc,this.onClick)
        }

    }

    private onClick(e){
         var index = e.currentTarget.index
        PKFaceItem.createItem().show(index,1);
        PKServerManager.getInstance().sendData(GameEvent.pkserver.face,{owner:PKData.getInstance().myPlayer.id,id:index},(msg)=>{

        })
        this.hide();
    }

    public hide(){
        MyTool.removeMC(this);
        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageClick,this)
    }

    private onStageClick(e){
        if(!this.hitTestPoint(e.stageX,e.stageY))
        {
            this.hide();
        }
    }

    public show(){
        GameManager.stage.addChild(this);
        this.x = 10
        this.y = (PKingUI.getInstance().displayCon-280)/2 + PKingUI.getInstance().displayY

        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageClick,this)
        egret.callLater(()=>{
            GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageClick,this)
        },this)
    }
}