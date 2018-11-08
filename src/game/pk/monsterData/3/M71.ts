class M71 extends MBase {
    constructor() {
        super();
    }

    //取最终伤害
    public getAtkHp(user:PKMonsterData,target:PKMonsterData){
        if(target.mid == 99)
            return 1
        return super.getAtkHp(user,target) + Math.ceil(target.maxHp/100*user.getSkillValue(1));
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(b && target.mid != 99)
        {
            var hp = this.getAtkHp(user,target);
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_DOUBLE,
                user:user,
                value:hp,
            })
        }
        return b;
    }
}