class BasePanel extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "BasePanelSkin";
    }

    private bottomGroup: eui.Group;
    private nameText: eui.Label;


    public setTitle(title){
       this.nameText.text = title
    }

    public setBottomHeight(v){
       this.bottomGroup.height = v
    }
}