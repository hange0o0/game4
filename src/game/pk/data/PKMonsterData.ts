//场上的怪
class PKMonsterData {
    public die = false;
    public passEnd = false;//冲过了终点

    public hp = 0
    public atk  = 0
    public speed  = 0
    public def  = 0
    public maxHp = 0
    public hpChange = 0  //每秒改变的HP值,是1秒，处理时会除2
    public lastHpChange = 0  //上次改变的HP值的时间
    public atkAble = true  //可以攻击
    public level = 0  //英雄的等级

    //隐藏属性
    public doubleRate  = 0
    public doubleValue  = 0
    public doubleAction  = false;
    public missRate  = 0
    public momian  = false
    public skillTemp  = {}//用于存放技能的临时变量
    public nohitTimes  = 0//不受伤害的次数

    public baseHp = 0
    public baseAtk  = 0
    public baseSpeed  = 0
    public addSpeed  = 0//速度改变百分比
    public manaHp  = 0//魔盾



    private skillTimes=0//技能使用的次数

    public x;//当前的位置
    public y;//当前的位置
    public atkY = 0;//攻击发出的Y值偏移
    public atkX = 0;//攻击发出的X值偏移
    public mid //对应的怪
    public owner//属于哪个玩家
    public actionTime//上次行动的时间
    public atkRota//进攻方向

    public target:PKMonsterData//攻击目标
    public skillTargets//技能目标

    public id;//唯一ID

    public atkHurtCount = 0;//累计输出伤害

    public stopTime = 0
    public lastSkill = 0
    public dieTime = 0
    public buff = [];

    public currentState = {};//当前的特殊状态
    public stateChange = false
    public reborning = false//有复活效果起作用了
    public stopReborn = false//禁止目标复活
    public listenerData//保存用于listener的数据

    public callHeroSkill//本次的英雄技能ID
    public useingHeroSkill//已触发的英雄技能ID


    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }
        var mvo = MonsterVO.getObject(this.mid);
        var add = mvo.getAdd(obj.force,this.getOwner().type);
        var maxAdd = obj.maxHpAdd || 1;

        this.hp = Math.floor(mvo.hp * add * maxAdd);
        this.atk = Math.floor(mvo.atk * add);
        this.speed = mvo.speed;
        this.def = mvo.def;


        this.maxHp = this.hp;
        this.baseHp = this.hp;
        this.baseAtk = this.atk;
        this.baseSpeed = this.speed;


        if(obj.hpRate)
        {
            this.hp  = Math.floor(this.hp*obj.hpRate) || 1
        }



        MBase.getData(this.mid).initMonster(this);
        //this.def += this.getVO().def;
    }

    public getForce(){
        var mvo = this.getVO();
        return Math.round((this.hp/mvo.hp*(1+this.def/100) + this.atk/mvo.atk*0.8 + this.speed/mvo.speed*0.5)*mvo.cost*10);
    }

    //根据属性相克，取攻击比例
    public getAtkRate(defender:PKMonsterData){
        if(_get['debug'])
            return 1//先不考滤相克
        var atkType = this.getVO().type
        var defType = defender.getVO().type
        return PKTool.getAtkRate(atkType,defType)
    }

    //public changeValue(key,value){
    //    if(key == 'speed' || key == 'def' || key == 'atk' || key == 'hpChange')
    //        this[key] += value;
    //}

    public getAtkBeforeCD(){
        if(!this.addSpeed)
            return this.getVO().mv_atk
        if(this.addSpeed < 0)
            return Math.floor(this.getVO().mv_atk*(1-this.addSpeed/100));
        return Math.floor(this.getVO().mv_atk*(1-this.addSpeed/(100 + this.addSpeed)));
    }

    public getAtkCD(){
        if(!this.addSpeed)
            return this.getVO().atkcd
        if(this.addSpeed < 0)
            return Math.floor(this.getVO().atkcd*(1-this.addSpeed/100));
        return Math.floor(this.getVO().atkcd*(1-this.addSpeed/(100 + this.addSpeed)));
    }

    public beSkillAble(){
        return this.momian == false && !this.isInState(PKConfig.STATE_MOMIAN);
    }

    //{endTime,  add:{属性名称:增加值}，   state:{状态名：true},   id:唯一ID,   no:这BUFF没生效,   value:技能等级数值}
    public addBuff(data:PKBuffData){
        data.owner = this;
        this.buff.push(data);
        if(data.id)
            this.resetBuffID(data.id);
        else
            data.enable();

        if(data.ing && data.haveState)
            this.resetState();
    }

    //拥有指定BUFF
    public haveBuff(id){
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            if(oo.id == id)
            {
                return true
            }
        }
        return false;
    }

    //清除状态
    public cleanBuff(t,user?,buffType=0){
        var needTestStat = false
        var needTestId = null
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            var needClean = oo.endTime && t && oo.endTime <= t
            if(user && user == oo.user)
                needClean = true;
            if(oo.removeAble)
            {
                if(buffType == -1 && oo.isDebuff)
                    needClean = true;
                if(buffType == 1 && !oo.isDebuff)
                    needClean = true;
            }
            if(needClean)
            {
                this.buff.splice(i,1);
                i--;
                if(oo.ing)
                {
                    if(oo.haveState)
                        needTestStat = true;
                    if(oo.id)
                    {
                        if(!needTestId)
                            needTestId = {};
                        if(!needTestId[oo.id])
                            needTestId[oo.id] = true;
                    }
                }
                oo.remove();
            }
        }
        if(needTestId)
        {
            for(var s in needTestId)
                this.resetBuffID(s);
        }
        if(needTestStat)
            this.resetState();
    }

    //判断是否在某个状态中
    public isInState(stateName){
        if(stateName == PKConfig.STATE_MOMIAN && this.momian)
            return true;
        return this.currentState[stateName];
    }

    //重置状态
    public resetState(){
        var lastState = this.currentState;
        this.currentState = {};
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            if(oo.ing && oo.haveState)
            {
                for(var s in oo.state)
                {
                    this.currentState[s] = true;
                    if(!lastState[s]) //新增了状态
                        this.stateChange = true;
                }
            }
        }

        if(!this.stateChange)
        {
            for(var s in lastState)
            {
                 if(!this.currentState[s]) //去除了状态
                 {
                     this.stateChange = true;
                     break;
                 }
            }
        }
    }

    //对ID唯一的技能进行重置
    public resetBuffID(id){
        var ids = []//所有相同ID的BUFF
        var current:PKBuffData;
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            if(oo.id == id)
            {
                ids.push(oo);
                if(oo.ing)
                    current = oo
            }
        }
        if(!ids.length)  //没技能
            return
        if(ids.length == 1 && current) //只有唯一技能
            return
        var newOne:PKBuffData;
        for(var i=0;i<ids.length;i++)
        {
            var oo:PKBuffData = ids[i];
            if(!newOne || Math.abs(oo.value) > Math.abs(newOne.value))
                newOne = oo;
        }
        if(!current) //以前没有
        {
            newOne.enable();
            return
        }
        if(newOne != current && newOne.value != current.value)
        {
            newOne.enable();
            current.disable();
        }
    }


    public getVO():MonsterVO{
        return MonsterVO.getObject(this.mid);
    }
    public getOwner(){
        return PKData.getInstance().getPlayer(this.owner);
    }

    public canMove(t){
        if(this.owner == 'sys')
            return false;
        if(this.getVO().speed <=0)
            return false;
        if(!this.canAction())
            return false
        if(!this.atkAble && PKData.getInstance().currentState == 'def'){
             if(this.atkRota == PKConfig.ROTA_LEFT && this.x > PKConfig.floorWidth/2 + PKConfig.appearPos - 100)
                 return false
             if(this.atkRota == PKConfig.ROTA_RIGHT && this.x < PKConfig.floorWidth/2 + PKConfig.appearPos + 100)
                 return false
        }
        return this.stopTime < t;
    }

    //可以有行为 如移动，攻击等
    public canAction(){
        return !this.die && !this.isInState(PKConfig.STATE_YUN)
    }

    public canAtk(){
        var PD =  PKData.getInstance();
        return  this.atkAble && this.canAction() &&  this.stopTime < PD.actionTime
    }

    public canBeAtk(user){
        return !this.die &&
            user.getOwner().teamData != this.getOwner().teamData && !this.isInState(PKConfig.STATE_NOBEATK)
    }

//可以用技能
    public canSkill(t){
        if(this.stopTime >= t)
            return null;
        var vo = this.getVO();
        if(!vo.skillcd) //无技能
            return null;
        if(this.lastSkill && (this.lastSkill + vo.skillcd >= t))
            return null;
        if(!this.canAction())
            return null;
        this.skillTargets = MBase.getData(this.mid).getSkillTarget(this);
        return this.skillTargets
    }

    public isHero(){
        return this.getVO().isHero();
    }

    public setSkillUse(actionTime){

        if(this.getVO().isHero())
        {
            if(this.callHeroSkill)
                this.useingHeroSkill = this.callHeroSkill;
            this.callHeroSkill = 0;
            MBase.getData(this.mid).setHeroSkillUse(this,this.useingHeroSkill)
        }

        if(this.getVO().skillcd < 0)
        {
            this.skillTimes += 1000;
            if(this.getVO().skillcd + this.skillTimes >= 0)
                this.lastSkill = Number.MAX_VALUE;
            else
                this.lastSkill = actionTime;
        }
        else
            this.lastSkill = actionTime;
    }

    public move(){
        if(!this.addSpeed)
            var rate = 1;
        else if(this.addSpeed > 0)
            var rate =  (1+this.addSpeed/100);
        else
            var rate = (1+this.addSpeed/(100 - this.addSpeed));

        this.x += this.atkRota * Math.round(this.speed*rate)/10;
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_MOVE,
            user:this
        })
    }
    public stand(){
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_STAND,
            user:this
        })
    }

    public getAtkTarget(){
        if(this.owner == 'sys')
            return null;
        var PD = PKData.getInstance();
        if(!this.canAtk())
            return null;
        var atkRage = this.getVO().getAtkDis();
        if(this.target)
        {
            if(this.target.canBeAtk(this) && Math.abs(this.target.x - this.x) < atkRage + this.target.getVO().width/2)
            {
                return this.target;
            }
            else
                this.target = null;
        }

        //找最近的
        var des = 0;
        var list = PD.monsterList
        var myPlayer = PD.getPlayer(this.owner);
        for(var i=0;i<list.length;i++)
        {
            var target:PKMonsterData = list[i];
            var ePlayer = PD.getPlayer(target.owner);
            if(myPlayer.teamData.id == ePlayer.teamData.id)//同一队
                continue;

            var tDes = Math.abs(target.x - this.x);
            if(tDes < atkRage + target.getVO().width/2 && target.canBeAtk(this)) {
                if (!this.target || des > tDes)
                {
                    this.target = target;
                    des = tDes;
                }
            }
        }
        return  this.target
    }

    //统计累计伤害
    public addAtkHurt(v){
        if(v > 0)
            this.atkHurtCount += v;
    }

    public atkAction(data){
        this.listenerData = data;
        if(data.hp)
            this.addAtkHurt(data.hp)

        this.getOwner().teamData.testState(PKConfig.LISTENER_ATK,this);
    }

    public beAtkAction(data){

        this.addHp(-data.hp)
        MBase.getData(this.mid).beAtkAction(this,data);
        this.listenerData = data;
        this.getOwner().teamData.testState(PKConfig.LISTENER_BEATK,this);
        if(this.die && data.atker)
        {
            MBase.getData(data.atker.mid).onKill(data.atker,this);
        }

    }

    //直接死亡
    public setDie(){
        this.hp = 0;
        this.die = true;
    }

    public addHp(hp){
        if(hp<0)
        {
            if(this.nohitTimes)
            {
                this.nohitTimes -- ;
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_NOHIT,
                    user:this,
                })
                return;
            }
            else if(this.manaHp)
            {
                this.manaHp += hp;
                if(this.manaHp < 0)
                {
                    hp = this.manaHp
                    this.manaHp = 0
                }
                else
                {
                    hp = 0;
                }
                //魔盾消失
                if(this.manaHp == 0)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MANAHP_CHANGE,
                        user:this,
                    })
                }
            }
            if(!hp)
                return;
        }


        this.hp += hp;
        if(this.hp <= 0)
            this.die = true;
        else if(this.hp > this.maxHp)
            this.hp = this.maxHp
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_HPCHANGE,
            user:this,
        })
        MBase.getData(this.mid).onHpChange(this);
    }

    public getHpRate(){
        return this.hp / this.maxHp
    }

    public onDie(){
        if(!this.passEnd)
        {
            for(var i=0;i<this.buff.length;i++)
            {
                var oo:PKBuffData =  this.buff[i];
                if(oo.ing && oo.haveState && (oo.state[PKConfig.STATE_DIE]))
                {
                    var id = parseInt((oo.id + '').split('_').shift())
                    MBase.getData(id).onBuff(oo);
                }
            }
            MBase.getData(this.mid).onDie(this);
        }
        this.getOwner().teamData.testState(PKConfig.LISTENER_DIE,this);
        MBase.getData(this.mid).onRemove(this);
        PKData.getInstance().actionRecord.push('die|' + PKData.getInstance().actionTime + '|' + this.id + '|' + this.passEnd)

        //if(this.skillTemp[210] == 1)
        //{
        //    var oo:PKBuffData = new PKBuffData()
        //    oo.user = this;
        //    oo.id = 210;
        //    SBase.getData(oo.id).onIll(oo);
        //}
    }

    public getSkillValue(index,needForce=false){
        var PD = PKData.getInstance();

        return CM.getCardVO(this.mid).getSkillValue(index,needForce?PD.getPlayer(this.owner).force:0)
    }
}