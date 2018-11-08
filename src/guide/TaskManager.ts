class TaskManager {
    private static _instance:TaskManager;
    public static getInstance():TaskManager {
        if (!this._instance)
            this._instance = new TaskManager();
        return this._instance;
    }

    private guideLight;
    public nowAction//正在进行的指引
    public actionStep//正在进行的指引的步数

    public lastFinishStat = {};


    public constructor() {

    }

    public initData(){
        this.lastFinishStat = {};
        var list = this.getCurrentTaskList()
        for(var i=0;i<list.length;i++)
        {
            var item = list[i];
            this.lastFinishStat[item.id] = item.isFinish()
        }
    }

    public cleanNowAcrion(key){
        if(TaskManager.getInstance().nowAction == key)
            TaskManager.getInstance().nowAction = null;
    }

    public getTaskIDByLine(line){
        var task = ActiveManager.getInstance().task;
        return task[line]
    }

    //当前的任务列表
    public getCurrentTaskList(){
        //var task = ActiveManager.getInstance().task;
        //var line = TaskVO.lineData;
        var arr = [];
        //if(!task.award)
        //    arr.push(line[0])
        //else
        //{
        //    var vo = TaskVO.getObject(task.award).getNextTaskVO();
        //    if(vo && vo.isEnable())
        //        arr.push(vo);
        //}

        //for(var s in task)
        //{
        //    if(s == 'stat')
        //        continue;
        //    var vo = TaskVO.getObject(task[s]).getNextTaskVO();
        //    if(vo && vo.isEnable())
        //        arr.push(vo);
        //}


        //for(var s in line)
        //{
        //    if(!task[s])
        //    {
        //        var vo = TaskVO.lineData[s][0];
        //        if(vo.isEnable())
        //            arr.push(vo);
        //    }
        //}
        return arr;
    }


    //在MC上显示一次光效
    public showGuideMC(mc) {
        if (!this.guideLight) {
            var data:any = RES.getRes('guide_mv' + "_json"); //qid
            var texture:egret.Texture = RES.getRes('guide_mv' + "_png");
            if (data == null || texture == null) {
                return
            }
            var mcFactory = new egret.MovieClipDataFactory(data, texture);

            this.guideLight = new egret.MovieClip();
            this.guideLight.movieClipData = mcFactory.generateMovieClipData('click_guide');
            this.guideLight.addEventListener(egret.MovieClipEvent.COMPLETE, this.onGuideLightComplete, this)
            this.guideLight.frameRate = 12//技能动画变慢
            this.guideLight.touchEnabled = false;
        }

        setTimeout(()=>{
            var rect = mc.getBounds();
            rect.x += mc.anchorOffsetX
            rect.y += mc.anchorOffsetY
            var p1 = mc.localToGlobal(rect.x, rect.y);
            var p2 = mc.localToGlobal(rect.x + rect.width, rect.y + rect.height);

            this.guideLight.x = p1.x + (p2.x - p1.x) / 2
            this.guideLight.y = p1.y + (p2.y - p1.y) / 2
            GameManager.container.addChild(this.guideLight);
            this.guideLight.gotoAndPlay(1, 1);
        },200);

    }

    private onGuideLightComplete() {
        this.guideLight.stop();
        MyTool.removeMC(this.guideLight);
    }


    public getTaskAward(taskid,fun?){
        var self = this;
        var oo:any = {};
        oo.taskid = taskid;
        Net.addUser(oo);
        Net.send(GameEvent.task.get_task_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail ==1)
            {
                MyWindow.Alert('该任务不在进行中')
                return;
            }
            if(msg.fail ==2)
            {
                MyWindow.Alert('该任务还没开启')
                return;
            }
            if(msg.fail ==3)
            {
                MyWindow.Alert('该任务还没完成')
                return;
            }
            msg.award.title = '任务完成';
            AwardUI.getInstance().show(msg.award)
            EM.dispatch(GameEvent.client.task_change);
            if(fun)
                fun();
        });
    }
}