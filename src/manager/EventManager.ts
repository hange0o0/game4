class EventManager extends egret.EventDispatcher {
    
    private static _instance: EventManager;
    
    public static getInstance():EventManager{
        if(!EventManager._instance)
            EventManager._instance = new EventManager();
        return EventManager._instance;
    }
        
	public constructor() {
        super();
	}
	public dispatch(type:string, data?:any){
        EventManager.getInstance().dispatchEventWith(type, false, data);
	}
	public addEvent(type:string, func:Function, thisObj:any){
    	  EventManager.getInstance().addEventListener(type, func, thisObj);
	}
    public removeEvent(type: string, func: Function, thisObj: any) {
        EventManager.getInstance().removeEventListener(type, func, thisObj);
    }

}

