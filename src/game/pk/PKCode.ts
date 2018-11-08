class PKCode {
    private static instance:PKCode;

    public static getInstance() {
        if (!this.instance) this.instance = new PKCode();
        return this.instance;
    }








    //每一步执行
    public onStep(){

        var PD = PKData.getInstance();
        if(PD.stopTime)
            return;
        if(!PD.startTime)
        {
            if(DEBUG)
                throw new Error('未开始就调用onStep')
            sendClientError('未开始就调用onStep')
            return;
        }
        var cd = PD.getPassTime() - PD.actionTime
        if(PD.actionTime == 0 && !PD.beginAuto) //在开始前上的怪
        {
            PD.beginAuto = true
            this.autoAction();
        }
        //console.log(cd)
        var runStart = TM.nowMS();
        while(PD.quick || cd > PKConfig.stepCD)
        {
            PD.actionTime += PKConfig.stepCD;
            PD.disableKey = {};
            cd -= PKConfig.stepCD;
            this.autoAction();
            this.actionPosCard();
            //this.addMonster();
            //this.actionSkill();
            this.monsterAction();
            this.monsterMove();
            PKMonsterAction.getInstance().actionAtk(PD.actionTime);//攻击落实
            this.heroAdd();

            this.actionFinish();

            if(PD.isReplay && PD.actionTime >= PD.replayEndTime)
                PD.isGameOver = true;

            if(PD.isGameOver)
                return true
            if(PD.actionTime > PKConfig.drawTime)//5分
                return true

            if(PD.quick && PD.actionTime >= PD.quickTime)
            {
                PD.quick = false;
                cd = 0;
                PD.startTime = TM.nowMS() - PD.actionTime + PD.speedAddTime;
                PD.startTime -= TM.nowMS() - runStart;//扣去运行时间
            }
        }
        return false;
    }
    ///////////////*********************************************************

    //英雄出动
    public heroAdd(){
        var PD = PKData.getInstance();
        if(PD.preLoadHeroStep < Math.floor((PD.actionTime + 1000*10)/PKConfig.heroCD))//预加载
        {
            PD.preLoadHeroStep ++;
            for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
            {
                var player = PD.playerObj[i];
                if (!player)
                    continue
                player.preloadHero(PD.preLoadHeroStep);
            }
        }

        if(PD.heroStep < Math.floor(PD.actionTime/PKConfig.heroCD))
        {
            PD.heroStep ++;
            var b = false
            for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
            {
                var player = PD.playerObj[i];
                if (!player)
                    continue
                b = player.addHero(PD.heroStep) || b;
            }
            if(b)
                PD.addVideo({
                    type:PKConfig.VIDEO_HERO_ADD
                })
        }
    }

    //自动出战上怪
    public autoAction(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if (!player)
                continue
            player.autoAction(PD.actionTime);
            //player.testAddPosCard(PD.actionTime);
        }
    }

    public actionPosCard(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if(!player)
                continue
            var needSpace = PKConfig.maxMonsterSpace - PD.getMonsterSpaceByPlayer(player.id);
            var arr = player.getEnablePos(PD.actionTime,needSpace)

            while(arr.length > 0)
            {
                PD.resetMonsterData();//重置技能数据，方便技能统计

                var data = arr.shift();
                if(data.mid < PKConfig.skillBeginID) //上怪
                {
                    if(needSpace > 0)
                    {
                        needSpace -= data.getVO().space;
                        var mData = data.getMonster(PD.actionTime);

                        PD.addMonster(mData);
                        data.setHaveAdd(PD.actionTime);
                    }
                }
                else
                {
                    data.actionSkill();
                    data.setHaveAdd(PD.actionTime);
                }

            }
        }
    }

    //怪出手
    public monsterAction(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            PD.resetMonsterData();//重置技能数据，方便技能统计
            var mvo:PKMonsterData = PD.monsterList[i];
            var skillTargets = mvo.canSkill(PD.actionTime);

            if(skillTargets && skillTargets.length > 0)   //用技能
            {
                PKMonsterAction.getInstance().skill(mvo,PD.actionTime)
            }
            else
            {
                var target = mvo.getAtkTarget()
                if(target)//普攻
                {
                    PKMonsterAction.getInstance().atk(mvo,PD.actionTime);
                }
            }
        }
    }

    //怪移动
    public monsterMove(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            if(mvo.canMove(PD.actionTime))
            {
                mvo.move();
            }
            else if(mvo.stopTime < PD.actionTime && mvo.mid != 99)
                mvo.stand();
        }
    }

    //一轮操作结束,移队死，过线的，结算,清除BUFF
    public actionFinish(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            if(mvo.die || (mvo.dieTime && mvo.dieTime <= PD.actionTime)) //死的
            {
                mvo.die = true;
                PD.monsterList.splice(i,1);
                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_DIE,
                    user:mvo,
                })
                i--;
                mvo.onDie();
                PD.monsterChange = true;
            }
            else if(mvo.x < PKConfig.appearPos || mvo.x > PKConfig.floorWidth + PKConfig.appearPos) //冲过终点
            {
                mvo.die = true;
                PD.monsterList.splice(i,1);
                i--;
                mvo.passEnd = true;
                mvo.onDie();
                PD.monsterChange = true;
                if(mvo.dieTime) //召唤物不算分
                {
                    PD.addVideo({
                        type:PKConfig.VIDEO_MONSTER_DIE,
                        user:mvo,
                    })
                    continue;
                }
                PD.getPlayer(mvo.owner).teamData.enemy.hp -= mvo.getVO().atk2;
                if(PD.getPlayer(mvo.owner).teamData.enemy.hp <= 0)
                {
                    //console.log(PD.getPlayer(mvo.owner).teamData.enemy)
                    PD.isGameOver = true;
                }

                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_WIN,
                    user:mvo,
                })
            }
            else { //其它
                if(mvo.hpChange && PD.actionTime - mvo.lastHpChange >= 500) //改变血量值
                {
                    mvo.addHp(Math.floor(mvo.hpChange/2))
                    mvo.lastHpChange = PD.actionTime;
                }
                mvo.cleanBuff(PD.actionTime) //清除BUFF
                if(mvo.stateChange)
                {
                    mvo.stateChange = false;
                    PD.addVideo({
                        type:PKConfig.VIDEO_MONSTER_STATE_CHANGE,
                        user:mvo,
                    })
                }
            }
        }
        PD.team1.onStateTimer();
        PD.team2.onStateTimer();


        if(!PD.isReplay)
        {
            var player = PD.myPlayer
            if(!player.autoList && player.getPosNum() == 0)
            {
                PD.onPosEmpty(player);
            }
        }

        if(PD.endless && PD.actionTime >= PD.endless)
        {
            PD.isGameOver = true;
        }
        if(PD.needcd && PD.actionTime >= PD.needcd)
        {
            PD.isGameOver = true;
        }


        //if(PD.actionTime > 60000 && (PD.monsterList.length == 0 || PD.currentState == 'def') && !PD.isGameOver)//如果1min后有一方没牌了也结束
        //{
        //    var b = true;
        //    for(var s in PKData.getInstance().playerObj)
        //    {
        //        var player = PKData.getInstance().playerObj[s];
        //        if(player.id == 'sys')
        //            continue;
        //        if(player.getPosNum() || player.getCardNum())
        //        {
        //            b = false;
        //            break
        //        }
        //    }
        //    if(b)
        //        PD.isGameOver = true;
        //}
    }


}