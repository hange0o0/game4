class SyncDataManager{
    private static _instance:SyncDataManager;
    public static getInstance():SyncDataManager {
        if (!this._instance)
            this._instance = new SyncDataManager();
        return this._instance;
    }

    public lastConnectTime;

    public snyc(data){
        var ss;
        this.lastConnectTime = TM.now();
        UM.closeVersion = data.close_version
        UM.closeTime = data.close_time
        for(var s  in  data)
        {
            var value = data[s];
            switch(s)
            {
                case 'sync_energy':
                    UM.energy = value;
                    this.dispatch(GameEvent.client.energy_change);
                    break;
                case 'sync_coin':
                    UM['coin'] = value;
                    //if(UM.getCoin()<0)
                    //{
                    //     sendClientError('金币负数：' + JSON.stringify(data) + '|'+TM.now() +"|" + SlaveManager.getInstance().getMasterTime())
                    //}
                    this.dispatch(GameEvent.client.coin_change);
                    break;
                case 'sync_diamond':
                    UM.diamond = value;
                    this.dispatch(GameEvent.client.diamond_change);
                    break;
                //case 'sync_opendata':
                //    UM.openData = value;
                //    if(data.mail_award)
                //    {
                //        MailManager.getInstance().serverAward++;
                //        this.dispatch(GameEvent.client.red_change)
                //    }
                //    UM.onOpenDataChange()
                //    break;
                //case 'sync_prop':
                //    for(ss in value)
                //    {
                //        PropManager.getInstance().props[ss] = value[ss] || 0;
                //    }
                //    this.dispatch(GameEvent.client.prop_change);
                //    break;
                //case 'sync_tec_force':
                //    UM.tec_force = value;
                //    this.dispatch(GameEvent.client.force_change);
                //    break;
                //case 'sync_hourcoin':
                //    UM.hourcoin = value;
                //    this.dispatch(GameEvent.client.hourcoin_change);
                //    break;
                //
                //case 'sync_tec':
                //    for(ss in value)
                //    {
                //        TecManager.getInstance().tecData[ss] = value[ss];
                //    }
                //    UM.level = TecManager.getInstance().getLevel(1);
                //    this.dispatch(GameEvent.client.tec_change);
                //    break;
                //case 'sync_skill':
                //    for(ss in value)
                //    {
                //        CardManager.getInstance().skillList[ss] = value[ss] || 0;
                //    }
                //    break;
                //case 'sync_hero':
                //    for(ss in value)
                //    {
                //        HeroManager.getInstance().heroData[ss] = value[ss] || 0;
                //    }
                //    this.dispatch(GameEvent.client.hero_change);
                //    break;
                //case 'sync_herolv':
                //    for(ss in value)
                //    {
                //        HeroManager.getInstance().heroLVData[ss] = value[ss] || 0;
                //    }
                //    this.dispatch(GameEvent.client.hero_change);
                //    break;

                case 'sync_task':
                    for(ss in value)
                    {
                        ActiveManager.getInstance().task[ss] = value[ss];
                    }
                    this.dispatch(GameEvent.client.task_change);
                    break;

            }
        }
    }

    private dispatch(event){
        egret.callLater(()=>{
            EM.dispatch(event);
        },this)
       
    }
}
