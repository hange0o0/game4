class M9 extends MBase {
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var rate = user.getSkillValue(1)/100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.id = 9;
            buff.user = user;
            buff.addValue('atk',Math.max(1,Math.floor(target.baseAtk*rate)));
            target.addBuff(buff)



            if(buff.ing)
            {

                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['atk+']
                })
            }

        }

        var listener = new M9StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            target.cleanBuff(0,user);
        }
        user.getOwner().teamData.removeStateListerByOwner(user)
    }
}

class M9StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var rate = this.owner.getSkillValue(1)/100;
        var buff = new PKBuffData()
        buff.id = 9;
        buff.user = this.owner;
        buff.addValue('atk',Math.max(1,Math.floor(target.baseAtk*rate)));
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['atk+']
            })
        }
    }
}