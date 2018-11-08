/**
 *
 * @author 
 *
 */
class Config {
	public constructor() {
	}

    public static isDebug: boolean = true;
    public static userHost: string = 'hangegame.com';
    public static host: string = 'hangegame.com';
    public static pkServerHost: string = '172.17.196.195';
    public static pkServerPose = 9029;
    public static serverID: number = 1;
    //public static host: string = '172.17.196.195:90';
    public static user_version: number = 1;
    public static version: number = 1;
    public static displayVersion = '1.0.0';
    public static pk_version: number = 1;
    public static cdn: string = "";
    public static localResRoot:string = "resource/net_resource/";



    public static slaveLevel = 10;
    public static activeLevel = 20;
    public static pvpLevel = 15;
    public static heroLevel = 50;


    //public static friendLevel = 3;
    //public static gambleLevel = 20;
    //
    //
    //public static mapLevel = 5;
    //public static dayLevel = 15;
    //public static serverLevel = 25;//卡士二阶
    //public static serverEqualLevel = 45;  //卡士五阶
    //public static leaderLevel = 95;  //
    //public static leaderSkillLevel = 145;  //


    public static platform = '';
    public static platformGameidAdd = '';
    public static equalValue = 1000;


    public static init(){
        Config.isDebug =  SharedObjectManager.getInstance().getValue('debug_open');

        var data = {groups:[],resources:[]}
        var arr = data.resources;
        var mData = MonsterVO.data;
        for(var s in mData)
        {
            arr.push(this.createImg("enemy" + s+'.png','monster/'));
        }
        arr.push(this.createImg('enemy_diamond.png','monster/'));


        for(var i=1;i<=1;i++)
        {
            arr.push(this.createImg("pk_bg" + i + ".png"));
        }
        arr.push(this.createImg('pk_arrow.png','monster/'));
        arr.push(this.createImg('pk_arrow_1.png','monster/'));
        for(var i=1;i<=5;i++)
        {
            arr.push(this.createImg("effect" + i + ".png",'monster/'));
        }

        var aniList = [5, 8,30,102,103,104,111,112,119,128,166,200,201,1001];
        for(var i=0;i<aniList.length;i++)
        {
            arr.push(this.createJSON('skill' + aniList[i] + '.json','ani/'));
            arr.push(this.createImg('skill' + aniList[i] + '.png','ani/'));
            AniManager.getInstance().aniList.push('skill' + aniList[i]);
        }


        for(var i=1;i<=10;i++)
        {
            arr.push(this.createImg('bullet' + i + '.png','ani/'));
        }

        for(var i=0;i<arr.length;i++)
        {
            MyRES.reg(arr[i].name,Config.localResRoot + arr[i].url);
        }
        console.log(MyRES.path)

        //RES.parseConfig(data, Config.localResRoot);
        console.log(data)
    }

    private static createImg(name,path=''){
        return {
           "name":name.replace('.','_'),
           "type":"image",
           "url": path + name
       }
    }
    private static createJSON(name,path=''){
        return {
           "name":name.replace('.','_'),
           "type":"json",
           "url": path + name
       }
    }
}
