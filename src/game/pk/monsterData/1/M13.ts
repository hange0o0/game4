class M13 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.atkAble =  false;
    }

    public onCreate(user:PKMonsterData){
        var listener = new M13StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        //var PD = PKData.getInstance();
        //var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        //for(var i=0;i<arr.length;i++)
        //{
        //    var target:PKMonsterData = arr[i];
        //    target.cleanBuff(0,user);
        //}
        user.getOwner().teamData.removeStateListerByOwner(user)
    }
}

class M13StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    //public x
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

        if(PKData.getInstance().actionTime - this.actionTime < 500)
            return;

        this.actionTime = PKData.getInstance().actionTime;

        var user:PKMonsterData = <PKMonsterData>this.owner;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getSkillValue(1);
        var list = [];

        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            var des = Math.abs(user.x - targetEnemy.x);
            if(des<=atkrage)
            {
                targetEnemy.addHp(-Math.ceil(user.getSkillValue(2,true)*user.getAtkRate(targetEnemy)*0.5))
            }
        }
        return list;
    }
}