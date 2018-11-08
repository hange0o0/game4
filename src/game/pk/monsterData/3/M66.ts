class M66 extends MBase {
    constructor() {
        super();
    }

    public onKill(user:PKMonsterData,target:PKMonsterData){
        var PD = PKData.getInstance();
        var mid = 65;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var num = user.getSkillValue(1)
        target.stopReborn = true;
        for(var i=0;i<num;i++)
        {
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:target.x,
                y:-30 + Math.random()*60,
                lastSkill:Number.MAX_VALUE,
                dieTime:PD.actionTime + user.getSkillValue(2)*1000,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }
    }


}