class MonsterTestUI extends game.BaseUI {
    private static instance:MonsterTestUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterTestUI();
        return this.instance;
    }

    private standBtn: eui.Label;
    private dieBtn: eui.Label;
    private loadBtn: eui.Label;
    private loadBtn2: eui.Label;
    private runBtn: eui.Label;
    private atkBtn: eui.Label;
    private inputText: eui.EditableText;




    private monsterMV:MonsterMV

    public constructor() {
        super();
        this.skinName = "MonsterTestUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();


        this.addBtnEvent(this.runBtn,this.onMove)
        this.addBtnEvent(this.standBtn,this.onStand)
        this.addBtnEvent(this.atkBtn,this.onAtk)
        this.addBtnEvent(this.dieBtn,this.onDie)
        this.addBtnEvent(this.loadBtn,this.onLoad)
        this.addBtnEvent(this.loadBtn2,this.onLoad2)

        this.monsterMV = new MonsterMV();
        this.addChild(this.monsterMV)
        this.monsterMV.load(1)
        this.monsterMV.play();
        this.monsterMV.x = 320;
        this.monsterMV.y = 600;

    }

    public onLoad(){
        this.monsterMV.load(this.inputText.text)
    }
    public onLoad2(){
        this.monsterMV.load(this.inputText.text,true)
    }

    public onMove(){
        this.monsterMV.run();
        this.monsterMV.play()
    }
    public onStand(){
        this.monsterMV.stand();
        this.monsterMV.play()
    }
    public onAtk(){
        this.monsterMV.atk();
        this.monsterMV.play()
    }
    public onDie(){
        this.monsterMV.die();
    }


    public show(){
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){

    }






}