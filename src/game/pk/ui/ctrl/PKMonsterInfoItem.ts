class PKMonsterInfoItem extends game.BaseItem {

    private bar1: eui.Rect;
    private bar2: eui.Rect;
    private text: eui.Label;
    private teamMC: eui.Image;






    public constructor() {
        super();

        this.skinName = "PKMonsterInfoItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        var data = this.data;
        var w = 170;
        //this.typeMC.source = 'icon_type'+data.type+'_png';
        this.teamMC.visible = data.type == data.self;
        this.text.text = data.s1
        var max = Math.max(data.max,15);
        this.bar1.width = 20 + data.s1/max*w;
        this.bar2.width = data.s2/max*w;
        if(data.s2)
        {
            this.text.text += '+' + data.s2
        }
        this.onTimer();
    }

    public onTimer(){

    }
}
