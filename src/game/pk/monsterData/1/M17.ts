class M17 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        //{hp:hp,atker:user}
        if(data.atker)
            data.atker.addHp(-Math.ceil(user.getSkillValue(1,true)*user.getAtkRate(data.atker)));
    }
}