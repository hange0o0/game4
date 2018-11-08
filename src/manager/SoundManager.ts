/**
 *
 * @author 
 *
 */
class SoundManager {
    private static instance: SoundManager;

    public constructor() {
        this.init();
    }

    public static getInstance(): SoundManager {
        if(!this.instance)
            this.instance = new SoundManager();
        return this.instance;
    }
    //默认关闭音乐
    private _soundPlaying: boolean = false;
    private _bgPlaying: boolean = false;
    private _openShake: boolean = true;
    private _isPlayMovie: boolean = true;
    private _isMessage: boolean = true;

    private currentChannel:egret.SoundChannel;
    private currentKey :string;
    private bgKey :string;
    private lastBGKey :string;
    private isLoad:boolean=false;

    public pkKey = [];
    public effectKey = [];
    // private tween:egret.Tween
    
    private init(){
        //if(!App.isMobile){//pc上默认开音乐
        //    this._soundPlaying = true;
        //    this._bgPlaying = true;
        //}
        //
        //if(Config.isDebug)
        //{
            this._soundPlaying = true;
            this._bgPlaying = true;
        //}

        var som = SharedObjectManager.getInstance();
        if(som.getValue("sound") != undefined)
            this._soundPlaying = som.getValue("sound");
        if(som.getValue("bgsound") != undefined)
            this._bgPlaying = som.getValue("bgsound");

        if(som.getValue("openShake") != undefined)
            this._openShake = som.getValue("openShake");
        if(som.getValue("playMovie") != undefined)
            this._isPlayMovie = som.getValue("playMovie");
        if(som.getValue("showMessage") != undefined)
            this._isMessage = som.getValue("showMessage");

        this.isLoad=this._soundPlaying;
    }

    public get soundPlaying(){
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._soundPlaying
    }
    public get bgPlaying(){
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._bgPlaying
    }
    public get openShake(){
        return this._openShake
    }
    public get isPlayMovie(){
        return this._isPlayMovie
    }
    public get isMessage(){
        return this._isMessage
    }

    public set soundPlaying(v){
        if(this._soundPlaying!=v)
            SharedObjectManager.getInstance().setValue("sound",v)
        this._soundPlaying = v;
        this.loadEffectSound();
    }
    public set bgPlaying(v){
        if(this._bgPlaying!=v){
            SharedObjectManager.getInstance().setValue("bgsound",v);
        }
        this._bgPlaying= v;

        if(!v ){
            this.stopBgSound();
        }
        else{
            this.playSound(SoundConfig.bg);
        }
    }
    public set openShake(v){
        if(this._openShake!=v)
            SharedObjectManager.getInstance().setValue("openShake",v)
        this._openShake= v;
    }
    public set isPlayMovie(v){
        if(this._isPlayMovie!=v)
            SharedObjectManager.getInstance().setValue("playMovie",v)
        this._isPlayMovie= v;
    }
    public set isMessage(v){
        if(this._isMessage!=v)
            SharedObjectManager.getInstance().setValue("showMessage",v)
        this._isMessage= v;
    }

    public addBtnClickEffect(btn:egret.DisplayObject){
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            this.playBtn();
        },this)
    }

    public playBtn(){
        this.playEffect(SoundConfig.effect_button);
    }

    public stopBgSound(){
        this.lastBGKey = this.bgKey;
        this.bgKey = null;
        try{
            if(_get['app'])
            {
                AppManager.getInstance().stopBG();
                return;
            }
            // if(this.tween){
            //     this.tween.pause();
            //     this.tween = null;
            // }
            if(this.isQzonePlay){
                window["QZAppExternal"].stopBackSound();
                this.onSoundComplete();
                return;
            }
            egret.clearTimeout(this.playTime);
            if(this.currentChannel){
                egret.Tween.removeTweens(this.currentChannel);
                this.currentChannel.stop();
            }
            this.onSoundComplete();
        }catch(e){}
    }

    public playEffect(v:string, delay:number = 0){
        if(!this.soundPlaying) return;

        if(_get['app'])
        {
            AppManager.getInstance().playEffect(v + ".mp3");
            return;
        }

        try{
            if(this.isQzonePlay){
                window["QZAppExternal"].playLocalSound(this.getSoundObject(v));
                return;
            }
            v += "_mp3"
            var sound:egret.Sound = MyRES.getRes(v);
            if(sound) sound.play(0,1);
            else
            {
                RES.createGroup('sound', [v], true);
                RES.loadGroup("sound");
            }
        }
        catch(e){
        }
    }

    public resumeSound(){
        if(this.lastBGKey)
            this.playSound(this.lastBGKey);
    }

    private tempLoop:number;
    public playSound(key:string, loop:number = 5999){


        if(!this.bgPlaying) return;
        if(this.bgKey == key) return;

        this.bgKey = key;
        if(_get['app'])
        {
            AppManager.getInstance().playBG(key +".mp3");
            return;
        }

        var url = Config.localResRoot + "music/" + key +".mp3"
        if(this.currentKey == url) return;
        this.currentKey=url;


        
        try{
            if(this.isQzonePlay){
                window["QZAppExternal"].playLocalBackSound(this.getMusicObject(key));
                return;
            }
            this.tempLoop = loop;
            /*if(this.currentChannel && this.currentKey == url){
                return;
            }

            this.currentKey=url*/

            var loader: egret.URLLoader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            loader.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
            loader.load(new egret.URLRequest(url));
        }
        catch(e){
        }
    }

    /************************************************************************************************** */
    /* 测试QQ空间 播放音乐 注意必必须预加载才能播放
    private testQzonePay(){
        var op = {
            'id':'bg_01_index',
            'url': 'http://space2.flash8f.com/resource/music1/12_treasure_ten.mp3',
            'bid': 0,
            'loop':2,
            'refresh': false
        }
        window["QZAppExternal"].preloadSound(function(evt){
            window["QZAppExternal"].playLocalSound(op);
            //window["QZAppExternal"].playLocalBackSound(op);
            //alert(evt.code + "---"+ op.bid);
        }, op);
    }*/

    private getSoundObject(soundID){
        var baseUrl = Config.localResRoot + "music/"
        return{
            'id':soundID,
            'url': baseUrl +  soundID +'.mp3',
            'bid': 0,
            'refresh': false,
            'loop': 0
        }
    }
    private getMusicObject(soundID){
        var oo:any = this.getSoundObject(soundID);
        oo.loop = -1;
        return oo;
    }

    public get isQzonePlay(){
        return false;
        // return Config.openQzonSound && !Config.isTouch && (getQzoneVerCode()>=40600);//qzone 4.6支持
        //return !Config.isTouch && (getQzoneVerCode()>=40600);//qzone 4.6支持
    }
    
    public preLoad(){
        var self = this;
        var index = 0;
        //var nameList = ["b101","b102","b103","b104",
        //    "f201","f202","f203","f204","f205","f206","f207","f208","f209","f210","f211","f212","f213","f214","f215","f216",
        //    "f301","f302","f303","f304","f305","f306","f307","f308","f309","f310","f311","f312","f313","f314","f315","f316",
        //    "f317","f318","f319","f320","f321","f322","f323"];

        var nameList = SoundConfig;


        var data = {groups:[],resources:[]}
        var arr = data.resources;
        var keysArr = this.pkKey = [];
        var addResources = function(name,path){
            arr.push({
                "name":name + "_mp3",
                "type":"sound",
                "url": path
            })
            keysArr.push(name + "_mp3");
        }

        var baseUrl = Config.localResRoot + "music/"
        for(var i in nameList){
            var op = this.getSoundObject(nameList[i]);
            if(nameList[i].indexOf('effect_') == 0)       {
                addResources(nameList[i], "music/" + nameList[i]+'.mp3')
                this.effectKey.push(nameList[i] + "_mp3")
            }
            else if(nameList[i].indexOf('pk_') == 0)       {
                addResources(nameList[i], "music/" + nameList[i]+'.mp3')
                this.pkKey.push(nameList[i] + "_mp3")
            }

            index ++;
            //(function(op){
            //    egret.setTimeout(function(){
            //        self.preLoadOne(op);
            //    }, this,100*index)
            //})(op)
        }


        if(!this.isQzonePlay) {
            for(var j=0;j<arr.length;j++)
            {
                MyRES.reg(arr[j].name,Config.localResRoot + arr[j].url);
            }
            //RES.parseConfig(data, Config.localResRoot);
            //RES.createGroup('sound', keysArr, true);
            //RES.loadGroup("sound");
        }




    }
    private preLoadOne(op){
        try{
            var self = this;
            if(this.isQzonePlay){
                window["QZAppExternal"].preloadSound(function(evt){
                    var url = Config.localResRoot + "music/" + op.id + ".mp3";
                    if(self.currentKey == url){
                        self.playSound(op.id);
                    }
                }, op);
                return;
            }
        }
        catch(e){}
    }


    public loadPKSound(){
        if(!this.soundPlaying)
            return;
        if(this.pkKey)
        {
            MyRES.loadGroup( SoundManager.getInstance().effectKey);
            this.pkKey = null;
        }
    }
    public loadEffectSound(){
        if(!this.soundPlaying)
            return;
        if(this.effectKey)
        {
            MyRES.loadGroup( SoundManager.getInstance().effectKey);
            this.effectKey = null;
        }
    }


    /************************************************************************************************** */
    
    private playTime:number;
    private onLoadComplete(event: egret.Event): void {
        egret.clearTimeout(this.playTime);

        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var self = this;
        try{
            this.onLoadError(event);
            if((this.currentKey && loader.data.url != this.currentKey) || !this._bgPlaying)
                return;
            if(this.currentChannel){
                // if(self.tween){//正在开始播
                //     egret.Tween.removeTweens(self.currentChannel);
                //     self.currentChannel.stop();
                //     self.tween = null;
                // }
                // self.tween = egret.Tween.get(this.currentChannel).to({volume:0},500).call(()=>{
                //     try{
                //         self.tween = null;
                //         if(self.currentChannel)
                            self.currentChannel.stop();
                            self.currentChannel=null;

                            if(!self._bgPlaying)return;
                            this.playTime = egret.setTimeout(fun, this, 150);
                            // fun();
                    // }
                    // catch(e){
                    // }
                // })
            }
            else
                fun();
        }
        catch(e){
        }

        function fun(){
            var sound: egret.Sound = <egret.Sound>loader.data;
            var channel: egret.SoundChannel = sound.play(0,self.tempLoop);
            // channel.volume =0;
            self.currentChannel = channel;
            // self.tween = egret.Tween.get(channel).to({volume:1},500).call(
            //     ()=>{
            //         self.tween = null;
            //     }
            // )
            channel.addEventListener(egret.Event.SOUND_COMPLETE, self.onSoundComplete, self);
        }

    }

    private onSoundComplete(event?:egret.Event):void {
        this.currentChannel = null;
        this.currentKey = null;
    }

    private onLoadError(event: egret.Event): void {
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        loader.removeEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
    }
    
    public fillData(d:Array<any>):void{
        if(d) {
            for(var i:number = 0;i < d.length;i++) {
                switch(d[i]["id"]) {
                    case 1:
                        this.soundPlaying = d[i]["num"] == 1;
                        break;
                    case 2:
                        this.bgPlaying = d[i]["num"] == 1;
                        break;
                    case 3:
                        this.openShake = d[i]["num"] == 1;
                        break;
                    case 4:
                        this.isPlayMovie = d[i]["num"] == 1;
                        break;
                    case 5:
                        this.isMessage = d[i]["num"] == 1;
                        break;
                }
            }
        }
    }
    /*public updateSetting(ids: Array<any>){
        var o:Array<any> =[];
        if(ids){
            for(var i = 0 ; i < ids.length;i++){
                switch(ids[i]){
                    case 1:
                        o.push({id:1,num:this.soundPlaying?1:0});
                        break;
                    case 2:
                        o.push({id:2,num:this.bgPlaying?1:0});
                        break;
                    case 3:
                        o.push({id:3,num:this.openShake?1:0});
                        break;
                    case 4:
                        o.push({id:4,num:this.isPlayMovie?1:0});
                        break;
                    case 5:
                        o.push({id:5,num:this.isMessage?1:0});
                        break;
                }
            }
        }
        else{
            o.push({id:1,num:this.soundPlaying?1:0});
            o.push({id:2,num:this.bgPlaying?1:0});
            o.push({id:3,num:this.openShake?1:0});
            o.push({id:4,num:this.isPlayMovie?1:0});
//            o.push({id:6,num:this.isLover?1:0});
            o.push({id:5,num:this.isMessage?1:0});
        }
        Net.instance.sendData(ServerEvent.sys.setting,{ data: o },null,false);
    }*/
}

class SoundConfig {
    public static bg: string = "bg";
    public static bg_pk: string = "bg_pk";
    public static bg_pk_view: string = "bg_pk_view";
    public static effect_buy: string = "effect_buy";
    public static effect_button: string = "effect_button";
    public static effect_join: string = "effect_join";
    public static effect_m_up: string = "effect_m_up";
    public static effect_u_up: string = "effect_u_up";
    public static pk_win: string = "pk_win";
    public static pk_loss: string = "pk_loss";
    public static pk_effect1: string = "pk_effect1";
    public static pk_effect2: string = "pk_effect2";
    public static pk_effect3: string = "pk_effect3";
    public static pk_effect4: string = "pk_effect4";
    public static pk_effect5: string = "pk_effect5";
    //public static pk_effect6: string = "pk_effect6";
    public static pk_effect7: string = "pk_effect7";
    public static pk_effect8: string = "pk_effect8";
    //public static pk_effect9: string = "pk_effect9";
    //public static pk_effect10: string = "pk_effect10";
    //public static pk_effect11: string = "pk_effect11";
    public static pk_effect12: string = "pk_effect12";
    //public static pk_effect13: string = "pk_effect13";
    public static pk_effect14: string = "pk_effect14";
    public static pk_effect15: string = "pk_effect15";
    public static pk_effect16: string = "pk_effect16";
    public static pk_jump: string = "pk_jump";
    public static pk_jump2: string = "pk_jump2";
    public static pk_run: string = "pk_run";
}
