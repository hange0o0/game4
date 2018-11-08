class ResourceBar extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ResourceBarSkin";
    }

    private topCon: eui.Group;
    private addCoinBtn: eui.Image;
    private coinText: eui.Label;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.addCoinBtn, this.onAddCoin)
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy)
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamond)

    }

    private onAddCoin(){
        //MainUI.getInstance().onBottomSelect(4);
        //TecUI.getInstance().setTab(2)
    }

    private onAddEnergy(){
        ShopUI.getInstance().show();
    }

    private onAddDiamond(){
        ShopUI.getInstance().show(true);
    }

    public dataChanged(){
        this.addCoinBtn.visible = this.addEnergyBtn.visible = this.addDiamondBtn.visible = this.data.showAdd
        this.renewTop();
        this.onTimer();
    }

    public onTimer(){
        this.renewEnergy();
        this.renewCoin();
    }

    public renewTop(){
        this.diamondText.text = UM.diamond + ''
    }

    private renewCoin(){
        //var coin = UM.getCoin();
        //if(coin < 0)
        //{
        //    this.setHtml(this.coinText,this.createHtml('偿还供奉中...',0xFF9999,22))
        //}
        //else
        //{
        //    this.coinText.text = NumberUtil.addNumSeparator(Math.max(UM.getCoin(),0),3);
        //}

    }

    public renewEnergy(){
        //var energy = UM.getEnergy();
        //if(energy)
        //    this.energyText.text = energy + '/' + UM.maxEnergy;
        //else
        //    this.setHtml(this.energyText,this.createHtml(DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5),0xFF0000));
    }


}