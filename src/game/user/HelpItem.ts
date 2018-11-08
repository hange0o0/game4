class HelpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HelpItemSkin";
    }

    private text: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        MyTool.setColorText(this.text,this.data.text)
    }

}