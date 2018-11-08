class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public gameid: string = _get['gameid'] || 'test';
    public landid: string;

    public hourcoin: number;
    public nick: string;
    public head: string;
    public type: number;

    public diamond: number;
    public uid: number;
    public level: number;
    public opentime: number;
    public tec_force:number;
    public last_land: number;

    public energy: any;
    public openData: any;
    public pk_common: any;
    public coin: number;


    public maxEnergy = 60;
    public maxLevel = 50;

    public closeVersion = 0;
    public closeTime = 0;


    public fill(data:any):void{
        this.gameid = data.gameid;
        this.landid = data.land_key;
        this.nick = data.nick;
        this.head = data.head;
        this.uid = data.uid;
        this.type = data.type;
        this.pk_common = data.pk_common;
        this.hourcoin = data.hourcoin;
        this.coin = data.coin;
        this.opentime = data.opentime;
        this.level = data.level;
        this.tec_force = data.tec_force;
        this.last_land = data.last_land;
        this.diamond = data.diamond;
        this.energy = data.energy; //  '{"v":0,"t":0,"rmb":0}'
        this.openData = data.openData; //  '{"v":0,"t":0,"rmb":0}'



        CardManager.getInstance().init(data.card)
        //PosManager.getInstance().init(data)
        //HangManager.getInstance().init(data.hang)
        ActiveManager.getInstance().init(data.active)
        //TecManager.getInstance().init(data.tec)
        //PropManager.getInstance().init(data.prop)
    }


    //public onOpenDataChange(){
    //    var mailTime = UM.openData.mailtime
    //    var slaveTime = UM.openData.slavetime
    //    if(SlaveManager.getInstance().lastGetSlaveTime && slaveTime > SlaveManager.getInstance().lastGetSlaveTime)
    //    {
    //        SlaveManager.getInstance().lastGetSlaveTime = 0
    //        if(SlaveUI.getInstance().stage)
    //        {
    //            SlaveManager.getInstance().slave_list(()=>{
    //                SlaveUI.getInstance().renew();
    //            })
    //        }
    //    }
    //    if(mailTime > MailManager.getInstance().mailData.msgtime)
    //    {
    //        MailManager.getInstance().mailData.time = 0
    //        PKManager.getInstance().getRecordTime = 0
    //
    //    }
    //}



    public testDiamond(v){
        if(UM.diamond < v)
        {
            MyWindow.Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.diamond + '\n是否前往购买钻石？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show(true);
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
    public testCoin(v){
        var coin = UM.coin;
        if(coin < v)
        {
            MyWindow.Confirm('金币不足！\n需要：' +v+'\n当前：'+coin + '\n是否前往购买金币？',function(v){
                if(v == 1)
                {
                    //ShopUI.getInstance().show('coin');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
}
                                