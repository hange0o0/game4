class M34 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.atkY = -30
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 100;
    }


    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b && target.beSkillAble())
        {
            var skillValue = user.getSkillValue(1);
            var buff = new PKBuffData()
            buff.id = 34;
            buff.isDebuff = true;
            buff.value = skillValue;
            buff.addValue('addSpeed',-skillValue);
            buff.user = user;
            buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['speed-']
                })
            }
        }
        return b;
    }
}