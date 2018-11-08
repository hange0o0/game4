class CardImg extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "CardImgSkin";
    }

    private img: eui.Image;
    private typeMC: eui.Image;





    public hideType = false
    public lastSource;
    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
        this.changeGay(false)
    }

    public changeGay(b){
        var vo =  CM.getCardVO(this.data);
        var source = vo.getImage(b);
        if(source != this.lastSource)
        {
            this.img.source = source
            this.lastSource = source;
            this.typeMC.visible = this.data > PKConfig.skillBeginID && !this.hideType;
            this.typeMC.source = vo.getTypeIcon();
        }
    }

}