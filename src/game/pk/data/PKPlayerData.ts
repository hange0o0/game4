//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public gameid;
    public nick;
    public head;
    public hp; //城堡的血量
    public type//类型
    public force;//怪的基础属性
    public teamData:PKTeamData   //对应队伍

    public lv//卡牌的等级

    public card//原始的手牌
    public hero//原始的英雄
    public level//PVP中有
    public score//PVP中有
    public autolist//原始的autolist
    private handCard = {};//当前的手牌  [{index,mid},]  上限5
    public hideCard = [];//隐藏的手牌  [{index,mid},]
    //public posCard = {};//已上阵的手牌 1-4,如果是自动的，不受此限制
    private posIndex = 1;
    //public prePosCard = {};//准备上阵的手牌 1-4,如果是自动的，不受此限制

    public posHistory = []; //要发给服务器的出卡记录
    public useCardList = []//使用过的卡

    private mp = 0//当前的魔法
    private mpArr = []//当前的魔法
    public useMP = 0//已使用的魔法
    private lastTime = 0//上一次魔法处理时间

    public isauto;
    public autoList;
    public heroList   //英雄列表
    public skillValue = {};

    public posList = {};//待上阵的卡牌列表


    constructor(obj?){
        if(obj)
            this.fill(obj);

        if(this.nick)
            this.nick = Base64.decode(this.nick);
        else
            this.nick = '守卫者' + this.id;
    }

    public fill(obj)
    {
        obj = ObjectUtil.clone(obj);
        //console.log(JSON.stringify(obj));
        for (var key in obj) {
            this[key] = obj[key];
        }
        this.handCard = {};
        this.hideCard = [];
        this.autoList = null;
        if(obj['autolist'])
        {
            this.autoList = PKTool.decodeAutoList(obj['autolist'].split('#'))
            if(!obj['card'])
                obj['card'] = obj['autolist'];
        }
        if(obj['actionlist'])
            this.autoList = PKTool.decodeActionList(obj['actionlist'].split(','))
        if(obj['hero'])
            this.heroList = PKTool.decodeHeroList(obj['hero'].split(','))
        if(obj['card'])
        {
            var card = obj['card'].split(',');
            for(var i=0;i<card.length;i++)
            {
                var cardData:any = {
                    index:i,
                    cardPos:0,
                    mid:card[i]
                }
                if(i<PKConfig.maxHandCard)
                {
                    cardData.cardPos =  i+1;
                    this.handCard[cardData.cardPos] = cardData;
                }
                else
                {
                    this.hideCard.push(cardData)
                }
            }
        }
        //if(this.autoList)//去除里面的英雄，这个会根据时间上的
        //{
        //     for(var i=0;i<this.autoList.length;i++)
        //     {
        //         if(CM.getCardVO(this.autoList[i].mid).isHero())
        //         {
        //             this.autoList.splice(i,1);
        //             i--;
        //         }
        //     }
        //}
        this.isauto = this.autoList && this.autoList.length > 0
        this.mp = PKConfig.mpInit;
        this.mpArr = PKTool.getMPList();
        while (!this.mpArr[0])
        {
            this.mpArr.shift();
        }

        this.posIndex = 1;
    }

    public getCardNum(){
        return (ObjectUtil.objLength(this.getHandCard(),true) + this.hideCard.length + (this.autoList?this.autoList.length:0))
    }
    public getPosNum(){
        return 0//ObjectUtil.objLength(this.posCard,true)
    }

    public getMonsterForce(mid){
        var force = this.force || 0;
        if(this.lv && this.lv[mid])
            force += this.lv[mid]*5;
        return force;
    }

    public addMP(v){
        this.resetMp();
        this.mp += v;
        this.useMP -= v;
    }
    public getMP(){
        this.resetMp();
        return this.mp;
    }

    private resetMp(){
        var t = PKData.getInstance().actionTime;
        var step = 1;
        while (this.mpArr[0] &&  this.mpArr[0]< t) {
            this.mp += step;
            this.lastTime = this.mpArr[0]
            this.mpArr.shift();
        }
    }

    public nextMpRate(){
        return  (PKData.getInstance().actionTime - this.lastTime) / (this.mpArr[0] - this.lastTime)
    }

    //private resetMp(){
    //    var t = PKData.getInstance().actionTime;
    //    var step = 1;
    //    //var max = PKConfig.maxMP;
    //    //
    //    //if(this.mp >= max){
    //    //    this.lastTime = t;
    //    //    return;
    //    //}
    //
    //    var nextCD = this.getNextCD();
    //    while (nextCD <= t) {
    //        this.mp += step;
    //
    //        //if(this.mp >= max){
    //        //    this.lastTime = t;
    //        //    return;
    //        //}
    //
    //        this.lastTime = nextCD
    //        nextCD = this.getNextCD();
    //    }
    //}
    //
    //public nextMpRate(){
    //    return  (PKData.getInstance().actionTime - this.lastTime) / (this.getNextCD() - this.lastTime)
    //}
    //
    //private getNextCD(){
    //    if(this.lastTime < 1000 * 60)
    //        return this.lastTime + 2000;
    //    else if(this.lastTime < 1000 * 60 * 2)
    //        return this.lastTime + 1500;
    //    else
    //        return this.lastTime + 1000;
    //}

    //public preloadHero(index){
    //    if(!this.heroList)
    //        return
    //    var oo = this.heroList[index - 1]
    //    if(oo && oo.mid) {
    //        MonsterVO.getObject(oo.mid).preLoad()
    //    }
    //}
    //
    ////出英雄
    //public addHero(index){
    //    if(!this.heroList)
    //        return false;
    //    var oo = this.heroList[index - 1]
    //    if(oo && oo.mid)
    //    {
    //        var PD = PKData.getInstance();
    //        var owner = this;
    //        var atkRota = owner.teamData.atkRota;
    //        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
    //        var monsterData =  {
    //            force:owner.force,
    //            mid:oo.mid,
    //            owner:this.id,
    //            atkRota:atkRota,
    //            level:oo.level,
    //            x:x,
    //            y:-25 + Math.random()*50,
    //            actionTime:PD.actionTime
    //        }
    //        PD.addMonster(monsterData);
    //
    //        var step = Math.floor(PKData.getInstance().actionTime/PKConfig.stepCD)
    //        this.posHistory.push(step + '#' +oo.mid);
    //        this.useCardList.push(oo.mid)
    //
    //
    //        PKData.getInstance().addVideo({
    //            type:PKConfig.VIDEO_POS_SHOW,
    //            isHero:true,
    //            mid:oo.mid,
    //            level:oo.level,
    //            user:this
    //        })
    //        return true;
    //    }
    //    return false
    //}

    public addPosCard(cardData){

        var posCard = new PKPosCardData({
            id:this.posIndex,
            mid:cardData.mid,
            owner:this.id,
            actionTime:PKData.getInstance().actionTime,
        })
        if(!this.posList[PKData.getInstance().round])
            this.posList[PKData.getInstance().round] = [];
        this.posList[PKData.getInstance().round].push(posCard);

        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_POS_ADD,
            mid:cardData.mid,
            user:this,
        })

        this.posIndex ++
        this.addMP(-CM.getCardVO(cardData.mid).cost);

        this.sendToServer({
            mid:cardData.mid,
            owner:this.id,
            actionTime:PKData.getInstance().actionTime
        })


        //手牌更新
        for(var i=1;i<=PKConfig.maxHandCard;i++)
        {
            if(this.handCard[i] == cardData)
            {
                var newCard:any = this.hideCard.shift();
                if(newCard)
                {
                    newCard.cardPos = i
                }
                this.handCard[i] = newCard;
                break;
            }
        }
    }

    public actionPosCard(){
        var PD = PKData.getInstance();
        var arr = this.posList[PD.round];
        if(!arr)
            return;
        for(var i=0;i<arr.length;i++)
        {
            var mData = arr[i].getMonster(PD.actionTime);
            PD.addMonster(mData);
        }

    }

    //public onPosCardEnable(posCard:PKPosCardData){
    //    for(var i=1;i<=PKConfig.maxHandCard;i++)
    //    {
    //        if(this.handCard[i] == posCard。cardData)
    //        {
    //            var newCard:any = this.hideCard.shift();
    //            if(newCard)
    //            {
    //                newCard.cardPos = i
    //            }
    //            this.handCard[i] = newCard;
    //            break;
    //        }
    //    }
    //    if(!this.isauto) //自动上怪那里已加了一次
    //    {
    //        var step = Math.floor(posCard.addTime/PKConfig.stepCD)
    //        if(posCard.cardData.mid != 501)//自动上的卡不统计
    //        {
    //            this.posHistory.push(step + '#' + posCard.cardData.mid);
    //            this.useCardList.push(posCard.cardData.mid)
    //        }
    //
    //    }
    //
    //    if(newCard)
    //    {
    //        newCard.showTime = posCard.addTime + 500;
    //    }
    //}

    private sendToServer(posCard){
        var PD = PKData.getInstance();

        if(this == PD.myPlayer && !PD.isReplay && !PD.quick && PKManager.getInstance().isOnline && posCard.mid < 500) //需要通知服务器，等服务器返回成功才应答
        {
            PKManager.getInstance().sendPosToServer(posCard)
        }
        else
        {
            //posCard.enableWaiting();
        }

    }

    ////上阵卡
    //public testAddPosCard(t){
    //    for(var s in this.prePosCard)
    //    {
    //        if(this.prePosCard[s] && this.prePosCard[s].testAdd(t))
    //        {
    //            if(this.posCard[s])
    //            {
    //                this.posCard[s].die();
    //            }
    //            this.posCard[s] = this.prePosCard[s];
    //            this.prePosCard[s] = null;
    //        }
    //    }
    //}

    //取手牌  (5)
    public getHandCard(){
        return this.handCard;
    }

    public posCardFormServer(data){
        if(data.round < PKData.getInstance().round)//上阵时间异常,是更早的回合
        {

        }
        //data.actionTime = data.actiontime;
        this.addPosCard(data)
        //this.posCard[data.id] = new PKPosCardData(data);
        //var step = Math.floor(PKData.getInstance().actionTime/PKConfig.stepCD)
        //if(data.mid != 501)//自动上的卡不统计
        //{
        //    this.posHistory.push(step + '#' +data.mid);
        //    this.useCardList.push(data.mid)
        //}
    }

    //自动上阵相关
    public autoAction(t){
        while(this.autoList && this.autoList[0])
        {
            var data = this.autoList[0];
            if(data.time <= t)
            {
                //var list = data.list;
                //for(var i=0;i<list.length;i++)
                //{
                this.addPosCard(data)
                //}
                //data.owner = this.id;
                //data.actionTime = PKData.getInstance().actionTime;
                //data.isAuto = true;
                //this.posCard[data.id] = new PKPosCardData(data);
                this.autoList.shift();
                //this.posIndex = data.id + 1
                //
                //this.addMP(-CM.getCardVO(data.mid).cost)
                //this.removeAutoCard(this.posCard[data.id]);
                //if(this == PKData.getInstance().myPlayer)
                //{
                //    PKData.getInstance().addVideo({
                //        type:PKConfig.VIDEO_POS_ADD,
                //        user:this.posCard[data.id],
                //    })
                //}
                //var step = Math.floor(PKData.getInstance().actionTime/PKConfig.stepCD)

            }
            else
                break;
        }
    }

    //private removeAutoCard(data:PKPosCardData){
    //    var PD = PKData.getInstance()
    //    if(!PD.isView())
    //        return;
    //    var list = []
    //    for(var s in this.handCard)
    //    {
    //          if(this.handCard[s] && this.handCard[s].mid == data.mid && !this.handCard[s].remove)
    //          {
    //              list.push({index:s,autoIndex:this.handCard[s].index})
    //          }
    //    }
    //    if(list.length == 0)
    //        return;
    //    if(list.length > 1)
    //    {
    //        ArrayUtil.sortByField(list,['autoIndex'],[0])
    //    }
    //    data.cardData = this.handCard[list[0].index]
    //    this.handCard[list[0].index].remove = true
    //    this.sendToServer(data)
    //}

    //public getEnablePos(t,leftSpace){
    //    var arr = [];
    //
    //    var monsterNum = 0;
    //    for(var s in this.posCard)
    //    {
    //        var oo:PKPosCardData = this.posCard[s];
    //        if(!oo)continue;
    //
    //        if(oo.testAdd(t))
    //        {
    //            if(oo.mid < PKConfig.skillBeginID)
    //            {
    //                if(leftSpace == 0)
    //                    continue;
    //                else
    //                    monsterNum ++;
    //            }
    //            arr.push(oo)
    //        }
    //        else if(!oo.useEnable())//已失效
    //        {
    //            this.posCard[s].die();
    //            PKData.getInstance().addVideo({
    //                type:PKConfig.VIDEO_POS_REMOVE,
    //                user:this.posCard[s],
    //            })
    //            this.posCard[s] = null;
    //        }
    //    }
    //    if(monsterNum > 1)
    //    {
    //        ArrayUtil.sortByField(arr,['actionTime','id'],[0,0])
    //    }
    //    return arr;
    //}

    //取可上战场的怪
    //public getAddMonster(t){
    //    var arr = [];
    //
    //    for(var s in this.posCard)
    //    {
    //        var oo:PKPosCardData = this.posCard[s];
    //        if(!oo || oo.mid>100)continue;
    //
    //        if(oo.testAdd(t))
    //        {
    //            arr.push(oo)
    //        }
    //    }
    //    if(arr.length > 1)
    //    {
    //        ArrayUtil.sortByField(arr,['actionTime','id'],[0,0])
    //    }
    //    return arr;
    //}

    ////取可起作用的技能
    //public getAddSkill(t){
    //    var arr = [];
    //    for(var s in this.posCard)
    //    {
    //        var oo:PKPosCardData = this.posCard[s];
    //        if(!oo || oo.mid<100)continue;
    //
    //        if(oo.testAdd(t))
    //        {
    //            arr.push(oo)
    //        }
    //    }
    //    return arr;
    //}
}