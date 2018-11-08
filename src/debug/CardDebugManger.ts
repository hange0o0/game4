class CardDebugManger {
    private static _instance:CardDebugManger;
    public static getInstance():CardDebugManger {
        if (!this._instance)
            this._instance = new CardDebugManger();
        return this._instance;
    }

    public constructor() {

    }

    private printCardInfo(msg){
        var arr = msg.like || []
        for(var i=0;i<arr.length;i++)
        {
            arr[i].like_num = Math.floor(arr[i].like_num)
            arr[i].unlike_num = Math.floor(arr[i].unlike_num)
            arr[i].total = arr[i].like_num + arr[i].unlike_num
        }
        console.log('最受争议')
        ArrayUtil.sortByField(arr,['total'],[1])
        this.printMonsterArr(arr,10,'total');
        console.log('最受欢迎')
        ArrayUtil.sortByField(arr,['like_num'],[1])
        this.printMonsterArr(arr,10,'total');
        console.log('最不受欢迎')
        ArrayUtil.sortByField(arr,['unlike_num'],[1])
        this.printMonsterArr(arr,10,'total');

        var levelObj = {}
        this.decodeLevelObj(msg.use_fight_get,levelObj);
        this.decodeLevelObj(msg.use_fight_init,levelObj);
        this.decodeLevelObj(msg.use_hang,levelObj);
        for(var s in levelObj)
        {
            var oo = levelObj[s]
            var skillArr = []
            var monsterArr = []
            var levelArray = this.getMonsterList(parseInt(s))
            for(var ss in oo)
            {
                if(parseInt(ss) > PKConfig.skillBeginID)
                    skillArr.push({id:ss,num:oo[ss]})
                else
                    monsterArr.push({id:ss,num:oo[ss]})
            }
            for(var i=0;i<levelArray.length;i++)
            {
                if(oo[levelArray[i].id])
                {
                    levelArray.splice(i,1);
                    i--;
                }
            }
            console.log('*********** LV.'+s+' **************')
            ArrayUtil.sortByField(monsterArr,['num'],[1])
            console.log('好的怪物')
            this.printMonsterArr(monsterArr,5);
            console.log('坏的怪物')
            monsterArr.reverse();
            this.printMonsterArr(monsterArr,5);
            if(levelArray.length > 0)
            {
                console.log('未被使用的怪物==========================================>>>>>>')
                this.printMonsterArr(levelArray,999);
            }

            ArrayUtil.sortByField(skillArr,['num'],[1])
            console.log('受欢迎技能')
            this.printMonsterArr(skillArr,10);
        }

    }

    public getMonsterList(level){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level > level)
                continue;
            arr.push(data[s]);
        }
        return arr;
    }

    private decodeLevelObj(data,obj){
        if(!data)
            return;
        //4|35,41,36,2,66
        var arr = data.split('\n')
        for(var i=0;i<arr.length;i++)
        {
            if(!arr[i])
                continue;
            var o = arr[i].split('|');
            var level = o[0];
            var list = o[1].split(',')
            if(!obj[level])
                obj[level] = {};
            for(var s in list)
            {
                var id = Math.floor(list[s])
                obj[level][id] = (obj[level][id] || 0) + 1
            }
        }
    }

    private printMonsterArr(arr,num=3,numKey='num'){
        for(var i=0;i<arr.length && i<num;i++)
        {
            var mvo = CM.getCardVO(Math.floor(arr[i].id));
            console.log((i + 1) + '\tid:' +mvo.id +  '\t\tnum:' +  arr[i][numKey] + '\t\tcost:' +  mvo.cost + '\t\tname:' +  mvo.name + '\t\tlevel:' +  mvo.level + '\t\ttype:' +  mvo.type)
        }
    }

    //要算出每个等级最多人用和最小人用的3个，要考虑没买的
    //投票最具争议，要求加强最多，要求削弱最多
    public getCardInfo(fun?) {
        var oo:any = {};
        Net.send(GameEvent.debug.get_card_record, oo, (data)=>{
            var msg = data.msg;
            this.printCardInfo(msg);
            if (fun)
                fun();
        });
    }
    public cleanCardRecord(key,fun?) {
        var oo:any = {};
        oo.key = key;
        Net.send(GameEvent.debug.clean_card_record, oo, function (data) {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }
}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;