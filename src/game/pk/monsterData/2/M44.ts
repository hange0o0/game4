class M44 extends MBase {
    constructor() {
        super();
    }
    public mvID1 = 112;
    public mvID2 = 8;

    public initMonster(user:PKMonsterData){
        user.atkX = 20
        user.atkY = 40
    }


    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*2 + 200;
    }




    public onKill(user:PKMonsterData,target:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage = user.getSkillValue(1);
        var hurt = user.getSkillValue(2,true);
        target.stopReborn = true;
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(newTarget == target)
                continue;
            if(!newTarget.canBeAtk(user))
                continue;
            var tDes = Math.abs(target.x - newTarget.x);
            if(tDes > atkRage)
                continue;
            newTarget.beAtkAction({hp:hurt})
            user.addAtkHurt(hurt)
        }
        var mv = AtkMVCtrl.getInstance().playAniOn(target.id,this.mvID1)
        if(mv)
        {
            mv.scaleX = mv.scaleY = 1;
            //mv.x -= 10
            mv.y -= 40
        }

    }
}