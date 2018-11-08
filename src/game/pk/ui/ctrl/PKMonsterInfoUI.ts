class PKMonsterInfoUI extends game.BaseContainer {
    private static instance:PKMonsterInfoUI;
    public static getInstance() {
        return this.instance;
    }

    public constructor() {
        super();
        PKMonsterInfoUI.instance = this;
        this.skinName = "PKMonsterInfoSkin";
    }

    private nameText1: eui.Label;
    private forceText1: eui.Label;
    private forceText2: eui.Label;
    private nameText2: eui.Label;
    private typeGroup: eui.Group;
    private t11: PKMonsterInfoItem;
    private t12: PKMonsterInfoItem;
    private t21: PKMonsterInfoItem;
    private t22: PKMonsterInfoItem;
    private t31: PKMonsterInfoItem;
    private t32: PKMonsterInfoItem;
    private totalText2: eui.Label;
    private totalText1: eui.Label;











    public playerData1:PKPlayerData
    public playerData2:PKPlayerData

    private xy

    public childrenCreated() {
        super.childrenCreated();
        this.hide();
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }
    public onVideoEvent(e){
        if(!this.visible)
            return;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        //if(!data || data.owner != this.playerData.id) //user不一定有
        //    return;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_MONSTER_DIE:
                this.renew();
                break;
        }
    }

    public onTimer(){
        if(!this.visible)
            return;
        //this.renewFlag && this.renewList()
    }

    public hide(){
        this.visible = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)
    }

    public show(playerData1,playerData2,xy?){
        this.xy = xy;
        this.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.once(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)

        this.visible = true;
        this.playerData1 = playerData1;
        this.playerData2 = playerData2;

        //this.type.source = 'icon_type'+playerData.type+'_png'
        this.nameText1.text = playerData1.nick;
        this.forceText1.text = '' + playerData1.force + ''
        this.nameText2.text = playerData2.nick;
        this.forceText2.text = '' + playerData2.force + ''
        //this.selfIcon.visible = playerData == PKData.getInstance().myPlayer;

        //if(this.playerData.teamData.atkRota == PKConfig.ROTA_LEFT)
        //    this.x = 150
        //else
            this.x = 10


        this.renew();
        this.y = (PKingUI.getInstance().displayCon-320)/2 + PKingUI.getInstance().displayY//GameManager.stage.stageHeight - 470//this.xy.y + 50
    }

    private renewPlayer(playerData,index){
        var PD = PKData.getInstance();
        var arr = [
            {type:1,self:playerData.type,s1:0,s2:0,total:0,max:0},
            {type:2,self:playerData.type,s1:0,s2:0,total:0,max:0},
            {type:3,self:playerData.type,s1:0,s2:0,total:0,max:0}
        ];
        var total = 0;
        var max = 0;
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i]
            if(mvo.owner != playerData.id)
                continue;

            var vo = mvo.getVO()
            var type = vo.type;
            total += vo.space;
            if(!type)
                continue;
            var oo = arr[type-1];
            if(mvo.dieTime)
                oo.s2 += vo.space
            else
                oo.s1 += vo.space
            max = Math.max(max,oo.s1+oo.s2)

        }
        for(var i=0;i<arr.length;i++)
        {
            var mc = this['t' + (i+1)+index]
            var data = arr[i];
            data.total = total;
            data.max = max;
            mc.data = data;
        }

        this['totalText' + index].text = '总人口：' + total + '/' + PKConfig.maxMonsterSpace;
    }

    public renew(){
        this.renewPlayer(this.playerData1,1)
        this.renewPlayer(this.playerData2,2)
    }
}