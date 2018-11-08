//出战区的怪
class PKPosCardData {
    public id;//唯一ID 1-4
    public mid //对应的怪
    public owner//主人ID
    public cardData//关联的手牌
    public isAuto = false//是否自动出怪上阵的

    public enableNum = 0;
    public enableMaxNum = 0;


    public addTime = 0//加入的时间
    public actionTime = 0//上次行动的时间
    public actionResult = 0//是否有等待出手的怪

    public num = 0//已使用的次数
    public needRemoveListener = true//结束后移除对应监听


    //上方显示用到
    public isLock = false;
    public topIndex;

    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }

        if(!PKData.getInstance().quick)
            this.getVO().preLoad();

        this.addTime = this.actionTime;
    }

    public getVO(){
        return CM.getCardVO(this.mid)
    }

    public getOwner(){
        return PKData.getInstance().getPlayer(this.owner);
    }

    public useEnable(){
        if(this.enableMaxNum)
            return this.enableNum < this.enableMaxNum
        var mvo = MonsterVO.getObject(this.mid)
                return this.num < mvo.num;
    }

    public getMaxNum(){
        if(this.enableMaxNum)
            return this.enableMaxNum;
        if(this.mid < PKConfig.skillBeginID)
        {
            var mvo = MonsterVO.getObject(this.mid)
            //if(this.isAuto)
                return mvo.num;
            //return 999
        }
    }

    public getRemainNum(){
        return this.getMaxNum() - this.num
    }

    public getNextCD(){
        var PD = PKData.getInstance();
        if(this.actionResult)
            return 0;
        var nextTime = this.actionTime + this.getMaxCD();
        return Math.max(0,nextTime - PD.actionTime);
    }

    //法术专用的整体时间计算
    public getRemainCD(){
        var maxCD = this.getMaxCD();
        if(maxCD)
        {
            if(this.getVO().num == 0)
                return (this.getNextCD() + maxCD*(this.getRemainNum()))
            else
                return (this.getNextCD() + maxCD*(this.getRemainNum() - 1))
        }
        return 0;
    }



    public getMaxCD(){
        if(this.num == 0)
            return PKConfig.beforeCD;
        else
        {
            if(this.enableMaxNum)
                return Number.MAX_VALUE;
            return this.getVO().cd;
        }
    }

    //是否可马上加入出战队列判断
    public testAdd(t){
        //if(this.enableNum)//这个不通过出战队列起作用
        //    return false
        if(this.actionResult)
        {
            //if(t - this.actionTime > PKConfig.remainCD) //超时
            //{
            //    this.actionTime = t;
            //    this.actionResult = 0;
            //    this.num ++;
            //    PKData.getInstance().addVideo({
            //        type:PKConfig.VIDEO_POS_FAIL,
            //        user:this
            //    })
            //    return false;
            //}
            return true;
        }
        if(!this.useEnable())
        {
            return false;
        }

        var cd = this.getMaxCD();
        if(t - this.actionTime >= cd)
        {
            if(this.mid > PKConfig.skillBeginID && this.num >= 1 && this.getVO().num == 0)//一次性，但存在界面中的技能失效
            {
                 return false;
            }
            if(this.cardData && this.cardData.waiting)//超时没返回，要向服务器请求数据进行同步
            {
                 return false;
            }
            this.actionTime = t;
            this.actionResult = 1;
            return true;
        }
        return false;
    }

    //组装上阵怪的数据
    public getMonster(actionTime){
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(this.owner);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        return {
            force:owner.force,
            mid:this.mid,
            owner:this.owner,
            atkRota:atkRota,
            fromPos:true,
            x:x,
            y:-25 + Math.random()*50,
            actionTime:actionTime
        }
    }

    public getSkillValue(index,needForce=false){
        if(DEBUG)
        {
            if(needForce)
            {
                if(CM.getCardVO(this.mid).des.indexOf('$' + index) == -1)
                    throw new Error(this.mid + ' $index:' + index)
            }
            else
            {
                if(CM.getCardVO(this.mid).des.indexOf('#' + index) == -1)
                    throw new Error(this.mid + ' #index:' + index)
            }
        }

        var PD = PKData.getInstance();
        return CM.getCardVO(this.mid).getSkillValue(index,needForce?PD.getPlayer(this.owner).force:0)
    }

    //public getSkillValue(index=1,noForce=false){
    //    var PD = PKData.getInstance();
    //    var owner = PD.getPlayer(this.owner);
    //    var vo = SkillVO.getObject(this.mid)
    //    var sv = vo['sv' + index];
    //    if(noForce)
    //        return sv
    //    return Math.floor(sv * (1+owner.force/100));
    //}

    //触发技能

    //上阵怪后的处理
    public setHaveAdd(actionTime){
        this.actionTime = actionTime;
        this.actionResult = 0;
        this.num ++;

        if(this.num == 1)
        {
            this.getOwner().teamData.posList.unshift(this)
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_POS_SHOW,
                user:this
            })
        }
    }

    //强行销毁
    public die(){
        if(this.needRemoveListener)
            this.getOwner().teamData.removeStateListerByOwner(this)
    }

    public enableWaiting(){
        this.cardData.waiting = false;
        this.cardData.remove = true;
        this.getOwner().onPosCardEnable(this);

        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_CARD_WAITING_CHANGE,
            user:this.cardData
        })
    }
}