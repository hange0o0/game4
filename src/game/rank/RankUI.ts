class RankUI extends game.BaseUI {

    private static _instance: RankUI;
    public static getInstance(): RankUI {
        if(!this._instance)
            this._instance = new RankUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private emptyGroup: eui.Group;



    public typeObj = {
        0:{key:'force',name:'战力',title:'战力'},
        1:{key:'hang',name:'战役',title:'关卡'},
        2:{key:'hourcoin',name:'生产',title:'时产'},
        3:{key:'offline',name:'自动场',title:'积分'},
    }
    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('排行榜');

        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = RankItem

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
        //this.topUI.setTitle(this.typeObj[this.tab.selectedIndex].name);
        this.getData();
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.getData();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public getData(){
        this.emptyGroup.visible = false
        this.list.visible = false
       RankManager.getInstance().getServerRank(this.typeObj[this.tab.selectedIndex].key,()=>{
          this.renew();
       })
    }

    public renew(){
        var arr = RankManager.getInstance().getRankList(this.typeObj[this.tab.selectedIndex].key).concat();
        if(arr.length > 0)
        {
            var rank = 0;
            for(var i=0;i<arr.length;i++)
            {
                var oo = arr[i];
                if(!oo)
                {
                    arr.splice(i,1);
                    i--;
                    continue;
                }
                oo.title = this.typeObj[this.tab.selectedIndex].title
                if(oo.gameid == UM.gameid)
                {
                    rank = oo.index;
                }
            }

            //arr.unshift({title:this.typeObj[this.tab.selectedIndex].title})
            if(rank)
                arr.unshift({text:'你的排名：第 '+rank+' 名'})
            else
                arr.unshift({text:'你还没上榜'})


        }
        this.emptyGroup.visible = arr.length == 0;
        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.list.visible = true;
    }
}