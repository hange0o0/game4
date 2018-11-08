class M36 extends MBase {
    constructor() {
        super();
    }

    public mvID1 = 119;
    public onDie(user:PKMonsterData){
        if(user.skillTemp[36])
            return;
        if(user.reborning)
            return;
        user.reborning = true;
        var PD = PKData.getInstance();
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill_before',
            model:this,
            user:user,
            target:user,
            stopTestDie:true,
            actionTime:PD.actionTime,
            endTime:PD.actionTime + 1000*user.getSkillValue(1)
        })
    }

    protected sendSkillAction(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill',
            user:user,
            target:target,
            stopTestDie:true,
            actionTime:actionTime,
            endTime:endTime
        })
    }





    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 36;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            y:user.y,
            lastSkill:Number.MAX_VALUE,
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        monster.skillTemp[36] = true;

        var mc = AtkMVCtrl.getInstance().playAniOn(monster.id,this.mvID1)
        if(mc)
        {
            mc.y -= 30
        }
    }


}