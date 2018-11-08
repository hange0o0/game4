class PKTopUI extends game.BaseContainer {
    private static _instance:PKTopUI
    public static getInstance() {
        return this._instance;
    }
    private hpGroup1: eui.Group;
    private hpGroupIcon: eui.Image;
    private hpText1: eui.Label;
    private hpGroup2: eui.Group;
    private hpText2: eui.Label;
    private player1: eui.Group;
    private scoreText1: eui.Label;
    private headMC1: HeadMC;
    private nameText1: eui.Label;
    private view1: eui.Image;
    private player2: eui.Group;
    private scoreText2: eui.Label;
    private headMC2: HeadMC;
    private view2: eui.Image;
    private nameText2: eui.Label;










    public itemArr = []
    public itempool = []
    public skillItemArr = []
    public skillItemPool = []
    private index = 1;
    public constructor() {
        super();

        this.skinName = "PKTopSkin";
        PKTopUI._instance = this;
    }


    public childrenCreated() {
        super.childrenCreated();
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
        this.touchEnabled = false;
    }


    public onVideoEvent(e){
        if(!this.stage)
            return;
        //var item:PKMonsterItem;
        var videoData = e.data;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_POS_SHOW:
                if(videoData.isHero)
                {
                    if(videoData.user.teamData != PKData.getInstance().myPlayer.teamData)
                    {
                        this.addSkillItem(videoData);
                    }
                    break
                }
                var data:PKPosCardData = videoData.user;
                var teamData = data.getOwner().teamData
                if(teamData.id != 'sys' && teamData != PKData.getInstance().myPlayer.teamData)
                    this.addSkillItem(data);
                if(data.mid > PKConfig.skillBeginID)
                    this.addSkill(data)
                break;
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_TEAM_HP_CHANGE:
                this.renewHp();
                break;
            //case PKConfig.VIDEO_TEAM_DEF:
            //    this.def1(videoData.user);
            //    break;
            //case PKConfig.VIDEO_TEAM_DEF2:
            //    this.def2();
            //    break;
            case PKConfig.VIDEO_MYPLAYER_CHANGE:
                this.onMyPlayerChange();
                break;
        }
    }

    public onMyPlayerChange(){
        var posList = PKData.getInstance().myPlayer.teamData.enemy.posList
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }

        this.index = posList.length + 1;
        for(var i=0;i<7;i++)
        {
            var data = posList[i];
            var item = this.createItem();
            this.itemArr.push(item)
            item.x = this.getX(i);
            this.addChild(item);
            if(data)
                data.topIndex = this.index - 1 - i;
            item.data = data;
        }
        this.renewViewPos();
    }

    private createSkillItem():PKSkillItem{
        var item:PKSkillItem = this.skillItemPool.pop();
        if(!item)
        {
            item = new PKSkillItem();
        }
        return item;
    }

    public removeSkillItem(item){
        var index = this.skillItemArr.indexOf(item);
        if(index != -1)
        {
            this.skillItemArr.splice(index,1);
            this.freeSkillItem(item);
        }
    }

    public freeSkillItem(item){
        if(!item)
            return;
        item.remove();
        this.skillItemPool.push(item);
    }


    public addSkill(data){
        if(data.mid > 500)
            return;

        var teamData = data.getOwner().teamData
        var item = this.createSkillItem();
        this.addChild(item)

        if(teamData.atkRota == PKConfig.ROTA_LEFT)
        {
            item.currentState = 'left'
            item.index = this.getIndex('left')
            item.data = data;
        }
        else
        {
            item.currentState = 'right'
            item.index = this.getIndex('right')
            item.data = data;
        }
        this.skillItemArr.push(item)
    }

    private getIndex(type){
        var indexObj = {};
        for(var i=0;i<this.skillItemArr.length;i++)
        {
            var item = this.skillItemArr[i];
            if(item.currentState == type)
            {
                indexObj[item.index] = true;
            }
        }
        var index = 1;
        while(true)
        {
            if(!indexObj[index])
                return index;
            index++;
        }
    }


    private createItem():PKTopItem{
        var item:PKTopItem = this.itempool.pop();
        if(!item)
        {
            item = new PKTopItem();
            item.y = 66;
        }
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        item.remove();
        this.itempool.push(item);

    }

    public remove(){
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }
        //while(this.skillItem2Arr.length)
        //{
        //    this.freeSkillItem2(this.skillItem2Arr.pop())
        //}
        while(this.skillItemArr.length)
        {
            this.freeSkillItem(this.skillItemArr.pop())
        }
    }

    public init(title){
        //this.topUI.setTitle(title);
        //if(GameManager.stage.stageHeight > 1050)
        //    this.y = 0
        //else
        //    this.y = -55;


        //this.cdGroup.visible = false
        this.index = 1;
        this.renewHp()

        this.remove();

        for(var i=0;i<7;i++)
        {
            var item = this.createItem();
            this.itemArr.push(item)
            item.x = this.getX(i);
            this.addChild(item);
            item.data = null;
        }

        //处理预显示
        if(PKData.getInstance().showTopNum)
        {
            var list = PKData.getInstance().otherPlayer.autolist.split(',');
            var num = PKData.getInstance().showTopNum;
            if(num > 7)
                num = 7
            for(var i=0;i<num;i++)
            {
                //var cardData = new PKPosCardData({
                //    mid:list[num - i - 1],
                //    isLock:true,
                //    topIndex:num - i
                //})
                this.itemArr[i].data = this.createLockData(list[num - i - 1],num - i);
            }
        }




        egret.Tween.removeTweens(this.hpGroup1)
        egret.Tween.removeTweens(this.hpGroup2)

        this.hpGroup1.scaleX = this.hpGroup1.scaleY = 0
        this.hpGroup2.scaleX = this.hpGroup2.scaleY = 0
        //this.defGroup1.scaleX = this.defGroup1.scaleY = 0
        //this.defGroup2.scaleX = this.defGroup2.scaleY = 0


        //
        //this.defScoreGroup1.x = 180
        //this.defScoreGroup2.x = 390
        //this.defScoreGroup1.y = 250
        //this.defScoreGroup2.y = 250

        this.view1.visible = false
        this.view2.visible = false

    }

    private renewViewPos(){
        var PD = PKData.getInstance();
        if(PD.isReplay)
        {
            this.view1.visible = PD.myPlayer.teamData.atkRota == PKConfig.ROTA_LEFT
            this.view2.visible = PD.myPlayer.teamData.atkRota == PKConfig.ROTA_RIGHT
        }
    }

    public appearMV(){
        egret.Tween.get(this.hpGroup1).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        egret.Tween.get(this.hpGroup2).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        //egret.Tween.get(this.defGroup1).wait(200).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        //egret.Tween.get(this.defGroup2).wait(200).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        var PD = PKData.getInstance();
        if(PD.isReplay)
        {
            this.renewViewPos()
        }
    }

    public renewHp(){
        var PD = PKData.getInstance();
        var team1 = PD.getTeamByRota(PKConfig.ROTA_LEFT);
        var team2 = PD.getTeamByRota(PKConfig.ROTA_RIGHT);
        this.hpText1.text = Math.max(0,team1.hp) + ''// + team1.maxhp + ' 增加防御:' + team1.def
        this.hpText2.text = Math.max(0,team2.hp) + ''// + team2.maxhp   //  ' 增加防御:' + team2.def + ' '+
    }


    public addSkillItem(data,isHero?){
        for(var i=0;i<this.itemArr.length;i++)
        {
           if(this.itemArr[i].data && this.itemArr[i].data.isLock && this.itemArr[i].data.topIndex == this.index)
           {
               this.itemArr[i].data = data;
               this.itemArr[i].dataChanged();
               //要加入一个新的
               if(i == 1 && this.index+1 < PKData.getInstance().showTopNum)
               {
                   var list = PKData.getInstance().otherPlayer.autolist.split(',');
                   this.removeTopItem();
                   this.addTopItem(this.createLockData(list[this.index+1],this.index + 2));
                   //this.addTopItem({
                   //    mid:list[this.index+1],
                   //    isLock:true,
                   //    topIndex:this.index + 2
                   //});
               }

               this.index ++
               return;
           }
        }

        this.removeTopItem();

        //加入一个
        data.topIndex = this.index
        this.index ++;
        this.addTopItem(data);
    }

    private createLockData(mid,index){
        return  new PKPosCardData({
            mid:mid,
            isLock:true,
            owner:PKData.getInstance().otherPlayer.id,
            topIndex:index
        })
    }

    private removeTopItem(){
        //移除一个
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item:PKTopItem = this.itemArr[i];
            var targetX = this.getX(i+1);
            egret.Tween.removeTweens(item)
            var tw = egret.Tween.get(item)
            tw.to({x:targetX},Math.abs(item.x - targetX)*2)
            if(targetX >= this.getX(7))
            {
                item.disAppear();
            }

            if(item.removeAble)
            {
                this.itemArr.splice(i,1);
                this.freeItem(item)
                i--;
            }
        }

    }

    private addTopItem(data){
        var item = this.createItem();
        this.itemArr.unshift(item)
        item.x = this.getX(0);
        this.addChild(item);

        item.data = data;
        item.appear()
    }

    private getX(index){
        return 16 + index*88
    }



}