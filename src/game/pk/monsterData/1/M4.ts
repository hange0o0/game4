class M4 extends MBase{
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
       if(b && PKData.getInstance().random() < user.getSkillValue(1)/100)
       {
           var buff = new PKBuffData()
           buff.user = user;
           buff.isDebuff = true;
           buff.addState(PKConfig.STATE_YUN);
           buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
           target.addBuff(buff)
       }
        return b;
    }

}