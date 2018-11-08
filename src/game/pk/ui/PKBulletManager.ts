class PKBulletManager {
    private static instance:PKBulletManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKBulletManager();
        return this.instance;
    }

    private arrowPool = [];
    private bulletPool = [];
    private bulletAniPool = [];
    private bulletAniPool2 = [];
    private bulletLinePool = [];
    private useItem = [];

    //有抛物线
    public createArrow(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:ArrowMC = this.arrowPool.pop();
        if(!item)
        {
            item = new ArrowMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        var con = fromMC.parent;
        con.addChildAt(item,con.getChildIndex(fromMC) + 1);
        this.useItem.push(item);
        return item;
    }


    //直线
    public createBullet(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:BulletMC = this.bulletPool.pop();
        if(!item)
        {
            item = new BulletMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        if(!fromMC)
            fromMC = toMC;
        var con = fromMC.parent;
        con.addChildAt(item,con.getChildIndex(fromMC) + 1);
        this.useItem.push(item);
        return item;
    }

    //直线2
    public createBulletAni(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:BulletAniMC = this.bulletAniPool.pop();
        if(!item)
        {
            item = new BulletAniMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        var con = fromMC.parent;
        con.addChildAt(item,con.getChildIndex(fromMC) + 1);
        this.useItem.push(item);
        return item;
    }

    //直线3   fun:每次移动触发的方法
    public createBulletLine(fromMC,toMC,beginTime,endTime,id?,fun?):ArrowMC{
        var item:BulletMCLine = this.bulletLinePool.pop();
        if(!item)
        {
            item = new BulletMCLine();
        }
        item.init(fromMC,toMC,beginTime,endTime,id,fun);
        var con = fromMC.parent;
        con.addChildAt(item,con.getChildIndex(fromMC) + 1);
        this.useItem.push(item);
        return item;
    }

    //直线4
    public createBulletAni2(fromMC,toMC,beginTime,endTime):ArrowMC{
        var item:BulletAniMC2 = this.bulletAniPool2.pop();
        if(!item)
        {
            item = new BulletAniMC2();
        }
        item.init(fromMC,toMC,beginTime,endTime);
        var con = toMC.parent;
        con.addChildAt(item,con.getChildIndex(toMC) + 1);
        this.useItem.push(item);
        return item;
    }

    public freeItem(item){
        if(!item)
            return;
        item.remove();
        if(item.type == 'arrow')
            this.arrowPool.push(item);
        else if(item.type == 'bullet')
            this.bulletPool.push(item);
        else if(item.type == 'bullet_ani')
            this.bulletAniPool.push(item);
        else if(item.type == 'bullet_ani2')
            this.bulletAniPool2.push(item);
        else if(item.type == 'bullet_line')
            this.bulletLinePool.push(item);
        ArrayUtil.removeItem(this.useItem,item)
    }

    public actionAll(){
        var PD = PKData.getInstance();
        var removeArr = [];
        for(var i=0;i<this.useItem.length;i++)
        {
             var item = this.useItem[i];
            if(!item.onAction(PD.actionTime))
            {
                removeArr.push(item);
            }
        }
        for(var i=0;i<removeArr.length;i++)
        {
            this.freeItem(removeArr[i]);
        }
    }

    public freeAll(){
        while(this.useItem.length)
        {
            this.freeItem(this.useItem[0]);
        }
    }
}

class ArrowMC extends egret.DisplayObjectContainer{
    public type = 'arrow'

    public mc = new eui.Image()
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime
    constructor() {
        super();
        this.mc.source = MyRES.getPath('pk_arrow_png')
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime,id){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var dis = Math.abs(this.toMC.x - this.fromMC.x);
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2
        var toY = this.toMC.y - this.toMC.data.getVO().height/2

        if(rate<=0.5)
        {
            var addY = dis*rate;
        }
        else
        {
            var addY = dis*(1-rate);
        }
        addY = Math.pow(addY,0.6);
        var maxAddY =  Math.pow(dis*0.5,0.6);

        if(rate<=0.5)
            var rotation = maxAddY - addY
        else
            var rotation = -(maxAddY - addY)

        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x)*rate
        this.y =  fromY + (toY - fromY)*rate - addY
        this.rotation = this.fromMC.x < this.toMC.x ? -rotation:rotation
        this.mc.scaleX = this.fromMC.x < this.toMC.x ? 1:-1
        return true;

    }

    public remove(){
        MyTool.removeMC(this);
    }
}
//图片字弹直线有角度
class BulletMC extends egret.DisplayObjectContainer{
    public type = 'bullet'

    public mc = new eui.Image()
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime
    public id

    public rota = 0;
    private config = {
        1:{w:25,h:75,rota:90},
        2:{w:25,h:120,rota:90},
        3:{w:25,h:120,rota:90},
        4:{w:25,h:80,rota:90},
        5:{w:25,h:120,rota:90},
        6:{w:25,h:120,rota:90},
        7:{w:25,h:120,rota:90},
        8:{w:20,h:57,rota:90},
        9:{w:18,h:18},
        10:{w:18,h:18},
    }
    constructor() {
        super();
        this.mc.source =MyRES.getPath( 'pk_arrow_png')
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime,id){
        this.id = id;
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.rota = 0;
        this.mc.rotation = 0;//有技能会旋转这个MC
        this.scaleY = 1;
        if(id)
        {
            this.mc.source = MyRES.getPath('bullet'+id+'_png')
            this.mc.anchorOffsetX = this.config[id].w/2
            this.mc.anchorOffsetY = 20
            if(this.config[id].rota)
            {
                this.rota = this.config[id].rota;
            }
        }


    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var toY = this.toMC.y - this.toMC.data.getVO().height/2
        if(this.fromMC)
        {
            var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2 + this.fromMC.data.atkY
            var addX = (this.fromMC.data.atkX * (this.toMC.x > this.fromMC.x?1:-1));
            this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x - addX)*rate + addX
            this.y =  fromY + (toY - fromY)*rate
            this.rotation = this.getRota(
                {x:this.fromMC.x,y:fromY},
                {x:this.toMC.x,y:toY}
            );
            if(this.id && this.config[this.id].rota)
            {
                var base = 1
                if(this.id && Math.abs(this.toMC.x - this.fromMC.x) <this.config[this.id].h)
                {
                    base =  Math.abs(this.toMC.x - this.fromMC.x)/this.config[this.id].h
                }

                if(rate < 0.5)
                    this.scaleY = rate*2*base
                else
                    this.scaleY = (1-rate)*2*base
            }
        }
        else
        {
            this.x = this.toMC.x
            this.y = toY - 300*(1-rate);
            this.rotation = this.rota + 90;
        }



        return true;

    }

    public getRota(begin,end){

        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + this.rota
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this.mc);
    }
}

//图片字弹直线有回调，无角度
class BulletMCLine extends egret.DisplayObjectContainer{
    public type = 'bullet_line'

    public mc = new eui.Image()
    public fromMC:PKMonsterItem
    public toMC:any
    public beginTime
    public endTime
    public id
    public fun
    constructor() {
        super();
        this.mc.source = ''
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime,id,fun?){
        this.id = id;
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.fun = fun;
        this.mc.source = MyRES.getPath(id)//

        //if(id)
        //{
        //    this.mc.source = 'bullet'+id+'_png'
        //    this.mc.anchorOffsetX = this.config[id].w/2
        //    this.mc.anchorOffsetY = 20
        //
        //
        //}


    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2 + this.fromMC.data.atkY
        var toY = this.toMC.y
        var addX = (this.fromMC.data.atkX * (this.toMC.x > this.fromMC.x?1:-1));
        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x - addX)*rate + addX
        this.y =  fromY// + (toY - fromY)*rate
        this.fun && this.fun();
        return true;

    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this.mc);
    }
}

//旧素材子弹动画
class BulletAniMC extends egret.DisplayObjectContainer{
    public type = 'bullet_ani'

    public mc;
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime

    public needRota = true
    public targetOffsetY = 0

    constructor() {
        super();
    }

    public init(fromMC,toMC,beginTime,endTime,id){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

        var AM = AniManager.getInstance();
        if(this.mc)
            AM.removeMV(this.mc);
        this.mc = AM.getAni(id);
        this.mc.scaleX = this.mc.scaleY = 0.3   //@ani scale
        this.mc.x = 0
        this.mc.y = 0
        this.addChild(this.mc)
        this.needRota = true;
        this.targetOffsetY = 0
    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = egret.Ease.sineIn((t - this.beginTime)/(this.endTime - this.beginTime));
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2 + this.fromMC.data.atkY
        var toY = this.toMC.y - this.toMC.data.getVO().height/2 + this.targetOffsetY
        var addX = (this.fromMC.data.atkX * (this.toMC.x > this.fromMC.x?1:-1));
        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x - addX)*rate + addX
        this.y =  fromY + (toY - fromY)*rate
        this.rotation = this.getRota(
            {x:this.fromMC.x,y:fromY},
            {x:this.toMC.x,y:toY}
        );

        return true;

    }

    public getRota(begin,end){
        if(!this.needRota)
            return 0;
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }

    public remove(){
        MyTool.removeMC(this);
        AniManager.getInstance().removeMV(this.mc);
        this.mc = null;
    }
}

//用新素材直线
class BulletAniMC2 extends egret.DisplayObjectContainer{
    public type = 'bullet_ani2'

    public mc:any = new MonsterAtkMV()
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime

    public targetOffsetY = 0

    constructor() {
        super();
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

        this.mc.x = 0
        this.mc.y = 0
        this.targetOffsetY = 0

        //this.mc.load()

    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2 + this.fromMC.data.atkY
        var toY = this.toMC.y - this.toMC.data.getVO().height/2 + this.targetOffsetY
        var addX = (this.fromMC.data.atkX * (this.toMC.x > this.fromMC.x?1:-1));
        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x - addX)*rate + addX
        this.y =  fromY + (toY - fromY)*rate
        return true;

    }


    public remove(){
        MyTool.removeMC(this);
        this.mc.stop();
    }
}
