var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, client_id, objects={}, state="",my_role="", game_tick=0, my_checkers=1, made_moves=0, game_id=0, my_turn=0, connected = 1, LANG = 0;
var any_dialog_active=0, min_move_amount=0, h_state=0, game_platform="",activity_on=1, hidden_state_start = 0, room_name = 'states2';
g_board=[];
var players="", pending_player="",tm={};
var my_data={opp_id : ''},opp_data={};
var g_process=function(){};
var WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

var load_list=[{class:"sprite",name:"desktop",code0:"objects[obj_name].x=-10;objects[obj_name].y=-10;objects[obj_name].width=820;objects[obj_name].height=470;",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"block",name:"title0",code0:"objects[obj_name]=new PIXI.BitmapText(['Играть','Play'][LANG], {fontName: 'mfont',fontSize: 32.04,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=85;objects[obj_name].y=168;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"block",name:"title1",code0:"objects[obj_name]=new PIXI.BitmapText(['Лидеры','Leaders'][LANG], {fontName: 'mfont',fontSize: 32.04,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=245;objects[obj_name].y=168;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"block",name:"title2",code0:"objects[obj_name]=new PIXI.BitmapText(['Инфо','Info'][LANG], {fontName: 'mfont',fontSize: 32.04,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=405;objects[obj_name].y=168;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"block",name:"title3",code0:"objects[obj_name]=new PIXI.BitmapText(['Настройки','Pref'][LANG], {fontName: 'mfont',fontSize: 32.04,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=565;objects[obj_name].y=168;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"sprite",name:"preferences_button",code0:"objects[obj_name].x=495;objects[obj_name].y=30;objects[obj_name].width=139.999576822917;objects[obj_name].height=130.00009765625;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.pref_button_down()};objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"cont",name:"main_buttons_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=75;objects[obj_name].sy=objects[obj_name].y=240;",code1:"objects[obj_name].addChild(objects.play_button);objects[obj_name].addChild(objects.lb_button);objects[obj_name].addChild(objects.rules_button);objects[obj_name].addChild(objects.preferences_button);objects[obj_name].addChild(objects.title0);objects[obj_name].addChild(objects.title1);objects[obj_name].addChild(objects.title2);objects[obj_name].addChild(objects.title3);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"rules_button",code0:"objects[obj_name].x=335;objects[obj_name].y=30;objects[obj_name].width=140.00009765625;objects[obj_name].height=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.rules_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"sprite",name:"play_button",code0:"objects[obj_name].x=15;objects[obj_name].y=30;objects[obj_name].width=140;objects[obj_name].height=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.play_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"sprite",name:"lb_button",code0:"objects[obj_name].x=175;objects[obj_name].y=30;objects[obj_name].width=140;objects[obj_name].height=130.00009765625;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.lb_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"common_code",code0:"document.body.style.backgroundColor = 'rgb(70, 70, 70)';app.renderer.backgroundColor = 0X3B3838;",code1:""},{class:"block",name:"rec_sticker_area",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=22;objects[obj_name].sy=objects[obj_name].y=260;objects[obj_name].width=148.235286458333;objects[obj_name].height=148.235384114583;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"board",code0:"objects[obj_name].x=190;objects[obj_name].y=10;objects[obj_name].width=430;objects[obj_name].height=430;objects[obj_name].visible=false;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){game.mouse_down_on_board()}.bind(game);",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"image",name:"lb_bcg",image_format:"png"},{class:"sprite",name:"message_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=20;objects[obj_name].width=180;objects[obj_name].height=170;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"message_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 20,align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=150;objects[obj_name].x=100;objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",code1:""},{class:"cont",name:"message_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=220;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.message_bcg);objects[obj_name].addChild(objects.message_text);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"timer_bcg",code0:"objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=10;objects[obj_name].width=120.00009765625;objects[obj_name].height=60.1134887695313;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"timer_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].visible=true;objects[obj_name].sx=objects[obj_name].x=70;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"cont",name:"timer_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].show=function(){this.childs.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.timer_bcg);objects[obj_name].addChild(objects.timer_text);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"checkers",size:"24",code0:"var num=n;objects[obj_name][num]=new PIXI.Sprite();objects[obj_name][num].visible=false;objects[obj_name][num].width=50;objects[obj_name][num].height=50;",code1:"var num=n;objects[obj_name][num].texture=game_res.resources.chk_quad_1.texture;app.stage.addChild(objects[obj_name][num]);"},{class:"sprite",name:"selected_frame",code0:"objects[obj_name].visible=false;",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"block",name:"cur_move_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0,0.5);objects[obj_name].x=32;objects[obj_name].y=430;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"block",name:"cards_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=10;objects[obj_name].y=40;",code1:"for (let i=0;i<objects.mini_cards.length;i++)objects[obj_name].addChild(objects.mini_cards[i]);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"mini_cards",size:"15",code0:"var num=n;objects[obj_name][num]=new player_mini_card_class(0,0,num);",code1:""},{class:"image",name:"cards_bcg",image_format:"png"},{class:"image",name:"chk_round_1",image_format:"png"},{class:"image",name:"chk_star_1",image_format:"png"},{class:"image",name:"chk_star_2",image_format:"png"},{class:"image",name:"chk_round_2",image_format:"png"},{class:"sprite",name:"pref_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=420.0001953125;objects[obj_name].height=319.99990234375;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"pref_ok",code0:"objects[obj_name].x=130;objects[obj_name].y=235;objects[obj_name].width=180;objects[obj_name].height=75;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.pref_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",code1:"",image_format:"png"},{class:"cont",name:"pref_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=50;",code1:"objects[obj_name].addChild(objects.pref_bcg);objects[obj_name].addChild(objects.pref_ok);objects[obj_name].addChild(objects.chk_quad_block);objects[obj_name].addChild(objects.chk_star_block);objects[obj_name].addChild(objects.chk_round_block);objects[obj_name].addChild(objects.chk_opt_frame);objects[obj_name].addChild(objects.pref_sound_switch);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"pref_sound_switch",code0:"objects[obj_name].x=237;objects[obj_name].y=178;objects[obj_name].width=50;objects[obj_name].height=50;objects[obj_name].interactive = true;objects[obj_name].buttonMode = true;objects[obj_name].pointerdown = function(){main_menu.pref_sound_switched()};    ",code1:"",image_format:"png"},{class:"block",name:"chk_star_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(1)};",code1:"objects[obj_name].texture=game_res.resources.chk_star_1.texture;"},{class:"block",name:"chk_round_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=280;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(2)};",code1:"objects[obj_name].texture=game_res.resources.chk_round_1.texture;"},{class:"block",name:"chk_quad_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=80;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(0)};",code1:"objects[obj_name].texture=game_res.resources.chk_quad_1.texture;"},{class:"sprite",name:"chk_opt_frame",code0:"objects[obj_name].x=60;objects[obj_name].y=70;objects[obj_name].width=110;objects[obj_name].height=110;",code1:"",image_format:"png"},{class:"image",name:"lb_player_card_bcg",image_format:"png"},{class:"block",name:"lb_cards_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=0;",code1:"for (let i=0;i<7;i++)objects[obj_name].addChild(objects.lb_cards[i]);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"lb_cards",size:"7",code0:"var num=n;objects[obj_name][num]=new lb_player_card_class(0,0,num+4);",code1:""},{class:"block",name:"lb_back_button",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=690;objects[obj_name].y=320;objects[obj_name].width=100;objects[obj_name].height=100;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){lb.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"objects[obj_name].texture=objects.back_button.texture;app.stage.addChild(objects[obj_name]);"},{class:"block",name:"sent_sticker_area",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=449;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].width=105;objects[obj_name].height=100;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"block",name:"lb_3_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=40;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"objects[obj_name].mask=objects.lb_3_mask;"},{class:"sprite",name:"lb_3_mask",code0:"objects[obj_name].x=40;objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"",image_format:"png"},{class:"block",name:"lb_3_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_3_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=156;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"cont",name:"lb_3_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=240;",code1:"objects[obj_name].addChild(objects.lb_3_avatar);objects[obj_name].addChild(objects.lb_3_mask);objects[obj_name].addChild(objects.lb_3_frame);objects[obj_name].addChild(objects.lb_3_crown);objects[obj_name].addChild(objects.lb_3_name);objects[obj_name].addChild(objects.lb_3_rating);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"lb_3_frame",code0:"objects[obj_name].x=40;objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"",image_format:"png"},{class:"sprite",name:"lb_3_crown",code0:"objects[obj_name].x=11;objects[obj_name].y=22;objects[obj_name].width=100;objects[obj_name].height=90;",code1:"",image_format:"png"},{class:"block",name:"lb_1_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;",code1:"objects[obj_name].mask=objects.lb_1_mask;"},{class:"sprite",name:"lb_1_mask",code0:"objects[obj_name].x=10;objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;",code1:"",image_format:"png"},{class:"cont",name:"lb_1_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.lb_1_mask);objects[obj_name].addChild(objects.lb_1_avatar);objects[obj_name].addChild(objects.lb_1_frame);objects[obj_name].addChild(objects.lb_1_crown);objects[obj_name].addChild(objects.lb_1_name);objects[obj_name].addChild(objects.lb_1_rating);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"lb_1_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_1_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=193;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"sprite",name:"lb_1_frame",code0:"objects[obj_name].x=10;objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;",code1:"",image_format:"png"},{class:"sprite",name:"lb_1_crown",code0:"objects[obj_name].x=98;objects[obj_name].y=24;objects[obj_name].width=100;objects[obj_name].height=90;",code1:"",image_format:"png"},{class:"block",name:"lb_2_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=130;objects[obj_name].height=130;",code1:"objects[obj_name].mask=objects.lb_2_mask;"},{class:"sprite",name:"lb_2_mask",code0:"objects[obj_name].x=10;objects[obj_name].y=40;objects[obj_name].width=150;objects[obj_name].height=150;",code1:"",image_format:"png"},{class:"block",name:"lb_2_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=85;objects[obj_name].y=140;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_2_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=88;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"cont",name:"lb_2_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=140;objects[obj_name].sy=objects[obj_name].y=145;",code1:"objects[obj_name].addChild(objects.lb_2_avatar);objects[obj_name].addChild(objects.lb_2_mask);objects[obj_name].addChild(objects.lb_2_frame);objects[obj_name].addChild(objects.lb_2_crown);objects[obj_name].addChild(objects.lb_2_name);objects[obj_name].addChild(objects.lb_2_rating);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"lb_2_frame",code0:"objects[obj_name].x=10;objects[obj_name].y=40;objects[obj_name].width=150;objects[obj_name].height=150;",code1:"",image_format:"png"},{class:"sprite",name:"lb_2_crown",code0:"objects[obj_name].x=87;objects[obj_name].y=17;objects[obj_name].width=100;objects[obj_name].height=90;",code1:"",image_format:"png"},{class:"block",name:"cards_menu_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Здесь можно сыграть с другими игроками онлайн','Here you can play online'][LANG], {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=objects[obj_name].sx=400;objects[obj_name].y=objects[obj_name].sy=20;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;objects[obj_name].visible=false;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"block",name:"players_online",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=objects[obj_name].sx=400;objects[obj_name].y=objects[obj_name].sy=430;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"rules_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=740;objects[obj_name].height=429.999869791667;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"rules_ok_button",code0:"objects[obj_name].x=290;objects[obj_name].y=352;objects[obj_name].width=180;objects[obj_name].height=75;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.rules_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",code1:"",image_format:"png"},{class:"cont",name:"rules_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=0;",code1:"objects[obj_name].addChild(objects.rules_bcg);objects[obj_name].addChild(objects.rules_ok_button);app.stage.addChild(objects[obj_name]);"},{class:"image",name:"mini_player_card_table",image_format:"png"},{class:"image",name:"rating_bcg",image_format:"png"},{class:"image",name:"pc_icon",image_format:"png"},{class:"image",name:"mini_player_card",image_format:"png"},{class:"image",name:"avatar_mask",image_format:"png"},{class:"image",name:"avatar_frame",image_format:"png"},{class:"block",name:"my_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].width=100.00009765625;objects[obj_name].height=100;",code1:"objects[obj_name].mask = objects.my_avatar_mask;"},{class:"block",name:"my_avatar_mask",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=20;",code1:"objects[obj_name].texture = gres.avatar_mask.texture;"},{class:"block",name:"my_card_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"my_card_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"block",name:"my_avatar_frame",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=20;objects[obj_name].y=10;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"objects[obj_name].texture = gres.avatar_frame.texture;"},{class:"cont",name:"my_card_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=objects[obj_name].sx=20;objects[obj_name].y=objects[obj_name].sy=10;",code1:"objects[obj_name].addChild(objects.my_avatar);objects[obj_name].addChild(objects.my_avatar_mask);objects[obj_name].addChild(objects.my_avatar_frame);objects[obj_name].addChild(objects.my_card_name);objects[obj_name].addChild(objects.my_card_rating);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"opp_card_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"opp_card_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"block",name:"opp_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].width=100.00009765625;objects[obj_name].height=100;",code1:"objects[obj_name].mask = objects.opp_avatar_mask;"},{class:"block",name:"opp_avatar_mask",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=20;",code1:"objects[obj_name].texture = gres.avatar_mask.texture;"},{class:"block",name:"opp_avatar_frame",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=20;objects[obj_name].y=10;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"objects[obj_name].texture = gres.avatar_frame.texture;"},{class:"cont",name:"opp_card_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=objects[obj_name].sx=620;objects[obj_name].y=objects[obj_name].sy=10;",code1:"objects[obj_name].addChild(objects.opp_avatar);objects[obj_name].addChild(objects.opp_avatar_mask);objects[obj_name].addChild(objects.opp_avatar_frame);objects[obj_name].addChild(objects.opp_card_name);objects[obj_name].addChild(objects.opp_card_rating);app.stage.addChild(objects[obj_name]);"},{class:"image",name:"chk_quad_2",image_format:"png"},{class:"image",name:"chk_quad_1",image_format:"png"},{class:"block",name:"giveup_button",code0:"objects[obj_name]=new PIXI.Sprite(gres.send_sticker_button.texture);objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.show()};objects[obj_name].x=10;objects[obj_name].y=70;objects[obj_name].width=170;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);",code1:"objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"},{class:"sprite",name:"send_sticker_button",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=170;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);",code1:"objects[obj_name].pointerdown=function(){stickers.show_panel()};objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"cont",name:"game_buttons_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].ready=true;objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=610;objects[obj_name].sy=objects[obj_name].y=310;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.send_sticker_button);objects[obj_name].addChild(objects.giveup_button);objects[obj_name].addChild(objects.stickers_button_title);objects[obj_name].addChild(objects.giveup_button_title);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"stickers_button_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Стикеры','Stickes'][LANG], {fontName: 'mfont',fontSize: 28.48,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=95;objects[obj_name].y=45;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"giveup_button_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Сдаться','Giveup'][LANG], {fontName: 'mfont',fontSize: 28.48,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=95;objects[obj_name].y=105;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"sprite",name:"stickers_bcg",code0:"objects[obj_name].x=9;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].width=320;objects[obj_name].height=350;",code1:"",image_format:"png"},{class:"block",name:"sticker_0",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=29;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_0'].texture;",code1:""},{class:"block",name:"sticker_1",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=99;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_1'].texture;",code1:""},{class:"block",name:"sticker_2",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=169;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_2'].texture;",code1:""},{class:"block",name:"sticker_3",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=239;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_3'].texture;",code1:""},{class:"block",name:"sticker_4",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=29;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_4'].texture;",code1:""},{class:"block",name:"sticker_5",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=99;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_5'].texture;",code1:""},{class:"block",name:"sticker_6",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=169;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_6'].texture;",code1:""},{class:"block",name:"sticker_7",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=239;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_7'].texture;",code1:""},{class:"block",name:"sticker_8",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=29;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_8'].texture;",code1:""},{class:"block",name:"sticker_9",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=99;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_9'].texture;",code1:""},{class:"block",name:"sticker_10",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=169;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_10'].texture;",code1:""},{class:"block",name:"sticker_11",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=239;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_11'].texture;",code1:""},{class:"block",name:"sticker_12",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=29;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_12'].texture;",code1:""},{class:"block",name:"sticker_13",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=99;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_13'].texture;",code1:""},{class:"block",name:"sticker_14",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=169;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_14'].texture;",code1:""},{class:"block",name:"sticker_15",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=239;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_15'].texture;",code1:""},{class:"cont",name:"stickers_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=234;objects[obj_name].sy=objects[obj_name].y=10;",code1:"app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.stickers_bcg);objects[obj_name].addChild(objects.close_stickers);objects[obj_name].addChild(objects.stickers_title);for (var z=0;z<16;z++) {objects[obj_name].addChild(objects['sticker_'+z]);objects['sticker_'+z].width=70;objects['sticker_'+z].height=70;objects['sticker_'+z].interactive=true;objects['sticker_'+z].buttonMode=true;const id=z;objects['sticker_'+id].pointerover=function(){this.tint=0xFF6666};objects['sticker_'+id].pointerout=function(){this.tint=this.base_tint};objects['sticker_'+id].pointerdown=function(){stickers.send(id)};}objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};"},{class:"sprite",name:"close_stickers",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=()=>{stickers.hide_panel()};objects[obj_name].x=269;objects[obj_name].y=21;objects[obj_name].width=40;objects[obj_name].height=40;",code1:"objects[obj_name].pointerover=function(){this.tint=0xff0000};objects[obj_name].pointerout=function(){this.tint=0xffffff};",image_format:"png"},{class:"block",name:"stickers_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Отправить стикер','Send sticker'][LANG], {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=144;objects[obj_name].y=39;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"stop_bot_button_bcg",code0:"objects[obj_name]=new PIXI.Sprite(gres.send_sticker_button.texture);objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){game.stop('my_stop')};objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=170;objects[obj_name].height=69.9998942057292;objects[obj_name].base_tint=objects[obj_name].tint;",code1:""},{class:"cont",name:"stop_bot_button",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].x=610;objects[obj_name].y=360;objects[obj_name].visible=false;",code1:"objects[obj_name].addChild(objects.stop_bot_button_bcg);objects[obj_name].addChild(objects.stop_bot_button_title);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"stop_bot_button_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Завершить','Стоп'][LANG], {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=96;objects[obj_name].y=45;objects[obj_name].base_tint=objects[obj_name].tint=0XDEEBF7;",code1:""},{class:"sprite",name:"back_button",code0:"objects[obj_name].x=690;objects[obj_name].y=340;objects[obj_name].width=100;objects[obj_name].height=100;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){cards_menu.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"sprite",name:"giveup_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=361;objects[obj_name].height=160;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"giveup_no",code0:"objects[obj_name].x=201;objects[obj_name].y=80;objects[obj_name].width=150;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.hide()};",code1:"objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"cont",name:"giveup_dialog",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=210;objects[obj_name].sy=objects[obj_name].y=280;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.giveup_bcg);objects[obj_name].addChild(objects.giveup_yes);objects[obj_name].addChild(objects.giveup_no);objects[obj_name].addChild(objects.giveup_title);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"giveup_yes",code0:"objects[obj_name].x=30;objects[obj_name].y=80;objects[obj_name].width=151;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.give_up()};",code1:"objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"block",name:"giveup_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Уверены?','Sure?'][LANG], {fontName: 'mfont',fontSize: 35.6,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=189;objects[obj_name].y=50;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"sprite",name:"big_message_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=380;objects[obj_name].height=260;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"big_message_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].maxWidth=320;objects[obj_name].x=200;objects[obj_name].y=30;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"cont",name:"big_message_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=201;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.big_message_bcg);objects[obj_name].addChild(objects.big_message_text);objects[obj_name].addChild(objects.close_big_message);objects[obj_name].addChild(objects.big_message_text2);objects[obj_name].addChild(objects.feedback_button);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"close_big_message",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=200;objects[obj_name].y=180;objects[obj_name].width=160;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){big_message.close()};    ",code1:"",image_format:"png"},{class:"sprite",name:"feedback_button",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=40;objects[obj_name].y=180;objects[obj_name].width=160;objects[obj_name].height=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){big_message.feedback_down()};    ",code1:"",image_format:"png"},{class:"block",name:"big_message_text2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].maxWidth=318;objects[obj_name].x=199;objects[obj_name].y=147;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"image",name:"hl_key0",image_format:"png"},{class:"image",name:"hl_key1",image_format:"png"},{class:"image",name:"hl_key2",image_format:"png"},{class:"image",name:"hl_key3",image_format:"png"},{class:"sprite",name:"feedback_bcg",code0:"objects[obj_name].x=9;objects[obj_name].y=10;objects[obj_name].width=581.000130208333;objects[obj_name].height=419.999869791667;objects[obj_name].interactive=true;objects[obj_name].pointerdown = feedback.pointerdown.bind(feedback);",code1:"",image_format:"png"},{class:"block",name:"feedback_msg",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 28.48});objects[obj_name].anchor.set(0,0);objects[obj_name].x=39;objects[obj_name].y=58;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;objects[obj_name].maxWidth=521;",code1:""},{class:"block",name:"feedback_control",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 19.58});objects[obj_name].anchor.set(1,1);objects[obj_name].x=560;objects[obj_name].y=160;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"cont",name:"feedback_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=101;objects[obj_name].sy=objects[obj_name].y=10;",code1:"objects[obj_name].addChild(objects.feedback_bcg);objects[obj_name].addChild(objects.feedback_msg);objects[obj_name].addChild(objects.feedback_control);objects[obj_name].addChild(objects.hl_key);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"hl_key",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;",code1:""},{class:"sprite",name:"invite_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=560;objects[obj_name].height=360;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].interactive=true;",code1:"",image_format:"png"},{class:"block",name:"invite_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=115;objects[obj_name].y=221;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"invite_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=115;objects[obj_name].y=249;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"invite_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=40;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].width=150;objects[obj_name].height=150;",code1:""},{class:"cont",name:"invite_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=141;objects[obj_name].sy=objects[obj_name].y=20;",code1:"objects[obj_name].addChild(objects.invite_bcg);objects[obj_name].addChild(objects.invite_avatar);objects[obj_name].addChild(objects.invite_name);objects[obj_name].addChild(objects.invite_rating);objects[obj_name].addChild(objects.invite_button);objects[obj_name].addChild(objects.invite_close);objects[obj_name].addChild(objects.invite_button_title);objects[obj_name].addChild(objects.invite_feedback);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"invite_button",code0:"objects[obj_name].x=60;objects[obj_name].y=280;objects[obj_name].width=390;objects[obj_name].height=80;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.send_invite()};objects[obj_name].pointerover=function(){this.tint=0x444444};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"invite_button_title",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 42.72});objects[obj_name].anchor.set(0.5,0.6);objects[obj_name].x=255;objects[obj_name].y=324;objects[obj_name].base_tint=objects[obj_name].tint=0X324D1F;",code1:""},{class:"block",name:"invite_feedback",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 16.02});objects[obj_name].x=210;objects[obj_name].y=50;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;objects[obj_name].maxWidth = 259.99990234375;",code1:""},{class:"sprite",name:"invite_close",code0:"objects[obj_name].x=480;objects[obj_name].y=10;objects[obj_name].width=90.00009765625;objects[obj_name].height=90;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.hide_invite_dialog()};objects[obj_name].pointerover=function(){this.tint=0x447444};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"td_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=419.999869791667;objects[obj_name].height=280.00009765625;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].interactive=true;",code1:"",image_format:"png"},{class:"block",name:"td_name1",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=210;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"td_rating1",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=239;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"td_avatar1",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=70;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=130;objects[obj_name].height=130;",code1:""},{class:"cont",name:"td_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=190;objects[obj_name].sy=objects[obj_name].y=50;",code1:"objects[obj_name].addChild(objects.td_bcg);objects[obj_name].addChild(objects.td_avatar1);objects[obj_name].addChild(objects.td_avatar2);objects[obj_name].addChild(objects.td_name1);objects[obj_name].addChild(objects.td_name2);objects[obj_name].addChild(objects.td_rating1);objects[obj_name].addChild(objects.td_rating2);objects[obj_name].addChild(objects.td_close);objects[obj_name].addChild(objects.td_title);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"td_name2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=305;objects[obj_name].y=211;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"td_rating2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=305;objects[obj_name].y=240;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"td_avatar2",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=240;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=130;objects[obj_name].height=130;",code1:""},{class:"block",name:"td_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Идет игра...','Game is on...'][LANG], {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=218;objects[obj_name].y=45;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"sprite",name:"td_close",code0:"objects[obj_name].x=361;objects[obj_name].y=17;objects[obj_name].width=59;objects[obj_name].height=60;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.close_table_dialog()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"req_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].width=360;objects[obj_name].height=219.99990234375;objects[obj_name].interactive=true;",code1:"",image_format:"png"},{class:"block",name:"req_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24.92,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=251;objects[obj_name].y=84;objects[obj_name].base_tint=objects[obj_name].tint=0X2F5597;",code1:""},{class:"block",name:"req_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].x=251;objects[obj_name].y=122;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"req_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=50;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=90;objects[obj_name].height=80;",code1:""},{class:"cont",name:"req_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=210;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.req_bcg);objects[obj_name].addChild(objects.req_avatar);objects[obj_name].addChild(objects.req_name);objects[obj_name].addChild(objects.req_rating);objects[obj_name].addChild(objects.req_ok);objects[obj_name].addChild(objects.req_deny);objects[obj_name].addChild(objects.req_title);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"req_ok",code0:"objects[obj_name].x=20;objects[obj_name].y=145;objects[obj_name].width=170;objects[obj_name].height=75;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.accept()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"req_deny",code0:"objects[obj_name].x=190;objects[obj_name].y=145;objects[obj_name].width=170.00009765625;objects[obj_name].height=75;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.reject()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"req_title",code0:"objects[obj_name]=new PIXI.BitmapText(['Приглашение','Invite'][LANG], {fontName: 'mfont',fontSize: 28.48,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=191;objects[obj_name].y=29;objects[obj_name].base_tint=objects[obj_name].tint=0X2F5597;",code1:""},{class:"sprite",name:"id_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].width=320;objects[obj_name].height=180;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"id_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=220;objects[obj_name].y=80;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"id_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=220;objects[obj_name].y=115;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"id_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=60;objects[obj_name].width=99.99990234375;objects[obj_name].height=100;",code1:""},{class:"cont",name:"id_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=true;objects[obj_name].sx=objects[obj_name].x=230;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.id_bcg);objects[obj_name].addChild(objects.id_avatar);objects[obj_name].addChild(objects.id_name);objects[obj_name].addChild(objects.id_rating);objects[obj_name].addChild(objects.id_loup);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"id_loup",code0:"objects[obj_name].sx=objects[obj_name].x=90;objects[obj_name].sy=objects[obj_name].y=123;objects[obj_name].anchor.set(0.5,0.5);",code1:"",image_format:"png"}];

irnd = function(min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width = 200;
		this.bcg.height = 100;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 20,align: 'center'});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 18,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 18,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width = 200;
		this.rating_bcg.height = 100;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;		
				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

var message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		sound.play('message');

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.5,'easeInBack');			
	}

}

var big_message = {
	
	p_resolve : 0,
	feedback_on : 0,
	
		
	show: function(t1,t2, feedback_on) {
		
		this.feedback_on = feedback_on;
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	feedback_down : async function () {
		
		if (objects.big_message_cont.ready===false || this.feedback_on === 0) {
			sound.play('locked');
			return;			
		}


		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');	
		
		await feedback.show();
		
		this.p_resolve("close");
				
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

var board_func={

	checker_to_move: "",
	target_point: 0,
	tex_2:0,
	tex_1:0,
	chk_type: 'quad',
	moves: [],
	move_end_callback: function(){},

	update_board: function() {

		this.target_point=0;

		//сначала скрываем все шашки
		objects.checkers.forEach((c)=>{	c.visible=false});

		var ind=0;
		for (var x=0;x<8;x++) {
			for (var y=0;y<8;y++) {

				if (g_board[y][x]!==0)
				{
					if (g_board[y][x]===2)
						objects.checkers[ind].texture=this.tex_2;

					if (g_board[y][x]===1)
						objects.checkers[ind].texture=this.tex_1;

					objects.checkers[ind].x=x*50+objects.board.x+10;
					objects.checkers[ind].y=y*50+objects.board.y+10;

					objects.checkers[ind].ix=x;
					objects.checkers[ind].iy=y;
					objects.checkers[ind].m_id=g_board[y][x];
					objects.checkers[ind].alpha=1;


					objects.checkers[ind].visible=true;
					ind++;
				}
			}
		}

	},

	get_checker_by_pos(x,y) {

		for (let c of objects.checkers)
			if (c.ix===x && c.iy===y)
				return c;
		return 0;
	},

	get_moves_path: function(move_data){

		var g_archive=[0,0,0,0,0,0,0,0,0,0,0];
		var move_archive=[[move_data.x1,move_data.y1]];


		function left(move_data,cur_board, m_archive) {

			var new_x=move_data.x1-1;
			var new_y=move_data.y1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;

			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];
				}
				return
			}
			else
			{
				left_combo(move_data,cur_board,	m_archive);
			}
		}

		function right(move_data,cur_board, m_archive) {
			var new_x=move_data.x1+1;
			var new_y=move_data.y1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;

			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];
				}
				return
			}
			else
			{
				right_combo(move_data,cur_board, m_archive);
			}
		}

		function up(move_data,cur_board, m_archive){
			var new_x=move_data.x1;
			var new_y=move_data.y1-1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;

			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];
				}
				return
			}
			else
			{
				up_combo(move_data,cur_board, m_archive);
			}
		}

		function down(move_data,cur_board, m_archive){
			var new_x=move_data.x1;
			var new_y=move_data.y1+1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;

			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];
				}
				return
			}
			else
			{
				down_combo(move_data,cur_board, m_archive);
			}
		}

		function left_combo(move_data, cur_board, m_archive) {

			var new_x=move_data.x1-2;
			var new_y=move_data.y1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[move_data.y1][move_data.x1-1]===0) return;
			if (cur_board[new_y][new_x]!==0) return;

			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];

			m_archive.push([new_x,new_y]);
			if (new_x===move_data.x2 && new_y===move_data.y2) {
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;
			}

			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}

			//продолжаем попытки комбо
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));

		}

		function right_combo(move_data,cur_board, m_archive) {

			var new_x=move_data.x1+2;
			var new_y=move_data.y1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[move_data.y1][move_data.x1+1]===0) return;
			if (cur_board[new_y][new_x]!==0) return;

			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];

			m_archive.push([new_x,new_y]);
			if (new_x===move_data.x2 && new_y===move_data.y2) {
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;
			}

			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}

			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));

		}

		function up_combo(move_data,cur_board, m_archive) {

			var new_x=move_data.x1;
			var new_y=move_data.y1-2;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[move_data.y1-1][move_data.x1]===0) return;
			if (cur_board[new_y][new_x]!==0) return;

			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];

			m_archive.push([new_x,new_y]);
			if (new_x===move_data.x2 && new_y===move_data.y2) {
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;
			}

			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}

			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));

		}

		function down_combo(move_data,cur_board, m_archive) {

			var new_x=move_data.x1;
			var new_y=move_data.y1+2;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[move_data.y1+1][move_data.x1]===0) return;
			if (cur_board[new_y][new_x]!==0) return;

			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];

			m_archive.push([new_x,new_y]);
			if (new_x===move_data.x2 && new_y===move_data.y2) {
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;
			}

			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}

			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));

		}

		left(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		right(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		up(		move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		down(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));

		return g_archive;
	},

	start_gentle_move: async function(move_data, moves) {

		
		let chk_spr = this.get_checker_by_pos(move_data.x1, move_data.y1);		
				
		for (let i = 1 ; i < moves.length; i++) {
			
			let tar_x = moves[i][0] * 50 + objects.board.x+10;
			let tar_y = moves[i][1] * 50 + objects.board.y+10;
			await anim2.add(chk_spr,{x:[chk_spr.x, tar_x], y: [chk_spr.y, tar_y]}, true, 0.16,'linear');
			sound.play('move');
		}
		
		
		var [sx,sy]=moves[0];
		var [tx,ty]=moves[moves.length-1];

		//меняем старую и новую позицию шашки
		[g_board[ty][tx],g_board[sy][sx]]=[g_board[sy][sx],g_board[ty][tx]];

		//обновляем доску
		this.update_board();
		
	},

	set_next_cell() {

		//проверяем что движение завершилось
		if (this.target_point===this.moves.length) {

			this.target_point=0;

			var [sx,sy]=this.moves[0];
			var [tx,ty]=this.moves[this.moves.length-1];

			//меняем старую и новую позицию шашки
			[g_board[ty][tx],g_board[sy][sx]]=[g_board[sy][sx],g_board[ty][tx]];

			//обновляем доску
			board_func.update_board();

			//вызываем функцию которая обозначает завершение движения шашки
			this.move_end_callback();

			return;
		}



		var [next_ix,next_iy]=this.moves[this.target_point];

		this.checker_to_move.tx=next_ix*50+objects.board.x+10;
		this.checker_to_move.ty=next_iy*50+objects.board.y+10;

		this.checker_to_move.dx=(this.checker_to_move.tx-this.checker_to_move.x)/10;
		this.checker_to_move.dy=(this.checker_to_move.ty-this.checker_to_move.y)/10;

		this.target_point++;
	},

	count_finished1: function (boardv) {
		let cnt=0;
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]===1)
					cnt++;
		return cnt;
	},

	count_finished2: function (boardv) {
		let cnt=0;
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]===2)
					cnt++;
		return cnt;
	},

	finished1: function (boardv) {
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]!==1)
					return 0;
		return 1;
	},

	finished2: function (boardv) {
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]!==2)
					return 0;
		return 1;
	},

	any1home: function(boardv) {
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]===1)
					return 1;
		return 0;
	},

	any2home: function(boardv) {
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]===2)
					return 1;
		return 0;
	},

	get_board_state: function(board, made_moves) {

		let w1=this.finished1(board);
		let w2=this.finished2(board);
		if (w1 === 1 && w2 === 1)
			return 'both_finished'
		if (w1 === 1)
			return 'my_finished_first'
		if (w2 === 1)
			return 'opp_finished_first'
		
		let any1home30 = this.any1home(board)*(made_moves >= 30);
		let any2home30 = this.any2home(board)*(made_moves >= 30);
		
		if (any1home30 === 1 && any2home30 === 1)
			return 'both_left_after_30'
		if (any1home30 === 1)
			return 'my_left_after_30'
		if (any2home30 === 1)
			return 'opp_left_after_30'
			

		//это случай если игра дошла до 80 хода
		if (made_moves >= 80) {

			let fin1=this.count_finished1(board);
			let fin2=this.count_finished2(board);

			if (fin1	>	fin2)	return 'my_more_fin_after_80';
			if (fin1	<	fin2)	return 'opp_more_fin_after_80';
			if (fin1	===	fin2)	return 'same_fin_after_80';
		}
		
		return '';
	}
}

var online_game = {
	
	name : 'online',
	start_time : 0,
	disconnect_time : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	move_time_left : 0,
	timer_id : 0,
	
	calc_new_rating : function (old_rating, game_result) {
		
		
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	activate : function () {
		
		//пока еще никто не подтвердил игру
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		
		//счетчик времени
		this.move_time_left = 15;
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);
		objects.timer_text.tint=0xffffff;
		
		//отображаем таймер
		objects.timer_cont.visible = true;
		objects.game_buttons_cont.visible = true;
		objects.timer_cont.x = my_turn === 1 ? 30 : 630;
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
		
		//устанавливаем локальный и удаленный статус
		set_state({state : 'p'});		
		
		//устанавливаем начальное расположение шашек
		g_board =[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		board_func.update_board();
		
		
	},
	
	timer_tick : function () {
		
		this.move_time_left--;
		
		if (this.move_time_left < 0 && my_turn === 1)	{
			
			if (this.me_conf_play === 1)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');
			
			return;
		}

		if (this.move_time_left < -5 && my_turn === 0) {
			
			if (this.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			
			
			return;
		}

		if (connected === 0 && my_turn === 0) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}		
		
		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			sound.play('clock');
		}

		//обновляем текст на экране
		objects.timer_text.text="0:"+this.move_time_left;
		
		//следующая секунда
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);		
	},
	
	reset_timer : function() {
		
		//обовляем время разъединения
		this.disconnect_time = 0;
		
		//перезапускаем таймер хода
		this.move_time_left = 32;
		objects.timer_text.text="0:"+this.move_time_left;
		objects.timer_text.tint=0xffffff;
		
		objects.timer_cont.x = my_turn === 1 ? 30 : 630;
		
	},
		
	stop : async function (result) {
		
		let res_array = [
			['my_timeout',LOSE, 'Вы проиграли!\nУ вас закончилось время'],
			['opp_timeout',WIN , 'Вы выиграли!\nУ соперника закончилось время'],
			['my_giveup' ,LOSE, 'Вы сдались!'],
			['opp_giveup' ,WIN , 'Вы выиграли!\nСоперник сдался'],
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , 'Вы выиграли!\nБыстрее соперника перевели свои шашки.'],
			['opp_finished_first',LOSE, 'Вы проиграли!\nСоперник оказался быстрее вас.'],
			['both_left_after_30',DRAW, 'Ничья\nНикто не успел вывести все шашки из дома.'],
			['my_left_after_30',LOSE, 'Вы проиграли!\nНе успели вывести свои шашки за 30 ходов.'],
			['opp_left_after_30',WIN , 'Вы выиграли!\nСоперник не успел вывести свои шашки за 30 ходов.'],
			['my_more_fin_after_80',WIN , 'Вы выиграли!\nПеревели больше шашек в новый дом.'],
			['opp_more_fin_after_80',LOSE, 'Вы проиграли!\nСоперник перевел больше шашек в новый дом.'],
			['same_fin_after_80',DRAW , 'Ничья\nОдинаковое количество шашек в новом доме'],
			['my_no_sync',NOSYNC , 'Похоже вы не захотели начинать игру.'],
			['opp_no_sync',NOSYNC , 'Похоже соперник не смог начать игру.'],
			['my_no_connection',LOSE , 'Потеряна связь!\nИспользуйте надежное интернет соединение.']
		];
		
		clearTimeout(this.timer_id);		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2];				
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		
		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;
	
	
		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			stickers.hide_panel();	
		
		//если диалоги еще открыты
		if (objects.giveup_dialog.visible===true)
			giveup_menu.hide();
				
		//убираем элементы
		objects.timer_cont.visible = false;
		objects.game_buttons_cont.visible = false;
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown = function() {};
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');
		else
			sound.play('win');
		
		

		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration,'rating': [old_rating,my_data.rating],'client_id':client_id, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
			
			
			let check_players =[
				'1NOs1k4jKvIIe80grKaEoIZ59PbuP0TWlBOoFHrUoh4=',
				'HAXS4Uwl22XJybZg2gTbwaHUzHOMc7X1mLFS2Av8ayM=',
				'JQLfWZUohlfV+xo1mbr55E1yqhDx65iOplh3zrJNAbA=',
				'HHNnZgYsNjwFHsGW5l3uvtX+GOeZJJcD8HQz8RcThWw=',
				'Z8rpvOLTNIjvgZxnTMTSZX5Z08QfynLlxi0ZvWs0cV8=',
				'w5jjfB09gf2kWOJ0BxicV1jUtkESey7npAzj+cyE078=',
				'nYaoPB58Z5BqhFaOqpJx10MEQblZY7wMLgUxqunbQJg=',
				'X3oRx1NdLMzDqrLaKAXAahBP8Pnq1k+irMDuHKHqMbY=',
				'vk113552413',
				'ZUCRKkTFE07ztjK1Pht6WKjMcZk4ZBz1G5BMokzOVsg=',
				'vk188397292',
				'UHo0nOw9SNkrRd2SOwZKGwcJjXKqFy7ePZw+moJrUGw=',
				'ihwRwyyjjwtumUck+HzegY6D5kZ3tIJKQ1ZHPlN6s3k=',
				'vk651786817',
				'z41rApQa+dtJEED5fD3obsAAgdoPyL8JYlGw0orCItQ=',
				'GwAJkw0eiVu8yWxoUsBwCQBoOU48AHB9cRlhamqNtcM=',
				'N2mKTRhaWkGUgCk6baYVxZsZiyjZRiJl8WOopFSBj3A=',
				'Q91gCAYjLDQeTBZLiwmWWzWmhZnuKTAWgpLbm3kw9Uo=',
				'Rlv31Fj5kzkNkkOKJ5BreenNDfMUecDq7EGwS4eKTVw=',
				'wmXca5Z53ezNANjw+BkH5GpfjDOpg51D+bJGmTJHsnQ=',
				'p70n979DU+biBKD3wbiOn0hADScsGJZkoRnEAx7MRNI='
			]
			
			//контрольные концовки
			if (check_players.includes(my_data.uid) || check_players.includes(opp_data.uid)) {
			firebase.database().ref("finishes2").push({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'rating': [old_rating,my_data.rating],'client_id':client_id, 'ts':firebase.database.ServerValue.TIMESTAMP});	
			}
			
		}
		
		//проверяем выход в мелкую комнату
		if (old_rating >= 1500 &&  my_data.rating <1500) {
			firebase.database().ref(room_name+"/"+my_data.uid).remove();
			room_name = 'states';
			message.add('Вы перешли в комнату для слабых игроков (((')
		}
		
		//проверяем выход в большую комнату
		if (my_data.rating >= 1500 &&  old_rating <1500) {
			firebase.database().ref(room_name+"/"+my_data.uid).remove();
			room_name = 'states2';
			message.add('Добро пожаловать в комнату для сильных игроков )))')
		}
	
		
		await big_message.show(result_info, `Рейтинг: ${old_rating} > ${my_data.rating}`,1)
		
	},
	
	clear : function() {
		
		
	}
	
}

var bot_game = {

	name :'bot',
	me_conf_play : 0,
	opp_conf_play : 0,

	activate: function() {


		//устанавливаем локальный и удаленный статус
		set_state ({state : 'b'});

		//очереди
		my_turn=1;
		
		opp_data.uid = 'BOT';
		
		//таймер уже не нужен
		objects.timer_cont.visible = false;
		objects.game_buttons_cont.visible = false;
		objects.stop_bot_button.visible = true;

		//инициируем доску в зависимости от рейтинга
		if (my_data.rating>=0 && my_data.rating<1500 )
			g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1500 && my_data.rating<1600 )
			g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,0,2,0,0,0,0],[0,0,2,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1600 && my_data.rating<1700 )
			g_board = [[2,2,2,0,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,0,0,0,0,0],[0,2,0,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1700 && my_data.rating<1800 )
			g_board = [[0,0,2,2,0,0,0,0],[0,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1800)
			g_board = [[0,0,2,2,0,0,0,0],[0,0,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1900)
			g_board = [[0,0,0,2,0,0,0,0],[0,0,2,2,2,0,0,0],[0,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,2,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=2000)
			g_board = [[0,0,0,0,0,0,0,0],[0,0,0,0,2,2,0,0],[0,0,2,2,2,2,0,0],[0,0,2,2,0,0,0,0],[0,2,2,0,0,0,0,0],[0,2,2,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];



		board_func.update_board();

	},

	stop : async function(result) {

		let res_array = [
			['both_finished',DRAW, 'Ничья'],
			['my_finished_first',WIN , 'Вы выиграли!\nБыстрее соперника перевели свои шашки.'],
			['opp_finished_first',LOSE, 'Вы проиграли!\nСоперник оказался быстрее вас.'],
			['both_left_after_30',LOSE, 'Вы проиграли!\nСоперник оказался быстрее вас.'],
			['my_left_after_30',LOSE, 'Вы проиграли!\nНе успели вывести свои шашки за 30 ходов.'],
			['my_more_fin_after_80',WIN , 'Вы выиграли!\nПеревели больше шашек в новый дом.'],
			['opp_more_fin_after_80',LOSE, 'Вы проиграли!\nСоперник перевел больше шашек в новый дом.'],
			['same_fin_after_80',DRAW , 'Ничья\nОдинаковое количество шашек в новом доме'],
			['my_stop',DRAW , 'Вы отменили игру.']			
		];
		
		let result_number = res_array.find( p => p[0] === result)[1];
		let result_info = res_array.find( p => p[0] === result)[2];				
			
		//выключаем элементы
		objects.stop_bot_button.visible = false;
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown = function() {};
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');
		
		
		await big_message.show(result_info, ')))',1)
		
	},

	make_move: async function() {

		await new Promise((resolve, reject) => setTimeout(resolve, 300));

		let m_data={};
		if (made_moves < 30)
			m_data=minimax_solver.minimax_3(g_board, made_moves);
		else 
			m_data=minimax_solver.minimax_3_single(g_board, made_moves);

		game.receive_move(m_data);	

	},
	
	reset_timer : function() {
		
		
	},
	
	clear : function() {
		
		//выключаем элементы
		objects.stop_bot_button.visible = false;
		
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var game = {

	opponent : "",
	selected_checker : 0,
	checker_is_moving : 0,
	state : 0,

	activate: function(opponent, role) {

		my_role = role;
		
		this.state = 'on';

		if (role==="master") {
			my_turn=1;			
			board_func.tex_2=game_res.resources['chk_'+board_func.chk_type+'_2'].texture;
			board_func.tex_1=game_res.resources['chk_'+board_func.chk_type+'_1'].texture;
			message.add('Вы играете красными шашками. Последний ход за соперником')
			
		} else {
			my_turn=0;
			board_func.tex_2=game_res.resources['chk_'+board_func.chk_type+'_1'].texture;
			board_func.tex_1=game_res.resources['chk_'+board_func.chk_type+'_2'].texture;
			message.add('Вы играете белыми шашками. Последний ход за вами')
		}
		
				
		if (this.opponent !== "")
			this.opponent.clear();
		
		this.opponent = opponent;
		this.opponent.activate();

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
			
		sound.play('note');

		//это если перешли из бот игры
		this.selected_checker=0;
		objects.selected_frame.visible=false;

		//основные элементы игры
		objects.board.visible=true;
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		
		
		objects.cur_move_text.visible=true;

		//обозначаем какой сейчас ход
		made_moves=0;
		objects.cur_move_text.text="Ход: "+made_moves;

		//включаем взаимодейтсвие с доской
		objects.board.pointerdown = game.mouse_down_on_board.bind(game);
		

	},

	timer_tick: function() {



	},

	mouse_down_on_board : function(e) {

		if (any_dialog_active===1 || this.checker_is_moving === 1) {
			sound.play('locked');
			return
		};

		//проверяем что моя очередь
		if (my_turn === 0 || this.checker_is_moving === 1) {
			message.add("не твоя очередь");
			return;
		}

		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board.y-10)/400);

		//если выбрана новая шашка
		if (this.selected_checker===0)
		{
			//находим шашку по координатам
			this.selected_checker=board_func.get_checker_by_pos(new_x,new_y);

			if (this.selected_checker.m_id===my_checkers)
			{
				objects.selected_frame.x=this.selected_checker.x;
				objects.selected_frame.y=this.selected_checker.y;
				objects.selected_frame.visible=true;

				//воспроизводим соответствующий звук
				sound.play('move');

				return;
			}
			else
			{
				message.add("Это не ваши шашки");
				this.selected_checker=0;
				return;
			}
		}

		if (this.selected_checker!==0)
		{

			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===this.selected_checker.ix && new_y===this.selected_checker.iy)
			{
				sound.play('move');
				this.selected_checker=0;
				objects.selected_frame.visible=false;
				return;
			}

			//формируем объект содержащий информацию о ходе
			let m_data={x1:this.selected_checker.ix,y1:this.selected_checker.iy,x2:new_x, y2:new_y};

			//пытыемся получить последовательность ходов
			let moves=board_func.get_moves_path(m_data);


			if (moves.length!==11)
			{
				//убираем выделение
				objects.selected_frame.visible=false;

				//отменяем выделение
				this.selected_checker=0;

				//отправляем ход сопернику
				game.process_my_move(m_data, moves);
			}
			else
			{
				message.add("Так нельзя ходить");
			}
		}

	},

	process_my_move : async function (move_data, moves) {

		//делаем перемещение шашки
		this.checker_is_moving = 1;
		await board_func.start_gentle_move(move_data, moves);	
		this.checker_is_moving = 0;
		
		//начинаем процесс плавного перемещения шашки
		if (state === "b") {					
			bot_game.make_move();
		}
		else
		{
			//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2
			move_data.x1=7-move_data.x1;
			move_data.y1=7-move_data.y1;
			move_data.x2=7-move_data.x2;
			move_data.y2=7-move_data.y2;

			//отправляем ход сопернику
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:{...move_data, board_state:0}},
			function(error){if(error){message.add("Ошибка при отправке хода. Сообщите админу.")}});
		}
		
		if (my_role === 'slave') {
			
			made_moves++;
			objects.cur_move_text.text="Ход: "+made_moves;
			
			let result = board_func.get_board_state(g_board, made_moves);
			if (result !== '') {
				this.stop(result);
				return;
			}	
		}
				
		//уведомление что нужно вывести шашки из дома
		if (made_moves>24 && made_moves<31 ) {
			if (board_func.any1home(g_board))
				message.add("После 30 ходов не должно остаться шашек в доме");
		}

		//уведомление что игра скоро закончиться
		if (made_moves>75 && made_moves<81 ) {
			message.add("После 80 хода выиграет тот кто перевел больше шашек в новый дом");
		}

		//перезапускаем таймер хода и кто ходит
		my_turn = 0;
				
		//обновляем таймер
		this.opponent.reset_timer();		

		//обозначаем что я сделал ход и следовательно подтвердил согласие на игру
		this.opponent.me_conf_play=1;

	},

	receive_move: async function(move_data) {
		
		//это чтобы не принимать ходы если игры нет (то есть выключен таймер)
		if (game.state !== 'on')
			return;		
		
		//воспроизводим уведомление о том что соперник произвел ход
		sound.play('receive_move');

		//обозначаем кто ходит
		my_turn = 1;	

		//обозначаем что соперник сделал ход и следовательно подтвердил согласие на игру
		this.opponent.opp_conf_play = 1;	
		
		//обновляем таймер
		this.opponent.reset_timer();			

		//считаем последовательность ходов
		let moves = board_func.get_moves_path(move_data);

		//плавно перемещаем шашку
		this.checker_is_moving = 1;
		await board_func.start_gentle_move(move_data, moves);
		this.checker_is_moving = 0;
		
		
		if (my_role === 'master') {
			made_moves++;
			objects.cur_move_text.text="Ход: "+made_moves;
				
			let result = board_func.get_board_state(g_board, made_moves);
			
			//бота нельзя блокировать
			if (result === 'opp_left_after_30' && this.opponent.name === 'bot')	result = '';
			
			if (result !== '') {
				this.stop(result);
			}			
		}
		

	},
	
	stop : async function (result) {
				
		this.state = 'pending';
				
		await this.opponent.stop(result);
				
		objects.giveup_dialog.visible=false;
		objects.cur_move_text.visible=false;
		objects.board.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.selected_frame.visible=false;
		objects.checkers.forEach((c)=> {c.visible=false});
		
		//рекламная пауза
		show_ad();
		await new Promise((resolve, reject) => setTimeout(resolve, 2000));
		
		this.state = 'off';
		//показыаем основное меню
		main_menu.activate();

		//стираем данные оппонента
		opp_data.uid="";
		
		//соперника больше нет
		this.opponent = "";

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state ({state : 'o'});
	}

}

var feedback = {
	
	
	keys_data : [[50,180,80,218.33,'1'],[90,180,120,218.33,'2'],[130,180,160,218.33,'3'],[170,180,200,218.33,'4'],[210,180,240,218.33,'5'],[250,180,280,218.33,'6'],[290,180,320,218.33,'7'],[330,180,360,218.33,'8'],[370,180,400,218.33,'9'],[410,180,440,218.33,'0'],[450,180,550,218.33,'<'],[70,227.9,100,266.23,'Й'],[110,227.9,140,266.23,'Ц'],[150,227.9,180,266.23,'У'],[190,227.9,220,266.23,'К'],[230,227.9,260,266.23,'Е'],[270,227.9,300,266.23,'Н'],[310,227.9,340,266.23,'Г'],[350,227.9,380,266.23,'Ш'],[390,227.9,420,266.23,'Щ'],[430,227.9,460,266.23,'З'],[470,227.9,500,266.23,'Х'],[510,227.9,540,266.23,'Ъ'],[90,275.8,120,314.13,'Ф'],[130,275.8,160,314.13,'Ы'],[170,275.8,200,314.13,'В'],[210,275.8,240,314.13,'А'],[250,275.8,280,314.13,'П'],[290,275.8,320,314.13,'Р'],[330,275.8,360,314.13,'О'],[370,275.8,400,314.13,'Л'],[410,275.8,440,314.13,'Д'],[450,275.8,480,314.13,'Ж'],[490,275.8,520,314.13,'Э'],[70,323.8,100,362.13,'!'],[110,323.8,140,362.13,'Я'],[150,323.8,180,362.13,'Ч'],[190,323.8,220,362.13,'С'],[230,323.8,260,362.13,'М'],[270,323.8,300,362.13,'И'],[310,323.8,340,362.13,'Т'],[350,323.8,380,362.13,'Ь'],[390,323.8,420,362.13,'Б'],[430,323.8,460,362.13,'Ю'],[470,323.8,500,362.13,')'],[510,323.8,540,362.13,'?'],[30,371.7,180,410.03,'ЗАКРЫТЬ'],[190,371.7,420,410.03,'_'],[430,371.7,570,410.03,'ОТПРАВИТЬ']],
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	
	show : function() {
		
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	pointerdown : function(e) {
		
		let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
		let my = e.data.global.y/app.stage.scale.y- objects.feedback_cont.y;;
		let key = -1;
		let key_x = 0;
		let key_y = 0;
		for (let k of this.keys_data) {			
			if (mx > k[0] && mx <k[2] && my > k[1] && my < k[3]) {
				key = k[4];
				key_x = k[0];
				key_y = k[1];
				break;
			}
		}
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
				
		
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		
		if (key === 'ЗАКРЫТЬ') {
			this.close();
			this.p_resolve("close");	
			key ='';
		}	
		
		if (key === 'ОТПРАВИТЬ') {
			
			if (objects.feedback_msg.text === '') return;
			
			let fb_id = irnd(0,15);
			firebase.database().ref("fb/"+opp_data.uid+"/"+fb_id).set([objects.feedback_msg.text, firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.close();
			this.p_resolve("sent");	
			key ='';
		}	
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

var	show_ad = function(){
		
	if (game_platform==="YANDEX") {			
		//показываем рекламу
		window.ysdk.adv.showFullscreenAdv({
		  callbacks: {
			onClose: function() {}, 
			onError: function() {}
					}
		})
	}
	
	if (game_platform==="VK") {
				 
		vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
		.then(data => console.log(data.result))
		.catch(error => console.log(error));	
	}		




}

var giveup_menu = {

	show: function() {


		if (made_moves <5 ) {
			message.add("Нельзя сдаваться в начале игры");		
			return;
		}


		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};
		
		any_dialog_active=1;

		if (objects.giveup_dialog.ready===false)
			return;
		sound.play('click');

		//--------------------------
		anim2.add(objects.giveup_dialog,{y:[450, objects.giveup_dialog.sy]}, true, 0.5,'easeOutCubic');


	},

	give_up: function() {

		if (objects.giveup_dialog.ready===false)
			return;
		sound.play('click');

		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		this.hide();

		game.stop('my_giveup');

	},

	hide : function() {

		if (objects.giveup_dialog.ready===false)
			return;
		
		sound.play('close');

		any_dialog_active=0;

		//--------------------------
		anim2.add(objects.giveup_dialog,{y:[objects.giveup_dialog.sy, 450]}, false, 0.5,'easeInCubic');

	}
}

var keep_alive = function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name+"/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var minimax_solver = {


bad_1:[[-4,-4,0,8,25,41,61,85],[-2,-2,2,10,27,43,63,87],[4,4,8,16,33,49,69,93],[19,19,23,31,43,59,79,103],[33,33,37,45,57,73,93,117],[51,51,55,63,75,91,111,135],[73,73,77,85,97,113,133,157],[99,99,103,111,123,139,159,183]],

patterns:[[[0,1,1],[0,2,1],[1,0,1],[2,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[0,3,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,2],[3,0,1]],[[0,1,1],[0,2,2],[1,0,2],[1,2,1],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,1]],[[0,1,2],[0,2,2],[1,0,2],[1,1,1],[1,2,1],[2,0,1]],[[0,1,2],[0,2,1],[1,0,2],[1,1,1],[2,0,2],[2,1,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[1,0,1],[1,1,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,2],[1,1,1],[2,0,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[0,3,1],[1,0,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[3,0,1]],[[0,1,2],[0,2,1],[1,0,2],[1,1,1],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,2],[1,1,1],[2,0,1]]],

fin_moves:[[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,2,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,2,5,3,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,3,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[5,2,5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,5,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,4,4,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,4,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[3,4,4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,4,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,2,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,2,5,3,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,3,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,4,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,4,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,3,5,4,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,3,5,4,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,4,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,4,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[4,6,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,4,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[3,5,4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[4,7,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,4,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,4,5,5,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,7],[3,6,4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,3,5,4,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,4,5,5,5,6,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,5,5,6,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,6,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6],[3,7,4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6],[5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,2,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,3,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,2,6,3,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,3,6,5,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,3,6,5,6,6,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,3,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,4,4,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,3,5,4,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,4,5,5,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,4,5,5,5,6,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,5,5,6,5,7,6,6,6,7,7,4,7,5,7,6,7,7],[4,3,4,4,5,4,5,5,5,6,5,7,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,4,5,5,5,6,5,7,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,7,5,4,5,5,5,6,5,7,6,5,6,6,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,3,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,3,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,2,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,2,6,3,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,3,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,3,6,4,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,3,6,4,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,3,6,4,6,6,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,3,7,4,7,6,7,7],[5,3,5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[3,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,3,5,4,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[3,5,4,5,5,4,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,5,5,6,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,3,6,6,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,5,5,6,5,7,6,6,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,6,5,7,6,4,6,7,7,4,7,5,7,6,7,7],[4,4,4,5,5,4,5,5,5,6,5,7,6,4,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,3,6,4,6,6,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,5,5,6,5,7,6,4,6,6,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,4,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[3,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,3,5,4,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,6,4,6,5,4,5,5,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,6,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,3,6,5,6,7,7,4,7,5,7,6,7,7],[4,4,4,6,5,4,5,5,5,6,5,7,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,3,6,4,6,7,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,6,5,7,6,4,6,7,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,6,5,7,6,4,6,5,7,4,7,5,7,6,7,7],[4,5,4,6,5,4,5,5,5,6,5,7,6,4,6,5,7,4,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,3,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,3,7,4,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[3,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,3,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,4,4,7,5,5,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,3,5,4,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,6,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,7,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[3,7,4,7,5,4,5,5,5,6,6,4,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,3,6,5,6,6,7,4,7,5,7,6,7,7],[4,4,4,7,5,4,5,5,5,6,5,7,6,5,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,3,6,4,6,6,7,4,7,5,7,6,7,7],[4,5,4,7,5,4,5,5,5,6,5,7,6,4,6,6,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,4,7,5,7,6,7,7],[4,6,4,7,5,4,5,5,5,6,5,7,6,4,6,5,7,4,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,3,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,3,7,4,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6],[5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,3,7,5,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,5,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,3,7,5,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,2,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,5,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,2,7,3,7,5,7,7],[5,3,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,3,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,5,5,4,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,6,5,4,5,5,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,7,5,4,5,5,5,6,6,4,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[4,4,5,4,5,5,5,6,5,7,6,5,6,6,6,7,7,3,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,4,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,6,6,7,7,3,7,4,7,6,7,7],[4,5,5,4,5,5,5,6,5,7,6,4,6,6,6,7,7,3,7,4,7,6,7,7],[4,6,5,4,5,5,5,6,5,7,6,4,6,5,6,7,7,3,7,4,7,6,7,7],[4,7,5,4,5,5,5,6,5,7,6,4,6,5,6,6,7,3,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,2,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,3,6,4,6,5,6,6,6,7,7,4,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,5,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,2,7,3,7,6,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,5,7,7],[5,4,5,5,5,6,5,7,6,4,6,5,6,6,6,7,7,3,7,4,7,5,7,6]],


	clone_board : function (board) {

		r_board=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
		for (let y=0;y<8;y++)
			for (let x=0;x<8;x++)
				r_board[y][x]=board[y][x];
		return r_board;
	},

	get_childs: function(board_data, checkers, forward){

		function check_in_hist(x,y, hist) {
			for (let i=0;i<hist.length;i++)
				if (x===hist[i][0] && y===hist[i][1])
					return true;
			return false;
		}

		function left(ix,iy,cur_board,moves_hist,boards_array) {

			var new_x=ix-1;
			var new_y=iy;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;

			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return;
			}
			else {
				left_combo(ix,iy,cur_board,moves_hist,boards_array);
			}
		}

		function right(ix,iy,cur_board,moves_hist,boards_array) {
			var new_x=ix+1;
			var new_y=iy;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;

			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return
			} else {
				right_combo(ix,iy,cur_board,moves_hist,boards_array);
			}
		}

		function up(ix,iy,cur_board,moves_hist,boards_array){
			var new_x=ix;
			var new_y=iy-1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;

			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return
			} else {
				up_combo(ix,iy,cur_board,moves_hist,boards_array);
			}
		}

		function down(ix,iy,cur_board,moves_hist,boards_array){
			var new_x=ix;
			var new_y=iy+1;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;

			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return
			} else {
				down_combo(ix,iy,cur_board,moves_hist,boards_array);
			}
		}

		function left_combo(ix,iy,cur_board,moves_hist,boards_array) {

			var new_x=ix-2;
			var new_y=iy;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[iy][ix-1]===0) return;

			if (cur_board[new_y][new_x]===0)
			{

				if (check_in_hist(new_x,new_y,moves_hist)===true) return;

				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;

				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;

				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);

				//продолжаем попытки комбо
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			}
		}

		function right_combo(ix,iy,cur_board,moves_hist,boards_array) {

			var new_x=ix+2;
			var new_y=iy;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[iy][ix+1]===0) return;

			if (cur_board[new_y][new_x]===0)
			{

				if (check_in_hist(new_x,new_y,moves_hist)===true) return;

				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;

				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;

				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);

				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			}
		}

		function up_combo(ix,iy,cur_board,moves_hist,boards_array) {

			var new_x=ix;
			var new_y=iy-2;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[iy-1][ix]===0) return;

			if (cur_board[new_y][new_x]===0)
			{

				if (check_in_hist(new_x,new_y,moves_hist)===true) return;

				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;

				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;

				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);

				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			}
		}

		function down_combo(ix,iy,cur_board,moves_hist,boards_array) {

			var new_x=ix;
			var new_y=iy+2;

			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			if (cur_board[iy+1][ix]===0) return;

			if (cur_board[new_y][new_x]===0)
			{
				if (check_in_hist(new_x,new_y,moves_hist)===true) return;

				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;

				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;

				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);

				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			}
		}

		var boards_array=[];

		if (forward===1) {

			if (checkers===1) {
				for (let y=0;y<8;y++) {
					for (let x=0;x<8;x++) {
						if (board_data[y][x]===checkers) {
							var moves_hist=[[x,y]];
							left	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							up		(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						}
					}
				}
			}

			if (checkers===2) {

				for (let y=0;y<8;y++) {
					for (let x=0;x<8;x++) {
						if (board_data[y][x]===checkers) {
							var moves_hist=[[x,y]];
							right	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							down	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						}
					}
				}
			}
		} else {

			for (let y=0;y<8;y++) {
				for (let x=0;x<8;x++) {
					if (board_data[y][x]===checkers) {
						var moves_hist=[[x,y]];
						right	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						down	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						left	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						up		(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
					}
				}
			}
		}


		return boards_array;

	},

	make_weights_board: function(made_moves) {

		let p=made_moves/60+0.5;
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_1[y][x]=Math.pow(x*x+y*y,p)+Math.pow((1-x)*(1-x)+y*y,p);
			}
		}
	},

	make_weights_board2: function(made_moves) {
		
		let r_num = Math.random()*0.8 + 0.2;
		let p=made_moves/60+0.5;
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_1[y][x]=r_num * Math.pow(x*x+y*y,p)+ (1 - r_num ) * Math.pow((1-x)*(1-x)+y*y,p);
			}
		}

		if (made_moves>37) {

			for (let y=5;y<8;y++) {
				for (let x=4;x<8;x++) {
					this.bad_1[y][x]=9999;
				}
			}

		}

	},

	board_val: function(board, made_moves) {

		var val_1=0;
		var val_2=0;


		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {

				if (board[y][x]===1)
					val_1-=this.bad_1[y][x];

				if (board[y][x]===2)
					val_2-=this.bad_1[7-y][7-x];
			}
		}

		//вычисляем блокированных 2 и добавляем как бонус к 1 dxdy положительный
		for (let y=0;y<3;y++) {
			for (let x=0;x<4;x++) {
				if (board[y][x]===2) {
					for (let p=0;p<this.patterns.length;p++) {

						let pattern_ok=1;
						for (let r=0;r<this.patterns[p].length;r++) {
							let dy=this.patterns[p][r][0];
							let dx=this.patterns[p][r][1];
							let ch=this.patterns[p][r][2];

							if (board[y+dy][x+dx]!==ch) {
								pattern_ok=0;
								break;
							}

						}
						val_1+=pattern_ok*1000;
					}
				}
			}
		}

		//вычисляем блокированных 1 и добавляем как бонус к 2 dxdy отрицательный
		for (let y=5;y<8;y++) {
			for (let x=4;x<8;x++) {
				if (board[y][x]===1) {
					for (let p=0;p<this.patterns.length;p++) {

						let pattern_ok=1;
						for (let r=0;r<this.patterns[p].length;r++) {
							let dy=-this.patterns[p][r][0];
							let dx=-this.patterns[p][r][1];
							let ch=3-this.patterns[p][r][2];

							if (board[y+dy][x+dx]!==ch) {
								pattern_ok=0;
								break;
							}

						}
						val_2+=pattern_ok*1000;
					}
				}
			}
		}

		//проверяем не закончилась ли игра
		if (made_moves>=30) {

			if (board_func.any1home(board)===1)
				val_2=999999;

			if (board_func.any2home(board)===1)
				val_1=999999;
		}

		return val_1-val_2;
	},

	invert_board: function(board) {

		inv_brd=minimax_solver.clone_board(board);
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				inv_brd[y][x] = board[7-y][7-x];
				if (inv_brd[y][x] !== 0)
					inv_brd[y][x] = 3 - inv_brd[y][x];
			}
		}

		return inv_brd;

	},

	check_fin_moves: function(board) {

		for (let i=0;i<this.fin_moves.length;i++) {

			let found=1;
			for (let c=0;c<12;c++) {

				let y=this.fin_moves[i][c*2];
				let x=this.fin_moves[i][c*2+1];
				if (board[y][x]!=2) {
					found=0;
					break;
				}
			}

			if (found===1)
				return 1;
		}
		return 0;
	},

	how_bad_board_2: function(board) {

		var bad_val_1=[0,999];

		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				if (board[y][x]===2) {

					let cy=7-y;
					let cx=7-x;
					let v=this.bad_1[cy][cx];
					bad_val_1[0]+=v;
				}

			}
		}


		if (board_func.finished2(board))
			return [-999999,0];

		if (this.check_fin_moves(board)===1)
			return [-999999,2];

		return bad_val_1;
	},

	minimax_3: function(board,made_moves) {

		this.make_weights_board(made_moves);
		let inv_brd=this.invert_board(board);

		var m_data2={};
		var m_data={};

		var max_ind=0;
		var max_ind2=0;
		var max_val2=0;
		var max_0=-9999999;
		var childs0=this.get_childs(inv_brd,1,1);
		for (let c0=0;c0<childs0.length;c0++) {

			var min_1=9999999;
			var childs1=this.get_childs(childs0[c0][0],2,1);
			for (let c1=0;c1<childs1.length;c1++) {


				var max_2=-9999999;
				var childs2=this.get_childs(childs1[c1][0],1,1);
				for (let c2=0;c2<childs2.length;c2++) {


				max_2=Math.max(this.board_val(childs2[c2][0],made_moves+3),max_2);
				if (max_2>min_1)
					break;
				}

			min_1=Math.min(min_1,max_2);
			if (min_1<max_0)
				break;
			}

		if (max_0<min_1) {

			max_val2=max_0;
			max_0=min_1;

			max_ind2=max_ind;
			max_ind=c0;
		}
		}

		m_data={x1:childs0[max_ind][1],y1:childs0[max_ind][2],x2:childs0[max_ind][3], y2:childs0[max_ind][4]};


		//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2
		m_data.x1=7-m_data.x1;
		m_data.y1=7-m_data.y1;
		m_data.x2=7-m_data.x2;
		m_data.y2=7-m_data.y2;
		return m_data;

	},

	download : function(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	},

	generate_fin_moves: function() {

		let tb=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];

		let bcnt=0;
		arr2=[]
		var childs0=this.get_childs(tb,1,0);
		for (let c0=0;c0<childs0.length;c0++) {

			var childs1=this.get_childs(childs0[c0][0],1,0);
			for (let c1=0;c1<childs1.length;c1++) {

				arr = childs1[c1][0];

				arr1=[];
				for (let y = 0; y < 8; y++) {
					for (let x = 0; x < 8; x++) {

						if (arr[y][x] === 1)
							arr1.push(y,x);
					}
				}

				arr2.push(arr1);

				bcnt++;

			}

		}

		this.download(JSON.stringify(arr2),"comb","text/plain");

	},

	minimax_3_single: function(board, made_moves) {

		this.make_weights_board2(made_moves);
		min_move_amount=-3;

		//this.update_weights_board();
		var m_data={};
		var min_bad=999999;
		var min_moves_to_win=9999;


		var childs0=this.get_childs(board,2,0);
		for (let c0=0;c0<childs0.length;c0++) {
			let ret=this.how_bad_board_2(childs0[c0][0]);
			let moves_to_win=ret[1]+1;
			let val=ret[0];

			if (val===-999999 && min_moves_to_win>moves_to_win) {
				min_moves_to_win=moves_to_win;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}

			var childs1=this.get_childs(childs0[c0][0],2,0);
			for (let c1=0;c1<childs1.length;c1++) {
				let ret=this.how_bad_board_2(childs1[c1][0]);
				let moves_to_win=ret[1]+2;
				let val=ret[0];

				if (val===-999999 && min_moves_to_win>moves_to_win) {
					min_moves_to_win=moves_to_win;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}

				var childs2=this.get_childs(childs1[c1][0],2,0);
				for (let c2=0;c2<childs2.length;c2++) {
					let ret=this.how_bad_board_2(childs2[c2][0]);
					let moves_to_win=ret[1]+3;
					let val=ret[0];

					if (val===-999999 && min_moves_to_win>moves_to_win) {
						min_depth=3;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}

					if (val<min_bad && min_moves_to_win>moves_to_win) {
						min_bad=val;
						min_depth=3;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}

				}

			}

		}

		return m_data;
	},

	minimax_4_single: function(board) {

		//this.update_weights_board(15);
		min_move_amount=-3;

		//this.update_weights_board();
		var m_data={};
		var min_bad=999999;
		var min_depth=999;

		var childs0=this.get_childs(board,2,0);
		for (let c0=0;c0<childs0.length;c0++) {
			let val=this.how_bad_board_2(childs0[c0][0]);
			if (val===-999999 && min_depth>1) {
				min_depth=1;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}
			if (val<min_bad) {
				min_bad=val;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}


			var childs1=this.get_childs(childs0[c0][0],2,0);
			for (let c1=0;c1<childs1.length;c1++) {
				let val=this.how_bad_board_2(childs1[c1][0]);
				if (val===-999999 && min_depth>2) {
					min_depth=2;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}
				if (val<min_bad) {
					min_bad=val;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}


				var childs2=this.get_childs(childs1[c1][0],2,0);
				for (let c2=0;c2<childs2.length;c2++) {
					let val=this.how_bad_board_2(childs2[c2][0]);

					if (val===-999999 && min_depth>3) {
						min_depth=3;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}
					if (val<min_bad) {
						min_bad=val;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}


					var childs3=this.get_childs(childs2[c2][0],2,1);
					for (let c3=0;c3<childs3.length;c3++) {
						let val=this.how_bad_board_2(childs3[c3][0]);
						if (val<min_bad) {
							min_bad=val;
							min_depth=4;
							m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
						}

					}

				}

			}

		}

		return m_data;
	}


}

var kill_game = function() {
	
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.sender;
		game_id=msg.game_id;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player === msg.sender) {
		cards_menu.rejected_invite();
	}

	//айди клиента для удаления дубликатов
	if (msg.message==="CLIEND_ID") 
		if (msg.client_id !== client_id)
			kill_game();


	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==="END" )
				game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}

}

var req_dialog = {

	_opp_data : {} ,
	
	show(uid) {

		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{

				//так как успешно получили данные о сопернике то показываем окно
				any_dialog_active=1;
				sound.play('receive_sticker');
			
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');


				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;
		
		sound.play('close');

		any_dialog_active=0;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (anim2.any_on()===true || objects.req_cont.visible===false || objects.big_message_cont.visible === true || game.state === 'pending') {
			sound.play('locked');
			return;			
		}


		any_dialog_active=0;
		
		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');


		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate(online_game, "slave");

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;
	
		any_dialog_active=0;
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

var main_menu = {

	activate: function() {

		//просто добавляем контейнер с кнопками
		objects.main_buttons_cont.visible=true;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.desktop.texture;

	},

	close : function() {

		objects.main_buttons_cont.visible=false;
		objects.desktop.visible=false;

	},

	play_button_down: function () {

		if (any_dialog_active===1 || activity_on===1) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};
		any_dialog_active=1;

		sound.play('click');
	
		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]}, true, 0.5,'easeOutBack');


	},

	rules_ok_down: function () {
		any_dialog_active=0;
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	pref_button_down: function () {

		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};
		any_dialog_active=1;

		sound.play('click');
	
		anim2.add(objects.pref_cont,{y:[-200, objects.pref_cont.sy]}, true, 0.5,'easeOutBack');


	},

	pref_ok_down: function() {

		any_dialog_active=0;
		sound.play('close');
		anim2.add(objects.pref_cont,{y:[objects.pref_cont.sy, -200]}, false, 0.5,'easeInBack');


	},

	chk_type_sel: function (i) {

		if (i===0)
		{
			objects.chk_opt_frame.x=60;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'quad';

		}

		if (i===1)
		{
			objects.chk_opt_frame.x=160;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'star';

		}

		if (i===2)
		{
			objects.chk_opt_frame.x=260;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'round';
		}
	},

	pref_sound_switched : function() {
		
		if (objects.pref_sound_switch.ready === false) {
			sound.play('locked');
			return;
		}
		
		if (sound.on === 1) {
			anim2.add(objects.pref_sound_switch,{x:[238, 202]}, true, 0.25,'linear');		
			sound.on = 0;
			return;
		}

		if (sound.on === 0){
			
			anim2.add(objects.pref_sound_switch,{x:[202, 238]}, true, 0.25,'linear');		
			sound.on = 1;	
			sound.play('close');			
			return;			
		}
		
	}

}

var lb = {

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
		

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;

	},

	back_button_down: function() {

		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='')
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					make_text(objects['lb_'+(i+1)+'_name'],players_array[i][0],180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

var cards_menu = {
	
	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {

		objects.cards_cont.visible=true;
		objects.back_button.visible=true;

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.cards_bcg.texture;

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}


		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		//включаем сколько игроков онлайн
		anim2.add(objects.players_online,{y:[500,objects.players_online.sy]}, true, 0.6,'linear');		
		anim2.add(objects.cards_menu_title,{y:[-50,objects.cards_menu_title.sy]}, true, 0.6,'linear');	
				
		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игроков
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
			
		objects.players_online.text=['Игроков онлайн: ' + num + '   ( комната: ' +room_name +' )','Players online: ' + num + '   ( room: ' +room_name +' )'][LANG];
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_tint: function(s) {

		switch(s) {

			case "o":
				return 0x559955;
			break;

			case "b":
				return 0x376f37;
			break;

			case "p":
				return 0x344472;
			break;

			case "w":
				return 0x990000;
			break;
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint('p');
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref("players/" + uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.tint=0x777777;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="BOT";
		objects.mini_cards[0].name="Бот";
		objects.mini_cards[0].name_text.text="Бот";
		objects.mini_cards[0].rating_text.text="1400";
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (any_dialog_active>0) {
			sound.play('locked');
			return
		};


		sound.play('click');
		
		any_dialog_active=1;		
		
		anim2.add(objects.td_cont,{y:[-150, objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
	
	close_table_dialog : function () {
		
		any_dialog_active=0;	
		
		sound.play('close');
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy, 400]}, false, 0.5,'easeInBack');

		
		
	},

	show_invite_dialog: function(cart_id) {

		if (any_dialog_active>0) {
			sound.play('locked');
			return
		};


		any_dialog_active=3;

		pending_player="";

		sound.play('click');
		
		objects.invite_feedback.text = '';
	
		anim2.add(objects.invite_cont,{y:[-150, objects.invite_cont.sy]}, true, 0.5,'easeOutBack');


		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		
		this.show_feedbacks(cards_menu._opp_data.uid);


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="BOT";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible = invite_available;
		objects.invite_button_title.text = ['Пригласить','Invite'][LANG];

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},
	
	show_feedbacks: async function(uid) {
		
		//получаем фидбэки
		let _fb = await firebase.database().ref("fb/" + uid).once('value');
		let fb_obj =_fb.val();
		if (fb_obj === null) {
			objects.invite_feedback.text = '***нет отзывов***'
			return;
		}
		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);
		
		//выбираем последние отзывы
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});
		
		let fb_cnt = fb.length;
		
		fb_cnt = Math.min(fb_cnt, 6);
				
		for (let i = 0 ; i < fb_cnt;i++) {
			let sender_name =  fb[i][2].toString();
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);			
			objects.invite_feedback.text +=(sender_name + ': ');
			objects.invite_feedback.text +=fb[i][0];
			objects.invite_feedback.text +='\n';	
		}
				
	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button.visible=false;
		objects.desktop.visible=false;

		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//больше ни ждем ответ ни от кого
		pending_player="";

		//убираем сколько игроков онлайн
		anim2.add(objects.players_online,{y:[objects.players_online.y,500]}, false, 0.6,'linear');		
		anim2.add(objects.cards_menu_title,{y:[objects.cards_menu_title.y,-50]}, false, 0.6,'linear');	

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		any_dialog_active=0;

		sound.play('close');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}


		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy, 400]}, false, 0.5,'easeInBack');


	},

	send_invite: function() {


		if (objects.invite_cont.ready===false || objects.invite_cont.visible===false)
			return;

		if (any_dialog_active===1 && any_dialog_active!==3) {
			sound.play('locked');
			return
		};

		if (cards_menu._opp_data.uid==="BOT")
		{
			this.close();
			
			//заполняем данные бот-оппонента
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;	
			
			game.activate(bot_game, 'master');
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text = ['Ждите ответ...','Waiting...'][LANG];
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
			any_dialog_active=1

		}

	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((',0);

	},

	accepted_invite: function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		//закрываем меню и начинаем игру
		cards_menu.close();
		game.activate(online_game, "master");
	},

	back_button_down: function() {

		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		main_menu.activate();

	}

}

var stickers = {
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel: function() {


		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};
		any_dialog_active=1;

		if (objects.stickers_cont.ready===false)
			return;
		sound.play('click');


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel: function() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		any_dialog_active=0;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	send : async function(id) {

		if (objects.stickers_cont.ready===false)
			return;
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add("Стикер отправлен сопернику");

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		
		await anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');
		
		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		await anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	receive: async function(id) {

		
		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
	
		await anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150]}, false, 0.5,'easeInBack');

	}

}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			init: function() {

				g_process=function() { help_obj.process()};

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					game_platform="YANDEX";
					Promise.all([
						this.loadScript('https://yandex.ru/games/sdk/v2')
					]).then(function(){
						help_obj.yandex();
					});
					return;
				}


				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					game_platform="VK";
					Promise.all([
						this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')

					]).then(function(){
						help_obj.vk()
					});
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					game_platform="debug";
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				game_platform="unknown";
				help_obj.unknown();

			},

			get_random_name : function(e_str) {
				
				let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}							

			},	

			yandex: function() {

				
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{


						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: function() {

				vkBridge.send('VKWebAppInit').then(()=>{
					
					return vkBridge.send('VKWebAppGetUserInfo');
					
				}).then((e)=>{
					
					my_data.name 	= e.first_name + ' ' + e.last_name;
					my_data.uid 	= "vk"+e.id;
					my_data.pic_url = e.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();		
					
				}).catch(function(e){
					
					alert(e);
					
				});

			},

			debug: function() {

				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}

			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				//вызываем коллбэк
				resolve("ok");
			},

			process : function () {

				objects.id_loup.x=20*Math.sin(game_tick*8)+90;
				objects.id_loup.y=20*Math.cos(game_tick*8)+110;
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref(room_name+"/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

		if (document.hidden === true)
			hidden_state_start = Date.now();
		
		set_state({hidden : document.hidden});
		
		
}

function init_game_env() {


	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			
		/*		
			apiKey: "AIzaSyDwyhzpCq06nXWtzTfPZ86I0jI_iUedJDg",
			authDomain: "quoridor-e5c40.firebaseapp.com",
			databaseURL: "https://quoridor-e5c40-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "quoridor-e5c40",
			storageBucket: "quoridor-e5c40.appspot.com",
			messagingSenderId: "114845860106",
			appId: "1:114845860106:web:fa020d476b1f1c28853af3"*/	
			

			apiKey: "AIzaSyBZnSsCdbCve-tYjiH9f5JbGUDaGKWy074",
			authDomain: "m-game-27669.firebaseapp.com",
			databaseURL: "https://m-game-27669-default-rtdb.firebaseio.com",
			projectId: "m-game-27669",
			storageBucket: "m-game-27669.appspot.com",
			messagingSenderId: "571786945826",
			appId: "1:571786945826:web:7e8bd49c963bbea117317b",
			measurementId: "G-XFJD615P3L"		
			
		});
	}

	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x404040});
	document.body.appendChild(app.view);

	//события изменения окна
	resize();
	window.addEventListener("resize", resize);
	
	//идентификатор клиента
	client_id = irnd(10,999999);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }


	//загружаем данные об игроке
    auth().then((val)=> {

		//загружаем аватарку игрока
		return new Promise(function(resolve, reject) {
			let loader=new PIXI.Loader();
			loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
			loader.load(function(l,r) {	resolve(l)});
		});

	}).then((l)=> {

		//устанавливаем фотки в попап и другие карточки
		objects.id_avatar.texture=objects.my_avatar.texture=l.resources.my_avatar.texture;

		//устанавлием аватарки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);

		//загружаем остальные данные данные игрока (в данном случае - рейтинг)
		return firebase.database().ref("players/"+my_data.uid).once('value');

	}).then((snapshot)=>{

		let data=snapshot.val();
		data===null ?
			my_data.rating=1400 :
			my_data.rating = data.rating || 1400;

		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;
			
		
		//my_data.rating = 1355;
			
		//номер комнаты
		if (my_data.rating >= 1500)
			room_name= 'states2';			
		else
			room_name= 'states';			
		
		
		//room_name= 'states3';	


		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//убираем лупу
		objects.id_loup.visible=false;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid+"name").set(my_data.name);
		firebase.database().ref("players/"+my_data.uid+"pic_url").set( my_data.pic_url);
		firebase.database().ref("players/"+my_data.uid+"rating").set(my_data.rating);
		firebase.database().ref("players/"+my_data.uid+"games").set(my_data.games);
		firebase.database().ref("players/"+my_data.uid+"tm").set(firebase.database.ServerValue.TIMESTAMP);
		
		
		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});
		
		//сообщение для дубикатов
		firebase.database().ref("inbox/"+my_data.uid).set({message:"CLIEND_ID",tm:Date.now(),client_id:client_id});

		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

		activity_on=0;

		return new Promise((resolve, reject) => {setTimeout(resolve, 1000);});

	}).then(()=>{

		anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack');
	
	}).catch((err)=>{
		alert(err.stack + " " + err);
	});


	//контроль за присутсвием
	var connected_control = firebase.database().ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});

	//устанавливаем начальный вид шашек
	board_func.chk_type='quad';

	//показыаем основное меню
	main_menu.activate();
	
	//запускаем главный цикл
	main_loop();

}

function load_resources() {


	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/corners/"
	//let git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/MS_Comic_Sans/font.fnt");

	game_res.add('receive_move',git_src+'sounds/receive_move.mp3');
	game_res.add('note',git_src+'sounds/note.mp3');
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('message',git_src+'sounds/message.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('win',git_src+'sounds/win.mp3');
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('close',git_src+'sounds/close.mp3');
	game_res.add('move',git_src+'sounds/move.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('clock',git_src+'sounds/clock.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	

    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	game_res.load(init_game_env);
	game_res.onProgress.add(progress);

	function progress(loader, resource) {

		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}

}

function main_loop() {


	//глобальная функция
	g_process();

	game_tick+=0.016666666;
	anim2.process();
	requestAnimationFrame(main_loop);
}

