class PVPCtrl extends egret.EventDispatcher {
    private static _instance:PVPCtrl;

    public static getInstance():PVPCtrl {
        if (!this._instance)
            this._instance = new PVPCtrl();
        return this._instance;
    }


    public type = PKManager.TYPE_PVP_ONLINE
    public pkData:any = {
        score:0,
        gameid:UM.gameid,
        pktype:'pvp',
        pkdata:{},
    };

    public constructor() {
        super();
        //PKServerManager.getInstance().addEventListener(GameEvent.pkserver.pair_cancel)
    }

    public isActive(){
        return PKServerManager.getInstance().ctrler == this;
    }

    public onConnect(){
        if(this.pkData)
        {
            //PairingUI.getInstance().show(this.pkData.pkdata.card,this.pkData.pkdata.hero,()=>{
                PKServerManager.getInstance().sendData(GameEvent.pkserver.pair,this.pkData)
            //});
        }
        else
        {
            PKServerManager.getInstance().onReConncet()
        }


    }

    public onPairSuccess(data){
        PKManager.getInstance().startPK(PKManager.TYPE_PVP_ONLINE,data.pkdata,{isOnline:true})

        var other;
        for(var i=0;i<data.pkdata.players.length;i++)
        {
            var player = data.pkdata.players[i]
            if(player.gameid != UM.gameid) {
                other = player;
                break
            }
        }
        //PVPManager.getInstance().pkOnlineStart(other,data.pkdata.seed)
        //EM.dispatchEventWith(GameEvent.client.pvp_change)
    }

    public sendPKResult(isWin,fun?){
        PKServerManager.getInstance().sendData(GameEvent.pkserver.pk_result,{win:isWin},(msg)=>{
            //if(msg.iswin)
            //    PVPManager.getInstance().pkOnlineWin(msg.key,fun)
            //else
            //    PVPManager.getInstance().pkOnlineFail(msg.key,fun)
            PKServerManager.getInstance().close();
        },true)
    }
}