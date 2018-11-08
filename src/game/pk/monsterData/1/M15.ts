class M15 extends MBase {
    constructor() {
        super();
    }

    //a对B攻击到达时的逻辑（攻击正式生效）
    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            user.atk += Math.ceil(user.baseAtk*user.getSkillValue(1)/100)

            //PKData.getInstance().addVideo({
            //    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            //    user:user,
            //    key:1,
            //    stateType:1
            //})
        }
        return b;
    }
}