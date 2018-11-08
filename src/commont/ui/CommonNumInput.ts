/**
 *
 * @author 
 * 事件用法：this.numCon.addEventListener(CommonNumInput.RENEW,this.renewCoin,this);
 */
class CommonNumInput extends game.BaseItem{
    public static RENEW:string = "renew";
	public constructor() {
    	super();
        this.skinName = "CommonNumInputSkin";
	}
	private reduceBtn: eui.Image;
	private addBtn: eui.Image;
	private input: eui.EditableText;
    private _maxNum:number = 999;
    public minNum:number=1;
    public stepNum:number = 1;//点击一次增加的数值;

    public addStr = ''

    public childrenCreated() {
        super.childrenCreated();
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)
        this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)
        this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.input.addEventListener(egret.TextEvent.FOCUS_OUT,this.onOut,this);
        this.input.addEventListener(egret.TextEvent.FOCUS_IN,this.onIn,this);
        this.input.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
    }

    public set maxNum(v){
        this._maxNum = v;
        this.input.maxChars = String(v).length+1
    }

    public get maxNum(){
        return this._maxNum;
    }

    private startTime:number
    private timer:any;
    private addNum:number
    private _nowNum:number;
    private onStart(e:egret.Event) {
        e.preventDefault();
        this.startTime = TM.now();
        this.timer = TickerManager.getInstance().setTickerOnce(this.onTimer,500,this);
        this.addNum = (e.currentTarget == this.addBtn ? 1 : -1) * this.stepNum;
        MyTool.changeGray(this.addBtn,false,true);
        MyTool.changeGray(this.reduceBtn,false,true);
        this.onTimer(true);
    }

    private onTimer(bool) {
        this._nowNum += this.addNum;
        if(this._nowNum >= this._maxNum) {
            this._nowNum = this._maxNum;
            this.addNum = 0;
            MyTool.changeGray(this.addBtn,true,true);
        }
        else if(this._nowNum <= this.minNum ) {
            this._nowNum =this.minNum;
            this.addNum = 0;
            MyTool.changeGray(this.reduceBtn,true,true);
        }
        //else if(this.minNum == 1 && this._nowNum < 0 ) {
        //    this._nowNum = this.addNum = 0;
        //}
        //else if(this.minNum>1 && this._nowNum <this.minNum)
        //{
        //    this._nowNum = this.minNum;
        //    this.addNum = 0;
        //}
        if(!bool && this.addNum != 0)
            this.timer = TickerManager.getInstance().setTickerOnce(this.onTimer,30,this);
        this.input.text = this._nowNum + this.addStr;
        this.renewCoin();
    }

    private onEnd(e) {
        TickerManager.getInstance().clearTicker(this.timer);
    }
    private onIn() {
        this.input.text = parseInt(this.input.text) + '';
    }

    private onOut() {
        var num = parseInt(this.input.text);
        this.input.text = num + this.addStr;
        //如果不是 stepNum 的整数倍 需要修正
        if(num%this.stepNum != 0){
            this.nowNum = Math.ceil(num/this.stepNum) * this.stepNum;
        }
        MyTool.changeGray(this.addBtn,false,true);
        MyTool.changeGray(this.reduceBtn,false,true);
        if(num >= this._maxNum)
        {
            this.nowNum = this._maxNum;
            MyTool.changeGray(this.addBtn,true,true);
        }
        else if(num <= this.minNum) {
            this.nowNum = this.minNum;
            MyTool.changeGray(this.reduceBtn,true,true);
        }
        else
        {
            this._nowNum = num;
        }
        this.renewCoin();
    }

    private onChange(){
        if(this.input.text == "")
        {
            this._nowNum = 0;
            this.renewCoin();
            return;
        }
        var num = parseInt(this.input.text);
        //如果不是 stepNum 的整数倍 需要修正
        if(num%this.stepNum != 0){
            this.nowNum = Math.ceil(num/this.stepNum) * this.stepNum;
        }
        if(num > this._maxNum)
        {
            this.nowNum = this._maxNum;
        }
        //else if(num < this.minNum) {
        //    this.nowNum = this.minNum;
        //}
        else
            this._nowNum = num;
        this.renewCoin();
    }

    private renewCoin(){
        this.dispatchEventWith(CommonNumInput.RENEW);
    }

    public set nowNum(v:number){
        this._nowNum = v;
        this.input.text = v+this.addStr;

        var num = parseInt(this.input.text);
        MyTool.changeGray(this.addBtn,num >= this._maxNum,true);
        MyTool.changeGray(this.reduceBtn,num <= this.minNum,true);
    }

    public get nowNum(){
        //if(this.input.text == "")
        //    this.nowNum = 0;
        if(this._nowNum < this.minNum) {
            this.nowNum = this.minNum;
        }
        return this._nowNum;
    }

    public init(min:number, max:number, step:number, value?:any){
        this.minNum = min;
        this.maxNum = max;
        this.stepNum = step || 1;

        this.input.maxChars = String(max).length+1

        if(this.addBtn){
            MyTool.changeGray(this.addBtn, false, true);
            MyTool.changeGray(this.reduceBtn, false, true);
        }
        if(value !=undefined){
            this.nowNum = value;
            MyTool.changeGray(this.addBtn, this.nowNum >= this._maxNum, true);
            MyTool.changeGray(this.reduceBtn, this.nowNum <= this.minNum, true);
        }
    }

    public setEnabled(v:boolean){
        this.addBtn.visible = this.reduceBtn.visible = v;
        this.input.touchEnabled = v;
    }
}
