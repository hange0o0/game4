class M2 extends MBase{
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.missRate =  user.getSkillValue(1)/100;
    }


}