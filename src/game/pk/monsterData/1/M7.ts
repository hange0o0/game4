class M7 extends MBase {
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.doubleValue = user.getSkillValue(2)/100;
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        if(user.getHpRate() < user.getSkillValue(1)/100)
        {
            user.doubleRate = 1;
        }
        super.atkAction(user,target,actionTime);
        user.doubleRate = 0
    }

    //protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
    //    var atk = super.getAtkerAtk(user,target);
    //    if(user.getHpRate() < 0.3)
    //    {
    //        atk *= 2;
    //    }
    //    return atk;
    //}
}