class M73 extends MBase {
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            var hp = this.getAtkHp(user,target)
            user.addHp(Math.ceil(hp/100*user.getSkillValue(1)));
        }
        return b;
    }
}