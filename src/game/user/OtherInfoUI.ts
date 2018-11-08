class OtherInfoUI extends game.BaseWindow {
    private static _instance: OtherInfoUI;
    public static getInstance(): OtherInfoUI {
        if(!this._instance)
            this._instance = new OtherInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "OtherInfoUISkin";
    }

    private scroller: eui.Scroller;
    private con: eui.Group;
    private cdGroup: eui.Group;
    private cdText: eui.Label;
    private slaveIcon: eui.Group;
    private slaveBG: eui.Rect;
    private slaveText: eui.Label;
    private headMC: HeadMC;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private proTitleText: eui.Label;
    private coinText: eui.Label;
    private forceText: eui.Label;
    private infoList: eui.List;
    private cardList: eui.List;
    private copyBtn: eui.Group;
    private slaveGroup: eui.Group;
    private list: eui.List;
    private viewBtn: eui.Button;
    private okBtn: eui.Button;
    private copyGroup: eui.Group;
    private btnGroup: eui.Group;
    private t0: OtherInfoChooseItem;
    private t1: OtherInfoChooseItem;
    private t2: OtherInfoChooseItem;
    private t3: OtherInfoChooseItem;
    private t4: OtherInfoChooseItem;














    private gameid;
    private master;
    private masterData;
    private isMyMaster;
    private chooseArray = []
    private copyResult = [];

    private dataArray = new eui.ArrayCollection()

    public childrenCreated() {
        super.childrenCreated();
        //this.bottomUI.setHide(this.hide,this);

        //this.scroller.viewport = this.list;
        this.list.itemRenderer = InfoItem

        //this.cardList.itemRenderer = PosListHeadItem
        this.cardList.dataProvider = this.dataArray

        //this.addBtnEvent(this.okBtn,this.onPK)
        //this.addBtnEvent(this.viewBtn,this.onView)
        //this.addBtnEvent(this.copyBtn,this.onCopy)
        this.addBtnEvent(this.nameText,this.onNameClick)

        this.touchEnabled = false;

        //for(var i=0;i<5;i++)
        //{
        //    var mc = this['t'+i]
        //    mc.data = i;
        //    this.chooseArray.push(mc)
        //    this.addBtnEvent(mc,this.onChooseCopy)
        //}

    }

    private onNameClick(){
        if(!Config.isDebug)
            return;
        MyWindow.Confirm('要切换到该玩家？'+this.gameid,(b)=>{
            if(b==1)
            {
                SharedObjectManager.getInstance().setValue('change_user_gameid',this.gameid)
                MyTool.refresh();
            }
        })
    }

    //private onChooseCopy(e){
    //    var index = e.currentTarget.data;
    //    if(this.copyResult.length == 0)
    //    {
    //        MyWindow.ShowTips('你没拥有任意一张卡牌，无法复制')
    //        return;
    //    }
    //    var hero = [];
    //    for(var i=0;i<this.copyResult.length;i++)
    //    {
    //        if(CM.getCardVO(this.copyResult[i]).isHero())
    //        {
    //            hero.push(this.copyResult[i])
    //            this.copyResult.splice(i,1);
    //            i--;
    //        }
    //    }
    //    if(this.copyResult.length > PosManager.getInstance().maxPosNum())
    //        this.copyResult.length = PosManager.getInstance().maxPosNum()
    //
    //    BasePosUI.getInstance().show('atk',null,{index:index,list:this.copyResult,hero:hero});
    //}
    //
    //private onCopy(){
    //
    //    //把没有的灰掉
    //    var list = this.cardList
    //    var CRM = CardManager.getInstance();
    //    var skillCardNum = {};
    //    this.copyResult = [];
    //    var grayItems = [];
    //
    //    for(var i=0;i<list.numChildren;i++)
    //    {
    //        var item:PosListHeadItem = <PosListHeadItem>list.getChildAt(i)
    //        if(!item.visible)
    //            continue;
    //        var vo = CM.getCardVO(item.data.id || item.data)
    //        var gray;
    //        if(vo.isHero())
    //        {
    //            gray = (HeroManager.getInstance().getHero(vo.id) == 0)
    //            console.log(vo.id,gray)
    //        }
    //        else if(vo.isMonster)
    //            gray = (!CRM.isOwnCard(vo.id))
    //
    //        else
    //        {
    //            gray = (CRM.getSkillNum(vo.id)-(skillCardNum[vo.id] || 0)<=0)
    //            skillCardNum[vo.id] = (skillCardNum[vo.id] || 0) + 1
    //        }
    //
    //
    //        if(!gray)
    //           this.copyResult.push(vo.id);
    //        else
    //            grayItems.push(item)
    //    }
    //
    //    console.log(this.copyResult)
    //    if(this.copyResult.length == 0)
    //    {
    //        MyWindow.ShowTips('你没拥有任意一张卡牌，无法复制')
    //        this.dataArray.refresh()
    //        return;
    //    }
    //
    //    for(var i=0;i<grayItems.length;i++)
    //    {
    //        grayItems[i].setGray(true)
    //    }
    //
    //    this.copyGroup.visible = true;
    //    egret.callLater(()=>{
    //        GameManager.stage.once(egret.TouchEvent.TOUCH_END,()=>{
    //            this.closeCopy();
    //        },this)
    //    },this)
    //
    //    var p = this.copyBtn.localToGlobal(0,0);
    //    p = this.globalToLocal(p.x,p.y,p);
    //    this.copyGroup.y = p.y - 180 + 50;
    //
    //    //显示状态
    //    for(var i=0;i<this.chooseArray.length;i++)
    //    {
    //        this.chooseArray[i].dataChanged();
    //    }
    //
    //}
    //
    //private closeCopy(){
    //    this.copyGroup.visible = false;
    //    this.dataArray.refresh()
    //}
    //
    //private onView(){
    //    var SM =  SlaveManager.getInstance()
    //    if(SM.viewObj[this.gameid])
    //    {
    //        var str = '确定取消对该玩家的关注吗？'
    //        MyWindow.Confirm(str,(b)=>{
    //            if(b==1)
    //            {
    //                SlaveManager.getInstance().deleteView(this.gameid,()=>{
    //                    this.viewBtn.label = '关注';
    //                    this.viewBtn.skinName = 'Btn1Skin'
    //                })
    //            }
    //        })
    //    }
    //    else
    //    {
    //         var len  = ObjectUtil.objLength(SM.viewObj);
    //        if(len >= SM.maxViewNum)
    //        {
    //            MyWindow.Alert('你的关注列表已达上限\n无法关注该玩家')
    //            return;
    //        }
    //        else
    //        {
    //            SlaveManager.getInstance().addView(this.gameid,()=>{
    //
    //                this.viewBtn.label = '取消关注';
    //                this.viewBtn.skinName = 'Btn2Skin'
    //                MyWindow.ShowTips('关注成功！')
    //            })
    //        }
    //    }
    //}
    //
    //private onPK(){
    //    var gameid = this.gameid
    //    var master = this.master
    //    var self = this
    //    var proCD = InfoManager.getInstance().otherInfo[this.gameid].protime - TM.now()
    //    if(proCD < 3600*24)
    //        var proStr  = DateUtil.getStringBySecond(proCD)
    //     else
    //        var proStr = DateUtil.getStringBySeconds(proCD,false,2)
    //    if(this.isMyMaster)
    //    {
    //        if(proCD > 0)
    //        {
    //            MyWindow.Alert('当前镇压时间剩余' + proStr + '\n无法反抗你的主人')
    //            return;
    //        }
    //        PKBeforeUI.getInstance().show({
    //            fun:function(id){
    //                SlaveManager.getInstance().slave_pk_begin(UM.gameid,gameid,id)
    //            }
    //        })
    //    }
    //    else if(this.master == UM.gameid)
    //    {
    //        var str = '确定要释放该奴隶吗？\n释放后1小时内不能再收服！\n'
    //        if(proCD > 0)
    //        {
    //            str += '\n当前镇压时间还剩余' + proStr;
    //        }
    //        MyWindow.Confirm(str,(b)=>{
    //            if(b==1)
    //            {
    //                SlaveManager.getInstance().slave_delete(gameid)
    //            }
    //        })
    //    }
    //    else
    //    {
    //        if(proCD > 0)
    //        {
    //            MyWindow.Alert('当前'+SlaveManager.getInstance().getProtectedWord(this.gameid,this.master)+'时间剩余' + proStr + '\n无法收服其作为你的奴隶')
    //            return;
    //        }
    //        if(SlaveManager.getInstance().getDeleteCD(gameid))
    //        {
    //            MyWindow.Alert('无法收服刚释放奴隶\n离下次收服还剩余：' + DateUtil.getStringBySecond(SlaveManager.getInstance().getDeleteCD(gameid)).substr(-5))
    //            return;
    //        }
    //        if(ObjectUtil.objLength(PosManager.getInstance().defList) == 0)
    //        {
    //            MyWindow.Alert('请先设置防守阵容',()=>{
    //                BasePosUI.getInstance().show('def',0);
    //            });
    //            return;
    //        }
    //
    //        if(gameid != master)
    //        {
    //            PKMasterInfoUI.getInstance().show(this.masterData,this.gameid)
    //            return;
    //        }
    //        PKBeforeUI.getInstance().show({
    //            fun:function(id){
    //                SlaveManager.getInstance().slave_pk_begin(gameid,master,id)
    //            }
    //        })
    //    }
    //
    //
    //}

    public show(gameid?){
        if(!gameid)
            return;
        this.gameid = gameid;
        InfoManager.getInstance().getInfo(gameid,()=>{
            this.superShow()
        })
    }

    public showNick(nick?){
        InfoManager.getInstance().getInfoByNick(nick,()=>{
            this.gameid = InfoManager.getInstance().getIDByNick(nick);
            this.superShow()
        })
    }

    public showUID(uid?){
        InfoManager.getInstance().getInfoByUID(uid,()=>{
            this.gameid = InfoManager.getInstance().getIDByUID(uid);
            this.superShow()
        })
    }

    public superShow(){
        //if(!SlaveManager.getInstance().isSlaveOpen())
        //{
            super.show();
        //    return;
        //}
        //SlaveManager.getInstance().viewList(()=>{
        //    SlaveManager.getInstance().slave_list(()=>{
        //        super.show()
        //    })
        //})
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.scroller.viewport.scrollV = 0;
        this.renew();
        this.onTimer();
        this.addPanelOpenEvent(GameEvent.client.info_change,this.regetInfo)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var data = InfoManager.getInstance().otherInfo[this.gameid]
        if(data && data.protime > TM.now())
        {
            var cd = data.protime - TM.now();
            if(cd < 3600*24)
                var str  = DateUtil.getStringBySecond(cd)
            else
                var str = DateUtil.getStringBySeconds(cd,false,2)
            this.cdText.text = str
            this.con.addChildAt(this.cdGroup,0)

        }
        else
        {
            MyTool.removeMC(this.cdGroup)
        }
    }

    private regetInfo(){
        delete InfoManager.getInstance().otherInfo[this.gameid]
        InfoManager.getInstance().getInfo(this.gameid,()=>{
            this.renew()
        })
    }

    public renew(){
        this.currentState = this.gameid == UM.gameid?'self':'other'
        this.isMyMaster = false
        this.copyGroup.visible = false
        var data = InfoManager.getInstance().otherInfo[this.gameid]
        var slave = InfoManager.getInstance().otherSlave[this.gameid];
        this.nameText.text = '' + data.nick //+ '  LV.' + (data.level||1);
        this.coinText.text = '时产：' + data.hourcoin

        var forceStr = data.tec_force;
        if(UM.tec_force > data.tec_force)
            forceStr = this.createHtml(forceStr,0x66FF66)
        else if(UM.tec_force < data.tec_force)
            forceStr = this.createHtml(forceStr,0xFF3333)

        this.setHtml(this.forceText, '战力：' +  forceStr);
        if(Config.isDebug)
            this.nameText.text += ' ' + data.uid



        var infoArr = [
            {title:'科技等级：',value:'LV.' + (data.level||1)},
            {title:'队伍生命：',value:data.hp + ' 点'},
            {title:'奴隶上限：',value:data.maxslave + ' 个'},
            {title:'手牌上限：',value:data.maxcard + ' 张'},
        ];


        this.infoList.dataProvider = new eui.ArrayCollection(infoArr)
        //this.coinText.text = '产出：' + data.hourcoin + '/小时';
        //this.forceText.text = '战力：'  + data.tec_force;
        this.headMC.setData(data.head,data.type);
        MyTool.setTypeImg(this.typeMC,data.type)

        var slaveList = slave.slave.concat();

        this.slaveIcon.visible = false

        this.master = this.gameid;
        this.masterData = slave.master
        if(slave.master)
        {
            slaveList.unshift(slave.master)
            this.master = slave.master.gameid;
            slave.master.isMaster = true;
            if(this.master == UM.gameid) //同步自己信息
            {
                slave.master.head = UM.head
                slave.master.tec_force = UM.tec_force
                slave.master.hourcoin = UM.hourcoin

                this.slaveIcon.visible = true
                this.slaveBG.fillColor = 0x0000FF
                this.slaveText.text = '奴'
            }
        }
        //while(slaveList.length %3 != 0)
        //    slaveList.push(null)
        this.list.dataProvider = new eui.ArrayCollection(slaveList)
        if(slaveList.length > 0)
            this.con.addChild(this.slaveGroup);
        else
            MyTool.removeMC(this.slaveGroup);

        //console.log(slaveList)

        for(var i=0;i<slaveList.length;i++)
        {
             if(slaveList[i] && slaveList[i].gameid == UM.gameid && this.master != UM.gameid)
             {
                 this.isMyMaster = true;

                 // //同步自己信息
                 slaveList[i].head = UM.head
                 slaveList[i].tec_force = UM.tec_force
                 slaveList[i].hourcoin = UM.hourcoin

                 this.slaveIcon.visible = true
                 this.slaveBG.fillColor = 0xFF0000
                 this.slaveText.text = '主'
                 break;
             }
        }

        if(this.isMyMaster)
        {
            this.okBtn.label = '反抗';
            this.okBtn.skinName = 'Btn1Skin'
        }
        else
        {
            if(this.master == UM.gameid)
            {
                this.okBtn.label = '释放奴隶'
                this.okBtn.skinName = 'Btn2Skin'
            }
            else if(this.master == this.gameid)
            {
                this.okBtn.label = '收服奴隶'
                this.okBtn.skinName = 'Btn1Skin'

            }
            else{
                this.okBtn.label = '抢夺奴隶'
                this.okBtn.skinName = 'Btn9Skin'
            }
        }

        //this.proTitleText.text = '剩余'+SlaveManager.getInstance().getProtectedWord(this.gameid,this.master)+'时间:'


        if(data.last_card)
        {
            var list = data.last_card.split(',');
            if(data.last_hero)
            {
                var hero = data.last_hero.split(',')
                var heroLevel = InfoManager.getInstance().otherInfo[this.gameid].hero_level;
                for(var i=0;i<hero.length;i++)
                {
                    var id = hero[i];
                    hero[i] = {
                        id:id,
                        isHero:true,
                        level:heroLevel?heroLevel[id]:1,
                    }
                }
                list = hero.concat(list)
            }
            this.dataArray.source = list;
        }
        else
        {
            this.dataArray.source = [];
        }
        this.dataArray.refresh()

        //var slaveOpen = SlaveManager.getInstance().isSlaveOpen()
        //if(!slaveOpen)
        //{
        //    MyTool.removeMC(this.viewBtn)
        //}
        //else
        //{
        //    this.btnGroup.addChild(this.viewBtn)
        //    this.viewBtn.label = SlaveManager.getInstance().viewObj[this.gameid]?'取消关注':'关注';
        //    this.viewBtn.skinName = SlaveManager.getInstance().viewObj[this.gameid]?'Btn2Skin':'Btn1Skin'
        //}
        //
        //
        //var slaveFull = !this.isMyMaster &&  this.master != UM.gameid && SlaveManager.getInstance().getCurrentMax()<= SlaveManager.getInstance().slaveList.length
        //if(!slave.self || slaveFull || !slaveOpen) //该玩家未进入过奴隶模块
        //{
        //    MyTool.removeMC(this.okBtn)
        //}
        //else
        //{
        //    this.btnGroup.addChild(this.okBtn)
        //}



    }
}