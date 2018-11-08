class ShopDiamondItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopDiamondItemSkin";
    }

    private diamondText: eui.Label;
    private costText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        PayManager.getInstance().add_diamond(this.data.id,()=>{
            MyWindow.ShowTips('增加钻石成功！')
        })
    }

    public dataChanged(){
        this.diamondText.text = '×' + this.data.diamond;
        this.costText.text = '￥' + this.data.cost;
    }

}