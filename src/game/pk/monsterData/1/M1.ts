class M1 extends MBase{
    constructor() {
        super();
    }

    public mvID1 = 103;


    //伤害飞行时间
    //protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
    //    return Math.abs(user.x - target.x) + 200;
    //}


    //技能动画



    public skill(user:PKMonsterData,target){
        var hp = Math.ceil(user.getSkillValue(2,true));
        target.beAtkAction({hp:hp,atker:user})
        user.atkAction({hp:hp})
    }

    private testTarget(target,val){
        if(!target.beSkillAble())
            return false;
        var des = Math.abs(val[0].x - target.x);
        if(des<=val[1])
        {
            target.temp = des;
           return true
        }
    }
    //对最多3个单位进行一次攻击
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var atkrage = user.getVO().getAtkDis() + 50;
        var list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user,atkrage]);

        var maxNum = user.getSkillValue(1)
        if(list.length>maxNum)
        {
            //ArrayUtil.sortByField(list,['temp','id'],[0,0])
            list.length = maxNum;
        }
        return list;
    }

    //初始化怪物隐藏属性
    //public initMonster(user:PKMonsterData){
    //    //user.doubleRate = 0.5;
    //    //user.doubleValue = 2;
    //    //user.missRate = 0.5;
    //}

    //public getSkillTarget(user:PKMonsterData){
    //    return [null];
    //}
    //
    //public skill(user:PKMonsterData,targets){
    //    var PD = PKData.getInstance();
    //    var mid = 1;
    //    var owner = PD.getPlayer(user.owner);
    //    var atkRota = owner.teamData.atkRota;
    //    var mData = {
    //        force:owner.force,
    //        mid:mid,
    //        owner:user.owner,
    //        atkRota:atkRota,
    //        x:user.x,
    //        lastSkill:Number.MAX_VALUE,
    //        actionTime:PD.actionTime
    //    }
    //    PD.addMonster(mData);
    //}

    //public atk(user:PKMonsterData,target:PKMonsterData){
    //    super.atk(user,target);
    //    //溅射 30%
    //    var isToRight = user.x<target.x
    //    var PD = PKData.getInstance();
    //    var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
    //    var atkRage = user.getVO().atkrage + 200;
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        var newTarget = arr[i];
    //        if(newTarget == target)
    //            continue;
    //        if(isToRight)
    //        {
    //            if(user.x > newTarget.x)
    //                continue
    //        }
    //        else if(user.x < newTarget.x)
    //            continue
    //        if(!newTarget.canBeAtk(user))
    //            continue;
    //        var tDes = Math.abs(user.x - newTarget.x);
    //        if(tDes > atkRage + newTarget.getVO().width/2)
    //            continue;
    //
    //        var hp = this.getAtkHp(user,newTarget);
    //        newTarget.beAtkAction({hp:Math.ceil(hp*0.3)})
    //    }
    //}

}