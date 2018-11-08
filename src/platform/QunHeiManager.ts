class QunHeiManager {
    private static _instance:QunHeiManager;
    public static getInstance():QunHeiManager {
        if (!this._instance)
        {
            this._instance = new QunHeiManager();
            this._instance.sdk = window['qhsdk'];
        }
        return this._instance;
    }

    public sdk

    public initData(){
        var initdata = {
            "username":_get['username'],//用户id，群黑登录接口里面username参数
            "gid":'3697',//群黑游戏id，可以在后台游戏列表查询
        };
        this.sdk.init(initdata);
    }

    public getDefaultNick(){
        return decodeURIComponent(_get['nname']);
    }

    public getLoginBase(){
        var data:any = {}
        data.h5 = 'qunhei'
        data.username = _get['username']
        data.serverid = _get['serverid']
        data.isadult = _get['isadult']
        data.time = _get['time']
        data.flag = _get['flag']
        return data;
    }

    //public login(){
    //    var LM = LoginManager.getInstance();
    //    var baseServerID = parseInt(_get['serverid']);
    //    var serverid = baseServerID + 100;
    //    LM.getServerList(function(){
    //        LM.gameid = 'qh'+_get['username'];
    //        LM.loginServer(serverid,null)
    //    })
    //}
    //
    ////创角上服
    //public newRole(){
    //    var roledata = {"act":"1","serverid":_get['serverid'],"rolename":UM.nick,"level":1};
    //    this.sdk.role(roledata);
    //}
    //
    ////登录上服
    //public loginRole(){
    //    var roledata = {"act":"2","serverid":_get['serverid'],"rolename":UM.nick,"roleid":UM.uid,"level":UM.level};
    //    this.sdk.role(roledata);
    //}
    //
    ////支付
    //public pay(goodsid,onSuccess){
    //    var localOrder = (TM.now() + '').substr(-5);
    //    var goodData = PayManager.getInstance().shopItemObj[goodsid];
    //    var ext = UM.gameid+'|'+Net.getInstance().serverID+'|' + goodsid + '|' + localOrder;
    //    var paydata = {
    //        "userId":_get['username'],
    //        "gid":'3697',
    //        "roleName":UM.nick,
    //        'goodsId':'' + goodsid,
    //        "goodsName":goodData.name || goodData.word,
    //        "money":goodData.cost,
    //        "ext":ext ,
    //        "sign":md5.incode('' + goodData.cost + _get['username'] + ext + '_pay'),
    //    };
    //    console.log(JSON.stringify(paydata))
    //    //{"userId":"419104","gid":"3697","roleName":"张晓杰","goodsId":"105","goodsName":"test","money":1,"ext":"1_qh419104|1|105","sign":"c4938ee0eeda67b2713775ddfe97dcea"}
    //    //money + userId + ext + key
    //    this.sdk.pay(paydata,function(code,msg){
    //        //充值结果通知，code为编号，msg为信息。该结果不能作为发货依据。
    //        //code=1充值成功 ，其他为充值失败。
    //        //alert(code+','+msg);
    //        if(code == 1)
    //            PayManager.getInstance().onBuyFinish(goodsid,onSuccess);
    //        else
    //            alert(code+','+msg);
    //    });
    //
    //    PayingUI.getInstance().show(localOrder,goodsid)
    //}
}