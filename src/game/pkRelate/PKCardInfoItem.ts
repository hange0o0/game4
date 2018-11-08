class PKCardInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKCardInfoItemSkin";
    }

    private rect: eui.Rect;
    private barMC: eui.Rect;
    private icon: eui.Image;
    private text: eui.Label;







    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        this.barMC.visible = false
        var arr = [1,4,5,8]
        if(arr.indexOf(this.data.index) != -1)
            this.currentState = 'stat1'
        else
            this.currentState = 'stat2'
        //{index:1,icon:'icon_cost_png',iconScale:1,title:'费用',value:vo.cost,valueAdd:0},
        this.icon.source = this.data.icon
        this.icon.scaleX = this.icon.scaleY = this.data.iconScale
        if(this.data.title)
        {
            this.rect.visible = true
            this.setHtml(this.text, this.createHtml(this.data.title,0xFFB17C) + '：' +  this.data.value
                + (this.data.valueAdd ? this.createHtml(' +'+this.data.valueAdd,0xFFB17C) : ''))
        }
        else
        {
            this.rect.visible = false
            this.text.text = ''
        }

        if(this.data.rate)
        {
            this.barMC.visible = true;
            this.barMC.width = this.data.rate * 205;
        }

    }

}