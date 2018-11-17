class PKTool {

    //对自动队列进行解析
    public static cdData = [
        {cd:0,mp:20},
        {cd:10,mp:20},
        {cd:15,mp:25},
        {cd:20,mp:25},
        {cd:25,mp:30},
        {cd:30,mp:30},
        {cd:30,mp:35},
        {cd:30,mp:35},
        {cd:30,mp:40},
        {cd:30,mp:40},
        {cd:30,mp:40},
    ]
    //private static step = [20, 25, 30, 30, 35, 35, 40, 40, 40, 40] //addMP
    //public static cd = [0, 10, 15, 30, 30, 30, 30, 30, 30, 30];   //215秒
    private static mpList;
    public static getMPList(){  //每点费用的获得时间
        if(!this.mpList)//初始化一次
        {
            this.mpList = [0];
            while(true)
            {
                var time = this.getMPTime(this.mpList.length)
                if(time > PKConfig.drawTime)
                    break
                this.mpList.push(time);
            }
            //var max = 250
            //for(var i=1;i<=max;i++)
            //{
            //    this.mpList[i] = this.getMPTime(i);
            //}
        }
        return this.mpList.concat()
    }

    public static getRound(t){
        if(t == 0)
            return 1;
        var cd = 0;
        for(var i=0;i<this.cdData.length;i++)
        {
            cd +=this.cdData[i].cd*1000;
            if(t< cd)
                return i;
        }
        return this.cdData.length;
    }

    public static decodeAutoList(arr) {
        var returnArr = [];
        var index = 1;
        var cd = 0
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i]
            var list = data.split(',');
            cd += this.cdData[i].cd*1000;
            for(var j=0;j<list.length;j++)
            {
                returnArr.push({
                    mid:list[j],
                    time:cd + PKConfig.stepCD*j*2 + PKConfig.stepCD*2,
                    id:index
                })
                index ++;
            }
        }
        console.log(returnArr)
        return returnArr;
    }

    private static addMPTime(arr,time,mp){
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i] >= time)
            {
                while(mp>0)
                {
                    arr.splice(i,0,time)
                    mp--;
                }
                break;
            }
        }
    }

    ////对自动队列进行解析
    //public static decodeAutoList(arr) {
    //    var returnArr = [];
    //    var mpCost = 0;
    //    var index = 1;
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        var id = arr[i]
    //        var mp = this.getGroupMp(id);//上阵MP
    //        var t = PKTool.getMPTime(mpCost + mp)//可以同时上阵的时间点
    //        if(id > 0)
    //        {
    //            returnArr.push({
    //                mid:id,
    //                time:t,
    //                id:index
    //            })
    //            index ++;
    //        }
    //        mpCost += mp;
    //    }
    //    return returnArr;
    //}

    //对玩家出战队列进行解析
    public static decodeActionList(arr) {
        var returnArr = [];
        var index = 1;
        for(var i=0;i<arr.length;i++)
        {
            var group = arr[i].split('#')
            returnArr.push({
                mid:group[1],
                time:PKConfig.stepCD*group[0],
                id:index
            })
            index ++;
        }
        return returnArr;
    }

    //对玩家英雄队列进行解析
    public static decodeHeroList(arr) {
        var returnArr = [];
        var index = 1;
        for(var i=0;i<arr.length;i++)
        {
            var group = arr[i].split('|')
            returnArr.push({
                mid:parseInt(group[0]),
                level:parseInt(group[1]),
                id:index
            })
            index ++;
        }
        return returnArr;
    }



    public static getGroupMp(id){
        var mp = 0;
        if(id < 0)
        {
            mp += -id;
        }
        else
        {
            var vo = CM.getCardVO(id);
            mp += vo.cost;
        }
        return mp;
    }

    //首次15秒，后面30秒的CD
    public static getMPTime(mp) {
        //30+40+60*3 = 250

        //var step = this.step;
        //var cd = this.cd;   //215秒
        var currentStep = 0;
        var currentCD = 0;
        for (var i = 0; i < this.cdData.length; i++) {
            currentStep += this.cdData[i].mp;
            currentCD += this.cdData[i].cd;
            if (currentStep >= mp) {
                return currentCD * 1000;
            }
        }
        return Number.MAX_VALUE;
    }

    //取攻击属性的相克
    public static getAtkRate(atkType,defType){
        if(defType == 0 || atkType == 0)
            return 1;
        var des = Math.abs(atkType - defType)
        if(des == 0)
            return 1;
        if(des == 1)
        {
            if(atkType< defType)
                return 1.5;
            return 0.8;
        }
        if(atkType > defType)
            return 1.5;
        return 0.8;
    }
}