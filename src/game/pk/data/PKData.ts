class PKData extends egret.EventDispatcher{
    private static instance:PKData;

    public static getInstance() {
        if (!this.instance) this.instance = new PKData();
        return this.instance;
    }
    public currentState = 'def'

    public quick = false//快速算出结果
    public quickTime = Number.MAX_VALUE//快速算出到这个时间
    public baseData//原始PK数据
    public isReplay;
    public replayEndTime;
    public isAuto;
    public round; //当前的回合

    public jumpMV = false;
    public isGameOver = false //游戏结束
    public showTopNum = 0 //头顶显示敌人出怪的数量
    public startTime = 0 //游戏开始时间
    public stopTime = 0 //游戏暂停时间
    public actionTime = 0 //游戏数据上处理过的时间
    public beginAuto = false //正式开始前的上怪处理

    public monsterID;//怪物ID下标累计
    public team1:PKTeamData;  //进攻方
    public team2:PKTeamData;
    public sysTeam:PKTeamData;
    public playerNum = 2;
    public endless = 0;//无尽时的倒计时
    public needcd = 0;//限时的倒计时

    public monsterChange = false//怪有变化
    public randomSeed = 0//随机的种子
    public randomTimes = 0//随机的次数
    public monsterList = [];//场上的怪的数据
    public playerObj = {};//场上的玩家的数据
    public myPlayer:PKPlayerData;
    public sysPlayer:PKPlayerData;
    public diamondData;
    public heroStep;
    public preLoadHeroStep;

    public history = {};
    public disableKey = {}; //同一时间不能起效的KEY

    public actionRecord = []

    public playSpeed = 1;//播放速度
    public lastDealSpeedTime = 0;//当前播放速度开始时间
    public speedAddTime = 0;//当前播放速度开始时间

        //public stateObj = [] //所有要触发动画的集合
    //public topVideoList = [] //影响关部的动画的集合
    //private topKey = ['monster_win','monster_add'];
    constructor(){
        super();
    }

    public isView(){
        return this.isAuto || this.isReplay
    }
    public canSpeed(){
        return this.isView() || (!PKManager.getInstance().isOnline && !GuideManager.getInstance().isGuiding)
    }

    //public changeSpeed(speed){
    //     this.playSpeed = speed;
    //}

    //取经过的时间
    public getPassTime(){
        var t = TM.nowMS();
        var cd = t - (this.lastDealSpeedTime || this.startTime);
        if(cd)
        {
            this.speedAddTime += (this.playSpeed - 1)*cd;
        }
        this.lastDealSpeedTime = t;
        return TM.nowMS() - this.startTime + this.speedAddTime;
    }

    //暂停
    public stop(){
        //if(isLast)//在最后一次行动后暂停(马上停)
        //    this.stopTime = this.actionTime + 1;
        //else
            this.stopTime = TM.nowMS();
    }

    //继续
    public play(){
        if(this.stopTime)
        {
            var add = (TM.nowMS() - this.stopTime)*this.playSpeed;
            this.startTime += add
            //this.actionTime += add;
            this.stopTime = 0;
        }
    }

    //初始化游戏
    public init(data){

        this.startTime = 0;
        this.round = 1;
        this.heroStep = 0;
        this.preLoadHeroStep = 0;
        this.isReplay = false;
        this.isAuto = false;
        this.baseData = data;
        this.actionRecord = [];
        this.quick = false
        this.quickTime = Number.MAX_VALUE
        this.history = {};
        this.monsterList.length = 0;
        this.playerObj = {};
        this.myPlayer = null;
        this.actionTime = 0;
        this.playSpeed = 1;
        this.lastDealSpeedTime = 0;
        this.speedAddTime = 0;
        this.stopTime = 0;
        this.monsterID = 1;
        this.isGameOver = false;
        this.monsterChange = false;
        this.beginAuto = false;
        this.currentState = 'pk';
        PKMonsterAction.getInstance().init()



        this.randomTimes = 0;
        this.randomSeed = data.seed;
        this.showTopNum = data.showTopNum || 0
        this.endless = data.endless || 0;
        this.needcd = data.needcd || 0;
        this.team1 = new PKTeamData({id:1})
        this.team2 = new PKTeamData({id:2})
        this.team1.enemy = this.team2
        this.team2.enemy = this.team1
        for(var i=0;i<data.players.length;i++)
        {
            var player = new PKPlayerData(data.players[i])
            player.teamData = this.getTeamByID(data.players[i].team)
            player.teamData.autoDef = Math.max(data.players[i].def || 0,player.teamData.autoDef)

            player.teamData.hp += player.hp;
            this.playerObj[player.id] = player;
            if(player.gameid == UM.gameid)
            {
                this.myPlayer = player;
                player.teamData.atkRota = PKConfig.ROTA_LEFT
                player.teamData.enemy.atkRota = PKConfig.ROTA_RIGHT
                player.teamData.members.unshift(player);
                this.isAuto = player.isauto;
            }
            else
                player.teamData.members.push(player);
        }

        this.sysTeam = new PKTeamData({id:'sys'})
        this.sysPlayer = new PKPlayerData({id:'sys',gameid:'sys',team:'sys'})
        this.sysPlayer.teamData = this.sysTeam;
        this.playerObj[this.sysPlayer.id] = this.sysPlayer;

        if(!this.myPlayer) //看别人的录像
        {
            this.team1.atkRota = PKConfig.ROTA_LEFT
            this.team2.atkRota = PKConfig.ROTA_RIGHT
            this.myPlayer = this.getPlayer(1)
        }
        this.team1.reInit();
        this.team2.reInit();
    }

    public getForceData(){
        var forceObj = {};
        for(var s in this.monsterList)
        {
            var monsterData:PKMonsterData = this.monsterList[s];
            var temaID = monsterData.getOwner().teamData.id;
            if(!forceObj[temaID])
                forceObj[temaID] = 0;
            forceObj[temaID] += monsterData.getForce()
        }
        return forceObj;
    }

    public random(){
        this.randomTimes ++;
        var seed = this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        this.randomSeed = rd * 100000000;
        return rd;
    }

    public rand(min,max){
        return min + Math.floor(this.random()*(max-min + 1))
    }

    //数据乱序
    public randSort(arr){
        var self = this;
        arr.sort(rdFun);
        function rdFun(){
            return self.random()>0.5?-1:1;
        }
    }

    public randomOne(arr:Array<any>,splice = false):any{
        var index = Math.floor(arr.length * this.random())
        var data = arr[index];
        if(splice)
            arr.splice(index,1);
        return data;
    }

    //下一轮开始倒计时
    public nextRoundCD(){
        var cd = PKTool.cdData[this.round].cd*1000 - this.actionTime;
        return cd
    }

    //开始游戏
    public start(){
        this.startTime = TM.nowMS()
        this.stopTime = 0;
    }

    public addDiamondMonster(){
        this.diamondData = this.addMonster({
            force:0,
            mid:99,
            owner:'sys',
            atkRota:1,
            x:PKConfig.floorWidth/2 + PKConfig.appearPos,
            y:0,
            actionTime:0
        });
    }

    public onPosEmpty(player:PKPlayerData){
        if(player.getCardNum())
        {
            if(PKManager.getInstance().pkType != PKManager.TYPE_FIGHT && player.getMP() >= 18)
                player.addPosCard({mid:501})
        }
        else
            player.addPosCard({mid:502})
    }



    //要保证只是通知改变显示，不能有逻辑
    public addVideo(data){
        if(this.quick)
            return;
        this.dispatchEventWith('video',false,data)
        //this.videoList.push(data)
        //if(this.topKey.indexOf(data.type) != -1)
        //    this.topVideoList.push(data);
    }

    public getTeamByID(teamID){
        if(teamID == 'sys')
            return this.sysTeam;
        return this.team1.id == teamID?this.team1:this.team2
    }
    public getTeamByRota(rota){
        return this.team1.atkRota == rota?this.team1:this.team2
    }

    public getPlayer(id):PKPlayerData{
        return this.playerObj[id]
    }

    public get otherPlayer(){
        return this.getPlayer(this.myPlayer.id==1?2:1)
    }

    //赢
    public isWin(){
        var team1 =  this.myPlayer.teamData
        var team2 =  this.myPlayer.teamData.enemy
        if(this.endless && this.actionTime >= this.endless)
            return true;
        if(this.needcd && this.actionTime >= this.needcd)
            return false;
        return team1.hp > 0 &&  team2.hp <= 0;
    }
    //平
    public isDraw(){
        var team1 =  this.myPlayer.teamData
        var team2 =  this.myPlayer.teamData.enemy
        if(this.needcd && this.actionTime >= this.needcd)
            return false;
        return (team1.hp > 0 &&  team2.hp > 0) || (team1.hp <= 0 &&  team2.hp <= 0);
    }
    //赢输平
    public getPKResult(){
        if(this.isWin())
            return 1;
        if(this.isDraw())
            return 3;
        return 2;
    }

    //找玩家对应的怪
    public getMonsterByPlayer(playerid,type=0){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.owner == playerid)
             {
                 if(type && oo.getVO().type != type)
                    continue
                 arr.push(oo)
             }
        }
        return arr;
    }
    //找玩家对应的怪的占位
    public getMonsterSpaceByPlayer(playerid){
        var count = 0;
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.owner == playerid)
             {
                 count += oo.getVO().space;
             }
        }
        return count;
    }


    //找对应的怪
    public getMonsterByID(id){
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.id == id)
             {
                 return oo;
             }
        }
        return null;
    }
    //找玩家对应的怪
    public getMonsterByTeam(team,fun?,value?){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.getOwner().teamData == team)
             {
                 if(fun && !fun(oo,value))
                    continue;
                 arr.push(oo)
             }
        }
        return arr;
    }

    //找玩家对应的怪
    public getMonsterByNoTeam(team,fun?,value?){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.getOwner().teamData != team)
             {
                 if(fun && !fun(oo,value))
                     continue;
                 arr.push(oo)
             }
        }
        return arr;
    }

    //取队伍的最前的怪
    public getFirstItem(taamID){
        var atkRota = PKData.getInstance().getTeamByID(taamID).atkRota;
        var chooseItem
        for(var i=0;i<this.monsterList.length;i++)
        {
            var item:PKMonsterData = this.monsterList[i];
            if(item.atkRota != atkRota)
                continue
            if(item.owner == 'sys')
                continue
            if(!chooseItem)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_LEFT && chooseItem.x<item.x)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_RIGHT && chooseItem.x>item.x)
                chooseItem = item;
        }
        return chooseItem
    }

    //取队伍的后排的怪
    public getBackItem(taamID){
        var atkRota = PKData.getInstance().getTeamByID(taamID).atkRota;
        var chooseItem
        for(var i=0;i<this.monsterList.length;i++)
        {
            var item:PKMonsterData = this.monsterList[i];
            if(item.atkRota != atkRota)
                continue
            if(item.owner == 'sys')
                continue
            if(!chooseItem)
            {
                if(!item.getVO().isNearAtk())
                    chooseItem = item;
            }
            else if(atkRota == PKConfig.ROTA_LEFT && chooseItem.x<item.x)
            {
                if(!item.getVO().isNearAtk())
                    chooseItem = item;
            }
            else if(atkRota == PKConfig.ROTA_RIGHT && chooseItem.x>item.x)
            {
                if(!item.getVO().isNearAtk())
                    chooseItem = item;
            }
        }
        return chooseItem
    }

    public getFirstX(teamID){
         var item = this.getFirstItem(teamID);
        if(item)
            return item.x;
        return  this.getTeamByID(teamID).atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
    }

    //加入怪到场上
    public addMonster(data){
        var player = this.getPlayer(data.owner)
        var toFront = player.teamData.toFront
        if(toFront > 0)
        {   var frontItem:any = this.getFirstItem(player.teamData.id);
            if(frontItem)
            {
                data.x = frontItem.x;
                if(!MonsterVO.getObject(data.mid).isNearAtk())
                {
                    data.x += player.teamData.atkRota == PKConfig.ROTA_LEFT?-60:60
                }
            }
        }

        var monster = new PKMonsterData(data)
        monster.id = this.monsterID;
        this.monsterID ++;
        this.monsterList.push(monster);

        this.addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD,
            user:monster
        })

        MBase.getData(monster.mid).onCreate(monster);

        monster.getOwner().teamData.testState(PKConfig.LISTENER_CREATE,monster);
        if(data.fromPos)
            monster.getOwner().teamData.testState(PKConfig.LISTENER_CREATE_POS,monster);
        this.monsterChange = true;

        this.history[monster.id] = ({
            id:monster.id,
            mid:monster.mid,
            owner:monster.owner,
            actionTime:this.actionTime
        })
        monster['xxx'] = this.actionTime + '|' + monster.id
        this.actionRecord.push('create|' + this.actionTime + '|' + monster.id + '|' + monster.mid+ '|' + monster.owner)
        return monster;
    }

    //重置战场上的怪的数据
    public resetMonsterData(){
        if(!this.monsterChange)
            return;
        this.monsterChange = true;
        for(var i=0;i<this.monsterList.length;i++)
        {

        }
    }

    public changeMyPlayer(id){
        var player = this.getPlayer(id);
        if(player == this.myPlayer)
            return;
        this.myPlayer = player;
        this.addVideo({
            type:PKConfig.VIDEO_MYPLAYER_CHANGE,
            user:this.myPlayer
        })
    }

    public onPKInfo(data){
         //console.log(data);
        //var oo = {
        //    actiontime:posCard.actionTime,
        //    id:posCard.id,
        //    mid:posCard.mid,
        //    owner:posCard.owner
        //}
        if(data.owner != this.myPlayer.id)
        {
            var player = this.getPlayer(data.owner)
            if(Math.abs(data.actiontime - this.actionTime) > 3000)//偏差严重，重置游戏
            {
                MyWindow.Alert('重置')
                return;
            }
            player.posCardFormServer(data)
        }
    }
    public onPKFace(data){
        if(data.owner != this.myPlayer.id)
        {
            PKFaceItem.createItem().show(data.id,-1);
        }
    }

    //把数据发往服务器
    //private sendCardList = []
    //private sendCardListing = []
    //public sendCardToServer(posCard:PKPosCardData){
    //     this.sendCardList.push(posCard);
    //    this.testSendCard();
    //}
    //
    //private testSendCard(){
    //    if(this.sendCardListing.length == 0 && this.sendCardList.length > 0)
    //    {
    //        this.sendCardListing = this.sendCardList;
    //        this.sendCardList = [];
    //        PKManager.getInstance().sendPosToServer(this.sendCardListing,()=>{
    //            this.sendCardFinish();
    //        })
    //    }
    //}
    //private sendCardFinish(){
    //    if(this.sendCardListing.length == 0 && this.sendCardList.length > 0)
    //    {
    //        this.sendCardListing = this.sendCardList;
    //        this.sendCardList = [];
    //    }
    //}

    //移除场上怪物
    //public removeMonster(id){
    //    for(var i=0;i<this.monsterList.length;i++)
    //    {
    //        var oo = this.monsterList[i];
    //        if(oo.id == id)
    //        {
    //            this.monsterList.splice(i,1);
    //            return;
    //        }
    //    }
    //}
}