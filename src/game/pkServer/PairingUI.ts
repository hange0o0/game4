class PairingUI extends game.BaseUI {

    private static _instance: PairingUI;
    public static getInstance(): PairingUI {
        if(!this._instance)
            this._instance = new PairingUI();
        return this._instance;
    }

    private topUI: TopUI;
    private con: eui.Group;
    private cdText: eui.Label;
    private cancelBtn: eui.Button;




    private monsterArr = []
    private card
    private hero
    private onShowFun
    private startTimer
    public constructor() {
        super();
        this.skinName = "PairingUISkin";
        this.canBGClose = false;
        this.LoadFiles = ['pk']
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('竞技场')
        this.addBtnEvent(this.cancelBtn,this.onClose)
    }

    private onClose(){
        PKServerManager.getInstance().close();
        this.hide();
    }

    public show(v?,v2?,fun?){
        this.card = v;
        this.hero = v2;
        this.onShowFun = fun;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.onShowFun && this.onShowFun();
        this.startTimer = TM.now();
        this.renew();
        this.onTimer();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var cd = TM.now() - this.startTimer + 1
        this.cdText.text = DateUtil.getStringBySecond(cd).substr(-5)
        if(cd > 25)
        {
            this.onClose();
            MyWindow.Confirm('很遗憾，没有匹配到玩家\n进群喊人一起匹配吧！',(b)=>{
                if(b==1)
                {
                    if(_get['app'])
                    {
                        AppManager.getInstance().joinQQ();
                    }
                }
            },['取消', 'QQ群'])
        }
    }

    public renew(){
         while(this.monsterArr.length > 0)
         {
             var item:PKMonsterMV = this.monsterArr.pop();
             PKMonsterMV.freeItem(item);
         }

        var arr = this.card.split(',')
        for(var i=0;i<arr.length;i++)
        {
            var id = parseInt(arr[i])
            if(id > PKConfig.skillBeginID)
            {
                arr.splice(i,1);
                i--;
            }
        }
        if(this.hero)
        {
            var hero = this.hero.split(',');
            for(var i=0;i<hero.length;i++)
            {
                var temp = hero[i].split('|')
                if(parseInt(temp[1]))
                    arr.push(temp[0])
            }
        }

        ArrayUtil.random(arr,3);
        if(arr.length > 15)
            arr.length = 15;

        var des = 25
        var begin = (400 - ((arr.length-1)*des))/2
        for(var i=0;i<arr.length;i++)
        {
            var id = parseInt(arr[i])
            item = PKMonsterMV.createItem();
            this.con.addChild(item);
            item.load(id)
            item.stand();
            item.scaleX = item.scaleY = 1.2;
            item.y = 280 + Math.random()*80
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        ArrayUtil.sortByField(this.monsterArr,['y'],[0]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.con.addChild(this.monsterArr[i]);
        }



        //item.stand();
    }
}