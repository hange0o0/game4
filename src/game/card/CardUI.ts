class CardUI extends game.BaseUI {

    private static _instance: CardUI;
    public static getInstance(): CardUI {
        if(!this._instance)
            this._instance = new CardUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    public list: eui.List;
    private tab: eui.TabBar;
    private emptyGroup: eui.Group;




    //private monsterType = 0
    //private skillType = 0
    private dataArray = new eui.ArrayCollection()

    //public isFirst = true

    public constructor() {
        super();
        this.skinName = "CardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CardItem
        this.list.dataProvider = this.dataArray
        //this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        //this.addBtnEvent(this.skillBtn,this.onSkill)
        //this.selectType = 0;

        //this.prop102.source = PropVO.getObject(102).getThumb()
        //this.prop103.source = PropVO.getObject(103).getThumb()
        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    //private onSkill(){
    //    if(PropManager.getInstance().getNum(102) == 0)
    //    {
    //        MyWindow.Alert(PropVO.getObject(102).propname + '不足')
    //        return;
    //    }
    //    CardManager.getInstance().card_draw(()=>{
    //    })
    //}

    private onTab(){
        //this.renewDownList();
        this.renewList();
    }

    //private onDownListSelect(){
    //    if(this.tab.selectedIndex == 0)
    //        this.monsterType = this.downList2.selectValue;
    //    else
    //        this.skillType = this.downList2.selectValue;
    //    this.renewList();
    //}

    //private renewDownList(){
    //    //this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
    //    if(this.tab.selectedIndex == 0)
    //    {
    //        var arr = [
    //            {label:'全部',label2: 'x' + CardManager.getInstance().getTotalMonsterList(0).length,data:0,icon: 'monster_all_icon_png'},
    //            {label:PKConfig.TYPENAME[1],label2: 'x' + CardManager.getInstance().getTotalMonsterList(1).length,data:1,icon: 'icon_type1_png'},
    //            {label:PKConfig.TYPENAME[2],label2: 'x' + CardManager.getInstance().getTotalMonsterList(2).length,data:2,icon: 'icon_type2_png'},
    //            {label:PKConfig.TYPENAME[3],label2: 'x' + CardManager.getInstance().getTotalMonsterList(3).length,data:3,icon: 'icon_type3_png'}];
    //        this.downList2.setData(arr,this.monsterType);
    //    }
    //    else
    //    {
    //        var arr = [
    //            {label:'全部',label2: 'x' + CardManager.getInstance().getTotalSkillList(0).length,data:0,icon:'skill_all_icon_png'},
    //            {label:PKConfig.SKILLTYPENAME[1],label2: 'x' + CardManager.getInstance().getTotalSkillList(1).length,data:1,icon: 'skill_type1_png'},
    //            {label:PKConfig.SKILLTYPENAME[2],label2: 'x' + CardManager.getInstance().getTotalSkillList(2).length,data:2,icon: 'skill_type2_png'},
    //            {label:PKConfig.SKILLTYPENAME[3],label2: 'x' + CardManager.getInstance().getTotalSkillList(3).length,data:3,icon: 'skill_type3_png'},
    //            {label:PKConfig.SKILLTYPENAME[4],label2: 'x' + CardManager.getInstance().getTotalSkillList(4).length,data:4,icon: 'skill_type4_png'},
    //            {label:PKConfig.SKILLTYPENAME[5],label2: 'x' + CardManager.getInstance().getTotalSkillList(5).length,data:5,icon: 'skill_type5_png'}];
    //        this.downList2.setData(arr,this.skillType);
    //    }
    //}


    public hide() {
        super.hide();
    }

    public onShow(){
        this.tab.validateNow();
        this.renewTabRed();
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.card_change,this.justRenewList)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewTabRed)
    }

    private renewTabRed(){
       this.tab.getChildAt(0)['redMC'].visible = CardManager.getInstance().isRed(1)
       this.tab.getChildAt(1)['redMC'].visible = CardManager.getInstance().isRed(2)
       this.tab.getChildAt(2)['redMC'].visible = CardManager.getInstance().isRed(3)
    }

    public showFinish(){
        GuideManager.getInstance().testShowGuide()
    }

    public justRenewList(){
        MyTool.renewList(this.list)
        //if(this.tab.selectedIndex == 1)
        //    this.renewSkillInfo();
    }

    public renew(){
        //this.renewDownList();
        this.renewList();
    }

    private renewList(){
        var CRM = CardManager.getInstance();
        var type = this.tab.selectedIndex + 1;
        var arr;
        //if(type <= 3)
        //{
            arr =CRM.getOpenMonsterList(type)
            this.currentState = 'monster'
            ArrayUtil.sortByField(arr,['isLock','cost','level','id'],[0,0,0,0]);
        //}
        //else
        //{
        //    this.currentState = 'skill'
        //    arr = CRM.getMySkillList(0)
        //    ArrayUtil.sortByField(arr,['cost','level','id'],[0,0,0]);
        //}

        this.dataArray.source = arr;
        this.dataArray.refresh()
        this.emptyGroup.visible = arr.length == 0
        //this.list.dataProvider = new eui.ArrayCollection(arr)

    }

    public getCurrentList(){
        return  this.dataArray.source;
    }

    /*private renewSkillInfo(){
        var CRM = CardManager.getInstance();
        var type = this.downList2.selectValue;
        var max = CRM.getOpenSkillList(type).length
        var now = CRM.getMySkillList(type).length
        this.valueText.text = '×' + PropManager.getInstance().getNum(102)
        this.valueText2.text = '×' + PropManager.getInstance().getNum(103)
        this.desText.text = '收集度：' +  now + '/' + max;
        if(now>=max)
        {
            this.skillBtn.skinName = 'Btn2Skin'
            this.skillBtn.touchEnabled = false
        }
        else
        {
            this.skillBtn.skinName = 'Btn1Skin'
            this.skillBtn.touchEnabled = true
        }
    }*/
}