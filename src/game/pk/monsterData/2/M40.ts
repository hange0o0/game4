class M40 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        var target = data.atker
        if(target && target.getVO().isNearAtk())
        {
            if(target.beSkillAble())
            {
                var skillValue = user.getSkillValue(1);
                var buff = new PKBuffData()
                buff.id = 40;
                buff.isDebuff = true;
                buff.value = skillValue;
                buff.addValue('def',-skillValue);
                buff.user = user;
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
                target.addBuff(buff)

                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        keys:['def-']
                    })
                }
            }
        }
    }
}