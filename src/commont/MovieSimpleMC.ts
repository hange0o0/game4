/**
 * 简化版 MovieClip
 * @author
 */
class MovieSimpleMC extends egret.EventDispatcher{
    private icon: eui.Image;
    private list: Array<string>;
    private current: number = 0;
    private max: number;

    private sleepFrame:number = 0;//一个循环后停止多少帧播放下一次
    private currSleep:number;
    private isOnce:boolean;
    private times:number;

    private timeID: egret.Timer;

    /*
     * var bgMovie = new MovieSimpleMC(this.bg,["map_city_item1_png","map_city_item2_png"]);
     bgMovie.gotoAndPay(0);
     */
    public constructor(icon: eui.Image, data:Array<string>, millisecond?:number, sleepFrame?:number) {
        super();
        this.icon = icon;
        this.setList(data);
        this.sleepFrame = sleepFrame || 0;
        this.currSleep = 0;

        this.timeID = new egret.Timer(millisecond || 42,0);//24帧每秒
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        return this;
    }

    public get isPlaying(){
        return this.timeID.running;
    }

    public setList(data:Array<string>){
        this.list = data;
        this.max = data.length;
    }

    public play(){
        if(this.list.length == 1){
            this.icon.source = this.list[0];
            this.stop();
            return;
        }
        this.currSleep = 0;
        this.timeID.start();
        return this;
    }

    public stop(){
        this.timeID.stop();
    }

    public gotoAndPlay(value:number=0){
        this.current = value;
        this.isOnce = false;
        this.times  = 0;
        this.icon.source = this.list[this.current];
        this.play();
    }
    public gotoAndPlayOnce(value:number=0){
        this.current = value;
        this.isOnce = true;
        this.times  = 0;
        this.icon.source = this.list[this.current];
        this.play();
    }
    public gotoAndPlayTimes(value:number=1){
        this.current = 0;
        this.isOnce = false;
        this.times = value;
        this.icon.source = this.list[this.current];
        this.play();
    }

    private updateTime(){
        if(this.sleepFrame != 0 && this.currSleep > 0){
            if(++this.currSleep == this.sleepFrame){
                this.currSleep = 0;
            }
            return;
        }
//        this.current++;
        this.icon.source = this.list[this.current];

//        console.log('this.icon.source',this.icon.source);
        if(++this.current == this.max){
            this.current = 0;
            this.currSleep = 1;
            if(this.isOnce)
            {
                this.dispatchEventWith("complete")
                this.stop();
            }
            else if(this.times > 0)
            {
                this.times --;
                if(this.times == 0)
                {
                    this.dispatchEventWith("complete")
                    this.stop();
                }

            }
        }
    }

    public dispose(){
        this.stop();
        // this.timeID.removeEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        // this.timeID = null;
        // this.icon.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
    }

    public setAutoDispose(){
        this.icon.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
    }
}


/**
 * 简化版 MovieClip
 * @author
 */
class MovieSimpleMC2 extends egret.DisplayObjectContainer {
    private icon: eui.Image;
    private iconWidth:number;
    private iconHeight: number;
    private current: number = 0;
    private max: number;

    private timeID: egret.Timer;

    /**
     * 播放次数
     * 默认为0
     * 0为无限循环
     * 1为只播放1次，2为播放2次，如此累推
     */
    private playTimes:number;
    private now_playTimes:number;
    /**
     * 是否循环
     */
    private isLoop:boolean;

    /*
     * var bgMovie = new MovieSimpleMC();
     * bgMovie.setData(this.bg,width,height,num);
     bgMovie.gotoAndPay(0);
     */
    public constructor() {
        super();
        this.touchEnabled = this.touchChildren = false;
    }

    public setData(icon: eui.Image | string,width: number,height: number,num: number,millisecond?: number,playTimes?:number):MovieSimpleMC2 {
        this.icon = <eui.Image>icon;
        if(typeof (icon) == "string"){
            this.icon = new eui.Image(<string>icon);
        }
        this.addChild(this.icon);

        this.iconWidth = width;
        this.iconHeight = height;
        this.max = num;

        if(!this.timeID){
            this.timeID = new egret.Timer(millisecond || 42,0);//24帧每秒
            this.timeID.addEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        }

        //播放次数
        this.playTimes = playTimes || 0;
        this.isLoop = ((this.playTimes == 0 ) ? true : false);

        this.reSet();

        return this;
    }
    public reSetSource(source:string){
        if(this.icon){
            this.icon.source = source;
        }
    }
    public setXY(value:{x?:number,y?:number,scaleX?:number,scaleY?:number}){
        if(value.x) this.x = value.x;
        if(value.y) this.y = value.y;
        if(value.scaleX) this.scaleX = value.scaleX;
        if(value.scaleY) this.scaleY = value.scaleY;
    }

    public play() {
        this.timeID.start();
    }

    public stop() {
        this.timeID.stop();
    }

    public reSet(){
        this.now_playTimes = 0;
    }

    public gotoAndPay(value: number) {
        this.current = value - 1;
        this.icon.scrollRect = new egret.Rectangle(this.current * this.iconWidth,0,this.iconWidth,this.iconHeight);
        this.play();
    }

    public gotoAndStop(value){
        this.current = value - 1;
        this.icon.scrollRect = new egret.Rectangle(this.current * this.iconWidth,0,this.iconWidth,this.iconHeight);
    }

    private updateTime()
    {
        this.icon.scrollRect = new egret.Rectangle(this.current * this.iconWidth,0,this.iconWidth,this.iconHeight);
        if(++this.current == this.max)
        {
            this.current = 0;
            if( !this.isLoop )
            {
                if( ++this.now_playTimes == this.playTimes)
                {
                    this.stop();
                    this.dispatchEventWith("stop");
                }
            }
        }
    }

    public dispose() {
        this.stop();
        this.timeID.removeEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        this.timeID = null;
    }
}
