class M48 extends MBase {
    constructor() {
        super();
    }

    public mvID1 = 200;

    public initMonster(user:PKMonsterData){
        user.atkX = 40
        //user.atkY = 65
    }


    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 100//Math.abs(user.x - target.x) + 100;
    }



    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage = user.getSkillValue(1);
        var hurt = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(newTarget == target)
                continue;

            if(!newTarget.canBeAtk(user))
                continue;
            var tDes = Math.abs(target.x - newTarget.x);
            if(tDes > atkRage + newTarget.getVO().width/2)
                continue;

            newTarget.beAtkAction({hp:hurt})
            user.addAtkHurt(hurt)
        }
        return true;
    }
}