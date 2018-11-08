class PKState extends game.BaseItem {

    private stateMC:eui.Image;
    private atkMV:MonsterAtkMV

    private timer;
    public constructor() {
        super();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged() {
        //if(!this.atkMV)
        //    this.atkMV = new MonsterAtkMV();
        if(this.data == PKConfig.STATE_YUN)
        {
            this.initAtkMV();
            this.atkMV.load('effect2_png',0,154,39,2)
        }
        else if(this.data == PKConfig.STATE_DIE)
        {
            this.initImg();
            this.stateMC.source = MyRES.getPath('effect5_png')
            this.stateMC.anchorOffsetX = 30/2
        }
        //else if(this.data == PKConfig.STATE_MOMIAN)
        //{
        //    this.initImg();
        //    this.stateMC.source = 'icon_def2_png'
        //    this.stateMC.anchorOffsetX = 52/2
        //}
        else if(this.data == PKConfig.STATE_MODUN)
        {
             this.initAtkMV();
            this.atkMV.load('effect1_png',0,440,128,4)
        }
        else if(this.data == PKConfig.STATE_MIANSHANG)
        {
             this.initImg();
            this.stateMC.source = MyRES.getPath('effect3_png')
            this.stateMC.anchorOffsetX = 52/2
        }
    }

    private initImg(){
        if(!this.stateMC)
        {
            this.stateMC = new eui.Image()
            this.addChild(this.stateMC)
        }
    }
    private initAtkMV() {
        if (!this.atkMV) {
            this.atkMV = new MonsterAtkMV();
            this.addChild(this.atkMV);
            this.atkMV.visible = true;
            this.atkMV.addEventListener('mv_end', this.onAtkMVEnd, this)
        }
    }

    private onAtkMVEnd(){
        //if()
        //this.atkMV.stop();
    }

    public remove(){
        clearTimeout(this.timer)
        MyTool.removeMC(this);
        if (this.atkMV)
            this.atkMV.stop()
    }

    public show(item){
        var mD:PKMonsterData = item.data
        clearTimeout(this.timer);
        switch (parseInt(this.data)){
            case PKConfig.STATE_YUN:
                this.atkMV.play()
                this.x = 50 -  154/4
                this.y = 300 - mD.getVO().height - 35
                break;
            case PKConfig.STATE_DIE:
                this.x = 50
                this.y = 300 - mD.getVO().height -50
                break;
            case PKConfig.STATE_MODUN:
                this.atkMV.play()
                var scale = (mD.getVO().height + 20)/128
                this.x = 50 -  110/2*scale
                this.y = 300 - mD.getVO().height-20
                this.atkMV.scaleX = this.atkMV.scaleY = scale
                break;
            case PKConfig.STATE_MIANSHANG:
                this.scaleX = item.monsterMV.scaleX
                if(item.monsterMV.scaleX == 1)
                    this.x = 50 -  mD.getVO().width/2 +10
                else
                    this.x = 50 +  mD.getVO().width/2 -10
                this.y = 300 - mD.getVO().height - 30
                this.timer = setTimeout(()=>{this.remove()},100)
                break;
        }

    }
}