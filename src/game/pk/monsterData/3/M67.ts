class M67 extends MBase {
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.nohitTimes += user.getSkillValue(1);
    }
}