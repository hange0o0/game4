class PKMonsterMV extends eui.Group {
    private static pool = [];
    public static createItem():PKMonsterMV{
        var item:PKMonsterMV = this.pool.pop();
        if(!item)
        {
            item = new PKMonsterMV();
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    public monsterMV:MonsterMV
    //public heroMV:HeroMVItem
    public currentMV;

    public set speed(v){
        this.currentMV.speed = v;
    }

    public get speed(){
        return this.currentMV.speed;
    }

    public get state(){
        return this.currentMV.state;
    }

    public remove(){
        this.stop()
        MyTool.removeMC(this);
    }

     public load(id){
         //if(id == 1)
         //    id = 101
         var vo = MonsterVO.getObject(id)
         if(this.currentMV)
             this.currentMV.stop();
         MyTool.removeMC(this.currentMV)
         //if(vo.isHero())
         //{
         //     if(!this.heroMV)
         //     {
         //         this.heroMV = new HeroMVItem()
         //         this.heroMV.addEventListener('mv_die',this.fireDie,this)
         //     }
         //    this.currentMV = this.heroMV;
         //    this.addChild(this.heroMV)
         //    this.heroMV.load(id)
         //}
         //else
         //{
             if(!this.monsterMV)
             {
                 this.monsterMV = new MonsterMV()
                 this.monsterMV.addEventListener('mv_die',this.fireDie,this)
             }
             this.currentMV = this.monsterMV;
             this.addChild(this.monsterMV)
             this.monsterMV.load(id)
         //}
     }

    private fireDie(){
        this.dispatchEventWith('mv_die')
    }

     public reset(){
         this.currentMV.reset();
     }

     public play(){
         this.currentMV.play();
     }

     public stop(){
         if(this.currentMV)
            this.currentMV.stop();
     }

     public run(){
         this.currentMV.run();
     }

     public stand(){
         this.currentMV.stand();
     }

     public atk(){
         this.currentMV.atk();
     }

     public die(){
         this.currentMV.die();
     }
}