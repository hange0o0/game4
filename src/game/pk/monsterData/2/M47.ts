class M47 extends MBase {
    constructor() {
        super();
    }

    public mvID1 = 104;
    public skill(user:PKMonsterData,target:PKMonsterData){
        var skillValue = user.getSkillValue(1,true);
        target.manaHp += skillValue
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MANAHP_CHANGE,
            user:target,
        })
        //PKData.getInstance().addVideo({
        //    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
        //    user:target,
        //    key:1,
        //    stateType:1
        //})
    }

    //
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().getAtkDis() + 100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.manaHp > 0)
                continue;

            var des = Math.abs(user.x - target.x);
            if(des<=atkrage)
            {
                return [target]
            }
        }
        return [];
    }
}