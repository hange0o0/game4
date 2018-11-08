class OtherInfoChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BasePosTabSkin";
    }

    private text: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
    }
    public dataChanged()
    {
        this.text.text = this.data + 1;
        //var list = PosManager.getInstance().getListByType('atk')
        //if(list[this.data] && list[this.data].list.length > 0)
        //    this.currentState = 'normal'
        //else
        //    this.currentState = 'empty'
    }

}