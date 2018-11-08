class PayManager {
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }
    public diamondBase = {
        '101':{'cost':6,'diamond':60},
        '102':{'cost':30,'diamond':305},
        '103':{'cost':100,'diamond':1024},
        '104':{'cost':680,'diamond':6980},
        '105':{'cost':1,'diamond':1}
    }
    public diamondList

    public shopData
    public shopTime
    public openShopTime

    public constructor() {
        this.diamondList = [];
        for(var s in this.diamondBase)
        {
            var oo =  this.diamondBase[s];
            oo.id = s;
            this.diamondList.push(oo);
        }

        this.openShopTime = SharedObjectManager.getInstance().getMyValue('open_shop_time') || 0
    }

    public getShopDiamond(data){
        return Math.floor(data.diamond*((data.times || 0)*0.2 + 1))
    }

    public isRed(){
        return !DateUtil.isSameDay(this.openShopTime)
    }

    public get_shop(fun?){
        if(this.shopTime && DateUtil.isSameDay(this.shopTime))
        {
            if(fun)
                fun()
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.pay.get_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("商店数据异常，错误码：" + msg.fail);
                return;
            }
            this.shopData = msg.shop;
            this.shopTime = TM.now();
            if(fun)
                fun();
        });
    }


    public buy_shop(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.buy_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail == 101)
            {
                MyWindow.Alert("购买失败，你目前的技能已满");
                return
            }
            if(msg.fail == 102)
            {
                MyWindow.Alert("购买失败，你目前的英雄已满");
                return
            }
            if(msg.fail)
            {
                MyWindow.Alert("购买失败，错误码：" + msg.fail);
                this.shopTime = 0;
                this.get_shop(()=>{
                    ShopUI.getInstance().renew();
                })
                return;
            }
            for(var i=0;i<this.shopData.length;i++)
            {
                if(this.shopData[i].key == id)
                {
                    this.shopData[i].times  = (this.shopData[i].times || 0) + 1;
                    break;
                }
            }
            AwardUI.getInstance().show(msg.award)
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
            if(fun)
                fun();
        });
    }

    public add_diamond(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.add_diamond,oo,(data) =>{
            var msg = data.msg;
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
            if(fun)
                fun();
        });
    }
}

