class M18 extends MBase {
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.hpChange +=  user.getSkillValue(1,true);
    }
}