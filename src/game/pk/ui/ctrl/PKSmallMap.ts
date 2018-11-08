class PKSmallMap extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "PKSmallMapSkin";
    }

    private smallMap: eui.Group;


    private mapItemArr = []
    private mapPoolArr = []

    private rate
    public childrenCreated() {
        super.childrenCreated();
        this.touchEnabled = this.touchChildren = false

        this.rate = (300-80)/PKConfig.floorWidth
    }


    public onTimer(){
        var PD = PKData.getInstance();
        var len = Math.max(this.mapItemArr.length,PD.monsterList.length);
        for(var i=0;i<len;i++)
        {
            var mc = this.mapItemArr[i];
            var data:PKMonsterData = PD.monsterList[i];
            if(!mc)
            {
                mc = this.mapPoolArr.pop();
                if(!mc)
                {
                    mc = new eui.Rect()
                    this.mapItemArr.push(mc)
                    this.smallMap.addChild(mc);
                }
            }
            if(data)
            {
                mc.x = (data.x - PKConfig.appearPos)*this.rate + 40
                mc.y = data.y/2 + 55/2
                if(data.mid == 99)
                {
                    mc.fillColor =0xffff00
                    mc.width = mc.height = 8
                    mc.x -= 4
                    mc.y -= 4
                }
                else
                {
                    mc.fillColor = data.atkRota == PKConfig.ROTA_LEFT?0x5959FF:0xFF0000
                    mc.width = mc.height = 4
                    mc.x -= 2
                    mc.y -= 2
                }
            }
            else
            {
                this.mapPoolArr.push(mc);
                MyTool.removeMC(mc);
                this.mapItemArr.splice(i,1);
                i--;
                len --;
            }
        }
    }
}