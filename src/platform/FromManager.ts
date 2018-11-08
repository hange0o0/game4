class FromManager {
    private static _instance:FromManager;
    public static getInstance():FromManager {
        if (!this._instance)
            this._instance = new FromManager();
        return this._instance;
    }

    public from = 'none'
    public h5Form = false

    public setForm(from){
        this.from = from;
        this.h5Form = true
        if(from == 'test')
            this.h5Form = false
        Config.localResRoot = '../resource2/'// + Config.localResRoot


        //本地测试用
        //_get['host'] = 'com'
        //_get['debug_server'] = '1'
        //_get['debug'] = '1'
    }

    public get isTapTap(){
        return _get['from'] == 'taptap';
    }

    public get isQunHei(){
        return this.from == 'qunhei';
    }

    public initData(){
       if(this.isQunHei)
       {
            QunHeiManager.getInstance().initData()
       }
    }

    public getManager():any{
        if(this.isQunHei)
        {
            return QunHeiManager.getInstance();
        }
    }





    /////////////////////////////////////////
    public getDefaultNick(){
        var mgr = this.getManager()
        if(mgr && mgr.getDefaultNick)
        {
            return mgr.getDefaultNick();
        }
        return null;
    }


    //登录
    public login(){
        var mgr = this.getManager()
        if(mgr && mgr.login)
        {
            mgr.login();
            return true;
        }
        return false;
    }

    //取登录数据
    public getLoginBase(){
        var mgr = this.getManager()
        if(mgr && mgr.getLoginBase)
        {
            return mgr.getLoginBase();
        }
        return null;
    }

    //创角上服
    public newRole(){
        var mgr = this.getManager()
        if(mgr && mgr.newRole)
        {
            mgr.newRole();
        }
    }

    //登录上服
    public loginRole(){
        var mgr = this.getManager()
        if(mgr && mgr.loginRole)
        {
            mgr.loginRole();
        }
    }

    //登录上服
    public pay(id,successFun){
        var mgr = this.getManager()
        if(mgr && mgr.pay)
        {
            mgr.pay(id,successFun);
        }
    }


}