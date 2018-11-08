class PKTool {

    //对自动队列进行解析
    private static mpList;
    public static getMPList(){  //每点费用的获得时间
        if(!this.mpList)//初始化一次
        {
            this.mpList = [0];
            while(true)
            {
                var time = this.getMPTime(this.mpList.length)
                this.mpList.push(time);
                if(time > PKConfig.drawTime)
                    break
            }
            //var max = 250
            //for(var i=1;i<=max;i++)
            //{
            //    this.mpList[i] = this.getMPTime(i);
            //}
        }
        return this.mpList.concat()
    }

    public static decodeAutoList(arr) {

        //会改到原数组
        var mpList = this.getMPList();
        //技能影响

        var returnArr = [];
        var mpCost = 0;
        var index = 1;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]

            if(id > 0)
            {
                var vo = CM.getCardVO(id);
                var mp = vo.cost
                var t = mpList[mpCost + mp]//可以同时上阵的时间点
                returnArr.push({
                    mid:id,
                    time:t,
                    id:index
                })
                index ++;

                if(!vo.isMonster && vo.sv4 == -10001)
                {
                    this.addMPTime(mpList,t + PKConfig.beforeCD + vo.cd,vo.sv1+mp)
                }
            }
            else
            {
                var mp = -id;
            }

            mpCost += mp;
        }
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

    public static getMPTime(mp){
        //30+40+60*3 = 250
        var step0 = PKConfig.mpInit;//初始值
        var step1 = 30;//第一分钟产量
        var step2 = 40;//第二分钟产量
        var step3 = 60;//之后每分钟的产量

        if(mp <= step0)
            return 0
        mp -= step0;

        if(mp <= step1)
            return mp/step1 * 60*1000

        mp -= step1;
        if(mp <= step2 )
            return mp/step2 * 60*1000 + 60*1000;

        mp -= step2;
        return mp/step3 * 60*1000 + 60*1000*2;

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