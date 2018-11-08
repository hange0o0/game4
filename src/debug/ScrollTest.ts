class ScrollTest extends game.BaseUI {
    private static instance: ScrollTest;
    public static getInstance() {
        if(!this.instance) this.instance = new ScrollTest();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "ScrollTestSkin";
    }
    private  removeBtn: eui.Rect;
    private  addBtn: eui.Rect;
    private  group: eui.Group;
    private  scroller: eui.Scroller;


    private mcArray = [];

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.addBtn,this.onStart)
        this.addBtnEvent(this.removeBtn,this.onMove)
    }

    private onStart(e){
        this.group.addChild(this.scroller)

    }
    private onMove(e){
        MyTool.removeMC(this.scroller)

    }

    public resizeFun(){
        this.scroller.height = GameManager.stage.stageHeight-300;
        console.log(this.scroller.height)
    }






}
