class M46 extends MBase {
    constructor() {
        super();
    }

    public mvID2 = 8;

    public initMonster(user:PKMonsterData){
        user.atkX = 20
        user.atkY = 40
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*2 + 200;
    }





    public skill(user:PKMonsterData,target:PKMonsterData){
        var skillValue = user.getSkillValue(1);
        var buff = new PKBuffData()
        buff.id = 46;
        buff.value = skillValue;
        buff.addValue('def',skillValue);
        buff.user = user;
        buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['def+']
            })
        }
    }

    //
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().getAtkDis() + 100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.haveBuff(46))
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