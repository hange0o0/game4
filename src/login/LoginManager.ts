class LoginManager{

    private static _instance:LoginManager;

    public static getInstance():LoginManager {
        if (!this._instance)
            this._instance = new LoginManager();
        return this._instance;
    }

    public gameid;
    public openKey;
    public lastLand;

    public lastUser;  //上次的登录的用户
    public quickPassword; //上次的登录的密码

    public logText;
    public isOtherLogin = false;

    public constructor() {
        var oo =  SharedObjectManager.getInstance().getValue('user') || {};
        this.lastUser = oo.user;
        this.quickPassword = oo.password;

        this.logText = SharedObjectManager.getInstance().getValue('logText') || {}
    }

    public showLoginUI(){
        PopUpManager.hideAll()
        LoginUI.getInstance().show();
    }

    public saveLogText(){
        SharedObjectManager.getInstance().setValue('logText',this.logText)
    }

    //测试名字是否合法
    public testName(mail){
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) return true;
        else {
            MyWindow.Alert('用户邮箱格式不对');
            return false;
        }
    }
    //测试密码是否合法
    public testPassword(password){
        var reg = /^[\w]{6,12}$/;
        if(password.match(reg)){
            return true;
        }
        else {
            MyWindow.Alert('密码的格式为6-12位，只能是字母、数字和下划线');
            return false;
        }
    }

    public writeDB(){
        var oo:any = {user:this.lastUser,password:this.quickPassword}
        SharedObjectManager.getInstance().setValue('user',oo)
    }

    //----------------------------------以下是没有接入平台时的，要自己管理用户----------------------------------
    public login(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;

        if(password)
        {
            oo.password = md5.incode(password);
        }
        else
            oo.quick_password = this.quickPassword;

        Net.send(GameEvent.sys.login,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                if(password)
                {
                    MyWindow.Alert('用户或密码错误');
                }
                else
                {
                    self.quickPassword = null;
                    LoginUI.getInstance().show();
                    self.writeDB();
                }
                return;
            }

            if(msg.fail == 2)
            {
                if(password)
                    MyWindow.Alert('登陆失败');
                self.quickPassword = null;
                LoginUI.getInstance().show();
                self.writeDB();
                return;
            }

            self.gameid = msg.userdata.id;
            self.openKey = msg.userdata.cdkey;
            self.lastLand = msg.userdata.last_land;



            self.lastUser = name;
            self.quickPassword = msg.quick_password;
            self.writeDB();

            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    public register(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = md5.incode(password);
        Net.send(GameEvent.sys.register,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('注册失败');
                return;
            }

            if(msg.fail == 2)
            {
                MyWindow.Alert('该用户邮箱已被注册');
                return;
            }

            self.gameid = msg.data.id;
            self.openKey = msg.data.cdkey;
            self.lastLand = msg.data.last_land;

            self.lastUser = name;
            self.quickPassword = msg.quick_password
            self.writeDB();

            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    private onUserLogin(){
        LoginUI.getInstance().hide();
        RegisterUI.getInstance().hide();
        this.loginServer();
    }

    //----------------------------------以下是进入时已有了用户后的处理（已有gameid 和 landid)----------------------------------
    public loginServer(fun?){
        var self = this;
        var oo:any = {};
        if(FromManager.getInstance().h5Form)
        {
            oo = FromManager.getInstance().getLoginBase();
        }
        UM.gameid = Config.platformGameidAdd + Config.serverID + '_' + this.gameid
        if(!MailManager.getInstance().getNotAwardNum())
            oo.mailtime = MailManager.getInstance().mailData.msgtime || 1
        //oo.serverid = serverid;
        oo.id = this.gameid;
        oo.cdkey = this.openKey;
        oo.logtime = this.logText.time || 0;

        Net.send(GameEvent.sys.login_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('用户状态已过期!');
                return;
            }

            if(msg.fail == 2)
            {
                RegisterServerUI.getInstance().show();
                return;
            }

            MailManager.getInstance().serverAward = msg.mailnum || 0;
            //SlaveManager.getInstance().initLogin(msg)
            UM.fill(msg.data);

            self.writeDB();
            if(msg.logtext)
            {
                self.logText = msg.logtext;
                if(self.logText.time < UM.opentime)
                    self.logText.cb = true
                self.saveLogText();
            }


            MainUI.getInstance().show();
            MainLoadingUI.getInstance().hide();
            FromManager.getInstance().loginRole()
            RegisterServerUI.getInstance().hide();
            if(fun)
                fun();
        });
    }

    public loginServer2(gameid,fun?){
        var self = this;
        var oo:any = {};
        oo.id = gameid;


        Net.send(GameEvent.sys.login_server2,oo,function(data){
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('无法进入!' + msg.fail);
                return;
            }

            self.isOtherLogin = true;
            UM.fill(msg.data);
            MainUI.getInstance().show();
            MainLoadingUI.getInstance().hide();
            if(fun)
                fun();
        });
    }

    //public debugLoginServer(gameid,cdkey,fun?){
    //    var self = this;
    //    var oo:any = {};
    //    oo.id = gameid;
    //    oo.cdkey = cdkey;
    //    Net.send(GameEvent.sys.login_server,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 1)
    //        {
    //            Alert('用户状态已过期!');
    //            return;
    //        }
    //
    //        if(msg.fail == 2)
    //        {
    //            Alert('没这个玩家');
    //            return;
    //        }
    //
    //        UM.fill(msg.data);
    //        MainUI.getInstance().show();
    //        MainLoadingUI.getInstance().hide();
    //        if(fun)
    //            fun();
    //    });
    //}
    //
    //public relogin(){
    //    var self = LoginManager.getInstance();
    //    var oo:any = {};
    //    //oo.serverid = serverid;
    //    oo.id = self.gameid;
    //    oo.cdkey = self.openKey;
    //    oo.logtime = self.logText.time || 0;
    //    var serverid = self.lastServer;
    //    Net.getInstance().serverID = serverid;
    //    Net.getInstance().serverHost = self.serverList[serverid].host;
    //    Net.send(GameEvent.sys.login_server,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 1)
    //        {
    //            Alert('用户状态已过期!',MyTool.refresh);
    //            return;
    //        }
    //
    //        if(msg.fail == 2)
    //        {
    //            return;
    //        }
    //
    //        UM.fill(msg.data);
    //        if(msg.logtext)
    //        {
    //            self.logText = msg.logtext;
    //            if(self.logText.time < UM.opentime)
    //                self.logText.cb = true
    //            self.saveLogText();
    //        }
    //
    //
    //        PopUpManager.showToMain()
    //    });
    //}

    public registerServer(nick,type,fun?){
        var self = this;
        var oo:any = {};
        if(FromManager.getInstance().h5Form)
        {
            oo = FromManager.getInstance().getLoginBase();
        }
        oo.nick = nick;
        oo.id = this.gameid;
        oo.cdkey = this.openKey;
        oo.type = type;

        //Net.getInstance().serverID = serverid;
        //Net.getInstance().serverHost = this.serverList[serverid].host;
        Net.send(GameEvent.sys.register_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('用户状态已过期');
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('该用户名已被使用');
                return;
            }
            if(msg.fail == 4)
            {
                MyWindow.Alert('注册失败');
                return;
            }

            if(msg.fail == 2)//已注册过了，可以直接登陆
            {
                self.loginServer();
                return;
            }

            //UM.fill(msg.data);
            if(FromManager.getInstance().h5Form)
            {
                FromManager.getInstance().newRole()
                UM.nick = nick;
            }
            GuideManager.getInstance().isGuiding = true;
            self.loginServer()
            if(fun)
                fun();
        });
    }
}
