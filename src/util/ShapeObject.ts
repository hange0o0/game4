/**
 *
 * @author 
 *
 */
class ShapeObject {

    //创建一条线
    public static drawLine(color:number, r: number, alhpa: number, x: number, y: number, 
                    x2: number, y2: number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.lineStyle(r, color, alhpa);
        shape.graphics.lineTo(x, y);
        shape.graphics.lineTo(x2, y2);
                
        return shape;
    }

    //创建一个圆形对象
    public static createCircle(bgColor:number, x: number, y: number, r: number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(bgColor);
        shape.graphics.drawCircle(x, y, r);
        shape.graphics.endFill();
        
        return shape;
    }

    //把矩形修改为圆形对象
    public static drawCircle(graphics:egret.Graphics, bgColor:number, x: number, y: number, r: number):egret.Graphics {
        graphics.beginFill(bgColor);
        graphics.drawCircle(x, y, r);
        graphics.endFill();

        return graphics;
    }

    //创建一个圆角矩形
    public static createRoundRect(bgColor:number, x: number, y: number, width: number, height: number,
                            ellipseWidth: number, ellipseHeight?: number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(bgColor);
        shape.graphics.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
        shape.graphics.endFill();
        
        return shape;
    }

    //把矩形修改为圆形矩形
    public static drawRoundRect(graphics:egret.Graphics, bgColor:number, x: number, y: number, width: number, height: number,
                                ellipseWidth: number, ellipseHeight?: number):egret.Graphics {
        graphics.clear();
        graphics.beginFill(bgColor);
        graphics.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
        graphics.endFill();

        return graphics;
    }

    //创建一个矩形
    public static createRect(bgColor:number, x: number, y: number, width: number, height: number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(bgColor);
        shape.graphics.drawRect(x, y, width, height);
        shape.graphics.endFill();
        
        return shape;
    }
    
    /**
     * 把Rect对象调整为圆角矩形
     * fillH 是否修正矩形高度，主要解决只想底部是圆角、顶部不是圆角的需求，通过加高高度来实现。
     */ 
    public static changeRoundRect(rect:eui.Rect, bgColor:number, ellipse:number, fillH:Boolean=true):void {
        var graphics: egret.Graphics = rect.graphics;
        graphics.clear();
        graphics.beginFill(bgColor);
        var yy: number = 0;
        var hh: number = rect.height;
        if(fillH){
            yy = -ellipse;
            hh += ellipse;
        }
        graphics.drawRoundRect(0, yy, rect.width, hh, ellipse, ellipse);
        graphics.endFill();
    }
}
