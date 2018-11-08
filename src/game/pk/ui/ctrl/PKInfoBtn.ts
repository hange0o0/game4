class PKInfoBtn extends game.BaseItem {

    private type: eui.Image;
    private selfIcon: eui.Image;
    private info: eui.Label;
    public constructor() {
        super();

        this.skinName = "PKInfoBtnSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClick,this)
    }

    private onClick(){
        if(GuideManager.getInstance().isGuiding && GuideManager.getInstance().guideKey != "pk")
        {
            return;
        }
        var p = this.localToGlobal(0,0)
        var PD = PKData.getInstance()
        PKMonsterInfoUI.getInstance().show(PD.myPlayer,PD.otherPlayer,p)
    }

    public dataChanged(){
        if(!this.data)
        {
            return;
        }
        var PD = PKData.getInstance()
        var player:PKPlayerData = this.data;

        this.type.source = 'icon_type'+player.type+'_png'
        this.selfIcon.visible = player == PD.myPlayer;
        this.info.text = 'x' + PD.getMonsterSpaceByPlayer(player.id);
    }
}