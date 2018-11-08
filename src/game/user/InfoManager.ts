class InfoManager {
    private static _instance:InfoManager;
    public static getInstance():InfoManager {
        if (!this._instance)
            this._instance = new InfoManager();
        return this._instance;
    }
    public otherNick = {};
    public otherInfo = {};
    public otherUID = {};
    public otherSlave = {};


    public errorOpenID = {};
    public errorNick = {};
    public errorUID = {};


    public init(data){

    }

    public getHeadList(){
        var arr = [];
        //var len = 10 + UM.level*2
        //for(var i=1;i<len;i++)
        //    arr.push(i);
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level <= UM.level)
                arr.push(vo);
        }
        ArrayUtil.sortByField(arr,['level'],[0]);
        for(var i=0;i<arr.length;i++)
        {
            arr[i] = arr[i].id
        }
        return arr;
    }

    public getIDByNick(nick){
        return this.otherNick[nick];
    }
    public getIDByUID(uid){
        return this.otherUID[uid];
    }

    public getInfo(otherid,fun?,stopAlert?) {
        if(this.otherInfo[otherid] && TM.now() - this.otherInfo[otherid].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        if(self.errorOpenID[otherid]){
            MyWindow.Alert(stopAlert || '没有找到该用户')
            return;
        }
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        if(!otherid)
        {
            sendClientError('otherid not find')
            return;
        }
        Net.addUser(oo);
        Net.send(GameEvent.user.user_info, oo, (data)=>{
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.errorOpenID[otherid] = true;
                MyWindow.Alert(stopAlert || '没有找到该用户')
                return;
            }

            this.initInfo(msg)

            if (fun)
                fun();
        });
    }

    public getInfoByNick(nick,fun?,stopAlert?) {
        var otherid = this.getIDByNick(nick);
        if(otherid && this.otherInfo[otherid] && TM.now() - this.otherInfo[otherid].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        if(self.errorNick[nick]){
            MyWindow.Alert(stopAlert || '没有找到该用户')
            return;
        }
        var self = this;
        var oo:any = {};
        oo.othernick = nick;
        if(!nick)
        {
            sendClientError('othernick not find')
            return;
        }
        Net.addUser(oo);
        Net.send(GameEvent.user.user_info, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.errorNick[nick] = true;
                MyWindow.Alert(stopAlert || '没有找到该用户')
                return;
            }
            this.initInfo(msg)


            if (fun)
                fun();
        });
    }

    public getInfoByUID(uid,fun?,stopAlert?) {
        var otherid = this.getIDByUID(uid);
        if(this.otherInfo[otherid] && TM.now() - this.otherInfo[otherid].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        if(self.errorUID[uid]){
            MyWindow.Alert(stopAlert || '没有找到该用户')
            return;
        }
        var self = this;
        var oo:any = {};
        oo.otheruid = uid;
        if(!uid)
        {
            sendClientError('otheruid not find')
            return;
        }
        Net.addUser(oo);
        Net.send(GameEvent.user.user_info, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.errorUID[uid] = true;
                MyWindow.Alert(stopAlert || '没有找到该用户')
                return;
            }
            this.initInfo(msg)

            if (fun)
                fun();
        });
    }

    public initInfo(msg){
        var info = msg.info;
        info.getTime = TM.now();
        this.otherInfo[info.gameid] = info;
        this.otherNick[info.nick] = info.gameid;
        this.otherUID[info.uid] = info.gameid;

        var slave = this.otherSlave[info.gameid] = {
            slave: msg.slave || [],
            self: msg.self,
            master: msg.master
        }
        if(msg.self)
            info.protime = msg.self.protime
        if(msg.master)
            msg.master.isMaster  = true;

        slave.slave.sort(function(a:any,b:any){
            if(a.addtime < b.addtime)
                return -1
            return 1
        })
    }


    public change_head(headid,fun?) {
        var oo:any = {};
        oo.headid = headid;
        Net.addUser(oo);
        Net.send(GameEvent.user.change_head, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("改名失败，错误码：" + msg.fail);
                return;
            }
            UM.head = headid
            EM.dispatchEventWith(GameEvent.client.head_change)
            if (fun)
                fun();
        });
    }

    public getMsg(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.sys.get_msg, oo, (data)=> {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }
}