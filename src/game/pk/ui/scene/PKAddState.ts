class PKAddState extends game.BaseItem {
    private static pool = [];
    public static createItem():PKAddState{
        var item:PKAddState = this.pool.pop();
        if(!item)
        {
            item = new PKAddState();
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    public static fillStateMC(mc,type){
        switch(type)
        {
            case 'atk+':
                mc.source = 'buff_1_png';
                break;
            case 'atk-':
                mc.source = 'buff_11_png';
                break;

            case 'speed+':
                mc.source = 'buff_2_png';
                break;
            case 'speed-':
                mc.source = 'buff_12_png';
                break;

            case 'def+':
                mc.source = 'buff_3_png';
                break;
            case 'def-':
                mc.source = 'buff_13_png';
                break;

            case 'hp+':
                mc.source = 'buff_5_png';
                break;
            case 'hp-':
                mc.source = 'buff_15_png';
                break;


            case 'momian':
                mc.source = 'buff_31_png';
                break;
            case 'ill':
                mc.source = 'buff_25_png';
                break;
            case 'reborn':
                mc.source = 'buff_41_png';
                break;
            default:
                throw new Error('1111')
        }
    }

    private stateMC: eui.Image;
    public constructor() {
        super();

        this.skinName = "PKAddStateSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 16
    }

    public dataChanged(){
    }

    public remove(){
        egret.Tween.removeTweens(this)
        MyTool.removeMC(this);
    }

    public show(type,parent:PKMonsterItem,delay){
        this.alpha = 0;
        PKAddState.fillStateMC(this.stateMC,type);
        egret.Tween.get(this).wait(delay).to({y:this.y - 40},800)
        egret.Tween.get(this).wait(delay).to({alpha:1}).wait(500).to({alpha:0},300).call(()=>{
            parent.removeAddState(this);
        })
    }
}