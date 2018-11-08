class PKMonsterAction {
    private static instance:PKMonsterAction;

    public static getInstance() {
        if (!this.instance) this.instance = new PKMonsterAction();
        return this.instance;
    }

    private atkList = [];

    public addAtkList(data){
        this.atkList.push(data)
    }

    public init(){
        this.atkList.length = 0;
    }


    public actionAtk(t){
        for(var i=0;i<this.atkList.length;i++)
        {
            var data = this.atkList[i];
            if(data.endTime <= t)  //事件生效
            {

                this.atkList.splice(i,1);
                i--;

                var user:PKMonsterData = data.user;
                var target:PKMonsterData = data.target;

                //if(user.mid == 36 && data.type == 'skill_before')
                //    console.log(99999)

                //判断攻击是否生效
                if(target && target.die && !data.stopTestDie)
                {
                    continue;
                }
                if(data.type == 'delay_run')   //延迟执行
                {
                    data.fun && data.fun();
                }
                else if(data.type == 'atk_before')   //攻击产生
                {
                    if(!user.canAction())
                        continue;
                    data.model.atkAction(user,target,t)
                }
                else if(data.type == 'atk')  //攻击生效
                {
                    if(target.isInState(PKConfig.STATE_NOBEATK))
                        return;
                    MBase.getData(user.mid).atk(user,target)
                }
                else if(data.type == 'skill_before')   //技能产生
                {
                    if(!user.canAction() && !data.stopTestDie)
                        continue;
                    user.setSkillUse(data.actionTime);
                    data.model.skillAction(user,data.target,t)
                }
                else if(data.type == 'skill')  //技能生效
                {
                    MBase.getData(user.mid).skill(user,data.target)

                }
            }
        }
    }

    public atk(user:PKMonsterData,actionTime){
        var time = actionTime + user.getAtkCD();
        user.stopTime = Math.max(user.stopTime,time)

        PKData.getInstance().addVideo({   //攻击动画开始
            type:PKConfig.VIDEO_MONSTER_ATK,
            user:user,
            target:user.target
        })

        MBase.getData(user.mid).atkBefore(user,actionTime)
    }

    public skill(user:PKMonsterData,actionTime){
        var time = actionTime + user.getAtkCD();
        user.stopTime = Math.max(user.stopTime,time)

        PKData.getInstance().addVideo({   //攻击动画开始
            type:PKConfig.VIDEO_MONSTER_ATK,
            user:user,
            target:user.skillTargets[0]
        })

        MBase.getData(user.mid).skillBefore(user,actionTime)
    }
}