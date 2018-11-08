//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    private textField;
    private infoText;
    private loadingMC
    private shape

    private timer

    private createView():void {

        this.shape = new eui.Rect();
        this.shape.width = 640;
        this.shape.fillColor = 0;
        this.shape.fillAlpha = 0.8;
        this.shape.touchEnabled = true;
        this.addChild(this.shape)

        this.textField = new eui.Label();
        this.addChild(this.textField);
        this.textField.x = 80;

        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.text = '加载准备中..';

        this.infoText = new eui.Label();
        this.addChild(this.infoText);
        this.infoText.x = 70;
        this.infoText.width = 500;
        this.infoText.textColor = 0xB59E7D;
        this.infoText.size = 22;
        this.infoText.lineSpacing = 6;



        var data:any = RES.getRes("loading_ani" +  "_json"); //qid
        var texture:egret.Texture = RES.getRes("loading_ani" + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.loadingMC = new egret.MovieClip();
        this.loadingMC.scaleX = this.loadingMC.scaleY = 1.5
        this.addChild(this.loadingMC);
        this.loadingMC.movieClipData = mcFactory.generateMovieClipData('loading_ani');
        this.loadingMC.x = 220;




    }

    public show(){
        GameManager.container.addChild(this);

        this.width = 640;
        this.height = GameManager.stage.stageHeight;
        this.shape.height = GameManager.stage.stageHeight;
        this.loadingMC.gotoAndPlay(1,-1)
        this.loadingMC.y = this.height/2 - 100;
        this.textField.y = this.height/2;

        MyTool.setHtml(this.infoText,HelpManager.getInstance().getInfoText());
        this.infoText.y = this.height - this.infoText.textHeight - 20;
        if(this.infoText.numLines > 1)
            this.infoText.textAlign = 'left'
        else
            this.infoText.textAlign = 'center'


        this.textField.text = '加载准备中..';

        this.visible = false;
        egret.clearTimeout(this.timer);
        this.timer = egret.setTimeout(function(){
            this.visible = true;
        },this,200)
    }

    public setProgress(current, total):void {
        this.textField.text = "加载中..." + current + "/" + total;
    }

    public hide(){
        MyTool.removeMC(this);
        this.loadingMC.stop();
    }
}
