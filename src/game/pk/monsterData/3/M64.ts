class M64 extends MBase {
    constructor() {
        super();
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }



    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b && target.mid != 99)
        {
            var hp = user.getSkillValue(1,true);
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