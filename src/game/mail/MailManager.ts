class MailManager {
    private static _instance:MailManager;

    public static getInstance():MailManager {
        if (!this._instance)
            this._instance = new MailManager();
        return this._instance;
    }
    //消息type的类型说明：
    //1:成为主人
    //2:抢奴隶
    //101:系统奖励

    public mailData;
    public mailEffectTime = 3*24*3600//有效时间
    public serverAward = 0;

    public constructor() {
        this.mailData = SharedObjectManager.getInstance().getMyValue('mailData') || {list:[],time:0};
        var t = TM.now();
        for(var i=0;i<this.mailData.list.length;i++)
        {
            var oo = this.mailData.list[i];
            if(parseInt(oo.time) + this.mailEffectTime < t)
            {
                this.mailData.list.splice(i,1);
                i--;
            }
        }
    }

    public getNotAwardNum(){
        var arr = this.getListByTpyes([101])
        for(var i=0;i<arr.length;i++)
        {
            if(parseInt(arr[i].stat))
            {
                arr.splice(i,1);
                i--;
            }
        }
        return arr.length + this.serverAward;
    }

    public saveData(){
        SharedObjectManager.getInstance().setMyValue('mailData',this.mailData);
    }

    public getMailTitle(data){
        var content = JSON.parse(data.content);
        var index = content.rd || 0;//用于文本随机
        var nick = MyTool.createHtml('' + Base64.decode(content.nick) + '',0xFFBC68);
        switch(parseInt(data.type))
        {
            case 1:
                return this.getDesByArr([
                    nick + '成了你的主人'
                ],index);
            case 2:
                return this.getDesByArr([
                    nick + '抢了你的奴隶'
                ],index);
            case 3:
                return this.getDesByArr([
                    nick + '抛弃了你'
                ],index);
            case 4:
                return this.getDesByArr([
                    nick + '起义了'
                ],index);
            case 101:
                return Base64.decode(content.des);
        }
        return nick;
    }

    public getMailDes(data){
        var content = JSON.parse(data.content);
        var index = content.rd || 0;//用于文本随机
        switch(parseInt(data.type))
        {
            case 1:
                return this.getDesByArr([
                    '从现在起我就是你的主人了，好好为我效力吧',
                    '打狗还看主人脸，跟了我就没人敢欺负你了',
                    '如果你表现得好，我可以考虑还你自由身',
                    '在我这里好好干，等以后我发财了绝少不了你的好处',
                    '能臣服于我是你的荣耀'],index);
            case 2:
                return this.getDesByArr([
                    '你的奴隶【'+Base64.decode(content.slave_nick)+'】看着还不错，我就拿去了',
                    '大胆【'+UM.nick+'】，你敢跟我抢【'+Base64.decode(content.slave_nick)+'】',
                    '我不能看着【'+Base64.decode(content.slave_nick)+'】在你手下受半点委屈',
                    '【'+Base64.decode(content.slave_nick)+'】跟了你是屈才了，他/她应该拥有更广阔的舞台',
                    '【'+Base64.decode(content.slave_nick)+'】是个好奴隶，但你不配拥有'],index);
            case 3:
                return this.getDesByArr([
                    '你的表现太令我失望了，我们的主仆情份就到此为止了吧',
                    '如果你能再努力点，我们何至于会走到这一步',
                    '你是个好人，但我们不适合做主仆',
                    '没有比较就没有伤害，但你的表现也实在太糟糕了',
                    '好好努力升级，以后我们还能做主仆'],index);
            case 4:
                return this.getDesByArr([
                    '我就不在你这里干了，爱咋咋滴',
                    '我叫你一声主人，你好意思答应么',
                    '就你这实力，要做我的奴隶我还不愿意呢',
                    '主人，你的实力还太弱了，要干巴爹哟~',
                    '想做我的主人，看来你还得再锻炼锻炼才行'],index);
            case 101:
                return Base64.decode(content.des);
        }
    }

    private getDesByArr(arr,index){
        index = index%arr.length;
       return arr[index];
    }

    //取type为XXXX的数据
    public getListByTpyes(typeArr){
        var arr = [];
        for(var i=0;i<this.mailData.list.length;i++)
        {
            var oo = this.mailData.list[i];
            if(ArrayUtil.indexOf(typeArr,oo.type) != -1)
            {
                arr.push(oo);
            }
        }
        return arr;
    }

    public deleteMail(id){
        for(var i=0;i<this.mailData.list.length;i++)
        {
            var oo = this.mailData.list[i];
            if(oo.id == id)
            {
                this.mailData.list.splice(i,1);
                break
            }
        }
        this.saveData()
    }

    public getMail(fun?){
        if(TM.now() - this.mailData.time < 30*60)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.msgtime = this.mailData.msgtime || 0
        Net.addUser(oo);
        Net.send(GameEvent.mail.get_mail,oo,(data) =>{
            var msg = data.msg;
            this.serverAward = 0;
            if(msg.list)
            {
                this.mailData.list = this.mailData.list.concat(msg.list)
                ArrayUtil.sortByField(this.mailData.list,['time'],[1])
                if(this.mailData.list[0])
                    this.mailData.msgtime = this.mailData.list[0].time;
                this.saveData()
            }
            EM.dispatchEventWith(GameEvent.client.red_change)
            if(fun)
                fun();
        });
    }

    public get_mail_award(mailObj,fun?){
        var oo:any = {};
        oo.id = mailObj.id
        Net.addUser(oo);
        Net.send(GameEvent.mail.get_mail_award,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail == 3)
            {
                MyWindow.Alert('邮件已被领取领取！')
                mailObj.stat = 1;
                this.saveData();
                EM.dispatch(GameEvent.client.mail_change);
                EM.dispatchEventWith(GameEvent.client.red_change)
                return
            }
            if(msg.fail == 1)
            {
                this.deleteMail(mailObj.id)
                MyWindow.Alert('邮件已过期')
                EM.dispatch(GameEvent.client.mail_change);
                EM.dispatchEventWith(GameEvent.client.red_change)
                return
            }
            if(msg.fail)
            {
                MyWindow.Alert('领取失败，错误代码：' + msg.fail)
                return;
            }
            mailObj.stat = 1;
            AwardUI.getInstance().show(msg.award)
            this.saveData();
            EM.dispatch(GameEvent.client.mail_change);
            EM.dispatchEventWith(GameEvent.client.red_change)
            if(fun)
                fun();
        });
    }
}