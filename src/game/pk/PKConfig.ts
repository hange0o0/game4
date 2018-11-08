class PKConfig {
    public static ROTA_LEFT = 1
    public static ROTA_RIGHT = -1

    public static TYPENAME = {
        1:'堡垒',
        2:'自然',
        3:'幽暗'
    }

    public static TYPECOLOR = {
        1:0x4093b6,
        2:0x3eaf6a,
        3:0xb03d3d
    }

    public static SKILLTYPENAME = {
        1:'伤害',
        2:'治疗',
        3:'辅助',
        4:'召唤',
        5:'特殊'
    }


    public static beforeShowTime = 5000; //开始战斗前，进入及倒计时需要的时间

    public static nearRage = 20; //少于等于该值为近战
    public static stepCD = 50; //步长
    public static gameTime = 5*60; //游戏时间,超出算平
    public static maxMonsterSpace = 30; //同时存活怪的占位
    public static floorWidth = 800//1300; //战场宽度
    public static appearPos = 100//出现的位置
    //public static diamondPos = 200//出现的位置
    public static remainCD = 3000//能出兵后没出兵保持的时间
    //public static maxMP = 20; //MP上限
    public static mpInit = 15; //初始的MP值
    public static beforeCD = 3*1000; //上阵前的等待
    public static maxHandCard = 6; //手牌上限
    public static maxPosCard = 4; //上阵牌上限
    public static typeAdd = 10; //类型加成百分比
    public static drawTime = 1000*60*5; //超时
    //public static autoDef = 10; //防守方队伍加成
    public static skillBeginID = 200; //大于这个的是技能
    public static heroCD = 3*1000;//40*1000; //出英雄的CD


    public static VIDEO_MONSTER_DOUBLE = 1;//爆击
    public static VIDEO_MONSTER_DIE = 2
    public static VIDEO_MONSTER_WIN = 3
    public static VIDEO_MONSTER_ADD = 4
    public static VIDEO_MONSTER_ATK = 5
    public static VIDEO_MONSTER_MOVE = 6
    public static VIDEO_MONSTER_HPCHANGE = 7
    public static VIDEO_MONSTER_MISS = 8 //闪避
    public static VIDEO_TEAM_DEF = 9 //队伍防御
    public static VIDEO_TEAM_DEF2 = 11 //队伍防御
    public static VIDEO_POS_SHOW = 10
    public static VIDEO_MONSTER_STATE_CHANGE = 12
    public static VIDEO_MONSTER_ADD_STATE = 13
    public static VIDEO_MONSTER_STAND = 14
    public static VIDEO_MONSTER_CHANGE_TEAM = 15
    public static VIDEO_POS_FAIL = 16
    public static VIDEO_TOTEM_ADD = 17  //加图腾
    public static VIDEO_TOTEM_REMOVE = 18 //-图腾

    public static VIDEO_POS_ADD = 19 //增加
    public static VIDEO_POS_REMOVE = 20 //结束

    public static VIDEO_MANAHP_CHANGE = 21 //魔盾结果
    public static VIDEO_MONSTER_NOHIT = 22 //免伤动画

    public static VIDEO_MONSTER_CHANGE_SKIN = 23 //改变皮肤

    public static VIDEO_MYPLAYER_CHANGE = 24 //观察者变化
    public static VIDEO_AUOT_ADD_CARD = 25 //自动上卡
    public static VIDEO_TEAM_HP_CHANGE = 26 //队伍血量发生变化
    public static VIDEO_CARD_WAITING_CHANGE = 27 //位置生效
    public static VIDEO_HERO_ADD = 28 //有英雄出现



    public static STATE_YUN = 1
    public static STATE_MOMIAN = 2
    public static STATE_MODUN = 3
    public static STATE_MIANSHANG = 4
    public static STATE_DIE = 5 //死亡时触发的BUFF，
    public static STATE_NOBEATK = 6
    public static STATE_SOUL = 7 //灵体

    //显示在右下角
    public static STATE_ILL = 101
    public static STATE_REBORN = 102


    public static LISTENER_NONE = 0
    public static LISTENER_CREATE = 1 //新单位生成
    public static LISTENER_DIE = 2
    public static LISTENER_TIMER = 3
    public static LISTENER_CREATE_POS = 4 //通过出战区生成
    public static LISTENER_ATK = 5 //
    public static LISTENER_BEATK = 6 //



}