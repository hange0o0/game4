
class GameEvent {
    public static client = {
        energy_change:'energy_change',
        coin_change:'coin_change',
        diamond_change:'diamond_change',
        force_change:'force_change',
        hourcoin_change:'hourcoin_change',
        mail_change:'mail_change',
        pos_change:'pos_change',
        tec_change:'tec_change',
        prop_change:'prop_change',
        hang_change:'hang_change',
        card_change:'card_change',
        head_change:'head_change',
        hero_change:'hero_change',
        task_change:'task_change',

        fight_change:'fight_change',
        pvp_change:'pvp_change',
        PVP_END:'PVP_END',


        pk_begin:'pk_begin',
        pk_end:'pk_end',
        info_change:'info_change',
        slave_change:'slave_change',
        view_change:'view_change',
        active_change:'active_change',
        active_end:'active_end',



        //task_change:'task_change',
        //card_change:'card_change',
        //pk_end:'pk_end',

        red_change:'red_change',
        pass_day:'pass_day',
        timer:'timer'
    };

    public static sys = {

        login:'login',
        quick_register:'quick_register',
        register:'register',




        login_server:'sys.login_server',
        login_server2:'sys.login_server2',
        register_server:'sys.register_server',
        get_msg:'sys.get_msg',

        client_error:'sys.client_error'
    }


    public static pkserver = {
        pair:'pair',
        pair_success:'pair_success',
        pk_info:'pk_info',
        face:'face',
        pk_result:'pk_result',
        pk_reset:'pk_reset',
        new_login:'new_login',
        get_reset_data:'get_reset_data',
        ispking:'ispking',
    }
    public static rank = {
        get_rank:'rank.get_rank',
        create_rank:'rank.create_rank',
        get_rank2:'rank.get_rank2'
    }

    public static prop = {
        buy_prop_shop:'prop.buy_prop_shop',
        get_prop_shop:'prop.get_prop_shop',
    }

    public static pvp = {
        get_pvp:'pvp.get_pvp',
        pk_pvp_offline:'pvp.pk_pvp_offline',
        pk_pvp_offline_continue:'pvp.pk_pvp_offline_continue',
        pk_pvp_offline_fail:'pvp.pk_pvp_offline_fail',
        pk_pvp_offline_win:'pvp.pk_pvp_offline_win',
        pvp_award:'pvp.pvp_award',
        pvp_round_award:'pvp.pvp_round_award',

        pk_pvp_online:'pvp.pk_pvp_online',
        pk_pvp_online_start:'pvp.pk_pvp_online_start',
        pk_pvp_online_fail:'pvp.pk_pvp_online_fail',
        pk_pvp_online_win:'pvp.pk_pvp_online_win',
    }

    public static card = {
        card_buy:'card.card_buy',
        card_draw:'card.card_draw',
        card_like:'card.card_like',
        card_like_set:'card.card_like_set',
        card_open:'card.card_open'
    }

    public static mail = {
        get_mail:'mail.get_mail',
        get_mail_award:'mail.get_mail_award'
    }

    public static active = {
        get_active:'active.get_active'
    }
    public static task = {
        get_task_award:'task.get_task_award'
    }

    public static pay = {
        add_diamond:'pay.add_diamond',
        buy_shop:'pay.buy_shop',
        get_shop:'pay.get_shop'
    }

    public static pos = {
        add_pos:'pos.add_pos',
        change_pos:'pos.change_pos',
        change_close:'pos.change_close',
        change_name:'pos.change_name',
        delete_pos:'pos.delete_pos'
    }

    public static hang = {
        award_hang:'hang.award_hang',
        pk_hang:'hang.pk_hang',
        pk_test:'hang.pk_test',
        hang_video_list:'hang.hang_video_list',
        hang_video:'hang.hang_video',
        hang_gift:'hang.hang_gift',
        pk_hang_result:'hang.pk_hang_result'
    }

    public static pk = {
        save_record:'pk.save_record',
        get_record:'pk.get_record',
    }

    public static fight = {
        //buy_shop:'fight.buy_shop',
        fight_award:'fight.fight_award',
        get_fight:'fight.get_fight',
        init_fight:'fight.init_fight',
        pk_fight:'fight.pk_fight',
        pk_fight_result:'fight.pk_fight_result',
        pk_fail:'fight.pk_fail',
        //fight_cancel:'fight.fight_cancel',
        change_pos:'fight.change_pos',
        add_chance:'fight.add_chance',
        final_award:'fight.final_award',
    }

    public static answer = {
        get_answer:'answer.get_answer',
        answer_pk:'answer.answer_pk',
        answer_pk_result:'answer.answer_pk_result',
        add_chance:'answer.add_chance',
        final_award:'answer.final_award',
    }
    public static random = {
        get_random:'random.get_random',
        random_pk:'random.random_pk',
        random_pk_result:'random.random_pk_result',
        add_chance:'random.add_chance',
        final_award:'random.final_award',
    }
    public static choosecard = {
        get_choosecard:'choosecard.get_choosecard',
        set_choosecard:'choosecard.set_choosecard',
        pos_choosecard:'choosecard.pos_choosecard',
        choosecard_pk:'choosecard.choosecard_pk',
        choosecard_pk_result:'choosecard.choosecard_pk_result',
        add_chance:'choosecard.add_chance',
        final_award:'choosecard.final_award',
    }
    public static endless = {
        get_endless:'endless.get_endless',
        endless_pk:'endless.endless_pk',
        endless_pk_result:'endless.endless_pk_result',
        add_chance:'endless.add_chance',
        final_award:'endless.final_award',
    }

    public static tec = {
        tec_up:'tec.tec_up'
    }
    public static hero = {
        hero_up:'hero.hero_up'
    }

    public static user = {
        user_info:'user.user_info',
        change_head:'user.change_head'
    }

    public static slave = {
        slave_add_view:'slave.slave_add_view',
        slave_delete_view:'slave.slave_delete_view',
        slave_view_list:'slave.slave_view_list',

        slave_award:'slave.slave_award',
        slave_delete:'slave.slave_delete',
        slave_list:'slave.slave_list',
        slave_miss:'slave.slave_miss',
        slave_reset_open:'slave.slave_reset_open',
        slave_addprotect:'slave.slave_addprotect',
        slave_pk_begin:'slave.slave_pk_begin',
        slave_pk_result:'slave.slave_pk_result'
    }

    public static debug = {
        get_card_record:'debug.get_card_record',
        clean_card_record:'debug.clean_card_record',
        pk_test:'debug.pk_test'
    }











}