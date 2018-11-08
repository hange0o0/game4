class PKServerManager extends egret.EventDispatcher{
    private static _instance:PKServerManager;

    public static getInstance():PKServerManager {
        if (!this._instance)
            this._instance = new PKServerManager();
        return this._instance;
    }

    private webSocket:egret.WebSocket;

    private callBackFun = {};

    private callBackIndex = 1;

    private modeNum = 0;
    private modeIndex = {};

    public ctrler

    public connect(ctrler?){
        this.close();
        this.ctrler = ctrler || PVPCtrl.getInstance();
        var sock = this.webSocket = new egret.WebSocket();
        sock.addEventListener( egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this );
        sock.addEventListener( egret.Event.CONNECT, this.onSocketOpen, this );
        sock.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        sock.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
        sock.connect(Config.pkServerHost, Config.pkServerPose);
        MsgingUI.getInstance2().show();
    }

    public onReceiveMessage(){
        var msg = this.webSocket.readUTF();
        console.log('socketReceive:'+msg);

        var oo:any = JSON.parse(msg);

        if(oo.fail)
        {
            if(oo.head == GameEvent.pkserver.ispking)
            {
                this.onCallBack(oo);
                return;
            }
            MyWindow.Alert('游戏连接已断开',MyTool.refresh(),'重新登陆');
            GameManager.getInstance().stopTimer();
            PKingUI.getInstance().setStop(true)
            return;
        }
        this.onCallBack(oo);

        //通用的处理
        switch(oo.head)
        {
            case GameEvent.pkserver.pair_success:
                this.ctrler.onPairSuccess(oo.msg);
                PairingUI.getInstance().hide();
                break;
            case GameEvent.pkserver.pk_info:
                this.onPKInfo(oo.msg);
                break;
            case GameEvent.pkserver.face:
                this.onFace(oo.msg);
                break;
            case GameEvent.pkserver.pk_reset:
                this.reset();
                break;
            case GameEvent.pkserver.new_login:
                MyWindow.Alert('该用户已在其它地方登录',MyTool.refresh(),'重新登陆');
                GameManager.getInstance().stopTimer();
                PKingUI.getInstance().setStop(true)
                break;
        }



        this.dispatchEventWith(oo.head,false,oo.msg);
    }

    public onCallBack(oo){
        if(oo.callbackid && oo.from == UM.gameid)//回调
        {
            this.callBackFun[oo.callbackid] && this.callBackFun[oo.callbackid](oo.msg);
            delete this.callBackFun[oo.callbackid];

            if(this.modeIndex[oo.callbackid])
            {
                delete this.modeIndex[oo.callbackid];
                this.modeNum--;
                if(this.modeNum <= 0)
                    MsgingUI.getInstance2().hide();
            }
        }
    }

    public onSocketOpen(){
        MsgingUI.getInstance2().hide();
        console.log('socket_open');
        this.ctrler.onConnect();

    }

    private onSocketClose(event:egret.Event):void {
        this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        console.log('socket_desconnect');
        //if(DEBUG) console.log(event.type);
        //this.isConnected = false;
        //if(this.reConnectTimes == 0){
        //    this.reConnect();
        //    return;
        //}
        //this.dispatchEventWith(Net.ON_ERROR);
    }

    private onIOError(event:egret.IOErrorEvent):void {
        MsgingUI.getInstance2().hide();
        if(DEBUG) console.log(event.type);
        if(this.ctrler && this.ctrler.pkData)
            MyWindow.Alert('无法连接对战服务器！')
        PairingUI.getInstance().hide();
        //this.isConnected = false;
        //if(this.reConnectTimes == 0){
        //    this.reConnect();
        //    return;
        //}
        //this.dispatchEventWith(Net.ON_ERROR);
    }


    public close(){
        MsgingUI.getInstance2().hide();
        this.ctrler = null;
        if(this.webSocket){
            this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.webSocket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.webSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
            this.webSocket.close();
            this.webSocket = null;
        }
    }

    public sendData(event,data,fun?,isMode?){
        if(!this.webSocket)
            return;
        var oo:any = {
            head:event,
            gameid:UM.gameid,
            msg:data
        }

        var carrBackID = this.callBackIndex;
        oo.callbackid = carrBackID;
        this.callBackIndex ++;
        if(fun)
        {
            this.callBackFun[carrBackID] = fun;
        }
        var cmd = JSON.stringify(oo);
        this.webSocket.writeUTF(cmd);
        console.log('socketSend:'+cmd);

        if(isMode)
        {
            MsgingUI.getInstance2().show();
            this.modeNum ++;
            this.modeIndex[carrBackID] = true;
        }
    }



    public onPKInfo(msg){
        PKData.getInstance().onPKInfo(msg)
    }

    public onFace(msg){
        PKData.getInstance().onPKFace(msg)
    }

    //取数据并重置游戏进程
    public reset(){
        PKServerManager.getInstance().sendData(GameEvent.pkserver.get_reset_data,{},(msg)=>{
            this.onReset(msg);
        })
    }

    private onReset(msg){
        var PD = PKData.getInstance();
        PD.init(msg.pkdata);
        PD.quick = true;
        PD.quickTime = msg.passtime;
        var arr = msg.action;
        var playerData = {};
        for(var i=0;i<arr.length;i++)
        {
            //{"actiontime":0,"id":2,"mid":"3","owner":1}
            var oo = arr[i];
            if(!playerData[oo.owner])
                playerData[oo.owner] = [];
            playerData[oo.owner].push(Math.floor(oo.actiontime/PKConfig.stepCD) + '#' + oo.mid);
        }

        for(var s in playerData)
        {
            PD.getPlayer(s).autoList = PKTool.decodeActionList(playerData[s])
            PD.getPlayer(s).isauto = true
        }

        PD.isAuto = true
        PKingUI.getInstance().removeAll();
        PD.start();
        PKCode.getInstance().onStep()
        for(var s in playerData)
        {
            PD.getPlayer(s).autoList = null;
            PD.getPlayer(s).isauto = false
        }
        PD.isAuto = false
        PKingUI.getInstance().resetView();
    }

    public onReConncet(){
        PKServerManager.getInstance().sendData(GameEvent.pkserver.ispking,{},(msg)=>{
            if(msg.passtime)
            {
                PKManager.getInstance().startPK(this.ctrler.type,msg.pkdata,{isOnline:true,isQuick:true})
                this.onReset(msg);
            }
            else
            {
                this.close();
            }
        },true)
    }

    //测试重连
    public reConnect(ctrl){
        ResourceLoaderUI.getInstance().show(['pk'],()=>{
            this.connect(ctrl);
        });
    }
}