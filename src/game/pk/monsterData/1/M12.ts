class M12 extends MBase {
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b && target.beSkillAble())
        {
            var skillValue = user.getSkillValue(1);
            var buff = new PKBuffData()
            buff.id = 12;
            buff.isDebuff = true;
            buff.value = skillValue;
            buff.addValue('atk',-Math.floor(target.baseAtk * skillValue/100));
            buff.addValue('def',-skillValue);
            buff.user = user;
            buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['atk-','def-']
                })
            }
        }
        return b;
    }
}