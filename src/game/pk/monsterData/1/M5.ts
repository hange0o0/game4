class M5 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.doubleRate = user.getSkillValue(1)/100;
        user.doubleValue = user.getSkillValue(2)/100;
    }
}