class MonsterAtkMV extends eui.Group {
    private mc:eui.Image;

    public frameTotal = 20//播放完一轮需要的帧数

    public rota = 0; //0横向，1纵向
    private index = 0;

    private mw = 480/4
    private mh = 480/4


    private frameNum = 4
    constructor(){
        super();
        this.init();
    }

    private init() {
        this.mc = new eui.Image();
        this.addChild(this.mc);
        //
        //MyTool.addTestBlock(this)

    }

    public load(id,rota,w,h,num=4){

        this.rota = rota;
        this.frameNum = num;
        if(rota == 0)
        {
            this.mw = w / num
            this.mh = h
        }
        else
        {
            this.mw = w
            this.mh = h/num
        }


        MyTool.setImgSource(this.mc,MyRES.getPath(id));

        this.width = this.mw
        this.height = this.mh
        this.mc.scrollRect = new egret.Rectangle(0,0,this.mw,this.mh)
    }


    public play(){
        this.reset()
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public stop(){
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    private reset(){
        this.index = 0;
        this.onE();
    }

    private onE(){
        var w = this.mw
        var h = this.mh
        var frameStep = Math.round(this.frameTotal*(1)/this.frameNum);

        if(this.rota == 0)
        {
            var x = Math.floor(this.index/frameStep)*w
            var y = 0
        }
        else
        {
            var y = Math.floor(this.index/frameStep)*h
            var x = 0
        }
        this.mc.scrollRect = new egret.Rectangle(x,y,w,h)
        this.index ++;
        if(this.index>=this.frameNum*frameStep)
        {
            this.index = 0;
            this.onEnd()
        }
    }

    private onEnd(){
        this.dispatchEventWith('mv_end')
    }

}