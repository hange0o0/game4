class M32 extends MBase {
    constructor() {
        super();
    }
    public initMonster(user:PKMonsterData){
        user.atkY = -30
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 100;
    }



    public onCreate(user:PKMonsterData){
        var listener = new M32StateListener();
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

class M32StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    //public x
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

        if(PKData.getInstance().actionTime - this.actionTime < 1000)
            return;



        this.actionTime = PKData.getInstance().actionTime;


        var user:PKMonsterData = <PKMonsterData>this.owner;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        var list = [];
        var hp = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            var des = Math.abs(user.x - targetEnemy.x);
            if(des<=atkrage)
            {
                if(!targetEnemy.skillTemp[32])
                    targetEnemy.skillTemp[32] = [];
                if(targetEnemy.skillTemp[32].length >= 3)
                {
                    while(targetEnemy.skillTemp[32][0] &&  PKData.getInstance().actionTime - targetEnemy.skillTemp[32][0] > 1000)
                        targetEnemy.skillTemp[32].shift();
                }
                if(targetEnemy.skillTemp[32].length >= 3)
                {
                    continue;
                }
                targetEnemy.skillTemp[32].push(this.actionTime);
                targetEnemy.addHp(hp)
            }
        }
        return list;
    }
}