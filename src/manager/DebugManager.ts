class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public stop = 0;
    public winCardArr = [];
    public finishFun = function(){return false}


    public constructor() {
    }

    public testHangView = false //在挂机中测试所有单位动画
    public MML = 998;  //测试出战怪的等级
    public addSkill = false
    public addHeroLevel = 0
    public maxHeroLevel = 20 //已开放的最大英雄等级
    public cardLen = 20
    public needTestTwo = false
    public createHangFlag = false;


    public printDetail = false;  //打印胜出怪物
    public winMonster = {}
    public winUseCard = []



}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;