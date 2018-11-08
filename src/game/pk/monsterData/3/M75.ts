class M75 extends MBase {
    constructor() {
        super();
    }

    public bulleteID = 1;

    public initMonster(user:PKMonsterData){
        user.atkX = 80
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 1000;
    }



    public atk(user:PKMonsterData,target:PKMonsterData){
        return false;
    }

    protected sendAtkBefore(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'atk_before',
            model:this,
            stopTestDie:true,
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }
    protected sendAtkAction(user,target,actionTime,endTime){
       super.sendAtkAction(user,target,actionTime,endTime)

        var listener = new M75StateListener();
        listener.owner = user;
        listener.stopDieRemove = true;
        listener.endTime = actionTime + this.getAtkArriveCD(user,target);
        listener.id = this.bulleteID
        listener.beginX = user.x
        if(target.x > user.x)
        {
            listener.beginX += user.atkX
            listener.targetX= listener.beginX + user.getSkillValue(1)
        }
        else
        {
            listener.beginX -= user.atkX
            listener.targetX= listener.beginX - user.getSkillValue(1)
        }

        this.bulleteID ++;
        user.getOwner().teamData.addStateLister(listener)
    }
}

class M75StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    public id
    public targetX
    public beginX
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var PD = PKData.getInstance();
        var user = <PKMonsterData>this.owner
        var arr = PD.getMonsterByNoTeam(user.getOwner().teamData);
        var atkrage = 0
        var currentX = this.beginX + (this.targetX - this.beginX)*(PD.actionTime - this.actionTime)/(this.endTime - this.actionTime)
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            if(!targetX.skillTemp[75])
                targetX.skillTemp[75] = {};
            if(!targetX.skillTemp[75][this.id] && Math.abs(currentX - targetX.x)<=atkrage + targetX.getVO().width/2)
            {
                targetX.skillTemp[75][this.id] = true;
                var hp = MBase.getData(75).getAtkHp(user,targetX);
                targetX.beAtkAction({hp:hp,atker:user})
                user.addAtkHurt(hp)
            }
        }
    }
}