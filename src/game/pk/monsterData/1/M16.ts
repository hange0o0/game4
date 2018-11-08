class M16 extends MBase {
    constructor() {
        super();
    }

    //a对B攻击到达时的逻辑（攻击正式生效）
    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            this.addBuff(user,target)
        }
        return b;
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        var target = data.atker
        if(target && target.getVO().isNearAtk())
        {
            this.addBuff(user,target)
        }
    }

    private addBuff(user,target){
        if(target.beSkillAble())
        {
            var skillValue = user.getSkillValue(1,true)
            var buff = new PKBuffData()
            buff.id = 16;
            buff.isDebuff = true;
            buff.value = skillValue
            buff.addValue('hpChange',-skillValue);
            buff.user = user;
            buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['hp-']
                })
            }
        }
    }
}