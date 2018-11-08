class M68 extends MBase {
    constructor() {
        super();
    }

    public preload(){
        AtkMVCtrl.getInstance().preLoadPNG('monster/enemy68_attack.png')
    }



    //取攻击力
    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = super.getAtkerAtk(user,target)
        if(!target.skillTemp[66])
            target.skillTemp[66] = {}
        if(!target.skillTemp[66][user.id])
            target.skillTemp[66][user.id] = 1
        atk = atk * (target.skillTemp[66][user.id])
        return atk;
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(b)
            target.skillTemp[66][user.id] = target.skillTemp[66][user.id] * user.getSkillValue(1)
        return b;
    }
}