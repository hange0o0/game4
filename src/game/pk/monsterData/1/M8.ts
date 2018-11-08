class M8 extends MBase {
    constructor() {
        super();
    }
    public mvID1 = 119;
    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.doubleValue = user.getSkillValue(1)/100;
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        if(target.dieTime)
        {
            user.doubleRate = 1;
        }
        super.atkAction(user,target,actionTime);
        user.doubleRate = 0
    }

    //protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
    //    var atk = super.getAtkerAtk(user,target);
    //    if(target.dieTime)
    //        atk *= 2;
    //    return atk;
    //}


    public skill(user:PKMonsterData,target:PKMonsterData){
        target.owner = user.owner
        target.atkRota = user.atkRota;
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_CHANGE_TEAM,
            user:target
        })
        //var hp = Math.ceil(this.getAtkHp(user,target)*0.5);
        //target.beAtkAction({hp:hp,atker:user})
        //user.atkAction({hp:hp})
    }
    //转化
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = 300;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(!target.dieTime)
                continue;
            if(target.hp>= user.getSkillValue(2,true))
                continue;
            if(!target.beSkillAble())
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