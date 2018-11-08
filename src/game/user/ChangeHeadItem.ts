class ChangeHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ChangeHeadItemSkin";
    }

    private headMC: HeadMC;
    private chooseMC: eui.Image;




    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        this.chooseMC.visible = UM.head == this.data;
        this.touchChildren = this.touchEnabled = !this.chooseMC.visible;
        this.headMC.setData(this.data,0);

    }

}