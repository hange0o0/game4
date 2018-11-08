class Net extends egret.EventDispatcher{
    private static instance: Net;
    public static getInstance() {
        if(!this.instance) this.instance = new Net();
        return this.instance;
    }

    //发送消息
    public static send(head,msg,fun?,isMode = true,serverType=1,isRepeat=false){
        Net.getInstance().send(head,msg,fun,isMode,serverType,isRepeat);
    }
    //添加用户信息
    public static addUser(msg){
        msg.landid = UM.landid;
        msg.gameid = UM.gameid;
    }


    private msgIndex = 0;

    public modeNum = 0;
    public outPut = true;
    public actionRecord = []
    public constructor() {
        super();
        this.modeNum = 0;
    }

    private getVariables(head,msg,serverType)
    {
        var variables = new egret.URLVariables('a=1');
        var oo:any = {};
        oo.head = head;
        if(msg.gameid)
        {
            oo.msg_index = this.msgIndex;
            this.msgIndex ++;
        }

        oo.msg = JSON.stringify(msg);
        oo.debug_client =  Config.isDebug;
        if(serverType == 1)
            oo.version = Config.version;
        else
            oo.version = Config.user_version;

        if(_get['debug_server'])
            oo.debug_server = 1;
        if(_get['game_version'])
            oo.game_version = _get['game_version'];
        if(FromManager.getInstance().h5Form)
            oo.h5 =  FromManager.getInstance().from

        variables.variables = oo;
        //(<any>variables.variables).msg = JSON.stringify(msg);
        //(<any>variables.variables).debug_client = Config.isDebug;
        //(<any>variables.variables).version = Config.version;


        return variables;
    }

    private pushRecord(str){
        this.actionRecord.push(str)
        while(this.actionRecord.length > 10)
            this.actionRecord.shift();
    }

    public send(head,msg,fun?,isMode = true,serverType=1,isRepeat=false){
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader['isMode'] = isMode
        loader['fun'] = fun
        loader['head'] = head
        loader['msg'] = msg;
        loader['isRepeat'] = isRepeat;

        if(serverType == 1)
        {
            var request = new egret.URLRequest(Config.host);
        }
        else
            var request = new egret.URLRequest(Config.userHost);
        //var request = new egret.URLRequest('http://qxu1606510485.my3w.com/new_index.php');
        request.method = egret.URLRequestMethod.POST;
        request.data = this.getVariables(head,msg,serverType);
        if(Config.isDebug && this.outPut)
        {
            console.log('send===>      '+head)
            console.log(JSON.stringify(msg) +'   '+TM.now());
        }

        if(isMode)
        {
            this.modeNum ++;
            //GameManager.container.touchChildren = GameManager.container.touchEnabled = false;
            this.addLoading();
        }

        this.pushRecord('send:' + head + '#' + this.modeNum)

        loader.load(request);





        loader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);

    }

    private onComplete(e){
        var loader = e.currentTarget;
        var isMode = loader.isMode
        var fun = loader.fun
        var head = loader.head
        var msg = loader.msg

        if(isMode)
            this.modeNum --;
        if(this.modeNum <= 0)
        {
            //GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
            this.removeLoading();
        }
        this.pushRecord('receive:' + head + '#' + this.modeNum)


        loader.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        if(Config.isDebug && this.outPut)
        {
            console.log('====receive>        '+head)
            console.log(e.target.data +'   ' +TM.now());
        }
        try {
            var data = JSON.parse(e.target.data)
            if(Config.isDebug && this.outPut)
                console.log(data.msg);
        }catch(e){

            if(Config.isDebug)
                MyWindow.Alert('通信数据异常');
            else
                MyWindow.Alert('通信数据异常',this.refresh,'重新登陆');
            return;
        }
        if(data.error)
        {
            //GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
            this.removeLoading();
            switch (data.error)
            {
                case 1:
                    if(_get['app'])
                        MyWindow.Alert('游戏已更新，请重新下载');
                    else
                        MyWindow.Alert('游戏已更新，请退出重进',this.refresh,'重新登陆');
                    GameManager.getInstance().stopTimer();
                    break;
                case 2:
                    MyWindow.Alert('该用户已在其它地方登录',this.refresh,'重新登陆');
                    GameManager.getInstance().stopTimer();
                    break;
                case 3:
                    MyWindow.Alert('通信出错',this.refresh,'重新登陆');
                    break;
                case 4:
                    MyWindow.Alert('用户数据写入失败',this.refresh,'重新登陆');
                    GameManager.getInstance().stopTimer();
                    break;
                case 5:
                    MyWindow.Alert('服务器正在维护中，请稍后再试',this.refresh);
                    GameManager.getInstance().stopTimer();
                    break;
                case 99:
                    MyWindow.Alert(data.error_str,this.refresh);
                    GameManager.getInstance().stopTimer();
                    break;
                default :
                    MyWindow.Alert('未知错误',this.refresh);
                    GameManager.getInstance().stopTimer();
                    break;
            }
            return;
        }
        TM.init(data.server_time);
        SyncDataManager.getInstance().snyc(data.msg);
        var oo:any = {};
        oo.sendData = msg;
        oo.msg = data.msg;
        if(fun)
            fun(oo);
        this.dispatchEventWith(head,false,oo);
    }

    private onError(e){
        var loader = e.currentTarget;
        loader.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        if(loader.isRepeat)
        {
            MyWindow.Confirm('数据提交失败，与服务器失去连接！',(b)=>{
                if(b==1)
                {
                    this.send(loader.head,loader.msg,loader.fun,loader.isMode,1,true);
                }
                else
                    this.refresh();
            },['刷新', '重试']);
        }
        else
        {
            MyWindow.Alert('与服务器失去连接！',this.refresh);
            GameManager.getInstance().stopTimer();
        }
        this.pushRecord('error' + this.modeNum)
        //GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
        this.removeLoading();
    }
    private refresh(){
        location.reload();
    }

    private addLoading(){
        MsgingUI.getInstance().show();
    }

    private removeLoading(){
        MsgingUI.getInstance().hide();
    }
}