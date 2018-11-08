//class EgretManager {
//    private static _instance:EgretManager;
//    public static getInstance():EgretManager {
//        if (!this._instance)
//            this._instance = new EgretManager();
//        return this._instance;
//    }
//
//    public nickName;
//
//    public constructor() {
//        //nest.easyuser.startup
//    }
//
//    public startup(fun?){
//        Config.platform = 'egret';
//        var self = this;
//        var info:any = {};
//        //设置游戏id。如果是通过开放平台接入，请在开放平台游戏信息-》基本信息-》游戏ID 找到。
//        info.egretApId = 91222;
//        //设置使用 Nest 版本。请传递2
//        info.version = 2;
//        //在debug模式下，请求nest接口会有日志输出。建议调试时开启
//        info.debug = true;
//        nest.easyuser.startup(info, function (data) {
//            if(data.result == 0) {
//                //初始化成功，进入游戏
//                //if(fun)
//                //    fun();
//                console.log(data['id'])
//                self.getLoginTypes();
//            }
//            else {
//                //初始化失败，可能是url地址有问题，请联系官方解决
//            }
//        })
//    }
//
//    public getLoginTypes(){
//        var self = this;
//        var loginTypes:Array<nest.easyuser.ILoginType> = nest.easyuser.getLoginTypes();
//        if (loginTypes.length) {//需要显示对应的登录按钮
//            //按照获取到的类型，显示全部的按钮，其中，qq（qq对应按钮）、 wx（微信对应按钮）、default（游戏内自己进入按钮），请可能兼容多种按钮同时存在的页面
//            //如果传入的参数带有 accInfo 信息，请根据 accInfo.avatarUrl 来显示头像，并修改名称为 XX一键登录。
//            //按钮点击后，请调用 nest.easyuser.login，并传入对应的登录类型
//        }
//        else {//直接调用 nest.easyuser.login，传入 {} 即可。
//            nest.easyuser.login({}, function (resultInfo:nest.user.LoginCallbackInfo) {
//                if (resultInfo.result == 0) {//登录成功
//                    self.login(resultInfo['id']);
//                }
//                else if (resultInfo.result == -3) {//平台登陆账号被踢掉，需要重新登陆
//                    self.showLoginOut();
//                }
//                else {//登录失败
//                    self.showLoginFail();
//                }
//            })
//        }
//    }
//
//    public login(id){
//        LoginManager.getInstance().login(id,'@password');
//        this.fillInfo()
//    }
//
//    public showLoginOut(){
//        Alert('该用户登录状态已失效，请重新登录',refresh);
//        function refresh(){
//            location.reload();
//        }
//    }
//    public showLoginFail(){
//        Alert('登录失败',refresh);
//        function refresh(){
//            location.reload();
//        }
//    }
//
//    public fillInfo(){
//        var self = this;
//        nest.easyuser.isSupport({}, function (supportData:nest.easyuser.UserSupportCallbackInfo) {
//            //获取是否支持nest.user.getInfo接口，有该字段并且该字段值为1表示支持
//            var getInfo = supportData.getInfo;
//            if(getInfo == 1)
//            {
//                nest.easyuser.getInfo({}, function (data:any) {
//                    if(data.result == 0) {
//                        //获取用户信息成功
//                        var msg = data.msg;              //传回的提示信息
//                        self.nickName = data.nickName;    //昵称
//                        //var avatarUrl = data.avatarUrl;  //头像
//                        //var sex = data.sex;              //性别, 0未知，1男，2女
//                        //var city = data.city;            //城市
//                        //var language = data.language;    //语言
//                        //var isVip = data.isVip;          //是否vip, 1是，0不是
//                        //var province = data.province;    //省份
//                        //var country = data.country;      //国家
//                    }
//                    else if (data.result == -3) {//平台登陆账号被踢掉，需要重新登陆
//                        self.showLoginOut();
//                    }
//                    else {
//                        //获取用户信息失败
//                    }
//                })
//            }
//
//        })
//    }
//
//    public pay(goodsid,onSuccess){
//        var self = this;
//        var info:any = {};
//        //购买物品id，在开放平台配置的物品id
//        info.goodsId = goodsid;
//        //购买数量，当前默认传1，暂不支持其他值
//        info.goodsNumber = "1";
//        //所在服
//        info.serverId = LoginManager.getInstance().lastServer;
//        //透传参数
//        var oo:any = {};
//        oo.id = goodsid;
//        Net.addUser(oo);
//        info.ext = JSON.stringify(oo);
//        nest.iap.pay(info, function (data) {
//            if(data.result == 0) {
//                //支付成功
//                PayManager.getInstance().onBuyFinish(goodsid,onSuccess);
//            }
//            else if(data.result == -1) {
//                //支付取消
//                ShowTips('支付取消')
//            }
//            else if (data.result == -3) {//平台登陆账号被踢掉，需要重新登陆
//                self.showLoginOut();
//            }
//            else {
//                Alert('支付失败')
//                //支付失败
//            }
//        })
//    }
//}

//		{
//			"name": "nest",
//			"path": "/nest"
//		},