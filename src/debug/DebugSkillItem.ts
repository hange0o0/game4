class DebugSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugSkillItemSkin";
    }

    private skillName: eui.Label;


    private mv;
    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }


    public dataChanged(){
        var key = this.data;
        var AM = AniManager.getInstance();
        if(this.mv)
            AM.removeMV(this.mv);
        var mv = this.mv = AM.getAni(this.data);
        mv.x = 100;
        mv.y = 100;
        this.addChild(mv);
        var config = AM.mvConfig[key.substr(5)]
        if(config)
        {
            if(config.scale)
            {
                mv.scaleX = mv.scaleY = config.scale;
            }
            if(config.frameRate)
                mv.frameRate = config.frameRate;
        }
        this.skillName.text = this.data;
    }
}
