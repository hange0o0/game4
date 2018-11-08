class M77 extends MBase {
    constructor() {
        super();
    }

    //预加载
    public preload(){
        AtkMVCtrl.getInstance().preLoadPNGLocal('enemy78_png')
    }

    public initMonster(user:PKMonsterData){
        user.atkAble =  false;
    }

    public onHpChange(user:PKMonsterData){
        if(!user.skillTemp[77] && user.getHpRate() < 0.5)
        {
            user.skillTemp[77] = true;
            user.addSpeed += 100;
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_CHANGE_SKIN,
                user:user,
                skin:78,
            })
        }
    }

    //public onKill(user:PKMonsterData,target:PKMonsterData){
    //    var PD = PKData.getInstance();
    //    var mid = 65;
    //    var owner = PD.getPlayer(user.owner);
    //    var atkRota = owner.teamData.atkRota;
    //    var num = user.getSkillValue(1)
    //    for(var i=0;i<num;i++)
    //    {
    //        var mData = {
    //            force:owner.force,
    //            mid:mid,
    //            owner:user.owner,
    //            atkRota:atkRota,
    //            x:target.x,
    //            y:target.y,
    //            lastSkill:Number.MAX_VALUE,
    //            dieTime:PD.actionTime + user.getSkillValue(2)*1000,
    //            actionTime:PD.actionTime
    //        }
    //        PD.addMonster(mData);
    //    }
    //}
}