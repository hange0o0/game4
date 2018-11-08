class MyRES {
    public static path = {}
    private static resource = {}
    public static reg(name,path){
        this.path[name] = path
    }
    public static getPath(name){
        return this.path[name];
    }
    public static loadGroup(arr){
        var fun = function(){};
        var type;
        for(var i=0;i<arr.length;i++)
        {
            var key = arr[i];
             if(!this.getPath(key))
                this.reg(key,key)

            if(this.getRes(key))
                continue;
            var path = this.getPath(key);
            if(path.indexOf('.json') != -1)
                type = RES.ResourceItem.TYPE_JSON
            else if(path.indexOf('.mp3') != -1)
                type = RES.ResourceItem.TYPE_SOUND
            else
                type = RES.ResourceItem.TYPE_IMAGE

            RES.getResByUrl(path,fun,this,type)
        }
    }

    public static getRes(key){
        return RES.getRes(this.getPath(key))
    }
}