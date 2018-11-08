/**
 *
 * @author
 *
 */
class DownList extends game.BaseContainer {
    public static SELECT:string = "SELECT";
    private btn: eui.Group;
    private img: eui.Image;
    private titleText: eui.Label;
    private listCon: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;


    private openHeight:number;
    private isOpen:boolean
    public defaultStr="全部"

    private dataArr;

    public constructor() {
        super();
        this.skinName = "DownListSkin"
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.btn,this.onOpen);
        this.scroller.viewport = this.list;
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);
        this.list.itemRenderer = DownListItem;
        this.openHeight = this.height;
        this.isOpen = false;
        this.renew();
    }

    private onOpen(e:egret.TouchEvent){
        e.stopImmediatePropagation()
        this.isOpen = !this.isOpen;
        if(this.isOpen)
        {
            this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this);
        }
        this.renew();
    }

    private onClickStage(){
        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickStage,this);
        this.isOpen = false;
        this.renew();
    }

    private renew(){
        if(this.isOpen && !this.listCon.parent)
            this.addChild(this.listCon);
        else if(!this.isOpen && this.listCon.parent)
            this.removeChild(this.listCon);
    }

    //select，传入data的值.不是index
    public setData(arr,select=0)
    {
        this.dataArr = arr;
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.height = Math.min(this.openHeight,arr.length * 56 - 6 + 60 - 1);
        this.selectValue = select;
    }

    public get selectValue(){
        var f= this.list.selectedItem;
        if(f) return f.data;
        return 0;
    }
    public set selectValue(select){
        var arr = this.dataArr;
        for(var i = 0 ; i < arr.length ; i++)
        {
            if(arr[i].data == select)
            {
                this.list.selectedIndex = i;
                break;
            }
        }
        if(i >= arr.length)
        {
            select = 0;
            this.list.selectedIndex = 0;
        }
        this.renewBtn(select)
    }

    private renewBtn(select){

        var arr = this.dataArr;
        for(var i = 0 ; i < arr.length ; i++)
        {
            if(select == arr[i].data)
            {
                this.titleText.text = arr[i].label
                this.img.source = arr[i].icon
                return;
            }
        }
        this.titleText.text = this.defaultStr;
    }

    private onSelect(){
        var f= this.list.selectedItem;
        var data = f? f.data:0
        this.dispatchEventWith(DownList.SELECT,true,data);
        this.renewBtn(data);
        //this.isOpen = false;
        //this.renew();
    }

}

class DownListItem extends game.BaseItem {
    private con: eui.Group;
    private img: eui.Image;
    private text: eui.Label;



    public constructor() {
        super();
        this.skinName = "DownListItemSkin"
    }

    public childrenCreated(){
        super.childrenCreated();
    }

    public dataChanged(){
        if(this.data.icon)
        {
            this.img.source = this.data.icon
            this.con.addChildAt(this.img,0)
        }
        else
        {
            MyTool.removeMC(this.img)
        }
        this.text.text = this.data ? (""+this.data.label):"全部";
        if(this.data.label2)
            this.text.text += this.data.label2;
    }
}