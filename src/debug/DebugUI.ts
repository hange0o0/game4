class DebugUI extends game.BaseUI {
	private static instance: DebugUI;
	public static getInstance() {
		if(!this.instance) this.instance = new DebugUI();
		return this.instance;
	}

	public constructor() {
		super();
		this.skinName = "DebugUISkin";
	}
	private  btn0: eui.Button;
	private  btn1: eui.Button;
	private  btn2: eui.Button;
	private  btn3: eui.Button;
	private  btn4: eui.Button;
	private  btn5: eui.Button;
	private  btn6: eui.Button;
	private  btn7: eui.Button;
	private  btn8: eui.Button;
	private  btn9: eui.Button;
	private  btn10: eui.Button;
	private  btn11: eui.Button;
	private  btn12: eui.Button;
	private  btn13: eui.Button;
	private  btn14: eui.Button;
	private  btn15: eui.Button;
	private  btn16: eui.Button;
	private  btn17: eui.Button;
	private  btn18: eui.Button;
	private  btn19: eui.Button;

	private pkData;

	public childrenCreated() {
		super.childrenCreated();
		this.addBtnEvent(this,this.onClick);
		this.btn0.label = 'close';
		this.btn1.label = 'P';
		this.btn2.label = 'r1';
		this.btn3.label = 'start';
		this.btn4.label = 'stop';

		this.btn5.label = 'get_server_card';
		this.btn6.label = 'pkServer';
		this.btn7.label = 'talk';
		this.btn8.label = 'agree';
		this.btn9.label = 'refuse';
		this.btn10.label = 'delete';

		this.btn11.label = 'getCard';
		this.btn12.label = 'ask';
		this.btn13.label = 'answer';

	   //默认登录
/*		LoginManager.getInstance().login(_get['gameid'],'111111',function(){
			LoginManager.getInstance().loginServer(1);
		});*/
	}

	private onClick(e){
		var self = this;
		switch(e.target)
		{
			case this.btn0:
			{
				this.hide();
				break;
			}

		}
	}

}
