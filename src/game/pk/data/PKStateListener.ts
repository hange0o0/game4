class PKStateListener { //图腾类，会针对状态改变进行触发
    public owner:PKMonsterData|PKPosCardData;     //
    public endTime = 0; //到这个点时会自动销毁
    public mvID = 0;
    public stopDieRemove = false; //如果true,即使主人没了也不要移除
    public x = 0; //如果有动画，出现的位置

    public type//监听类型

   // public id//唯一的ID，ID相同时，value值大的会生效
    //public value;


    constructor(obj?) {

    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

    }
    // 图腾移除时会调用的方法
    public onRemove(){

    }

}