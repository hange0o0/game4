class DebugSkillList extends game.BaseUI {
    private static instance:DebugSkillList;
    public static getInstance() {
        if (!this.instance) this.instance = new DebugSkillList();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DebugSkillListSkin";
        this.LoadFiles = ['ani'];
    }

    private scroller: eui.Scroller;
    private list: eui.List;


    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.itemRenderer = DebugSkillItem
    }

    public show(data?){
        super.show();

    }

    public onShow(){
        var list = [
            6,136,16,
            10,157,177,28,
            108,158,
            30,109,119,126,134,
            112,116,120,161,
            102,105,113,149,
            15,21,22,14,27,111,175,176,200

        ]


        var arr = [];
        //var noArr = [1,2,155,156,169,101,171,165]
        for(var i=1;i<list.length;i++)
        {
            //if(!RES.hasRes('skill' + i + '_json'))
            //    continue;
            //
            ////if(noArr.indexOf(i) == -1)
                arr.push('skill' + i);
        }
        //for(var i=0;i<list.length;i++)
        //{
        //    arr.push('skill' + list[i]);
        //}
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}