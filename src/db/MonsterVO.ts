class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public isMonster = true;

    public width: number;
    public height: number;
    public atk: number;
    public type: number;
    public headoff: number;
    public heightoff: number;
    public atkcd: number;
    public cost: number;
    public space: number;
    public def: number;
    public cd: number;
    public num: number;
    public atkrage: number;
    public level: number;
    public mcnum: number;
    public mcheight: number;
    public name: string;
    //public num2: number;
    public des: string;
    public speed: number;
    public hp: number;
    public skillcd: number;
    public id: number;
    public mcwidth: number;
    public atk2: number;
    public mv_atk: number;
    public mv_atk2: number;
    public sv1: number;
    public sv2: number;
    public sv3: number;
    public sv4: number;  //no use


    public haveLoad = false;
    public temp = 0
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.width = data.width
        this.height = data.height
        this.atk = data.atk
        this.type = data.type
        this.headoff = data.headoff
        this.heightoff = data.heightoff
        this.atkcd = data.atkcd * 1000
        this.cost = data.cost
        this.space = data.space
        this.def = data.def
        this.cd = data.cd * 1000
        this.num = data.num
        //this.num2 = data.num2
        this.atkrage = data.atkrage
        this.level = data.level
        this.mcnum = data.mcnum
        this.mcheight = data.mcheight
        this.name = data.name
        this.des = data.des
        this.speed = data.speed
        this.hp = data.hp
        this.id = data.id
        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.mcwidth = data.mcwidth
        this.atk2 = data.atk2
        this.skillcd = data.skillcd * 1000
        this.mv_atk = data.mv_atk * 1000
        this.mv_atk2 = data.mv_atk2

        //this.speed = 50;

        //var arr = [];
        //for(var s in MonsterVO.data)
        //{
        //    if(MonsterVO.data[s].level < 998)
        //        arr.push(MonsterVO.data[s])
        //}
        ////console.log(arr.join(','));
        ////ArrayUtil.sortByField(arr,['level'],[0])
        //for(var i=0;i<arr.length;i++)
        //{
        //    console.log(arr[i].level,arr[i].id,arr[i].name)
        //}
        //var arr = [];
        ////var obj = {}
        //for(var s in SkillVO.data)
        //{
        //    if(SkillVO.data[s].level < 998)
        //    {
        //        arr.push(SkillVO.data[s])
        //        //if(!obj[MonsterVO.data[s].level])
        //        //    obj[MonsterVO.data[s].level] = []
        //        //obj[MonsterVO.data[s].level].push(MonsterVO.data[s])
        //    }
        //}
        //console.log(arr.join(','));
        //var arr = MonsterVO.
        //ArrayUtil.sortByField(arr,['level'],[0])
        //for(var i=0;i<arr.length;i++)
        //{
        //    var vo = arr[i];
        //    console.log('LV.' +vo.level+ '\t\tid:' + vo.id+ '\t\t' + vo.name)
        //}

        //for(var s in obj)
        //{
        //    console.log('---------------LV.' + s + '\t\tnum:' + obj[s].length)
        //    for(var i=0;i<obj[s].length;i++)
        //    {
        //        var vo = obj[s][i];
        //        console.log('LV.' +vo.level+ '\t\tid:' + vo.id+ '\t\t' + vo.name)
        //    }
        //
        //}
    }





    public getImage(gay?){
        if(gay)
            return Config.localResRoot + 'card_gay/card_'+this.id+'.jpg';
        return Config.localResRoot + 'card/card_'+this.id+'.jpg';
    }

    public getHeroBG(star){
        return 'hero_bg'+star+'_png'
    }

    public getBG(){
        if(this.type == 1)
            return 'border_7_png';
        if(this.type == 2)
            return 'border_6_png';
        return 'border_8_png';
    }

    public getTypeIcon(){
        return 'icon_type'+this.type+'_png'
    }

    public preLoad(){
        if(this.haveLoad)
            return;
        MyRES.loadGroup(['enemy'+this.id+'_png'])
         MBase.getData(this.id).preload();
        this.haveLoad = true;
    }

    public getAdd(force,type?){
        if(type)
            var typeAdd = this.type == type?PKConfig.typeAdd:0
        else
            var typeAdd = 0;
        var add = (1+force/100)*(1+typeAdd/100);
        return add;
    }

    public getSkillValue(index,force=0){
        var sv = this['sv' + index];
        //if(DEBUG && !GuideManager.getInstance().isGuiding)
        //{
        //    if(force && this.des.indexOf('$'+index) == -1)
        //        throw new Error(this.id + '_$' + index)
        //    else if(!force && this.des.indexOf('#'+index) == -1)
        //        throw new Error(this.id + '_#' + index)
        //}
        if(!force)
            return sv
        return Math.floor(sv * (1+force/100));
    }

    public getDes(forceRate,fillColor?){
        return this.des.replace('#1',this.fillColor(this.sv1,fillColor)).
            replace('#2',this.fillColor(this.sv2,fillColor)).
            replace('#3',this.fillColor(this.sv3,fillColor)).
            replace('$1',this.changeValue(this.sv1,forceRate,fillColor)).
            replace('$2',this.changeValue(this.sv2,forceRate,fillColor) + '').
            replace('$3',this.changeValue(this.sv3,forceRate,fillColor)).
            replace('#CD',MyTool.toFixed(this.cd/1000,1) + '')   //CD初始时乘了1000
    }

    private fillColor(str,fillColor){
        if(fillColor)
            return MyTool.createHtml(str,0xFFD67F)
        return str
    }

    private changeValue(v,forceRate,fillColor){
        if(!v)
            return;
        return this.fillColor(Math.ceil(v*forceRate),fillColor);
    }

    public getAtkDis(){
        return this.width/2 + this.atkrage
    }

    public isNearAtk(){
        return this.atkrage <= PKConfig.nearRage
    }

    public isHero(){
        return false;
    }


}