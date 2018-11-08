class CardManager {
    private static _instance:CardManager;
    public static getInstance():CardManager {
        if (!this._instance)
            this._instance = new CardManager();
        return this._instance;
    }

    public monsterList = {}

    public skillCost = 30;
    public maxSkill = 999;

    public init(msg){
        //var data = MonsterVO.data;
        //for(var s in data)
        //{
        //    if(data[s].level == 0)
        //          this.monsterList[s] = true;
        //}
        //
        //for(var s in msg.monster)
        //    this.monsterList[msg.monster[s]] = true;

    }

    public isRed(monsterType=0){
        var coin = UM.coin
        var arr = this.getOpenMonsterList(monsterType)
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].isLock && this.getUpCoin(arr[i].id) <= coin)
                return true;
        }
        return false;
    }

    public getMonsterLevel(id){
        return this.monsterList[id] || 0;
    }



    public getTotalMonsterList(type){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level >= 999)
                continue
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getMyMonsterList(type){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level > UM.level)
                continue;
            if(type && type != vo.type)
                continue;
            if(vo.level > 1 && !this.getMonsterLevel(vo.id))
                continue;
            arr.push(vo);
        }
        return arr;
    }

    public getOpenMonsterList(type){
        var arr = [];
        var data = MonsterVO.data;
        var level = UM.level
        for(var s in data)
        {
            if(type && type != data[s].type)
                continue;
            if(data[s].level <= level)
            {
                data[s].isLock = this.monsterList[s]?0:1
                arr.push(data[s]);
            }
        }
        return arr;
    }

    //public getUpMonsterList(){
    //    var data = MonsterVO.data;
    //    for(var s in data)
    //    {
    //        //if(data[s].level <= UM.level+1)
    //        //    this.monsterList.push(parseInt(s));
    //    }
    //}
    //
    //public getUpSkillList(){
    //    var data = SkillVO.data;
    //    for(var s in data)
    //    {
    //        //if(data[s].level <= UM.level+1)
    //        //    this.skillList.push(parseInt(s));
    //    }
    //}

    public getUpCoin(id){
        var vo = MonsterVO.getObject(id)
        return Math.floor(Math.pow(vo.level,3.9)*100);    //要改成3.9
    }

    public resetOtherList(listData){

        if(typeof listData == 'string')
            return  listData.split(',');
        //list:lastArr.join(','),
        //    force:player.force,
        //    type:player.type,
        //    hero:player.hero
        var list = listData.list.split(',')
        for(var i=0;i<list.length;i++)
        {
            var oo:any = {};
            var vo = CM.getCardVO(list[i])
            if(!vo)
                continue;
            oo.id = list[i];
            oo.force = listData.force
            oo.type = listData.type
            list[i] = oo;
        }
        return list;
    }

    private getHeroLV(id,data){
        var arr = data.split(',')
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split('|');
            if(temp[0] == id)
                return parseInt(temp[1]);
        }
        return 1;
    }


    public card_open(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.card.card_open,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('解锁失败，错误代码：' + msg.fail)
                return;
            }
            MyWindow.ShowTips('解锁成功！')
            this.monsterList[msg.id] = true;
            EM.dispatch(GameEvent.client.card_change);
            if(fun)
                fun();
        });
    }


}