class MBase {
    private static baseData = {};
    public static getData(id):MBase{
        if(!this.baseData[id])
        {
            var myClass = eval("M" + id);
            this.baseData[id] = new myClass();
            this.baseData[id].id = id;
        }
        return this.baseData[id];
    }

    public mvID1
    public mvID2
    public mvID3

    public id
    public type = 'monster'
    constructor() {
    }

    public isHeroSkillCDOK(user,id){
        var lastSkillTime = user.skillTemp['hs' + id] || 0;

        var cd = user.getVO().getHeroSkill(id).skillcd;
        if(user.mid == 102 && user.level >=5) //减CD技能
        {
            cd = user.getVO().getHeroSkillValue(5,1) * 1000;
        }
        if(PKData.getInstance().actionTime > lastSkillTime + cd)
        {
            //console.log(PKData.getInstance().actionTime , lastSkillTime , user.getVO().getHeroSkill(id).skillcd,JSON.stringify(user.skillTemp))
            return true;
        }
        return false;
    }
    public setHeroSkillUse(user,id,t?){
        user.skillTemp['hs' + id] = Math.max(t || PKData.getInstance().actionTime, user.skillTemp['hs' + id] || 0);
        //console.log( JSON.stringify(user.skillTemp))
    }

    public onHpChange(user:PKMonsterData){

    }
    public onCreate(user:PKMonsterData){

    }
    public onDie(user:PKMonsterData){

    }
    public onRemove(user:PKMonsterData){

    }
    public onBuff(buff:PKBuffData){

    }
    //被攻击时的处理
    public beAtkAction(user:PKMonsterData,data){

    }
    //杀死单位的处理
    public onKill(user:PKMonsterData,target:PKMonsterData){

    }

    //预加载
    public preload(){
        if(this.mvID1)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID1)
        if(this.mvID2)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID2)
        if(this.mvID3)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID3)
    }
    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){

    }

    //////////////////////////////////////////////////////  skill
    //取技能目标
    public getSkillTarget(user:PKMonsterData){
        return [];
    }

    //伤害飞行时间
    protected getSkillArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 0;
    }

    //技能动画
    public skillMV(user,target,actionTime,endTime){
        AtkMVCtrl.getInstance().mSkillMV(this.id,user,target,actionTime,endTime)
    }

    //实现技能
    public skill(user:PKMonsterData,target){

    }


    //////////////////////////////////////////////////////    atk
    //取技能目标
    protected getAtkTargets(user:PKMonsterData){
        return [user.target];
    }
    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 0;
    }

    //攻击发出时的附加动画，如箭，魔发效果
    public atkMV(user,target,actionTime,endTime){
        AtkMVCtrl.getInstance().mAtkMV(this.id,user,target,actionTime,endTime)
    }



   //////////////////////////////////////////////////////   other上面的为要处理的函数
    //技能前处理（生成技能事件）
    public skillBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime + this.getAtkMVCD(user)//这个时间后发出攻击时件(前摇)
        var targets = user.skillTargets;
        for(var i=0;i<targets.length;i++)
        {
            this.sendSkillBefore(user,targets[i],actionTime,endTime)
        }
    }

    //技能发出处理
    public skillAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var endTime = actionTime + this.getSkillArriveCD(user,target);
        this.sendSkillAction(user,target,actionTime,endTime) //攻击起作用
    }

    //攻击前处理（生成PK事件）设攻击发出时间，攻击目标选择
    public atkBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime + this.getAtkMVCD(user)//这个时间后发出攻击时件(前摇)
        var targets = this.getAtkTargets(user);
        for(var i=0;i<targets.length;i++)
        {
            this.sendAtkBefore(user,targets[i],actionTime,endTime)
        }
    }

    public getAtkMVCD(user:PKMonsterData){
        return user.getAtkBeforeCD();
    }

    //攻击发出，设攻击生效(起作用)时间
    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var endTime = actionTime + this.getAtkArriveCD(user,target);

        if(user.doubleRate && PKData.getInstance().random() < user.doubleRate)
        {
            user.doubleAction = true;
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_DOUBLE,
                user:user,
                value:user.atk*user.doubleValue,
            })
        }
        else
            user.doubleAction = false;


        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    //a对B攻击到达时的逻辑（攻击正式生效）
    public atk(user:PKMonsterData,target:PKMonsterData){
        if(!user.doubleAction && target.missRate && PKData.getInstance().random() < target.missRate)  //暴击不可闪
        {
            if(target.die)
                return false;
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_MISS,
                user:target
            })
            return false;
        }
        var hp = this.getAtkHp(user,target);
        target.beAtkAction({hp:hp,atker:user})
        user.atkAction({hp:hp})
        return true;
    }

    //取攻击力
    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = user.atk * user.getAtkRate(target);
        if(user.doubleAction)
            atk *= user.doubleValue;
        return Math.ceil(atk);
    }

    //取最终伤害
    public getAtkHp(user:PKMonsterData,target:PKMonsterData){
        var atk = this.getAtkerAtk(user,target);
        var teamDef = target.getOwner().teamData.getTeamDef();
        var hp = Math.floor(atk * Math.max(1-(target.def + teamDef)/100,0));
        if(hp < 1)
            hp = 1;
        return Math.ceil(hp);
    }

    protected sendAtkBefore(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'atk_before',
            model:this,
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }
    protected sendSkillBefore(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill_before',
            model:this,
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }

    protected sendAtkAction(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件攻击起作用
            type:'atk',
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })

        if(!PKData.getInstance().quick)
            this.atkMV(user,target,actionTime,endTime)

    }
    protected sendSkillAction(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill',
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })

        if(!PKData.getInstance().quick)
            this.skillMV(user,target,actionTime,endTime)

    }
}