class M33 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.atkY = -30
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 100;
    }


    public atk(user:PKMonsterData,target:PKMonsterData){
        var hp = Math.floor((1-target.getHpRate())*target.maxHp*0.15)
        var b = super.atk(user,target)
        if(b && target.mid != 99 && hp > 0)
        {
            hp = Math.min(hp,user.getSkillValue(1,true));
            target.beAtkAction({hp:hp})
            user.addAtkHurt(hp)
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_DOUBLE,
                user:user,
                value:hp,
            })
        }
        return b;
    }
}