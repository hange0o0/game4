class M65 extends MBase {
    constructor() {
        super();
    }

    public getSkillTarget(user:PKMonsterData){
        return [null];
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 65;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            y:-30 + Math.random()*60,
            lastSkill:Number.MAX_VALUE,
            actionTime:PD.actionTime
        }
        PD.addMonster(mData);
        //mData.y = -30 + Math.random()*60;
        //PD.addMonster(mData);
    }
}