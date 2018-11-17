class HangUI extends game.BaseItem {

    private static _instance: HangUI;
    public static getInstance(): HangUI {
        if(!this._instance)
            this._instance = new HangUI();
        return this._instance;
    }

    private con: eui.Group;


    private cost1 = 0
    private cost2 = 0
    private overCount = 10

    private initTime
    private openTimer
    private lastRota = 0

    private callStop = false;

    public constructor() {
        super();
        this.skinName = "HangUISkin";
        HangUI._instance = this;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.initTime = egret.getTimer();
        this.resetHeight(500);
    }

    public resetHeight(h){
        this.height = h;
        //this.con.mask = new egret.Rectangle(0,0,580-5*2,h-5*2)
    }

    public onVisibleChange(b){
         if(b)
            this.renew()
        else
            this.stop();
    }


    public renew(){
        var cd =  1000 -  (egret.getTimer() - this.initTime)
        clearTimeout(this.openTimer);
        if(cd > 0)
        {
            this.reset(true);
            this.openTimer = setTimeout(()=>{
                if(this.stage)
                    this.renew();
            },cd)
            return;
        }
        this.callStop = false;
        var pkvideo = PKVideoCon.getInstance()
        if(pkvideo.parent != this.con)
            this.reset();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    }

    //public addVideoCon(){
    //    var pkvideo = PKVideoCon.getInstance()
    //    this.con.addChild(pkvideo)
    //    pkvideo.y = -10;
    //    pkvideo.x = 0
    //}

    public stop(){
        this.callStop = true
        clearTimeout(this.openTimer);
    }

    public reset(stopStart?){
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:UM.gameid,team:1,force:100,hp:1},
                {id:2,gameid:'npc',team:2,force:100,hp:1}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_MAIN_HANG
        PKBulletManager.getInstance().freeAll();
        var PD = PKData.getInstance();
        PD.init(data);
        PD.isReplay = true
        var pkvideo = PKVideoCon.getInstance();
        this.con.addChild(pkvideo)
        pkvideo.y = this.height-510;
        pkvideo.init(true);
        pkvideo.x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;     // + PKConfig.appearPos
        this.cost1 = 20
        this.cost2 = 20
        this.overCount = 0

        if(stopStart)
            return;

        PD.start();
        this.onStep()
    }

    public clean(){
        var pkvideo = PKVideoCon.getInstance()
        if(pkvideo.parent == this.con)
        {
            egret.Tween.removeTweens(pkvideo)
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            PKBulletManager.getInstance().freeAll()
            pkvideo.remove();
            MyTool.removeMC(pkvideo);
        }
        clearTimeout(this.openTimer);
    }


    public onStep(){
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();
        var videoCon = PKVideoCon.getInstance();
        var cd = PD.getPassTime() - PD.actionTime
        if(cd > 1000*5)
        {
            this.reset();
            return;
        }
        while(cd > PKConfig.stepCD)
        {
            PD.actionTime += PKConfig.stepCD;
            cd -= PKConfig.stepCD;
            if(Math.floor(PD.actionTime/PKConfig.stepCD)%10 == 0)
                this.testAddMonster();

            PC.monsterAction();
            PC.monsterMove();
            PKMonsterAction.getInstance().actionAtk(PD.actionTime);//攻击落实
            PC.actionFinish();
        }
        videoCon.action();
        videoCon.randomTalk()
        if(PD.isGameOver ||  PD.actionTime > 90000 || (PD.actionTime > 3000 && PD.monsterList.length == 0))
        {
            this.overCount ++;
            if(this.overCount == 50)
            {
                if(this.callStop)
                {
                    this.clean();
                    return;
                }
                this.reset();
            }
            if(PD.isGameOver)
                return;
        }

        //videoCon.x = -(videoCon.width-640)/2;

        //var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        //if(!item && PD.actionTime > 10*1000)
        //    item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
        //if(item)
        //{
        //    var w = 580
        //    var scrollH = -(item.x - w/2);
        //    if(scrollH > 0)
        //        scrollH = 0;
        //    else if(scrollH < w - videoCon.width)
        //        scrollH = w - videoCon.width;
        //    var dec = Math.abs(videoCon.x - scrollH)
        //    var rote =  videoCon.x > scrollH ?1:-1
        //    if(dec > 80 || this.lastRota == rote)
        //    {
        //        egret.Tween.removeTweens(videoCon)
        //        if(dec > 10)
        //        {
        //            var tw = egret.Tween.get(videoCon)
        //            tw.to({x:scrollH},Math.min(300,dec*10))
        //        }
        //        else
        //        {
        //            videoCon.x = scrollH;
        //        }
        //        this.lastRota = rote
        //    }
        //}
    }

    private getTestID(){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level != 999)
                arr.push(s)
        }
        //
        //var data = SkillVO.data;
        //for(var s in data)
        //{
        //    if(data[s].level != 999)
        //        arr.push(s)
        //}
        return ArrayUtil.randomOne(arr);
    }

    private testAddMonster(){
        if(this.cost1 > 0)
        {
            var id = <number>ArrayUtil.randomOne(CardManager.getInstance().getMyMonsterList(0)).id;
            if(Config.isDebug && DM.testHangView)
            {
                id = this.getTestID();
            }
            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost1 -= vo.cost
            this.addMonster(id,1)
        }

        if(this.cost2 > 0)
        {
            while(true)
            {
                var id = <number>ArrayUtil.randomOne(CardManager.getInstance().getMyMonsterList(0)).id;
                if(id == 47)
                    continue;
                if(id < PKConfig.skillBeginID)
                    break;
            }
            if(Config.isDebug && DM.testHangView)
            {
                id = this.getTestID();
            }

            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost2 -= vo.cost
            this.addMonster(id,2)
        }
    }

    private addMonster(id,ownerid){
        //if(!this.stage)
        //    return;
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(ownerid);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        var oo = {
            force:owner.force,
            mid:id,
            owner:ownerid,
            atkRota:atkRota,
            x:x,
            level:1,
            y:-25 + Math.random()*50,
            actionTime:PD.actionTime
        }
        PD.addMonster(oo);
    }

}