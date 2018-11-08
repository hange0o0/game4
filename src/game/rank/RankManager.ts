class RankManager {
    private static _instance:RankManager;
    public static getInstance():RankManager {
        if (!this._instance)
            this._instance = new RankManager();
        return this._instance;
    }

    public rankData = {};

    public getRankList(ranktype){
        if(!this.rankData[ranktype])
            return [];
        var list = this.rankData[ranktype].list;
        for(var i=0;i<list.length;i++)
        {
            if(list[i].gameid == UM.gameid)
            {
                list[i].head = UM.head;
                //switch (ranktype)
                //{
                //    case 'force':
                //        list[i].score = UM.tec_force;
                //        break;
                //    case 'hang':
                //        list[i].score = HangManager.getInstance().level;
                //        break;
                //    case 'hourcoin':
                //        list[i].score = UM.hourcoin;
                //        break;
                //    case 'offline':
                //        if(PVPManager.getInstance().offline)
                //            list[i].score = PVPManager.getInstance().offline.score;
                //        break;
                //}
            }
            list[i].score = parseInt(list[i].score);
        }
        ArrayUtil.sortByField(list,['score'],[1]);
        for(var i=0;i<list.length;i++)
        {
            list[i].index = i+1;
        }
        return list;
    }

    public getServerRank(ranktype,fun?){
        if(ranktype == 'offline')
        {
            this.getServerRank2(ranktype,fun)
            return;
        }
        if(this.rankData[ranktype] && this.rankData[ranktype].time > TM.now())
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.ranktype = ranktype;
        Net.send(GameEvent.rank.get_rank,oo,(data) =>{
            var msg = data.msg;
            var list = msg.list || []
            this.rankData[ranktype] = {
                time:TM.now() + 5*60,
                list:list
            }
            if(fun)
                fun();
        });
    }
    public createRank(ranktype,fun?){
        if(this.rankData[ranktype] && this.rankData[ranktype].time > TM.now())
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.ranktype = ranktype;
        Net.send(GameEvent.rank.create_rank,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail == 1)
            {
                if(!this.rankData[ranktype])
                    MyWindow.Alert('排行榜生成中，请稍后再试')
                if(fun)
                    fun();
                return
            }
            this.getServerRank2(ranktype,fun);
        });
    }
    public getServerRank2(ranktype,fun?){
        if(this.rankData[ranktype] && this.rankData[ranktype].time > TM.now())
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.ranktype = ranktype;
        Net.send(GameEvent.rank.get_rank2,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail == 1)
            {
                this.createRank(ranktype,fun);
                return
            }
            if(msg.fail == 2)
            {
                if(!this.rankData[ranktype])
                    MyWindow.Alert('排行榜生成中，请稍后再试')
                if(fun)
                    fun();
                return
            }
            var list = JSON.parse(msg.list || '[]')
            this.rankData[ranktype] = {
                time:TM.now() + 5*60,
                list:list
            }
            if(fun)
                fun();
        });
    }


}