class TickerManager {
    public constructor() {
        this.ticker = egret.Ticker.getInstance();
    }
    private static _instance: TickerManager;

    private funArr: Array<any> = [];
    private ticker: egret.Ticker;
    private isFirst:boolean = false;

    public static getInstance(): TickerManager {
        if(!TickerManager._instance)
            TickerManager._instance = new TickerManager();
        return TickerManager._instance;
    }

    public setTickerOnce(fun: Function,time: number,thisObject: any): any {
        //        var t = { fun: fun,time: time,times: 1,currentTime: time ,thisObject:thisObject}
        //        this.funArr.push(t);
        return this.setTicker(fun,time,thisObject,1);
    }

    public setTicker(fun: Function,time: number,thisObject: any,times?: number): any {
        if(this.funArr.length == 0) {
            this.ticker.register(this.onTick,this);
        }
        var t = {
            fun: fun,
            time: time,
            times: (!times || times <= 0) ? -1 : times,
            currentTime: time,
            thisObject: thisObject
        }
        this.funArr.push(t);


        return t;
    }

    public clearTicker(t: any) {
        if(!t) return;
        var arr = this.funArr;
        if(arr.length == 0 || !t) return;
        for(var i = 0;i < arr.length;i++) {
            if(arr[i] == t) {
                arr.splice(i,1);
                return;
            }
        }

        if(this.funArr.length == 0) {
            this.ticker.unregister(this.onTick,this);
        }
    }

    private onTick(dt: number) {
        if(!this.isFirst)
        {
            this.isFirst = true;
            return;
        }
        var arr = this.funArr;
        if(arr.length) {
            var obj: any;
            for(var i = arr.length - 1;i >= 0;i--) {
                obj = arr[i];
                obj.currentTime -= dt;
                if(obj.currentTime <= 0) {
                    obj.fun.call(obj.thisObject);
                    obj.currentTime = obj.time;
                    if(obj.times == 1) {
                        arr.splice(i,1);
                        if(arr.length == 0) {
                            this.ticker.unregister(this.onTick,this);
                        }
                    }
                    else
                        obj.times -= 1;
                }
            }
        }
    }
}