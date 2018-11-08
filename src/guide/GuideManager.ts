/**
 *
 * @author 
 *
 */
class GuideManager {
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:boolean = false;

    public temp;


    public guideKey;
    public guideStep = 0;

    public guideRandom = 0;
    public guidePK = 0;


    private guideArr = [];
    public constructor() {
        this.init();
    }

    public static getInstance(): GuideManager {
        if(!this._instance)
            this._instance = new GuideManager();
        return this._instance;
    }

    public testShowGuide(){
        if(this.isGuiding)
        {
           this.showGuide()
        }
    }

    public enableScrollV(scroller){
        scroller.scrollPolicyV = this.isGuiding? eui.ScrollPolicy.OFF:eui.ScrollPolicy.AUTO
    }

    public showGuide(){
        if(!this.isGuiding)
            return;
        this.guideKey = ''
        MyTool.stopClick(300);
        egret.callLater(this.guideFun,this);
    }

    public reInit(){
        this.guideRandom = 0;
        this.guidePK = 0;
        this.guideArr[0].text = '(代号)['+UM.nick+']您好，欢迎来到[【冲破防线】]！我是你的引路人[铁牛]。'
    }

    private init(){
        var self = this;
        //            hideHand:false,
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return MainFightUI.getInstance().mapBtn.openBtn},
        //    text:'来不及多解释了，赶快出战吧！',
        //})
        //
        //this.addGuideObj({
        //    text:'出战前可拖动卡牌进行顺序调整，位置靠前的卡牌会有更大机率在早期被抽到。',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    toBottom:100,
        //    mc:function(){return BasePosUI.getInstance().mainPKBtn},
        //    text:'现在这个顺序就挺合适的，我们直接开始吧！',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkTop.con},
        //    text:'这是对方出牌的记录区，顺序记录了敌人所有出过的卡牌。',
        //    guideKey:'pkTop',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().scroller},
        //    text:'这是战场，对战双方会在这里短兵相接，你来我往，争取胜机。',
        //    guideKey:'scroller',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkCtrlCon.cardGroup},
        //    text:'这是手牌区,里面是玩家可选择出战的卡牌。',
        //    guideKey:'cardGroup',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkCtrlCon.overMC},
        //    text:'这是出战区，放在出战区的卡牌会按其效果在战场上起到相应作用。',
        //    guideKey:'overMC',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkCtrlCon.costGroup},
        //    text:'这是手牌能量,上阵不同的卡牌需耗费不同的能量。',
        //    guideKey:'cost',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkCtrlCon.cardObj[1]},
        //    text:'请选择一张需要上阵的卡牌。',
        //    guideKey:'card',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkCtrlCon.overMC},
        //    text:'点击出战区，可把所选卡牌上阵。玩家也可以通过[拖放]到[出战区]或[战场]上实现此操作',
        //    guideKey:'addCard',
        //})
        //
        //this.addGuideObj({
        //    text:'当战斗卡牌被放入[出战区]时，会有[3秒]的准备时间，准备时间过后，卡牌才会生效。',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    text:'由此可见，对战时的预判能力非常重要。现在你可以继续放入手牌。',
        //    fun:function(){
        //        PKingUI.getInstance().showCountDown()
        //        GuideUI.getInstance().hide();
        //    }
        //})
        //
        ////this.addGuideObj({
        ////    mc:function(){return PKVideoCon.getInstance().getItemByID(1).monsterMV.getRect()},
        ////    text:'这是防御石,所有攻击其的单位，都会为已方队伍赚取防御积分，增加队伍的防御属性',
        ////    guideKey:'diamondMonster',
        ////    fun:function(){
        ////        self.showGuide()
        ////    }
        ////})
        //
        //this.addGuideObj({
        //    mc:function(){return PKingUI.getInstance().pkTop.hpGroupIcon},
        //    text:'这是队伍生命,当被敌人冲破出生点后就会扣除相应生命值，生命值降为0时战斗失败。',
        //    guideKey:'hp',
        //    fun:function(){
        //        self.showGuide()
        //        TaskManager.getInstance().showGuideMC(PKingUI.getInstance().pkCtrlCon.tipsMC)
        //    }
        //})
        //
        //this.addGuideObj({
        //    text:'请注意右下角显示的兵种相克关系,现在就开始你的表演吧！',
        //    guideKey:'pk',
        //    fun:function(){
        //        PKingUI.getInstance().setStop(false);
        //        GuideUI.getInstance().hide();
        //    }
        //})
        //////////////////////////////////////
        //this.addGuideObj({
        //    mc:function(){return MainFightUI.getInstance().forceGroup},
        //    text:'随着战役的推进，遇到的敌人会越来越强，我们必需增强自身的实力以应对各种情况。',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return TecUI.getInstance().list.getChildAt(0)},
        //    text:'我们可通过升级战力科技提升[所有卡牌]的战力。',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return TecInfoUI.getInstance().okBtn},
        //    nearMC:true,
        //    text:'只要资源足够，马上升级吧。一次提升，处处可用！',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return TecInfoUI.getInstance().cancelBtn},
        //    text:'战力提升是增强自身最有效的办法，除此之外。。',
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return MainUI.getInstance().bottomItems[3]},
        //    text:'。。拥有更多的卡牌，可让你在对战中有着更大的操作空间',
        //})
        //this.addGuideObj({
        //    mc:function(){return CardUI.getInstance().list.getChildAt(2)},
        //    text:'点击未解锁的随从卡牌进行解锁',
        //})
        //this.addGuideObj({
        //    mc:function(){return CardInfoUI.getInstance().okBtn},
        //    nearMC:true,
        //    text:'解锁后你就可以在进攻和防守阵容中使用该随从卡牌了',
        //})
        ////this.addGuideObj({
        ////    mc:function(){return CardInfoUI.getInstance().closeBtn},
        ////    text:'当你的主科技等级提升时，你可以获得更多的未解锁卡牌',
        ////})
        //
        //////////////////////////////////////
        //
        //this.addGuideObj({
        //    text:'游戏的基本玩法介绍，到这里就暂告一段落了。',
        //    fun:function(){
        //        self.showGuide();
        //    }
        //})
        ////
        ////this.addGuideObj({
        ////    text:'但游戏内还有其它好玩功能，需要玩家您慢慢探索。如有需要，可点击界面内的帮助按钮查看相关说明。',
        ////    fun:function(){
        ////        self.showGuide()
        ////    }
        ////})
        //
        ////this.addGuideObj({
        ////    text:'我觉得以您的智慧，应该也不再需要我的手把手教学了吧？',
        ////    fun:function(){
        ////        self.showGuide()
        ////    }
        ////})
        //
        //this.addGuideObj({
        //    text:'加油前进吧，后面还有更精彩的内容等着你呢！',
        //    fun:function(){
        //        self.endGuide()
        //        CardInfoUI.getInstance().hide();
        //        MainUI.getInstance().onBottomSelect(2);
        //        EM.dispatch(GameEvent.client.task_change);
        //
        //        setTimeout(()=>{
        //            TaskManager.getInstance().showGuideMC(MainFightUI.getInstance().taskGroup)
        //        },1000)
        //
        //    }
        //})
    }

    private endGuide(){
        this.isGuiding = false;
        GuideUI.getInstance().hide();
    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var guideData:any = {};
        guideData.mc = data.mc;
        //if(guideData.mc && typeof guideData.mc == 'string')
        //    guideData.mc = eval(guideData.mc);
        if(guideData.mc && typeof guideData.mc == 'function')
            guideData.mc = guideData.mc();
        guideData.fun = data.fun;
        guideData.text = data.text;
        guideData.toBottom = data.toBottom;
        guideData.nearMC = data.nearMC;
        guideData.hideHand = data.hideHand || false;

        this.guideKey = data.guideKey

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = GameManager.stage.stageHeight - 140 -260//Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = 140//(GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

    private getMainGameRect(){
        return new egret.Rectangle(0,80,640,390);
    }

    private getMainGameRect2(){
        return new egret.Rectangle(0,80+390,640,GameManager.stage.stageHeight-80-100-390);
    }
    private getCardInfoCloseRect(){
        var mc = CardInfoUI.getInstance().closeBtn
        var topY = mc.parent.localToGlobal(0,mc.y).y
        return new egret.Rectangle(0,topY,640,GameManager.stage.stageHeight - topY);
    }


}
