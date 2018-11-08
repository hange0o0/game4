class M3 extends MBase{
    constructor() {
        super();
    }

    public preload(){
        AtkMVCtrl.getInstance().preLoadPNG('monster/enemy3_attack.png')
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        super.atkAction(user,target,actionTime);
        //第二次伤害
        var endTime = actionTime + this.getAtkArriveCD(user,target)+50;
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
        //第3次伤害
        var endTime = endTime+50;
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }



}