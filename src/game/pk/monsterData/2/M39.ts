class M39 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        var target = data.atker
        if(target && target.getVO().isNearAtk())
        {
            if(PKData.getInstance().random() < user.getSkillValue(1)/100)
            {
                var buff = new PKBuffData()
                buff.user = user;
                buff.isDebuff = true;
                buff.addState(PKConfig.STATE_YUN);
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
                target.addBuff(buff)
            }
        }
    }
}