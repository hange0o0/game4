class AtkMVCtrl {
    private static instance:AtkMVCtrl;

    public static getInstance() {
        if (!this.instance) this.instance = new AtkMVCtrl();
        return this.instance;
    }

    public preLoadMV(id){
        AniManager.getInstance().preLoadMV(id)
    }
    public preLoadPNG(url){
        MyRES.loadGroup([Config.localResRoot +url])
    }
    public preLoadPNGLocal(url){
        MyRES.loadGroup([url])
    }
    public playAniOn(id,mvid){
        if(!PKVideoCon.getInstance().stage)
            return;
        return PKVideoCon.getInstance().playAniOn(id,mvid)
    }

    public mAtkMV(mid,user,target,actionTime,endTime){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['atkMV' + mid])
            this['atkMV' + mid](user,target,actionTime,endTime)
    }
    public mSkillMV(mid,user,target,actionTime,endTime){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['skillMV' + mid])
            this['skillMV' + mid](user,target,actionTime,endTime)
    }

    public sSkillMV(mid,target:PKMonsterData){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['skillMV' + mid])
            this['skillMV' + mid](target)
    }




    ////////////////////////////////////////////////////////////////
    private atkMV1(user,target,actionTime,endTime){
        var mBase = MBase.getData(1)
       this.playAniOn(target.id,mBase.mvID1)
    }


    private atkMV3(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var item = PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime)
        var mc = item.mc;
        mc.source = Config.localResRoot + 'monster/enemy3_attack.png'
        mc.anchorOffsetX = 55/2
        mc.anchorOffsetY = 30/2
        var tw = egret.Tween.get(mc,{loop:true});
        tw.to({rotation:360},300)
    }

    //private atkMV10(user,target,actionTime,endTime){
    //    var mBase = MBase.getData(10)
    //    var mv = this.playAniOn(target.id,mBase.mvID1)
    //    if(mv)
    //    {
    //        mv.scaleX = mv.scaleY = 1;
    //        mv.x -= 10
    //        mv.y -= 30
    //        console.log( mv.scaleX)
    //    }
    //}

    private atkMV31(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,5)
    }

    private atkMV32(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,7)
    }

    private atkMV33(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,1)
    }

    private atkMV34(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,3)
    }

    private atkMV35(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,2)
    }

    private atkMV38(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,9)
    }
    private atkMV43(user,target,actionTime,endTime){
        var mBase = MBase.getData(43)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV44(user,target,actionTime,endTime){
        var mBase = MBase.getData(44)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV45(user,target,actionTime,endTime){
        var mBase = MBase.getData(45)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV46(user,target,actionTime,endTime){
        var mBase = MBase.getData(46)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV47(user,target,actionTime,endTime){
        var mBase = MBase.getData(47)
        this.playAniOn(target.id,mBase.mvID1)
    }

    private atkMV48(user,target,actionTime,endTime){
        var mBase = MBase.getData(48)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc = this.playAniOn(user.id,mBase.mvID1)
        if(mc)
        {
            mc.scaleY = 1;
            if(userItem.x > targetItem.x)
            {
                mc.scaleX = -1
                mc.x -= 30
            }
            else
            {
                mc.scaleX = 1
                mc.x += 30
            }
            mc.y -= 70
        }
    }

    public atkMV61(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV62(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV63(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV64(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createArrow(userItem,targetItem,actionTime,endTime)
    }

    public atkMV68(user,target,actionTime,endTime){
        var AM = AniManager.getInstance();
        var mc = AM.getImg(Config.localResRoot + 'monster/enemy68_attack.png');
        mc.anchorOffsetX = 65/2
        mc.anchorOffsetY = 60/2
        var tw = egret.Tween.get(mc);
        tw.to({rotation:720},200).set({rotation:0}).to({rotation:720,scaleX:0.1,scaleY:0.1},100).call(()=>{
            AM.removeImg(mc);
        })
        var atker = PKVideoCon.getInstance().getItemByID(user.id)
        mc.x = atker.x + user.atkRota * 20
        mc.y = atker.y - 40
        atker.parent.addChildAt(mc,atker.parent.getChildIndex(atker) + 1);
        //PKVideoCon.getInstance().addMCOn(user.id,mc)
    }

    public atkMV70(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV72(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC2 = <BulletAniMC2>(PKBulletManager.getInstance().createBulletAni2(userItem,targetItem,actionTime,endTime))
        mc.mc.anchorOffsetX = 560/4/2
        mc.mc.anchorOffsetY = 90
        mc.targetOffsetY = target.getVO().height/2
        if(userItem.x > targetItem.x)
            mc.mc.scaleX = 1
        else
            mc.mc.scaleX = -1
        mc.mc.load(Config.localResRoot + 'monster/enemy72_attack.png',0,560,90)
        mc.mc.play()
    }

    public atkMV74(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC2 = <BulletAniMC2>(PKBulletManager.getInstance().createBulletAni2(userItem,targetItem,actionTime,endTime))
        mc.mc.anchorOffsetX = 560/4/2
        mc.mc.anchorOffsetY = 90
        mc.targetOffsetY = target.getVO().height/2
        if(userItem.x > targetItem.x)
            mc.mc.scaleX = 1
        else
            mc.mc.scaleX = -1
        mc.mc.load(Config.localResRoot + 'monster/enemy72_attack.png',0,560,90)
        mc.mc.play()
    }

    public atkMV75(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = {
            x: user.x + user.atkRota * user.getSkillValue(1),
            y:user.y
        }
        PKBulletManager.getInstance().createBulletLine(userItem,targetItem,actionTime,endTime,'pk_arrow_1_png')
    }

    public atkMV76(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV111(user,target,actionTime,endTime){
        var mBase = MBase.getData(111)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc = this.playAniOn(user.id,mBase.mvID1)
        if(mc)
        {
            mc.scaleY = 1;
            if(userItem.x > targetItem.x)
            {
                mc.scaleX = -1
                mc.x -= user.atkX
            }
            else
            {
                mc.scaleX = 1
                mc.x += user.atkX
            }
            mc.y -= 90
        }
    }
    public atkMV112(user,target,actionTime,endTime){
        var mBase = MBase.getData(112)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc = this.playAniOn(user.id,mBase.mvID1)
        if(mc)
        {
            mc.scaleY = 1;
            if(userItem.x > targetItem.x)
            {
                mc.scaleX = -1
                mc.x -= user.atkX
            }
            else
            {
                mc.scaleX = 1
                mc.x += user.atkX
            }
            mc.y -= 90
        }
    }


    ////////////////////////////////////////////////////////////////
    public skillMV1(user,target,actionTime,endTime){
        this.atkMV1(user,target,actionTime,endTime)
    }

    public skillMV3(user,target,actionTime,endTime){
        this.atkMV3(user,target,actionTime,endTime)
    }

    public skillMV8(user,target,actionTime,endTime){
        var mBase = MBase.getData(8)
        this.playAniOn(target.id,mBase.mvID1)
    }

    //技能动画
    public skillMV10(user,target,actionTime,endTime){
        var mBase = MBase.getData(10)
        var mv = this.playAniOn(target.id,mBase.mvID1)
        if(mv)
        {
            //mv.scaleX = mv.scaleY = 0.8;
            //mv.x -= 10
            mv.y -= 40
        }

    }

    private skillMV38(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,10)
    }







    ////////////////////////////////////////////////////////////////
    public skillMV101(user,target,actionTime,endTime){
        var mBase = MBase.getData(101)
        if(user.useingHeroSkill == 4)
            this.playAniOn(target.id,mBase.mvID1)
    }
    public skillMV102(user,target,actionTime,endTime){
        //var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        //var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        //PKBulletManager.getInstance().createArrow(userItem,targetItem,actionTime,endTime)

        //var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var id = [1,6,3,2,5][Math.min(4,user.level)]
        PKBulletManager.getInstance().createBullet(null,targetItem,actionTime,endTime,id)
    }

    public skillMV108(user,target,actionTime,endTime){
        var mBase = MBase.getData(108)
        if(user.useingHeroSkill == 3 || user.useingHeroSkill == 2)
            this.playAniOn(target.id,mBase.mvID1)
    }

    //技能动画
    public skillMV116(user,target,actionTime,endTime){
        var mBase = MBase.getData(116)
        if(user.useingHeroSkill == 3 || user.useingHeroSkill == 4)
        {
            var mv = this.playAniOn(target.id,mBase.mvID1)
            mv && (mv.y -= 40);
        }
    }

    public skillMV114(user,target,actionTime,endTime){
        var mBase = MBase.getData(114)
        var mvMC = this.playAniOn(target.id,mBase.mvID1)
        mvMC.y -= target.getVO().height/2
    }

}