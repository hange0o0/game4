class RegisterServerUI extends game.BaseWindow {
    private static instance:RegisterServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterServerUI();
        return this.instance;
    }

    private backBtn: eui.Button;
    private registerBtn: eui.Button;
    private nameText: eui.TextInput;
    private randomBtn: eui.Group;
    private chooseMC: eui.Rect;
    private arrowMC: eui.Image;
    private type1: eui.Image;
    private type2: eui.Image;
    private type3: eui.Image;
    private desText: eui.Label;





    private type = 1;
    private mItem;

    public constructor() {
        super();
        this.skinName = "RegisterServerUISkin";
        this.canBGClose = false;
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.onClose);
        this.addBtnEvent(this.registerBtn, this.onClick);
        this.addBtnEvent(this.randomBtn, this.onRandom);
        this.addBtnEvent(this.type1, this.onType1);
        this.addBtnEvent(this.type2, this.onType2);
        this.addBtnEvent(this.type3, this.onType3);

        this.nameText.restrict = "a-zA-Z0-9_\u0391-\uFFE5";
        this.nameText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);


        this.mItem = PKMonsterMV.createItem();
        this.mItem.scaleX = this.mItem.scaleY = 1.2;
        this.mItem.y = 300
        this.mItem.x = 180
        this.addChild(this.mItem);
    }

    public onClose(){
        this.hide();
        LoginUI.getInstance().show();
    }

    public hide(){
        super.hide();
        egret.Tween.removeTweens(this.arrowMC)
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        if(!this.nameText.text || this.nameText.text == '神秘人' || BadWordsFilter.validateName(this.nameText.text))
        {
            MyWindow.Alert('代号中含有非法字符');
            return;
        }

        LM.registerServer(this.nameText.text,this.type);
    }

    private onRandom(){
        this.nameText.text = MyTool.randomName();
    }

    private onType1(){
        this.type = 1;
        this.renewType();
    }
    private onType2(){
        this.type = 2;
        this.renewType();
    }
    private onType3(){
        this.type = 3;
        this.renewType();
    }


    private onChange(){
        this.nameText.text = MyTool.replaceEmoji(this.nameText.text);
        var len = StringUtil.getStringLength(this.nameText.text);
        if(len > 14)
        {
            this.nameText.text = StringUtil.getStringByLength(this.nameText.text,7);
        }
    }

    public show(){
        MainLoadingUI.getInstance().hide();
        super.show();
    }

    public onShow(){
        this.onRandom();
        this.type = Math.floor(Math.random()*3 + 1)
        console.log(this.type)

        if(FromManager.getInstance().h5Form)
        {
            var nick = FromManager.getInstance().getDefaultNick()
            if(nick)
                this.nameText.text = nick;
            MyTool.removeMC(this.backBtn);
        }
        this.renewType();

        RES.loadGroup("guide");
    }


    private renewType(){
        var mc = this['type' + this.type]
        //var arr = ['',
        //    this.createHtml(PKConfig.TYPENAME[1],0x00FFFF),
        //    this.createHtml(PKConfig.TYPENAME[2],0x00FFFF),
        //    this.createHtml(PKConfig.TYPENAME[3],0x000000)
        //]

        this.chooseMC.x = mc.x - 8;
        this.chooseMC.y = mc.y - 8;
        this.setHtml(this.desText,this.createHtml(PKConfig.TYPENAME[this.type],PKConfig.TYPECOLOR[this.type]))
        //this.setHtml(this.desText, '加强【' + this.createHtml(PKConfig.TYPENAME[this.type]+'类型',PKConfig.TYPECOLOR[this.type]) + '】单位属性10%')

        egret.Tween.removeTweens(this.arrowMC)
        var baseY = this.chooseMC.y + this.chooseMC.height + 10;
        this.arrowMC.y = baseY
        this.arrowMC.x = mc.x + 64/2 - 22/2
        var tw = egret.Tween.get(this.arrowMC,{loop:true});
        tw.to({y:this.arrowMC.y + 8},500).to({y:baseY},500);


        var typeMid = {
            1:6,
            2:41,
            3:65,
        }

        var id = parseInt(typeMid[this.type])
        var item = this.mItem

        item.load(id)
        item.stand();


    }


}