class PKCardInfoUI extends game.BaseContainer {

    private static _instance: PKCardInfoUI;
    public static getInstance(): PKCardInfoUI {
        if(!this._instance)
            this._instance = new PKCardInfoUI();
        return this._instance;
    }

    private type: eui.Image;
    private nameText: eui.Label;
    private cardGroup: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private desText: eui.Label;
    private group: eui.Group;
    private list1: eui.List;
    private line: eui.Image;
    private list2: eui.List;
    private teamIcon: eui.Image;



    public dataIn

    private stageX
    private stageY
    public constructor() {
        super();
        this.skinName = "PKCardInfoSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.img.hideType = true;
        this.list1.itemRenderer = PKCardInfoItem
        this.list2.itemRenderer = PKCardInfoItem
    }


    public show(v){

        GameManager.container.addChild(this);
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this,true);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.stageX = GameManager.stageX
        this.stageY = GameManager.stageY
        var w = 560
        this.x = Math.min(Math.max(GameManager.stageX - w/2,0),640-w)
        this.renew(v);
        var y = 0;
        if(GameManager.stageY < GameManager.stage.stageHeight/2)
        {
            y = GameManager.stageY + 50
            if(v.target)
            {
                y = v.target.localToGlobal(0,0).y  + v.target.height + 50
            }
            this.y = Math.min(y,GameManager.stage.stageHeight - this.height)
            //    this.bottom = undefined
            //this.top = Math.max(0,GameManager.stageY + 50)
        }
        else
        {
            y = GameManager.stageY - 50 - this.height
            if(v.target)
            {
                y = v.target.localToGlobal(0,0).y  - 50 -this.height
            }
            this.y = Math.max(y,0)
            //this.top = undefined
            //this.bottom = Math.max(0,(GameManager.stage.stageHeight - GameManager.stageY) + 50)
        }

        //console.log(this.height)
        //this.y =
    }

    private onMove(e){
         if(Math.abs(this.stageX - e.stageX) > 20 || Math.abs(this.stageY - e.stageY) > 20)
            this.hide();
    }

    public hide() {
        game.BaseUI.setStopEevent();
        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        MyTool.removeMC(this)
    }


    public renew(v){
        var CRM = CardManager.getInstance();
        this.dataIn = v;
        var vo:any = CM.getCardVO(this.dataIn.mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
        this.nameText.text = vo.name;
        this.type.source = vo.getTypeIcon()

        if(this.dataIn.rota)
        {
            this.teamIcon.source = this.dataIn.rota == PKConfig.ROTA_LEFT ? 'card_battle2_png' : 'card_battle_png'
            this.teamIcon.visible = true
        }
        else
        {
            this.teamIcon.visible = false
        }


        var baseForceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force)
        var forceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force,this.dataIn.type)
        this.setHtml(this.desText,vo.getDes(forceAdd,true));
        console.log(forceAdd)
        var str = vo.isMonster? '传送':'施法'

        var arr1:any = [
            {index:1,icon:'icon_cost_png',iconScale:1,title:str + '费用',value:vo.cost,valueAdd:0},
            //{index:1,icon:'',iconScale:1,title:'',value:0,valueAdd:0},
        ]

        if(vo.isMonster)
        {
            arr1.push({index:2,icon:'icon_times_png',iconScale:1,title:'传送次数',value:vo.num || 1,valueAdd:0})
            arr1.push({index:3,icon:'icon_clock_png',iconScale:1,title:str + '间隔',value:MyTool.toFixed(vo.cd/1000,1)+'秒',valueAdd:0})
        }
        else
        {
            if(vo.num == 0)
                arr1.push({index:2,icon:'icon_clock2_png',iconScale:1,title:'持续时间',value:MyTool.toFixed(vo.cd/1000,1)+'秒',valueAdd:0})
            else if(vo.num == 1)
                arr1.push({index:2,icon:'icon_clock_png',iconScale:1,title:'技能次数',value:'单次',valueAdd:0})
            else if(vo.num > 1)
            {
                arr1.push({index:2,icon:'icon_clock_png',iconScale:1,title:'持续时间',value:MyTool.toFixed((vo.num-1) * vo.cd/1000,1)+'秒',valueAdd:0})
                arr1.push({index:3,icon:'icon_clock_png',iconScale:1,title:str + '间隔',value:MyTool.toFixed(vo.cd/1000,1)+'秒',valueAdd:0})
            }
        }

        MyTool.removeMC(this.line)
        MyTool.removeMC(this.list2)


        if(vo.isMonster)
        {
            //arr1.push({index:4,icon:'',iconScale:1,title:'间隔',value:vo.cost,valueAdd:0})

            this.type.scaleX = this.type.scaleY = 0.6
            this.addMonsterList(vo)
        }
        else
        {
            this.type.scaleX = this.type.scaleY = 1

            if(vo.mid)
            {
                this.addMonsterList(CM.getCardVO(vo.mid))
            }
        }

        if(arr1.length%2 == 1)
            arr1.push({index:4,icon:'',iconScale:1,title:'',value:'',valueAdd:0});

        this.list1.dataProvider = new eui.ArrayCollection(arr1)




    }

    private addMonsterList(vo){
        var baseForceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force)
        var forceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force,this.dataIn.type)

        this.group.addChild(this.line)
        this.group.addChild(this.list2)
        var atk = Math.floor(vo.atk * baseForceAdd);
        var hp = Math.floor(vo.hp * baseForceAdd);
        var def = vo.def;

        var ark2 = Math.floor(vo.atk * forceAdd);
        var hp2 = Math.floor(vo.hp * forceAdd);
        var def2 = def + (this.dataIn.teamDef || 0);
        //if(this.dataIn.pos == 1)
        //    ark2 = Math.floor(ark2*1.1);
        //else if(this.dataIn.pos == 2)
        //    hp2 = Math.floor(hp2*1.1);
        //else if(this.dataIn.pos == 3)
        //    def2 += 5;
        var arr2:any = [
            {index:1,icon:'icon_love_png',iconScale:0.6,title:'血量',value:hp,valueAdd:hp2 - hp}
        ]
        if(atk)
        {
            arr2.push({index:2,icon:'icon_atk_png',iconScale:1,title:'攻击力',value:atk,valueAdd:ark2-atk})
            arr2.push({index:5,icon:'icon_atkcd_png',iconScale:1,title:'攻击间隔',value:MyTool.toFixed(vo.atkcd/1000,1)+'秒',valueAdd:0})
            arr2.push({index:6,icon:'icon_rage_png',iconScale:1,title:'攻击距离',value:vo.isNearAtk()?'近战':vo.atkrage,valueAdd:0})
        }

        arr2.push({index:3,icon:'icon_def1_png',iconScale:0.4,title:'防御',value:def,valueAdd:def2 - def})
        arr2.push({index:4,icon:'icon_speed_png',iconScale:1,title:'移动速度',value:vo.speed,valueAdd:0})
        arr2.push({index:4,icon:'icon_atkhp_png',iconScale:1,title:'队伍伤害',value:vo.atk2,valueAdd:0})
        arr2.push({index:7,icon:'icon_pos_png',iconScale:1,title:'需要人口',value:vo.space,valueAdd:0})

        if(vo.skillcd > 0)
            arr2.push({index:0,icon:'icon_clock_png',iconScale:1,title:'技能间隔',value:MyTool.toFixed(vo.skillcd/1000,1)+'秒',valueAdd:0});
        if(arr2.length%2 ==1)
            arr2.push({index:0,icon:'',iconScale:1,title:'',value:'',valueAdd:0});
        for(var i=0;i<arr2.length;i++)
        {
            arr2[i].index = i+1;
        }


        //else
        //    arr2.push({index:0,icon:'',iconScale:1,title:'',value:'',valueAdd:0});
        this.list2.dataProvider = new eui.ArrayCollection(arr2)
    }
}