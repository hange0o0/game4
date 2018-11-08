class PKFailItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKFailItemSkin";
    }

    private desText: eui.Label;
    private btn: eui.Button;


    public childrenCreated() {
        super.childrenCreated();
        this.btn.visible = false
        this.addBtnEvent(this.btn,this.onClick)
    }

    private onClick() {

    }

    public dataChanged() {
        this.desText.text = this.data.title
    }
}