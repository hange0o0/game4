class M69 extends MBase {
    constructor() {
        super();
    }

    public onDie(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];

            var des = Math.abs(user.x - target.x);
            if(des<=atkrage + target.getVO().width/2)
            {
                var skillValue = user.getSkillValue(2);
                var buff = new PKBuffData()
                buff.id = 69;
                buff.value = skillValue;
                buff.addValue('atk',Math.floor(target.baseAtk * skillValue/100));
                buff.user = user;
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(3);
                target.addBuff(buff)

                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        keys:['atk+']
                    })
                }
            }
        }
    }
}