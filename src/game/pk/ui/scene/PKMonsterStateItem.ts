class PKMonsterStateItem extends game.BaseItem {

    private mc: eui.Image;




    public index;
    public constructor() {
        super();

        this.skinName = "PKMonsterStateItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        PKAddState.fillStateMC(this.mc,this.data);
    }

}