class M35 extends MBase {
    constructor() {
        super();
    }
    public mvID1 = 103;
    public initMonster(user:PKMonsterData){
        user.atkY = -30
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 100;
    }


    public skill(user:PKMonsterData,target:PKMonsterData){
        var PD = PKData.getInstance();
        var mid = 35;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var num =1
        for(var i=0;i<num;i++)
        {
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-25 + Math.random()*50,
                lastSkill:Number.MAX_VALUE,
                dieTime:PD.actionTime + user.getSkillValue(1)*1000,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }
    }

    public getSkillTarget(user:PKMonsterData){
        user.getAtkTarget();
        if(user.target)
            return [null];
        return [];
    }
}

//
//class M35StateListener extends PKStateListener {
//    public type = PKConfig.LISTENER_TIMER
//    public actionTime
//    constructor() {
//        super();
//        this.actionTime = PKData.getInstance().actionTime;
//    }
//
//    // 起作用时会调用的方法
//    public actionFun(target?:PKMonsterData){
//        var user:PKPosCardData = <PKPosCardData>this.owner;
//
//        if(PKData.getInstance().actionTime - this.actionTime < 1000)
//            return;
//        var PD = PKData.getInstance();
//        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
//        var atkrage = user.getSkillValue(3);
//        var list = [];
//        for(var i=0;i<arr.length;i++)
//        {
//            var targetX = arr[i];
//            if(!targetX.beSkillAble())
//                continue;
//            var des = Math.abs(this.x - targetX.x);
//            if(des<=atkrage)
//            {
//                list.push(targetX)
//            }
//        }
//        var selectTarget = ArrayUtil.randomOne(list);
//        if(selectTarget)
//        {
//            this.actionTime = PKData.getInstance().actionTime;
//            AtkMVCtrl.getInstance().playAniOn(selectTarget.id,this.mvID)
//            selectTarget.addHp(-user.getSkillValue(1,true))
//        }
//    }
//
//    public onRemove(){
//        PKData.getInstance().addVideo({
//            type:PKConfig.VIDEO_TOTEM_REMOVE,
//            user:this
//        })
//    }
//}