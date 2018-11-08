class PKManager {
    //录像里也要调
    public static TYPE_HANG = 1;
    public static TYPE_SLAVE = 2;
    public static TYPE_PVP_OFFLINE = 3;
    public static TYPE_PVP_ONLINE = 4;


    public static TYPE_FIGHT = 51;
    public static TYPE_ANSWER = 52;
    public static TYPE_RANDOM = 53;
    public static TYPE_CHOOSECARD= 54;
    public static TYPE_ENDLESS = 55;




    public static TYPE_TEST = 101;
    public static TYPE_MAIN_HANG = 102; //挂机动画用

    private static instance:PKManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }



    public pkType;
    public pkResult;
    public isOnline;
    public recordList;
    public getRecordTime;
    public recordTime;
    public hangRecord;


    public currentPK;
    public showTopNum = 0; //显示敌人的历史阵容的数量

    public recordLen = 20;
    constructor(){
        this.recordList = SharedObjectManager.getInstance().getMyValue('pk_replay1') || []
        this.recordTime = SharedObjectManager.getInstance().getMyValue('pk_record_time') || 0
        this.hangRecord = SharedObjectManager.getInstance().getMyValue('hangRecord') || {list:[],t:0}

        for(var i=0;i<this.recordList.length;i++)//去除录像版本不对的
        {
             if(this.recordList[i].version != Config.pk_version)
             {
                 this.recordList.splice(i,1);
                 i--;
             }
        }
        if(this.recordList.length > this.recordLen)
            this.recordList.length = this.recordLen;
    }

    public pkWord = ['投降，或者死亡','来战个痛快','小心你的背后','这招看你怎么躲','我要认真了','你就只会这几招吗','我要出大招了','我会赐予你死亡','你究竟想怎样...','我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的',
        '品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','尝尝我的厉害吧', '你会后悔对上我的' ,'希望你能多坚持一会吧','不要输得太难看哦','对面上来的是什么啊','我允许你认输','唯有一战了','胜利属于我们的',
        '我们来做个了结吧','你的身体有破绽','你空门大开啊','尝尝这个吧','接下...\n这一招吧','用这招....\n来决胜负吧', '马上将你解决掉', '就用你的死来结束吧','别罗嗦了...来吧','来啊!\n互相相害啊','求一败','抬走，下一个',
        '来个强点的','对面没人了吗','来让我战个痛快吧','哈哈哈','我的目标是要3杀','胜利是属于我的','你睡着了吗','你分心了','别小看我!','游戏结束了','满足了吗','到现在才来求饶吗',
        '浪费时间!!','想逃吗!真无聊!','你可别小看我啊!','你还未够资格','别惹我....!','任务保证完成','赢的人，\n是我','你太脆弱了','哦，是的！\n我要胜利了','抱歉','打得不错','发生这种事我很抱歉','对此我很抱歉','你敢盯着我看',
        '对面太弱了','威武','有希望了','想输都难','距离胜利又近一步了','看来我不用再出手了','燃烧吧！\n小宇宙！','我会让你后悔来到世上','严肃点，\n这是比赛','啦啦啦啦~',
        '我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的','祈祷别对上我吧','我的怒火\n会毁灭一切','噢，亲爱的\n要坚持住','你死定了','你们这是自寻死路','品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','你对力量一无所知',
        '这就是王者之气啊','刚才你们说什么来着','看到我们有多强了吧','等会去哪庆功好呢','留几个给我杀啊','放轻点，别把对面吓跑了','蠢材！','让我来干掉你....',
        '我要打呵欠了','让我好好抱抱你！','我准备好了','我已经等不及了','→_→','@_@','( ¯ □ ¯ )','（╯＾╰）','>_<','(╯▔▽▔)╯','(╬▔皿▔)凸', '到此为止了','别烦我!','还没有结束的～', '有点本事啊', '我绝不认输',
        '我只是变的更坚强了','我和你没完','不胜利毋宁死','死亡，没什么好怕的','为胜利献身','哈哈!','呀！！！','过来好好打一架','胆小鬼','品尝我的愤怒吧','这是个秘密','训练又开始了！','你不能通过这里','清算时间','嘿！伙计！','加入战斗',
        '勇敢战斗','准备作战','来吧','接受挑战','接..招','目标已经标记出来了','我渴望胜利','是时候了！','是时候流点血了','你要让谁流血','啊，感觉真棒','你要我干啥？','杀啊！','休想逃走','尝尝我的利刃','给我个任务吧','接受任务',
        '尝尝厉害吧，笨猪','狗崽子！！！','使劲打用力抽','我的眼睛洞察一切','愿祖先保佑你','放马过来','瞄准你啦','向前推进','你是谁！','痛苦降临','我预见了你的末日','不从者。。死','轮到你，流血啦','你马上就会人间蒸发','你死定了',
        '你死期将至','无人能够阻拦我','没人可以通过','不留活口','为了荣耀','时间不多了，我们上吧','全体注意','下一个，轮到谁啦','冲锋陷阵','额，付出代价','把这个敌人留给我','我们该干什么','撕碎，扯烂','我们来干什么','要我攻击哪里？',
        '我来给他点颜色瞧瞧','好疼啊','活着就要战斗','要打架了','所有人，都过来','死亡没什么好怕的','我，会让你安息','我可没时间陪你玩','死亡之神在召唤','待宰羔羊！','医生，我流血了','啊！医生！','我闻到血的味道','是吗？那就去死吧！',
        '祝你好运！','赐予我力量！','你们这是自寻死路！','我快没有时间了！','哈，那家伙死定了！','你想玩个游戏吗','灵魂，躁动不安','恐惧，如影随形','不可饶恕','都是你的错','恐惧吧，哀嚎吧','放纵你内心的恐惧吧','死期将至','戳死你！','残酷的命运',
        '$%&*&$@','@#$%&','( T___T ) ','( 3__3 ) ','zzz ZZZ','╭∩╮','...']


    public defaultCardList = '6,6,6,41,3,31,64,65,64';

    public getPKBG(){
        return this.getBG(1)//this.getBG(HangManager.getInstance().getHangBGID())
    }

    public getBG(id){
        return Config.localResRoot + 'map/map'+(id || 1)+'.jpg';
    }

    public testFail(failID){
        //['']

        MyWindow.Alert('PK异常！错误码：' + failID);
        return true;
        //switch(failID)
        //{
        //    case 101:
        //
        //        return true;
        //    case 102:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //    case 103:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //}
        //return false;
    }
    public testBeginFail(failID){
        //['']

        if(failID == 3)
        {
            MyWindow.Alert('PK异常！法术卡牌数量不足');
            return true
        }
        MyWindow.Alert('PK异常！错误码：' + failID);
        return true;
        //switch(failID)
        //{
        //    case 101:
        //
        //        return true;
        //    case 102:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //    case 103:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //}
        //return false;
    }

    //public getDefaultPKList(){
    //    var index = SharedObjectManager.getInstance().getMyValue('pk_choose')
    //    var data = PosManager.getInstance().getListByType('atk')[index];
    //    if(data && data.list)
    //        return data.list;
    //    return this.defaultCardList;
    //}
    //public getDefaultPKHero(){
    //    var index = SharedObjectManager.getInstance().getMyValue('pk_choose')
    //    var data = PosManager.getInstance().getListByType('atk')[index];
    //    if(data && data.hero)
    //        return data.hero;
    //    return '';
    //}

    public sendResult(fun){
        if(PKData.getInstance().isReplay)
        {
            fun && fun();
            return;
        }
        var result = this.quickTest()
        if(result)
        {
            if(DEBUG)
            {
                MyWindow.Alert('PK数据异常！')
                console.log(result)
                PKingUI.getInstance().hide();
                return;
            }
            else
            {
                var PD = PKData.getInstance();
                //var tResult = PD.getPKResult();
                //var actionTime = PD.actionTime
                var data = ObjectUtil.clone(PD.baseData);
                for(var i=0;i<data.players.length;i++)
                {
                    var players = data.players[i];
                    players.actionlist = PD.getPlayer(players.id).posHistory.join(',');
                }
                sendClientError('PK数据异常:'+result+'|' + JSON.stringify(data))
            }
        }
        this.pkResult = null;
        switch(this.pkType)
        {
            //case PKManager.TYPE_HANG:
            //    HangManager.getInstance().pkResult(fun);
            //    break;
            //case PKManager.TYPE_PVP_OFFLINE:
            //    PVPManager.getInstance().pkOfflineWin(fun);
            //    break;
            case PKManager.TYPE_PVP_ONLINE:
                PVPCtrl.getInstance().sendPKResult(true,fun)
                //PVPManager.getInstance().pkOnlineWin(fun);
                break;
            case PKManager.TYPE_TEST:
                fun && fun();
                break;
            //case PKManager.TYPE_SLAVE:
            //    SlaveManager.getInstance().slave_pk_result(fun);
            //    break;
            //case PKManager.TYPE_FIGHT:
            //    FightManager.getInstance().pkResult(fun);
            //    SharedObjectManager.getInstance().setMyValue('fight_video','')
            //    break;
            //case PKManager.TYPE_ANSWER:
            //    PKAnswerManager.getInstance().pkResult(fun);
            //    break;
            //case PKManager.TYPE_RANDOM:
            //    PKRandomManager.getInstance().pkResult(fun);
            //    break;
            //case PKManager.TYPE_CHOOSECARD:
            //    PKChooseCardManager.getInstance().pkResult(fun);
            //    break;
            //case PKManager.TYPE_ENDLESS:
            //    PKEndLessManager.getInstance().pkResult(fun);
            //    break;
        }
    }

    //测试一下数据正确性
    public quickTest(){
        if(DEBUG)
            return '';
        var PD = PKData.getInstance();
        if(!DEBUG && !PD.baseData.check)
            return ''
        //var mpList = DM.testActionList(PD.myPlayer.posHistory.join(','))
        //console.log('============')
        var lastRecord = JSON.stringify(PKData.getInstance().actionRecord)
        //if(DEBUG)
        //    console.log(lastRecord)
        var lastType = this.pkType
        this.pkType = PKManager.TYPE_TEST;
        this.pkResult = null;

        var tResult = PD.getPKResult();
        var actionTime = PD.actionTime
        var randomTimes = PD.randomTimes
        var data = ObjectUtil.clone(PD.baseData);
        for(var i=0;i<data.players.length;i++)
        {
            var players = data.players[i];
            players.actionlist = PD.getPlayer(players.id).posHistory.join(',');
            //console.log(players.actionlist)
            //players.autolist = null;
        }
        PD.init(data);
        PD.quick = true;
        PD.start();
        PKCode.getInstance().onStep()
        this.pkType = lastType
        //if(DEBUG)
        //    console.log(JSON.stringify(PKData.getInstance().actionRecord))
        var result = (tResult == PD.getPKResult()?'':'#1|' + tResult +':'+ PD.getPKResult()) +
            (actionTime == PD.actionTime?'':'#2|' + actionTime +':'+ PD.actionTime) +
            (randomTimes == PD.randomTimes?'':'#3|' + randomTimes +':'+ PD.randomTimes);

        //if(mpList.length)
        //    result += 'mp:['+mpList.join(',')+']'
        if(result)
            result += 'action:['+lastRecord+'|' +JSON.stringify(PKData.getInstance().actionRecord)+ ']'

        return result;
    }
    ////主动时数据会多很多，要去掉才能和后面的比较
    //private resetArr(){
    //    var arr;
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        if(typeof arr[i] == 'number')
    //        {
    //            arr.splice(i,1);
    //            i--;
    //            continue;
    //        }
    //        if(arr[i].indexOf('mv') != -1)
    //        {
    //            arr.splice(i,1);
    //            i--;
    //            continue;
    //        }
    //        if(arr[i].indexOf('mid') != -1)
    //        {
    //            arr.splice(i,1);
    //            i--;
    //            continue;
    //        }
    //    }
    //}

    private saveVideo(key){
        var history = SharedObjectManager.getInstance().getMyValue(key) || {}
        history.otherList = this.resetAutoList(PKData.getInstance().getPlayer(2),history.otherList)
        if(!history.history)
            history.history = [];
        history.history.unshift(this.recordList[0]);
        history.time = TM.now();
        SharedObjectManager.getInstance().setMyValue(key,history);
    }

    public sendFail(fun){
        if(PKData.getInstance().isReplay)
        {
            fun && fun();
            return;
        }
        this.pkResult = null;
        switch(this.pkType)
        {
            //case PKManager.TYPE_FIGHT:
            //    this.saveVideo('fight_video');
            //    FightManager.getInstance().pkFail(fun);
            //    break;
            //case PKManager.TYPE_CHOOSECARD:
            //    this.saveVideo('chooseCard_video');
            //    fun && fun();
            //    break;
            //case PKManager.TYPE_ENDLESS:
            //    this.saveVideo('endless_video');
            //    fun && fun();
            //    break;
            //case PKManager.TYPE_ANSWER:
            //    this.saveVideo('answer_video');
            //    fun && fun();
            //    break;
            //case PKManager.TYPE_PVP_OFFLINE:
            //    PVPManager.getInstance().pkOfflineFail(fun);
            //    break
            case PKManager.TYPE_PVP_ONLINE:
                PVPCtrl.getInstance().sendPKResult(false,fun)
                //PVPManager.getInstance().pkOnlineFail(fun);
                break
            //case PKManager.TYPE_HANG:
            //    var lastHistory = SharedObjectManager.getInstance().getMyValue('hang_video') || {};
            //    if(lastHistory.level === HangManager.getInstance().level)
            //    {
            //        lastHistory.fail ++;
            //    }
            //    else
            //    {
            //        lastHistory.level = HangManager.getInstance().level
            //        lastHistory.fail = 1;
            //        lastHistory.gift = 0;
            //        lastHistory.gifttimes = 0;
            //        lastHistory.otherList = ''
            //        lastHistory.history = [];
            //    }
            //    lastHistory.otherList = this.resetAutoList(PKData.getInstance().getPlayer(2),lastHistory.otherList)
            //    if(!lastHistory.history)
            //        lastHistory.history = [];
            //    lastHistory.history.unshift(this.recordList[0]);
            //    SharedObjectManager.getInstance().setMyValue('hang_video',lastHistory)
            //    fun && fun();
            //    break;
            default:
                fun && fun();
                break;
        }
    }

    //重设对方出卡记录
    public resetAutoList(player:PKPlayerData,lastList){
        var lastArr = [];
        if(lastList)
        {
            if(typeof lastList == 'string')
                lastArr = lastList.split(',');
            else
                lastArr = lastList.list.split(',');
        }
        var index = lastArr.indexOf('0');
        if(index != -1)
            lastArr.length = index;
        if(player.useCardList.length > lastArr.length)
            lastArr = player.useCardList.concat();
        var len = player.autolist.split(',').length;
        if(player.heroList)
        {
            for(var i=0;i<player.heroList.length;i++)
            {
                 if(player.heroList[i].mid)
                     len ++;
            }
        }
        while(lastArr.length < len)
            lastArr.push(0);
        return {
            list:lastArr.join(','),
            force:player.force,
            type:player.type,
            hero:player.hero
        }
    }

    public stopPK(){
        var b =  UM.closeVersion && Config.version <= UM.closeVersion && TM.now()>= UM.closeTime-10*60;
        if(b)
        {
            MyWindow.Alert('服务器在'+DateUtil.getStringBySecond(UM.closeTime - TM.now()).substr(-5)+'后更新，暂时无法PK')
            if(UM.closeTime - TM.now() <= 0)
            {
                InfoManager.getInstance().getMsg();
            }
        }

        return b;
    }

    public startPK(pkType,data,sp?){
        var sp = sp ||{}
        this.pkType = pkType;
        this.pkResult = null;
        this.isOnline = sp.isOnline;

        var PD = PKData.getInstance();
        if(this.showTopNum)
            data.showTopNum = this.showTopNum;
        this.showTopNum = 0;
        PD.init(data);
        PKingUI.getInstance().show(sp.isQuick);


        //PVPContinueUI.getInstance().hide()
    }

    //阵容中的测试
    public test(atk,def){
        var PD = PKData.getInstance()

        //攻击列表乱序
        var list = atk.list.split(',');
        var atkList:any = [];

        list = list.reverse();
        var len = list.length;
        var add = 1;
        var total = 0;
        for(var i=0;i<len;i++)
        {
            var rate = add;
            list[i] = {'id':list[i],'rate':rate}
            add += i+1;
            total += rate;
        }
        while(len)
        {
            rate = 0;
            var current = Math.ceil(Math.random()*total);
            for(i=0;i<len;i++)
            {
                rate += list[i]['rate'];
                if(current <= rate)
                {
                    total -= list[i]['rate'];
                    atkList.push(list[i]['id']);
                    list.splice(i,1);
                    break;
                }
            }
            len--;
        }


        var index = 0;
        while(atkList[index] && atkList[index]>PKConfig.skillBeginID)
        {
            index ++;
        }
        var head2 = atkList[index];
        var head1 = def.list.split(',')[0];





        atkList = atkList.join(',')

        var pkData = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'npc',team:2,autolist:def.list,force:UM.tec_force,type:UM.type,hp:5,nick:def.name,head:head1},
                {id:2,gameid:UM.gameid,team:1,card:atkList,force:UM.tec_force,nick:atk.name,type:UM.type,hp:5,head:head2}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(pkData);
        PKingUI.getInstance().show();
    }

    //private changeHero(hero){
    //    if(!hero)
    //        return ''
    //    var arr = hero.split(',')
    //    for(var i=0;i<5;i++)
    //    {
    //        var hid = arr[i];
    //        if(!hid)
    //            hid = 0;
    //        arr[i] = hid+'|'+HeroManager.getInstance().getHeroLevel(hid);
    //    }
    //    return arr.join(',');
    //}

    //public startPlay(){
    //    var PD = PKData.getInstance()
    //    var data = {
    //        seed:TM.now(),
    //        players:[
    //            {id:1,gameid:'npc',team:2,autolist:'1,2,1,2,1,2,1,2',force:0,type:1,hp:5},
    //            {id:2,gameid:UM.gameid,team:1,card:'1,1,1,2,2,2,1,1,1',force:0,nick:'user',type:1,hp:5}
    //        ]
    //    };
    //    PD.init(data);
    //    PKingUI.getInstance().show();
    //}

    public playReplay(data){
        var PD = PKData.getInstance()
        PD.init(data);
        PD.isReplay = true
        PD.replayEndTime = data.actionTime;
        this.pkResult = null;
        this.pkType = data.type;
        PKingUI.getInstance().show();
    }

    //PK的校验码
    public addPKKey(oo){
        var PD = PKData.getInstance()
        var card = PD.myPlayer.card || PD.myPlayer.autolist;
        var cd = PD.actionTime

        oo.cd = PD.actionTime
        oo.key = md5.incode(cd + card + oo.list + PD.baseData.seed).substr(-8)
        Net.addUser(oo)
    }

    //6分钟内胜3次
    //15分钟内游戏6次
    //30分钟内胜8次
    public setPKCoolDown(){
        var rt = TM.now() - 30*60;
        var tt = TM.now() - 15*60;
        var wt = TM.now() - 6*60;
        var list = this.hangRecord.list;
        var winNum3 = 0;
        var winNum8 = 0;
        var gameNum = 0;
        for(var i=0;i<list.length;i++)
        {
            var oo = list[i];
            if(oo.t < rt)
            {
                list.splice(i,1);
                i--;
                continue;
            }
            if(oo.r == 1)
            {
                winNum8 ++;
                if(oo.t >= wt)
                    winNum3++;
            }
            if(oo.t >= tt)
                gameNum ++;
        }
        var countDown = 0;
        if(winNum3 >= 3)
            countDown += 60;
        if(winNum8 >= 8)
            countDown += 120;
        if(gameNum >= 6)
        {
            countDown += 60 + (gameNum - 6) * 15;
        }


        if(countDown)
        {
            this.hangRecord.t = TM.now() + countDown;
            SharedObjectManager.getInstance().setMyValue('hangRecord',this.hangRecord)
        }
        return countDown;
    }

    //把录像保存到本地
    public savePKResult(){
        if(this.pkType > 100)
            return;
        if(this.pkType == PKManager.TYPE_RANDOM)
            return;
        var PD = PKData.getInstance()
        if(PD.isReplay)
            return;


        var data = ObjectUtil.clone(PD.baseData)
        data.version = Config.pk_version
        data.type = this.pkType;
        data.pktime = TM.now();
        data.actionTime = PD.actionTime
        data.result = PD.getPKResult();
        data.score = Math.max(0,PD.team1.hp) + ':' + Math.max(0,PD.team2.hp);
        for(var i=0;i<data.players.length;i++)
        {
            var players = data.players[i];
            //delete players.autolist;
            //delete players.card;
            if(players.autolist && !players.card)
                players.card = players.autolist
            players.actionlist = PD.getPlayer(players.id).posHistory.join(',');
        }
        this.recordList.unshift(data)

        SharedObjectManager.getInstance().setMyValue('pk_replay1',this.recordList)

        //if(this.pkType == PKManager.TYPE_HANG && HangManager.getInstance().level > 20 && !PD.isAuto)
        //{
        //    this.hangRecord.list.push({t:TM.now(),r: data.result})
        //    SharedObjectManager.getInstance().setMyValue('hangRecord',this.hangRecord)
        //}

        //if(data.result == 1 && data.type == PKManager.TYPE_SLAVE)
        //{
        //    var gameid = PD.myPlayer.teamData.enemy.members[0].gameid;
        //    setTimeout(()=>{
        //        this.sendPKRecord(gameid,data);
        //    },1000)
        //
        //}
    }

    //private sendPKRecord(gameid,data)
    //{
    //    var oo:any = {};
    //    oo.otherid = gameid;
    //    oo.pkdata = data;
    //    Net.addUser(oo);
    //    Net.send(GameEvent.pk.save_record, oo, (data)=> {
    //
    //    });
    //}

    //public getPKRecord(fun?)
    //{
    //    if(TM.now() - this.getRecordTime < 60*30)
    //    {
    //        fun && fun();
    //        return;
    //    }
    //    var oo:any = {};
    //    oo.time = this.recordTime
    //    Net.addUser(oo);
    //    Net.send(GameEvent.pk.get_record, oo, (data)=> {
    //        var msg = data.msg;
    //        var list = msg.list || [];
    //        if(list.length > 0)
    //        {
    //            var b = false
    //            for(var i=0;i<list.length;i++)
    //            {
    //                var oo = list[i];
    //                oo.pkdata = JSON.parse(oo.pkdata);
    //                if(oo.pkdata.version == Config.pk_version)
    //                {
    //                    oo.pkdata.result = 2;//对方赢就是我输
    //                    this.recordList.push(oo.pkdata)
    //                    b = true
    //                }
    //                this.recordTime = Math.max(this.recordTime,oo.time);
    //            }
    //            if(b)
    //            {
    //                ArrayUtil.sortByField(this.recordList,['pktime'],[1]);
    //                SharedObjectManager.getInstance().setMyValue('pk_replay1',this.recordList)
    //            }
    //            SharedObjectManager.getInstance().setMyValue('pk_record_time',this.recordTime)
    //        }
    //        this.getRecordTime = TM.now();
    //        fun && fun();
    //    });
    //}

    public sendPosToServer(posCard:PKPosCardData,fun?)
    {
        var oo = {
            actiontime:posCard.actionTime,
            id:posCard.id,
            mid:posCard.mid,
            owner:posCard.owner
        }
        PKServerManager.getInstance().sendData(GameEvent.pkserver.pk_info,oo,(msg)=> {
            posCard.enableWaiting();
            fun && fun();
        });
        //oo.posCard = posCard
        //Net.addUser(oo);
        //Net.send(GameEvent.pk.get_record, oo, (data)=> {
        //    var msg = data.msg;
        //    posCard.enableWaiting();
        //    fun && fun();
        //});
    }
    //public sendPosToServer(posCard:PKPosCardData,fun?)
    //{
    //    var oo:any = {};
    //    oo.posCard = posCard
    //    Net.addUser(oo);
    //    Net.send(GameEvent.pk.get_record, oo, (data)=> {
    //        var msg = data.msg;
    //        posCard.enableWaiting();
    //        fun && fun();
    //    });
    //}
}