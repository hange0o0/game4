class GameManager {
    private static _instance:GameManager;
    public static getInstance():GameManager {
        if (!this._instance)
            this._instance = new GameManager();
        return this._instance;
    }

    private timeID: egret.Timer;
    private lastTime: number;
    public lastTouchTime: number;
    public lastTouchMC;
	public constructor() {
        this.timeID = new egret.Timer(1000);
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.timerun,this);
        this.timeID.start();
	}
	
    public static stage:egret.Stage;
    public static stageX;
    public static stageY;
    public static container:egret.DisplayObjectContainer;

    public isWebGL(){
        return egret.Capabilities.renderMode == 'webgl';
    }

    public init(){
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
    }

    public stopTimer(){
        this.timeID.stop();
    }

    private onTouchMove(e){
        GameManager.stageX = e.stageX;
        GameManager.stageY = e.stageY;
    }
    private onTouchBegin(e){
        this.lastTouchMC = e.target;
        GameManager.stageX = e.stageX;
        GameManager.stageY = e.stageY;
        this.lastTouchTime = egret.getTimer();
    }


    private timerun(): void {
        var now = TM.now();
        if(!this.lastTime) {
            this.lastTime = now;
            return;
        }
        if(!DateUtil.isSameDay(this.lastTime,now))//跨0点
        {
            //TeamPVEManager.getInstance().passDay();
            //DayGameManager.getInstance().passDay();
            //GuessManager.getInstance().passDay();

            EM.dispatch(GameEvent.client.pass_day);
        }
        EM.dispatch(GameEvent.client.timer);

        //if(UM.friendtime == 0){  //拿过日志了
        //    if(now%30 == 0) //5分钟请求一次
        //    {
        //        FriendManager.getInstance().getLog(null,null,false);
        //    }
        //}
        this.lastTime = now
        if(SyncDataManager.getInstance().lastConnectTime && now - SyncDataManager.getInstance().lastConnectTime > 3600) //超过1小时要重新登录
        {
            MyWindow.AlertRelogin('已经离开很长时间了，请重新登陆吧')
        }
    }

    //取现在到晚上12点还差的时间
    public getZeroCD(){
        var d= DateUtil.timeToChineseDate(TM.now());
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setHours(24);

        return Math.floor(d.getTime()/1000) - TM.now();
    }

}


class App {
    public static touchEvent: string = egret.TouchEvent.TOUCH_TAP;
    
    public constructor() {
    }
    	
    public static get isMobile():boolean{
        return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
    }
    public static get isAndroid():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return ua.indexOf('android') != -1;
    }
    public static get isIOS():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return /ip(ad|hone|od)/.test(ua);
    }
}

var _get = {};
var url = location.hash || location.search;
var splitStr = location.hash ? '#' : '?';
if (url.indexOf(splitStr) != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
        var a = strs[i].split("=");
        var k = a[0];
        var v = a[1];
        _get[k] = v;
    }
}


function handleErr(msg,url, line, col, errorObj)
{
    //if(!Net.getInstance().serverHost)
    //    return;
    var txt = (url|| '').substr(-30,27)+ ':' + msg + '|' + line + "--" + col+ "--" + (errorObj && errorObj.stack);
    var str = MyTool.getBtnPath(GameManager.getInstance().lastTouchMC);
    if(str)
        txt += str;
    sendClientError(txt);
    //Net.send(GameEvent.sys.client_error,{msg:txt});
    //if(LoginManager.getInstance().isAuto)
    //{
    //    LoginManager.getInstance().showLoginUI();
    //}
    //else if(GuideManager.getInstance().isGuiding)
    //{
    //    Alert('发生未知错误',MyTool.refresh);
    //}
    return false
}

function sendClientError(txt){
    Net.send(GameEvent.sys.client_error,{msg:UM.gameid + ':' + txt},null,false);
}
onerror=handleErr;