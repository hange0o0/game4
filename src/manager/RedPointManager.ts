class RedPointManager {
    private static instance:RedPointManager;

    public static getInstance():RedPointManager {
        if (!this.instance) this.instance = new RedPointManager();
        return this.instance;
    }


    public rpObj = {};
    public unlockSkill = 0;
    public unlockWing = [];
    public enable = false

    constructor(){

    }

    public initData(){
        var self = this;
        // 	签到没有领
        this.addRedPoint([this.rp('p1'),this.rp('pp1')],function(){
            return false;
        });


        this.renewAll();
    }


    public renewAll()
    {
        this.testIndex(1);//签到
        this.testIndex(2); //	幸运屋

    }

    //解锁技能
    public onUnlockSkill(){
        this.unlockSkill = 1;
        SharedObjectManager.getInstance().setMyValue('unlockSkill',1);
        this.testIndex(7);
    }

    //查看了技能面板
    public viewSkill(){
        this.unlockSkill = 0;
        SharedObjectManager.getInstance().setMyValue('unlockSkill',false);
        this.testIndex(7);
    }



    //测试某个功能的红点
    public testIndex(index){
         this.testRedPoint(this.rp('p' + index));
    }

    //替换原UI的红点
    public replace(mc,name){
        var newMC = this.rp(name);
        newMC.x = mc.x;
        newMC.y = mc.y;
        mc.parent.addChildAt(newMC,mc.parent.getChildIndex(mc));
        MyTool.removeMC(mc);
        return newMC;
    }

    //创建一个显示用的红点
    public rp(name){
        if(this.rpObj[name])
            return this.rpObj[name];
        var mc = new eui.Image()
        mc.source = 'red_dot_png';
        mc.touchEnabled = false;
        this.rpObj[name] = mc;
        return mc;
    }

    //加入红点控制
    public addRedPoint(mcList,fun)
    {
        for(var i=0;i<mcList.length;i++)
        {
            var mc = mcList[i];
            if(!mc.redPointObject)
            {
                mc.redPointObject = {
                    redParent:[],
                    redChild:[],
                    redFun:null
                }
            }
            if(i == 0)
            {
                mc.redPointObject.redFun = fun;
            }
            //加入父类
            if(mcList[i+1])
            {
                if(mc.redPointObject.redParent.indexOf(mcList[i+1]) == -1)
                {
                    mc.redPointObject.redParent.push(mcList[i+1])
                }
            }
            //加入子类
            if(i > 0)
            {
                if(mc.redPointObject.redChild.indexOf(mcList[i-1]) == -1)
                {
                    mc.redPointObject.redChild.push(mcList[i-1])
                }
            }
        }
    }

    //把直系的相关红点点亮
    public testRedPoint(mc,index = 0)
    {
        if(index > 30) //防止死循环
            return;
        var redObj = mc.redPointObject;
        if(!redObj)
            return;
        if(redObj.redChild.length > 0)
        {
            for(var i=0;i<redObj.redChild.length;i++)
            {
                this.testRedPoint(redObj.redChild[i],index+1);
            }
            return;
        }
        //计算并点亮父节点
        if(redObj.redFun)
        {
            mc.visible = redObj.redFun();
            this.lightParent(mc);
        }
    }

    //点亮父节点，冒泡上去
    private lightParent(mc,index = 0){
        if(index > 30) //防止死循环
            return;
        var redObj = mc.redPointObject;
        if(!redObj)
            return;
        for(var i=0;i<redObj.redParent.length;i++)
        {
            var parMC = redObj.redParent[i];
            var b = false;
            for(var j=0;j<parMC.redPointObject.redChild.length;j++)
            {
                b = parMC.redPointObject.redChild[j].visible;
                if(b)
                    break;
            }
            parMC.visible = b;
            this.lightParent(parMC,index + 1);
        }
    }
}