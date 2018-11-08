class M74 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.atkX = 20
        user.atkY = 65
    }

    public preload(){
        AtkMVCtrl.getInstance().preLoadPNG('monster/enemy72_attack.png')
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*1.5 + 200;
    }



    public getSkillTarget(user:PKMonsterData){
        return [null];
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 64;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var num = user.getSkillValue(1)
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
                dieTime:PD.actionTime + user.getSkillValue(2)*1000,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }

    }
}