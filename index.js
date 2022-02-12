var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", game_tick=0, my_checkers=1, selected_checker=0, move=0, game_id=0, my_turn=0;
var me_conf_play=0,opp_conf_play=0, any_dialog_active=0, min_move_amount=0, h_state=0, game_platform="",activity_on=1, hidden_state_start = 0, room_name = 'states2';
g_board=[];
var players="", pending_player="",tm={};
var my_data={opp_id : ''},opp_data={};
var g_process=function(){};

var load_list=[{class:"block",name:"rec_sticker_area",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=22;objects[obj_name].sy=objects[obj_name].y=260;objects[obj_name].width=148.235286458333;objects[obj_name].height=148.235384114583;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"board",code0:"objects[obj_name].x=190;objects[obj_name].y=10;objects[obj_name].visible=false;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){game.mouse_down_on_board()};",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"sprite",name:"desktop",code0:"objects[obj_name].x=-10;objects[obj_name].y=-10;",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"sprite",name:"play_button",code0:"objects[obj_name].x=15;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.play_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"sprite",name:"lb_button",code0:"objects[obj_name].x=175;objects[obj_name].y=10;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.lb_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"sprite",name:"preferences_button",code0:"objects[obj_name].x=495;objects[obj_name].y=10;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.pref_button_down()};objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"cont",name:"main_buttons_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=75;objects[obj_name].sy=objects[obj_name].y=240;",code1:"objects[obj_name].addChild(objects.play_button);objects[obj_name].addChild(objects.lb_button);objects[obj_name].addChild(objects.rules_button);objects[obj_name].addChild(objects.preferences_button);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"rules_button",code0:"objects[obj_name].x=330;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.rules_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"",image_format:"png"},{class:"image",name:"lb_bcg",image_format:"png"},{class:"sprite",name:"send_sticker_button",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);",code1:"objects[obj_name].pointerdown=function(){stickers.show_panel()};objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"sprite",name:"giveup_button",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.show()};objects[obj_name].x=10;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);",code1:"objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"cont",name:"game_buttons_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].ready=true;objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=610;objects[obj_name].sy=objects[obj_name].y=310;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.send_sticker_button);objects[obj_name].addChild(objects.giveup_button);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"message_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=20;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"message_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 20,align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=150;objects[obj_name].x=100;objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",code1:""},{class:"cont",name:"message_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=220;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.message_bcg);objects[obj_name].addChild(objects.message_text);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"timer_bcg",code0:"objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"timer_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].visible=true;objects[obj_name].sx=objects[obj_name].x=90;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:""},{class:"cont",name:"timer_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].show=function(){this.childs.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.timer_bcg);objects[obj_name].addChild(objects.timer_text);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"checkers",size:"24",code0:"var num=n;objects[obj_name][num]=new PIXI.Sprite();objects[obj_name][num].visible=false;",code1:"var num=n;objects[obj_name][num].texture=game_res.resources.chk_quad_1_tex.texture;app.stage.addChild(objects[obj_name][num]);"},{class:"sprite",name:"selected_frame",code0:"objects[obj_name].visible=false;",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"sprite",name:"giveup_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"giveup_no",code0:"objects[obj_name].x=150;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.hide()};",code1:"objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"cont",name:"giveup_dialog",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=250;objects[obj_name].sy=objects[obj_name].y=270;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.giveup_bcg);objects[obj_name].addChild(objects.giveup_yes);objects[obj_name].addChild(objects.giveup_no);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"giveup_yes",code0:"objects[obj_name].x=30;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.give_up()};",code1:"objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"block",name:"cur_move_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0,0.5);objects[obj_name].x=32;objects[obj_name].y=430;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"stop_bot_button",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].visible=false;objects[obj_name].pointerdown=function(){bot_game.stop()};objects[obj_name].x=objects[obj_name].sx=620;objects[obj_name].y=objects[obj_name].sy=370;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);",code1:"objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",image_format:"png"},{class:"sprite",name:"stickers_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"sticker_0",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_0'].texture;",code1:""},{class:"block",name:"sticker_1",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_1'].texture;",code1:""},{class:"block",name:"sticker_2",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_2'].texture;",code1:""},{class:"block",name:"sticker_3",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_3'].texture;",code1:""},{class:"block",name:"sticker_4",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_4'].texture;",code1:""},{class:"block",name:"sticker_5",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_5'].texture;",code1:""},{class:"block",name:"sticker_6",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_6'].texture;",code1:""},{class:"block",name:"sticker_7",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_7'].texture;",code1:""},{class:"block",name:"sticker_8",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_8'].texture;",code1:""},{class:"block",name:"sticker_9",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_9'].texture;",code1:""},{class:"block",name:"sticker_10",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_10'].texture;",code1:""},{class:"block",name:"sticker_11",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_11'].texture;",code1:""},{class:"block",name:"sticker_12",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_12'].texture;",code1:""},{class:"block",name:"sticker_13",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_13'].texture;",code1:""},{class:"block",name:"sticker_14",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_14'].texture;",code1:""},{class:"block",name:"sticker_15",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_15'].texture;",code1:""},{class:"cont",name:"stickers_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=230;objects[obj_name].sy=objects[obj_name].y=60;",code1:"app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.stickers_bcg);objects[obj_name].addChild(objects.close_stickers);for (var z=0;z<16;z++) {objects[obj_name].addChild(objects['sticker_'+z]);objects['sticker_'+z].width=70;objects['sticker_'+z].height=70;objects['sticker_'+z].interactive=true;objects['sticker_'+z].buttonMode=true;const id=z;objects['sticker_'+id].pointerover=function(){this.tint=0xFF6666};objects['sticker_'+id].pointerout=function(){this.tint=this.base_tint};objects['sticker_'+id].pointerdown=function(){stickers.send(id)};}objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};"},{class:"sprite",name:"close_stickers",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=()=>{stickers.hide_panel()};objects[obj_name].x=270;objects[obj_name].y=21;",code1:"objects[obj_name].pointerover=function(){this.tint=0xff0000};objects[obj_name].pointerout=function(){this.tint=0xffffff};",image_format:"png"},{class:"block",name:"cards_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=10;objects[obj_name].y=40;",code1:"for (let i=0;i<objects.mini_cards.length;i++)objects[obj_name].addChild(objects.mini_cards[i]);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"mini_cards",size:"15",code0:"var num=n;objects[obj_name][num]=new player_mini_card_class(0,0,num);",code1:""},{class:"sprite",name:"back_button",code0:"objects[obj_name].x=699;objects[obj_name].y=322;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){cards_menu.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"app.stage.addChild(objects[obj_name]);",image_format:"png"},{class:"image",name:"cards_bcg",image_format:"png"},{class:"image",name:"chk_round_1_tex",image_format:"png"},{class:"image",name:"chk_7_1_tex",image_format:"png"},{class:"image",name:"chk_7_2_tex",image_format:"png"},{class:"image",name:"chk_round_2_tex",image_format:"png"},{class:"sprite",name:"pref_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"pref_ok",code0:"objects[obj_name].x=130;objects[obj_name].y=195;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.pref_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",code1:"",image_format:"png"},{class:"cont",name:"pref_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=50;",code1:"objects[obj_name].addChild(objects.pref_bcg);objects[obj_name].addChild(objects.pref_ok);objects[obj_name].addChild(objects.chk_quad_block);objects[obj_name].addChild(objects.chk_7_block);objects[obj_name].addChild(objects.chk_round_block);objects[obj_name].addChild(objects.chk_opt_frame);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"chk_7_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(1)};",code1:"objects[obj_name].texture=game_res.resources.chk_7_1_tex.texture;"},{class:"block",name:"chk_round_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=280;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(2)};",code1:"objects[obj_name].texture=game_res.resources.chk_round_1_tex.texture;"},{class:"block",name:"chk_quad_block",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=80;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(0)};",code1:"objects[obj_name].texture=game_res.resources.chk_quad_1_tex.texture;"},{class:"sprite",name:"chk_opt_frame",code0:"objects[obj_name].x=60;objects[obj_name].y=70;",code1:"",image_format:"png"},{class:"image",name:"lb_player_card_bcg",image_format:"png"},{class:"block",name:"lb_cards_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=0;",code1:"for (let i=0;i<7;i++)objects[obj_name].addChild(objects.lb_cards[i]);app.stage.addChild(objects[obj_name]);"},{class:"array",name:"lb_cards",size:"7",code0:"var num=n;objects[obj_name][num]=new lb_player_card_class(0,0,num+4);",code1:""},{class:"block",name:"lb_back_button",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=700;objects[obj_name].y=320;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){lb.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};",code1:"objects[obj_name].texture=objects.back_button.texture;app.stage.addChild(objects[obj_name]);"},{class:"block",name:"sent_sticker_area",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=346;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].width=105;objects[obj_name].height=100;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"block",name:"lb_3_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=40;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;",code1:"objects[obj_name].mask=objects.lb_3_mask;"},{class:"sprite",name:"lb_3_mask",code0:"objects[obj_name].x=40;objects[obj_name].y=50;",code1:"",image_format:"png"},{class:"block",name:"lb_3_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_3_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=156;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"cont",name:"lb_3_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=240;",code1:"objects[obj_name].addChild(objects.lb_3_avatar);objects[obj_name].addChild(objects.lb_3_mask);objects[obj_name].addChild(objects.lb_3_frame);objects[obj_name].addChild(objects.lb_3_crown);objects[obj_name].addChild(objects.lb_3_name);objects[obj_name].addChild(objects.lb_3_rating);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"lb_3_frame",code0:"objects[obj_name].x=40;objects[obj_name].y=50;",code1:"",image_format:"png"},{class:"sprite",name:"lb_3_crown",code0:"objects[obj_name].x=11;objects[obj_name].y=22;",code1:"",image_format:"png"},{class:"block",name:"lb_1_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;",code1:"objects[obj_name].mask=objects.lb_1_mask;"},{class:"sprite",name:"lb_1_mask",code0:"objects[obj_name].x=10;objects[obj_name].y=50;",code1:"",image_format:"png"},{class:"cont",name:"lb_1_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.lb_1_mask);objects[obj_name].addChild(objects.lb_1_avatar);objects[obj_name].addChild(objects.lb_1_frame);objects[obj_name].addChild(objects.lb_1_crown);objects[obj_name].addChild(objects.lb_1_name);objects[obj_name].addChild(objects.lb_1_rating);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"lb_1_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_1_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=193;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"sprite",name:"lb_1_frame",code0:"objects[obj_name].x=10;objects[obj_name].y=50;",code1:"",image_format:"png"},{class:"sprite",name:"lb_1_crown",code0:"objects[obj_name].x=98;objects[obj_name].y=24;",code1:"",image_format:"png"},{class:"block",name:"lb_2_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=130;objects[obj_name].height=130;",code1:"objects[obj_name].mask=objects.lb_2_mask;"},{class:"sprite",name:"lb_2_mask",code0:"objects[obj_name].x=10;objects[obj_name].y=40;",code1:"",image_format:"png"},{class:"block",name:"lb_2_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=85;objects[obj_name].y=140;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"lb_2_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=88;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"cont",name:"lb_2_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=140;objects[obj_name].sy=objects[obj_name].y=145;",code1:"objects[obj_name].addChild(objects.lb_2_avatar);objects[obj_name].addChild(objects.lb_2_mask);objects[obj_name].addChild(objects.lb_2_frame);objects[obj_name].addChild(objects.lb_2_crown);objects[obj_name].addChild(objects.lb_2_name);objects[obj_name].addChild(objects.lb_2_rating);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"lb_2_frame",code0:"objects[obj_name].x=10;objects[obj_name].y=40;",code1:"",image_format:"png"},{class:"sprite",name:"lb_2_crown",code0:"objects[obj_name].x=87;objects[obj_name].y=17;",code1:"",image_format:"png"},{class:"image",name:"wait_response",image_format:"png"},{class:"sprite",name:"big_message_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"big_message_text",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=160;objects[obj_name].y=30;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",code1:""},{class:"cont",name:"big_message_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=240;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};",code1:"objects[obj_name].addChild(objects.big_message_bcg);objects[obj_name].addChild(objects.big_message_text);objects[obj_name].addChild(objects.close_big_message);objects[obj_name].addChild(objects.big_message_text2);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"close_big_message",code0:"objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=99;objects[obj_name].y=147;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){big_message.close()};    ",code1:"",image_format:"png"},{class:"block",name:"big_message_text2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=159;objects[obj_name].y=123;objects[obj_name].base_tint=objects[obj_name].tint=0XFFC000;",code1:""},{class:"sprite",name:"rules_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"rules_ok_button",code0:"objects[obj_name].x=290;objects[obj_name].y=352;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.rules_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",code1:"",image_format:"png"},{class:"cont",name:"rules_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=0;",code1:"objects[obj_name].addChild(objects.rules_bcg);objects[obj_name].addChild(objects.rules_ok_button);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"players_online",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=385;objects[obj_name].y=420;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:"app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"id_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"id_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=220;objects[obj_name].y=80;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"id_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=220;objects[obj_name].y=115;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"id_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=60;objects[obj_name].width=99.99990234375;objects[obj_name].height=100;",code1:""},{class:"cont",name:"id_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=true;objects[obj_name].sx=objects[obj_name].x=230;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.id_bcg);objects[obj_name].addChild(objects.id_avatar);objects[obj_name].addChild(objects.id_name);objects[obj_name].addChild(objects.id_rating);objects[obj_name].addChild(objects.id_loup);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"id_loup",code0:"objects[obj_name].sx=objects[obj_name].x=90;objects[obj_name].sy=objects[obj_name].y=123;objects[obj_name].anchor.set(0.5,0.5);",code1:"",image_format:"png"},{class:"image",name:"mini_player_card_table",image_format:"png"},{class:"sprite",name:"td_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].interactive=true;",code1:"",image_format:"png"},{class:"block",name:"td_name1",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=210;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"td_rating1",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=239;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"td_avatar1",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=70;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=130;objects[obj_name].height=130;",code1:""},{class:"cont",name:"td_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=190;objects[obj_name].sy=objects[obj_name].y=50;",code1:"objects[obj_name].addChild(objects.td_bcg);objects[obj_name].addChild(objects.td_avatar1);objects[obj_name].addChild(objects.td_avatar2);objects[obj_name].addChild(objects.td_name1);objects[obj_name].addChild(objects.td_name2);objects[obj_name].addChild(objects.td_rating1);objects[obj_name].addChild(objects.td_rating2);objects[obj_name].addChild(objects.td_close);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"td_close",code0:"objects[obj_name].x=370;objects[obj_name].y=20;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.close_table_dialog()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"td_name2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=305;objects[obj_name].y=211;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"td_rating2",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=305;objects[obj_name].y=240;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"td_avatar2",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=240;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=130;objects[obj_name].height=130;",code1:""},{class:"image",name:"rating_bcg",image_format:"png"},{class:"image",name:"pc_icon",image_format:"png"},{class:"image",name:"mini_player_card",image_format:"png"},{class:"image",name:"avatar_mask",image_format:"png"},{class:"image",name:"avatar_frame",image_format:"png"},{class:"block",name:"my_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].width=100.00009765625;objects[obj_name].height=100;",code1:"objects[obj_name].mask = objects.my_avatar_mask;"},{class:"block",name:"my_avatar_mask",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=20;",code1:"objects[obj_name].texture = gres.avatar_mask.texture;"},{class:"block",name:"my_card_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"my_card_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"block",name:"my_avatar_frame",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=20;objects[obj_name].y=10;",code1:"objects[obj_name].texture = gres.avatar_frame.texture;"},{class:"cont",name:"my_card_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=objects[obj_name].sx=20;objects[obj_name].y=objects[obj_name].sy=10;",code1:"objects[obj_name].addChild(objects.my_avatar);objects[obj_name].addChild(objects.my_avatar_mask);objects[obj_name].addChild(objects.my_avatar_frame);objects[obj_name].addChild(objects.my_card_name);objects[obj_name].addChild(objects.my_card_rating);app.stage.addChild(objects[obj_name]);"},{class:"block",name:"opp_card_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"opp_card_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=80;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",code1:""},{class:"block",name:"opp_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=20;objects[obj_name].width=100.00009765625;objects[obj_name].height=100;",code1:"objects[obj_name].mask = objects.opp_avatar_mask;"},{class:"block",name:"opp_avatar_mask",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=20;",code1:"objects[obj_name].texture = gres.avatar_mask.texture;"},{class:"block",name:"opp_avatar_frame",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=20;objects[obj_name].y=10;",code1:"objects[obj_name].texture = gres.avatar_frame.texture;"},{class:"cont",name:"opp_card_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].x=objects[obj_name].sx=625;objects[obj_name].y=objects[obj_name].sy=5;",code1:"objects[obj_name].addChild(objects.opp_avatar);objects[obj_name].addChild(objects.opp_avatar_mask);objects[obj_name].addChild(objects.opp_avatar_frame);objects[obj_name].addChild(objects.opp_card_name);objects[obj_name].addChild(objects.opp_card_rating);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"req_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"req_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=251;objects[obj_name].y=73;objects[obj_name].base_tint=objects[obj_name].tint=0X2F5597;",code1:""},{class:"block",name:"req_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=251;objects[obj_name].y=117;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"req_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=50;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=90;objects[obj_name].height=80;",code1:""},{class:"cont",name:"req_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=210;objects[obj_name].sy=objects[obj_name].y=-10;",code1:"objects[obj_name].addChild(objects.req_bcg);objects[obj_name].addChild(objects.req_avatar);objects[obj_name].addChild(objects.req_name);objects[obj_name].addChild(objects.req_rating);objects[obj_name].addChild(objects.req_ok);objects[obj_name].addChild(objects.req_deny);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"req_ok",code0:"objects[obj_name].x=20;objects[obj_name].y=145;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.accept()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"req_deny",code0:"objects[obj_name].x=190;objects[obj_name].y=145;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.reject()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"invite_bcg",code0:"objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"block",name:"invite_name",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=184;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",code1:""},{class:"block",name:"invite_rating",code0:"objects[obj_name]=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=213;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",code1:""},{class:"block",name:"invite_avatar",code0:"objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=70;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].width=130;objects[obj_name].height=130;",code1:""},{class:"cont",name:"invite_cont",code0:"objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=260;objects[obj_name].sy=objects[obj_name].y=50;",code1:"objects[obj_name].addChild(objects.invite_bcg);objects[obj_name].addChild(objects.invite_avatar);objects[obj_name].addChild(objects.invite_name);objects[obj_name].addChild(objects.invite_rating);objects[obj_name].addChild(objects.invite_button);objects[obj_name].addChild(objects.invite_close);app.stage.addChild(objects[obj_name]);"},{class:"sprite",name:"invite_close",code0:"objects[obj_name].x=206;objects[obj_name].y=23;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.hide_invite_dialog()};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"sprite",name:"invite_button",code0:"objects[obj_name].x=20;objects[obj_name].y=240;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.send_invite()};objects[obj_name].pointerover=function(){this.tint=0x444444};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",code1:"",image_format:"png"},{class:"image",name:"chk_quad_2_tex",image_format:"png"},{class:"image",name:"chk_quad_1_tex",image_format:"png"}];


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

var anim={

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,

	anim_array: [null,null,null,null,null,null,null,null,null,null,null],
	linear: function(x) {

		return x
	},
	linear_and_back: function(x) {

		return x < 0.2 ? x*5 : 1.25 - x * 1.25

	},
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
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
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	easeOutQuart: function(x) {
		return 1 - Math.pow(1 - x, 4);
	},
	easeOutQuint: function(x) {
		return 1 - Math.pow(1 - x, 5);
	},
	easeInCubic: function(x) {
		return x * x * x;
	},
	easeInQuint: function(x) {
		return x * x * x * x * x;
	},
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	add_pos: function(params){

		if (params.callback===undefined)
			params.callback=()=>{};


		//если уже идет анимация данного спрайта то отменяем ее
		for (var i=0;i<this.anim_array.length;i++)
			if (this.anim_array[i]!==null)
				if (this.anim_array[i].obj===params.obj)
					this.anim_array[i]=null;

		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{

			if (this.anim_array[i]===null)	{

				params.obj.visible=true;
				params.obj.alpha=1;
				params.obj.ready=false;

				//если в параметрах обозначена строка  - предполагаем что это параметр объекта
				if (typeof(params.val[0])==='string') params.val[0]=params.obj[params.val[0]];
				if (typeof(params.val[1])==='string') params.val[1]=params.obj[params.val[1]];

				params.obj[params.param]=params.val[0];
				var delta=params.val[1]-params.val[0];
				this.anim_array[i]={
										obj:params.obj,
										process_func: this.process_pos.bind(this),
										param:params.param,
										vis_on_end:params.vis_on_end,
										delta,
										func:this[params.func].bind(anim),
										start_val:params.val[0],
										speed:params.speed ,
										progress:0,
										callback:params.callback
									};
				return;
			}

		}

		//console.log("Нет свободных слотов для анимации");

	},
	add_scl: function(params){

		if (params.callback===undefined)
			params.callback=()=>{};

		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{

			if (this.anim_array[i]===null)	{

				params.obj.visible=true;
				params.obj.alpha=1;
				params.obj.ready=false;

				var delta=params.val[1]-params.val[0];
				this.anim_array[i]={
									obj:			params.obj,
									process_func: 	this.process_scl.bind(this),
									param:			params.param,
									vis_on_end:		params.vis_on_end,
									delta,
									func:			this[params.func].bind(anim),
									start_val:		params.val[0],
									speed:			params.speed ,
									progress:		0,
									callback		:params.callback
								};
				return;
			}

		}

		//console.log("Нет свободных слотов для анимации");

	},
	process: function()	{
		for (var i=0;i<this.anim_array.length;i++)
			if (this.anim_array[i]!==null)
				this.anim_array[i].process_func(i);
	},
	process_pos: function(i) {

		this.anim_array[i].obj[this.anim_array[i].param]=this.anim_array[i].start_val+this.anim_array[i].delta*this.anim_array[i].func(this.anim_array[i].progress);

		if (this.anim_array[i].progress>=1)	{
			this.anim_array[i].callback();
			this.anim_array[i].obj.visible=this.anim_array[i].vis_on_end;
			this.anim_array[i].obj.ready=true;
			this.anim_array[i]=null;
			return;
		}

		this.anim_array[i].progress+=this.anim_array[i].speed;
	},
	process_scl: function(i) {

		this.anim_array[i].obj.scale[this.anim_array[i].param]=this.anim_array[i].start_val+this.anim_array[i].delta*this.anim_array[i].func(this.anim_array[i].progress);

		if (this.anim_array[i].progress>=1)	{
			this.anim_array[i].callback();
			this.anim_array[i].obj.visible=this.anim_array[i].vis_on_end;
			this.anim_array[i].obj.ready=true;
			this.anim_array[i]=null;
			return;
		}

		this.anim_array[i].progress+=this.anim_array[i].speed;
	}

}

function add_message(text) {

	//воспроизводим звук
	game_res.resources.message.sound.play();

	objects.message_text.text=text;

	anim.add_pos({obj:objects.message_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-200, 	'sx'],	speed:0.02});

	if (objects.message_cont.timer_id!==undefined)	clearTimeout(objects.message_cont.timer_id);


	//убираем сообщение через определенное время
	objects.message_cont.timer_id=setTimeout(()=>{
		anim.add_pos({obj:objects.message_cont,param:'x',vis_on_end:false,func:'easeInBack',val:['sx', 	-200],	speed:0.02});
	}, 6000);

}

var big_message={

	callback_func: function(){},

	show: function(text,text2,callback) {

		any_dialog_active=1;


		if (text2!==undefined || text2!=="")
			objects.big_message_text2.text=text2;
		else
			objects.big_message_text2.text='**********';

		if (callback===undefined)
			this.callback_func=()=>{};
		else
			this.callback_func=callback;

		objects.big_message_text.text=text;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-180, 	'sy'],	speed:0.02});

	},

	close : function() {

		any_dialog_active=1;

		//вызываем коллбэк

		this.callback_func();
		game_res.resources.close.sound.play();

		if (objects.big_message_cont.ready===false)
			return;

		any_dialog_active=0;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	450],	speed:0.05});

	}
}

var board_func={

	checker_to_move: "",
	target_point: 0,
	tex_2:0,
	tex_1:0,
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

					//проверка что шашка под угрозой
					if (x>3 && x<8 && y>4 && y<8 && move>24 && move<31 && objects.checkers[ind].m_id===1)
						objects.checkers[ind].danger=1;
					else
						objects.checkers[ind].danger=0;


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

	start_gentle_move: function(move_data,moves,callback) {

		//подготавливаем данные для перестановки
		this.move_end_callback=callback;
		this.checker_to_move=this.get_checker_by_pos(move_data.x1,move_data.y1);
		this.moves=moves;
		this.target_point=1;
		this.set_next_cell();

	},

	process_checker_move: function () {

		//двигаем шашки только если в игре
		if (state!=="p" && state!=="b")
			return;


		//двигаем шашку
		if (this.target_point!==0) {

			this.checker_to_move.x+=this.checker_to_move.dx;
			this.checker_to_move.y+=this.checker_to_move.dy;

			var dx=this.checker_to_move.x-this.checker_to_move.tx;
			var dy=this.checker_to_move.y-this.checker_to_move.ty;

			var d=Math.sqrt(dx*dx+dy*dy);
			if (d<1) {

				//воспроизводим соответствующий звук
				game_res.resources.move.sound.play();

				this.set_next_cell();
			}
		}

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

	process_home_danger: function() {

		if (state==="b")
			return;

		for (let c of objects.checkers) {
			if (c.danger===1)
				c.alpha=Math.sin(game_tick*5)*0.5+0.5;
		}

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

	get_board_state: function(board, cur_move) {

		let w1=this.finished1(board);
		let w2=this.finished2(board);
		let any1home=this.any1home(board)*(cur_move>=30);
		let any2home=this.any2home(board)*(cur_move>=30);

		//это случай если игра дошла до 80 хода
		if (cur_move>=80) {

			let fin1=this.count_finished1(board);
			let fin2=this.count_finished2(board);

			if (fin1	>	fin2)	return 88;
			if (fin1	<	fin2)	return 89;
			if (fin1	===	fin2)	return 90;
		}

		//кодируем сосотяние игры в одно значение
		return w1*1+w2*2+any1home*4+any2home*5;
	}
}

var bot_game={

	start: function() {


		//устанавливаем локальный и удаленный статус
		set_state ({state : 'b'});

		objects.desktop.visible=false;
		objects.main_buttons_cont.visible=false;
		objects.cards_cont.visible=false;

		objects.board.visible=true;

		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		objects.timer_cont.visible=true;
		objects.stop_bot_button.visible=true;
		objects.cur_move_text.visible=true;

		//очереди
		my_turn=1;

		//включаем взаимодейтсвие с доской
		objects.board.interactive=true;
		objects.board.pointerdown=game.mouse_down_on_board;

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


		//это надо удалить
		//g_board = [[0,0,0,0,0,0,0,0],[0,0,0,0,2,2,0,0],[0,0,2,2,2,2,0,0],[0,0,2,2,0,0,0,0],[0,2,2,0,0,0,0,0],[0,2,2,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		//move=35;

		board_func.update_board();


	},

	stop : function() {



		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.close.sound.play();

		finish_game.bot(10);


	},

	make_move: function() {


		let m_data={};
		if (move<30) {
			m_data=minimax_solver.minimax_3(g_board,move);
		} else {
			//let f2=board_func.count_finished2(g_board);
			//if (f2>8)
			//	m_data=minimax_solver.minimax_4_single(g_board,move);
			//else
			m_data=minimax_solver.minimax_3_single(g_board,move);
		}


		//получаем последовательность ходов
		let moves=board_func.get_moves_path(m_data);

		board_func.start_gentle_move(m_data,moves,function(){

			//перемещаем табло времени
			objects.timer_cont.x=620-objects.timer_cont.x;

			my_turn=1;
			let board_state=board_func.get_board_state(g_board, move);
			//проверяем не закончена ли игра
			if (board_state===1 || board_state===2 || board_state===3 || board_state===4 || board_state===9)  {

				//допускаем что 2 не могут быть зажаты
				if (board_state===9)
					board_state=4;

				finish_game.bot(board_state);
			}

		});


	}
}

var calc_my_new_rating=function(res)	{

	var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
	if (res===1)
		return Math.round(my_data.rating + 16 * (1 - Ea));
	if (res===0)
		return Math.round(my_data.rating + 16 * (0.5 - Ea));
	if (res===-1)
		return Math.round(my_data.rating + 16 * (0 - Ea));
};

var cut_string = function(s,f_size, max_width) {

	let sum_v=0;
	for (let i=0;i<s.length;i++) {

		let code_id=s.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			s = s.substring(0, i) + 'S' + s.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width)
			return s.substring(0,i-1);
	}
	return s

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

var finish_game = {

	online: function(res) {

		if (!(state==='p'))	return;

		//удаляем счетчик оставшегося на ход времени
		clearTimeout(game.move_timer);

		var game_result=0;
		var game_result_text="";
		var game_result_text2="";

		switch (res) {

			case 1: // шашки 1 завршили игру
				if (my_role==="master") {
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";
					game_result=1;
				} else {
					game_result_text="Вы проиграли\nсоперник перевел шашки в новый дом";
					game_result=-1;
				}
			break;

			case 2:	// шашки 2 завршили игру
				if (my_role==="master") {
					game_result_text="Вы проиграли\nсоперник перевел шашки в новый дом";
					game_result=-1;
				} else {
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";
					game_result=1;
				}
			break;

			case 3:	// оба завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;
			break;

			case 4:	// шашки 1 не успели вывести из дома за 30 ходов
				if (my_role==="master") {
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";
					game_result=-1;
				} else {
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";
					game_result=1;
				}
			break;

			case 5: // шашки 2 не успели вывести из дома за 30 ходов

				if (my_role==="master") {
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";
					game_result=1;
				} else {
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";
					game_result=-1;
				}
			break;

			case 9:	// оба не успели вывести из дома за 30 ходов
				game_result_text="НИЧЬЯ!\nникто не успел вывести шашки из дома за 30 ходов";
				game_result=0;
			break;

			case 10:
				game_result_text="Победа!\nСоперник сдался!";
				game_result=1;
			break;

			case 11:
				game_result_text="Вы сдались!";
				game_result=-1;
			break;

			case 12:

			break;

			case 13:
				if (me_conf_play===1) {
					game_result_text="Вы проиграли!\nзакончилось время на ход!";
					game_result=-1;
				} else {
					game_result_text="Похоже Вы не смогли начать игру!";
					game_result=999;
				}
			break;

			case 14:
				if (opp_conf_play===1) {
					game_result_text="Победа!\nсоперник не сделал ход!"; //возможно пропала связь
					game_result=1;
				} else {
					game_result_text="Похоже соперник не смог начать игру!";
					game_result=999;
				}
			break;

			case 15:	//я отказываюсь от игры
				game_result_text="Вы отказались от игры!";
				game_result=999;
			break;

			case 16:	//получение отказа от игры
				game_result_text="Соперник отказался от игры!";
				game_result=999;
			break;

			case 88: // шашки 1 больше завели в дом на 80 ход
				if (my_role==="master") {
					game_result_text="Вы выиграли\nперевели больше шашек в новый дом";
					game_result=1;
				} else {
					game_result_text="Вы проиграли\nсоперник перевел больше шашек в новый дом";
					game_result=-1;
				}
			break;

			case 89: // шашки 2 больше завели в дом на 80 ход
				if (my_role==="master") {
					game_result_text="Вы проиграли\nсоперник перевел больше шашек в новый дом";
					game_result=-1;
				} else {
					game_result_text="Вы выиграли\nперевели больше шашек в новый дом";
					game_result=1;
				}
			break;

			case 90: // одинаково шашек в новом дому
				game_result_text="НИЧЬЯ!";
				game_result=0;
			break;

		}

		if (game_result!==999) {

			//обновляем мой рейтинг в базе и на карточке
			let old_rating=my_data.rating;

			//считаем и записываем мой новый рейтинг
			my_data.rating=calc_my_new_rating(game_result);
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
			game_result_text2="Рейтинг: "+old_rating+" > "+my_data.rating;
			objects.my_card_rating.text=my_data.rating;
			//console.log(old_rating,my_data.rating)

			//записываем результат в базу данных
			let duration = ~~((Date.now() - game.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':game_result,'fin_type':res,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
			
			let check_players =[
				'1NOs1k4jKvIIe80grKaEoIZ59PbuP0TWlBOoFHrUoh4=',
				'2ifgfvcabThOq2EhUg2qYNagFukZm49Hky9CBILikrE=',
				'ApglJugCBw3owZiptBGmAFtghywpFDUl4GOE5yTevc8=',
				'HAXS4Uwl22XJybZg2gTbwaHUzHOMc7X1mLFS2Av8ayM=',
				'HHNnZgYsNjwFHsGW5l3uvtX+GOeZJJcD8HQz8RcThWw=',
				'Q91gCAYjLDQeTBZLiwmWWzWmhZnuKTAWgpLbm3kw9Uo=',
				'X3oRx1NdLMzDqrLaKAXAahBP8Pnq1k+irMDuHKHqMbY=',
				'Z8rpvOLTNIjvgZxnTMTSZX5Z08QfynLlxi0ZvWs0cV8=',
				'aPehlhdOYUKrCObw76SfaIGwK8BbBm2Hk7bR+WRNgsM=',
				'cZ9FfoeCzzwm3CbHPkBKRHTAh4qoDaJvrserVFtBvPo=',
				'ihwRwyyjjwtumUck+HzegY6D5kZ3tIJKQ1ZHPlN6s3k=',
				'ls4147060',
				'nYaoPB58Z5BqhFaOqpJx10MEQblZY7wMLgUxqunbQJg=',
				'p70n979DU+biBKD3wbiOn0hADScsGJZkoRnEAx7MRNI=',
				'v3fob5izUFzWXThIxl1VpWbmDulYWZlfWVRBG9qzrdQ=',
				'vNx2vRus1XIPlMFllQmDnqWfV3YZp7Ff5hYis5eKllc=',
				'vk113552413',
				'vk188397292',
				'w5jjfB09gf2kWOJ0BxicV1jUtkESey7npAzj+cyE078=',
				'wmXca5Z53ezNANjw+BkH5GpfjDOpg51D+bJGmTJHsnQ='	
			]
			
			if (check_players.includes(my_data.uid) || check_players.includes(opp_data.uid)) {
			firebase.database().ref("finishes2").push({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':game_result,'fin_type':res,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});	
			}

			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);	
			
			//воспроизводим звук
			if (game_result===-1)
				game_res.resources.lose.sound.play();
			else
				game_res.resources.win.sound.play();
		} else {
			
			//восстанавливаем проигрышный рейтинг
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
			
		}


		//показыаем сообщение с результатом игры
		big_message.show(game_result_text,game_result_text2, function(){finish_game.show_ad()});

		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeOutBack',val:['sy',-450],	speed:0.03});

		objects.giveup_dialog.visible=false;
		objects.cur_move_text.visible=false;
		objects.timer_cont.visible=false;
		objects.board.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.game_buttons_cont.visible=false;
		objects.selected_frame.visible=false;
		objects.checkers.forEach((c)=> {c.visible=false});
		move=0;

		//показыаем основное меню
		main_menu.activate();

		opp_data.uid="";

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state ({state : 'o'});

	},

	bot: function(res) {

		var game_result_text="";
		var game_result_text2="";
		var game_result=1;

		switch (res) {

			case 1: // шашки 1 завершили игру
				game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";
			break;

			case 2:	// шашки 2 завершили игру
				game_result_text="Вы проиграли!\nоппонент быстрее Вас перевел шашки в новый дом";
				game_result=0;
			break;

			case 3:	// шашки 1 и 2 завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;
			break;

			case 4:	// шашки 1 не успели вывести из дома за 30 ходов
				game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";
				game_result=0;
			break;

			case 5: // шашки 2 не успели вывести из дома за 30 ходов
				game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";
			break;

			case 9:	// шашки 1 и 2 не успели вывести из дома за 30 ходов
				game_result_text="НИЧЬЯ!\nникто не успел вывести шашки из дома за 30 ходов";
				game_result=0;
			break;

			case 10:	// нажали кнопку завершить
				game_result_text="Игра завершена";
				game_result=0;
			break;

		}


		//воспроизводим звук
		if (game_result===1) {

			//если мы играем в рамках соц.сети то обновляем рейтинг и на карточке тоже
			if (my_data.rating < 2000) {
				
				my_data.rating++;
				game_result_text2="Рейтинг: +1";	
				objects.my_card_rating.text=my_data.rating;
				firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
				
			} else {				
				game_result_text2=")))";				
			}


			game_res.resources.win.sound.play();
		}
		else {

			game_res.resources.lose.sound.play();
		}


		//показыаем сообщение с результатом игры
		big_message.show(game_result_text,game_result_text2, function(){finish_game.show_ad()});


		//если диалоги еще открыты
		objects.timer_cont.visible=false;
		objects.board.visible=false;
		objects.stickers_cont.visible=false;
		objects.cur_move_text.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.game_buttons_cont.visible=false;
		objects.selected_frame.visible=false;
		objects.checkers.forEach((c)=>{	c.visible=false});
		objects.stop_bot_button.visible=false;
		move=0;

		//показыаем основное меню
		main_menu.activate();

		opp_data.uid="";

		//устанавливаем статус в базе данных только если досупна онлайн игра
		set_state({state : 'o'});


	},

	show_ad: function() {

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

}

var game={

	move_time_left: 30,
	move_timer:0,
	start_time:0,

	activate: function(role) {

		console.clear();
		//console.log(role);
		my_role=role;
		if (my_role==="master") {
			objects.timer_cont.x=610;
			my_turn=0;
		} else {

			objects.timer_cont.x=10;
			my_turn=1;
		}

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
		
		//фиксируем время начала игры
		game.start_time = Date.now();

		//ни я ни оппонент пока не подтвердили игру
		me_conf_play=0;
		opp_conf_play=0;

		game_res.resources.note.sound.play();

		//это если перешли из бот игры
		objects.stop_bot_button.visible=false;
		selected_checker=0;
		objects.selected_frame.visible=false;


		objects.board.visible=true;

		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		objects.timer_cont.visible=true;
		objects.game_buttons_cont.visible=true;
		objects.cur_move_text.visible=true;

		//обозначаем какой сейчас ход
		move=0;
		objects.cur_move_text.text="Ход: "+move;

		//включаем взаимодейтсвие с доской
		objects.board.pointerdown=game.mouse_down_on_board;
		
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу
		let lose_rating = calc_my_new_rating(-1);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);


		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});

		//счетчик времени
		this.move_time_left=35;
		this.move_timer=setTimeout(function(){game.timer_tick()}, 1000);
		objects.timer_text.tint=0xffffff;

		//сначала скрываем все шашки
		g_board =[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		board_func.update_board();

	},

	timer_tick: function() {

		this.move_time_left--;

		if (this.move_time_left<0 && my_turn === 1)	{
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:14}});
			finish_game.online(13);
			return;
		}

		if (this.move_time_left<-5 && my_turn === 0) {
			//firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:13}});
			finish_game.online(14);
			return;
		}

		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			game_res.resources.clock.sound.play();
		}


		objects.timer_text.text="0:"+this.move_time_left;
		this.move_timer=setTimeout(function(){game.timer_tick()}, 1000);

	},

	mouse_down_on_board : function(e) {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};


		//если происходит движение шашки то выходим
		if (board_func.target_point!==0)
			return;

		//проверяем что моя очередь
		if (my_turn === 0) {
			add_message("не твоя очередь");
			return;
		}

		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board.y-10)/400);

		//если выбрана новая шашка
		if (selected_checker===0)
		{
			//находим шашку по координатам
			selected_checker=board_func.get_checker_by_pos(new_x,new_y);

			if (selected_checker.m_id===my_checkers)
			{
				objects.selected_frame.x=selected_checker.x;
				objects.selected_frame.y=selected_checker.y;
				objects.selected_frame.visible=true;

				//воспроизводим соответствующий звук
				game_res.resources.move.sound.play();

				return;
			}
			else
			{
				add_message("Это не ваши шашки");
				selected_checker=0;
				return;
			}
		}

		if (selected_checker!==0)
		{

			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===selected_checker.ix && new_y===selected_checker.iy)
			{
				game_res.resources.move.sound.play();
				selected_checker=0;
				objects.selected_frame.visible=false;
				return;
			}



			//формируем объект содержащий информацию о ходе
			let m_data={x1:selected_checker.ix,y1:selected_checker.iy,x2:new_x, y2:new_y};

			//пытыемся получить последовательность ходов
			let moves=board_func.get_moves_path(m_data);


			if (moves.length!==11)
			{

				objects.selected_frame.visible=false;

				//отменяем выделение
				selected_checker=0;

				//отправляем ход сопернику
				game.process_my_move(m_data,moves);
			}
			else
			{
				add_message("сюда нельзя ходить");
			}
		}

	},

	process_my_move : function (move_data, moves) {

		//обновляем счетчик хода
		move++;
		objects.cur_move_text.text="Ход: "+move;

		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(g_board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=0;
		if (my_role==="master") // если я мастер
			board_state=board_func.get_board_state(new_board, move);

		//начинаем процесс плавного перемещения шашки
		if (state==="b") {
			//это игра с ботом
			board_func.start_gentle_move(move_data,moves,function() {setTimeout(function(){bot_game.make_move()},400)});
		}
		else
		{
			//начинаем плавное перемещение шашки
			board_func.start_gentle_move(move_data,moves,function(){});

			//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2
			move_data.x1=7-move_data.x1;
			move_data.y1=7-move_data.y1;
			move_data.x2=7-move_data.x2;
			move_data.y2=7-move_data.y2;

			//отправляем ход сопернику
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:{...move_data,board_state:board_state}},
			function(error){if(error){add_message("Ошибка при отправке хода. Сообщите админу.")}});
		}

		//проверяем не закончена ли игра
		if (board_state!==0)
			finish_game.online(board_state);


		//уведомление что нужно вывести шашки из дома
		if (move>24 && move<31 ) {
			if (board_func.any1home(new_board))
				add_message("После 30 ходов не должно остаться шашек в доме");
		}

		//уведомление что игра скоро закончиться
		if (move>75 && move<81 ) {
			add_message("После 80 хода выиграет тот кто перевел больше шашек в новый дом");
		}



		//перезапускаем таймер хода и кто ходит
		this.move_time_left=30;
		objects.timer_text.tint=0xffffff;
		my_turn = 0;

		//перемещаем табло времени
		objects.timer_cont.x=620-objects.timer_cont.x;

		//обозначаем что я сделал ход и следовательно подтвердил согласие на игру
		me_conf_play=1;

	}

}

var giveup_menu={

	show: function() {




		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		any_dialog_active=1;

		if (objects.giveup_dialog.ready===false)
			return;
		game_res.resources.click.sound.play();

		//--------------------------
		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:true,func:'easeOutCubic',val:[450,'sy'],	speed:0.05});

	},

	give_up: function() {

		if (objects.giveup_dialog.ready===false)
			return;
		game_res.resources.click.sound.play();

		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:10}});

		this.hide();

		finish_game.online(11);

	},

	hide : function() {

		if (objects.giveup_dialog.ready===false)
			return;
		game_res.resources.close.sound.play();

		any_dialog_active=0;

		//--------------------------
		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy',450],	speed:0.05});
	}
}

var keep_alive= function() {
	
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

var minimax_solver={


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

	make_weights_board: function(move) {

		let p=move/60+0.5;
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_1[y][x]=Math.pow(x*x+y*y,p)+Math.pow((1-x)*(1-x)+y*y,p);
			}
		}
	},

	make_weights_board2: function(move) {
		
		let r_num = Math.random()*0.8 + 0.2;
		let p=move/60+0.5;
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_1[y][x]=r_num * Math.pow(x*x+y*y,p)+ (1 - r_num ) * Math.pow((1-x)*(1-x)+y*y,p);
			}
		}

		if (move>37) {

			for (let y=5;y<8;y++) {
				for (let x=4;x<8;x++) {
					this.bad_1[y][x]=9999;
				}
			}

		}

	},

	board_val: function(board, move) {

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
		if (move>=30) {

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

	minimax_3: function(board,move) {

		this.make_weights_board(move);
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


				max_2=Math.max(this.board_val(childs2[c2][0],move+3),max_2);
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

	minimax_3_single: function(board, move) {

		this.make_weights_board2(move);
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

var process_new_message=function(msg) {

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
	if (msg.message==="REJECT"  && pending_player===msg.sender) {
		cards_menu.rejected_invite();
	}


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
				finish_game.online(msg.data.board_state);

			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender===opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

var receive_move = function(move_data) {

	//воспроизводим уведомление о том что соперник произвел ход
	game_res.resources.receive_move.sound.play();

	//считаем последовательность ходов
	let moves=board_func.get_moves_path(move_data);

	//плавно перемещаем шашку
	board_func.start_gentle_move(move_data,moves,function(){});

	//если игра завершена то переходим
	if (move_data.board_state!==0)	{
		finish_game.online(move_data.board_state);
		return;
	}

	//перезапускаем таймер хода
	game.move_time_left=30;
	objects.timer_text.tint=0xffffff;

	//обозначаем кто ходит
	my_turn = 1;

	//обозначаем что соперник сделал ход и следовательно подтвердил согласие на игру
	opp_conf_play=1;

	//перемещаем табло времени
	objects.timer_cont.x=620-objects.timer_cont.x;

}

var req_dialog={

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
				game_res.resources.receive_sticker.sound.play();
				anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:true,func:'easeOutElastic',val:[-260, 	'sy'],	speed:0.02});

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

		any_dialog_active=0;

		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		any_dialog_active=0;
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;	

		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave");

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});
	}


}

var main_menu= {


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
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

		this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		any_dialog_active=1;

		game_res.resources.click.sound.play();

		anim.add_pos({obj:objects.rules_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-450,'sy'],	speed:0.04});

	},

	rules_ok_down: function () {
		any_dialog_active=0;
		anim.add_pos({obj:objects.rules_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',-450],	speed:0.04});
	},

	pref_button_down: function () {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		any_dialog_active=1;

		game_res.resources.click.sound.play();

		anim.add_pos({obj:objects.pref_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-200,'sy'],	speed:0.04});

	},

	pref_ok_down: function() {

		any_dialog_active=0;
		game_res.resources.close.sound.play();
		anim.add_pos({obj:objects.pref_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',-200],	speed:0.04});

	},

	chk_type_sel: function (i) {

		if (i===0)
		{
			objects.chk_opt_frame.x=60;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_quad_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_quad_2_tex.texture;
		}

		if (i===1)
		{
			objects.chk_opt_frame.x=160;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_7_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_7_2_tex.texture;
		}

		if (i===2)
		{
			objects.chk_opt_frame.x=260;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_round_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_round_2_tex.texture;
		}
	}


}

var lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;


		anim.add_pos({obj:objects.lb_1_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.02});
		anim.add_pos({obj:objects.lb_2_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.025});
		anim.add_pos({obj:objects.lb_3_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.03});
		anim.add_pos({obj:objects.lb_cards_cont,param:'x',vis_on_end:true,func:'easeOutCubic',val:[450,0],	speed:0.03});

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
			game_res.resources.locked.sound.play();
			return
		};


		game_res.resources.click.sound.play();
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

var cards_menu={
	
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
		objects.players_online.visible=true;
		
		
		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name) .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

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
			
		objects.players_online.text='Игроков онлайн: ' + num + '   ( комната: ' +room_name +' )';
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14)
			num_of_tables = num_of_tables - (num_of_cards - 14);

		
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
		objects.mini_cards[0].uid="AI";
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
			game_res.resources.locked.sound.play();
			return
		};


		any_dialog_active=1;		
		
		anim.add_pos({obj:objects.td_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-150,'sy'],	speed:0.04});
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
	
	close_table_dialog : function () {
		
		any_dialog_active=0;	
		
		game_res.resources.close.sound.play();
		
		anim.add_pos({obj:objects.td_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',400],	speed:0.04});
		
		
	},

	show_invite_dialog: function(cart_id) {

		if (any_dialog_active>0) {
			game_res.resources.locked.sound.play();
			return
		};


		any_dialog_active=3;

		pending_player="";

		game_res.resources.click.sound.play();

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;

		anim.add_pos({obj:objects.invite_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-150,'sy'],	speed:0.04});


		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};


		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

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
		objects.players_online.visible=false;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		any_dialog_active=0;

		game_res.resources.close.sound.play();

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}


		anim.add_pos({obj:objects.invite_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',400],	speed:0.04});

	},

	send_invite: function() {


		if (objects.invite_cont.ready===false || objects.invite_cont.visible===false)
			return;

		if (any_dialog_active===1 && any_dialog_active!==3) {
			game_res.resources.locked.sound.play();
			return
		};

		if (cards_menu._opp_data.uid==="AI")
		{
			this.close();
			
			//заполняем данные бот-оппонента
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;	
			
			bot_game.start();
		}
		else
		{
			game_res.resources.click.sound.play();
			objects.invite_button.texture=game_res.resources.wait_response.texture;
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
			any_dialog_active=1

		}

	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((');

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
		game.activate("master");
	},

	back_button_down: function() {

		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};

		game_res.resources.click.sound.play();

		this.close();
		main_menu.activate();

	}

}

var stickers={

	show_panel: function() {


		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		any_dialog_active=1;

		if (objects.stickers_cont.ready===false)
			return;
		game_res.resources.click.sound.play();


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450,'sy'],	speed:0.02});
	},

	hide_panel: function() {

		game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		any_dialog_active=0;

		//анимационное появление панели стикеров
		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeOutBack',val:['sy',-450],	speed:0.02});
	},

	send : function(id) {

		if (objects.stickers_cont.ready===false)
			return;

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		add_message("Стикер отправлен сопернику");

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		anim.add_pos({obj:objects.sent_sticker_area,param:'alpha',vis_on_end:true,func:'linear',val:[0, 0.5],	speed:0.02});
		//objects.sticker_area.visible=true;
		//убираем стикер через 5 секунд
		if (objects.sent_sticker_area.timer_id!==undefined)
			clearTimeout(objects.sent_sticker_area.timer_id);

		objects.sent_sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.sent_sticker_area,param:'alpha',vis_on_end:false,func:'linear',val:[0.5,0],	speed:0.02});}, 3000);

	},

	receive: function(id) {

		//воспроизводим соответствующий звук
		game_res.resources.receive_sticker.sound.play();

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;

		anim.add_pos({obj:objects.rec_sticker_area,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.02});

		//убираем стикер через 5 секунд
		if (objects.rec_sticker_area.timer_id!==undefined)
			clearTimeout(objects.rec_sticker_area.timer_id);
		objects.rec_sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.rec_sticker_area,param:'x',vis_on_end:false,func:'easeInBack',val:['x',-150],	speed:0.02});}, 5000);

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

						//если личные данные не получены то берем первые несколько букв айди
						if (my_data.name=="" || my_data.name=='')
							my_data.name=my_data.uid.substring(0,5);

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

					let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Волк","Лиса","Мышь","Сова","Слон","Енот","Кролик","Бизон","Пантера"];
					let rnd_num=Math.floor(Math.random()*rnd_names.length)
					let rand_uid=Math.floor(Math.random() * 9999999);

					my_data.name 		=	rnd_names[rnd_num]+rand_uid;
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					localStorage.setItem('uid',my_data.uid);
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

	resize();
	window.addEventListener("resize", resize);

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
		if (my_data.rating > 1450)
			room_name= 'states2';
		else
			room_name= 'states';

		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//убираем лупу
		objects.id_loup.visible=false;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});

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

		anim.add_pos({obj: objects.id_cont,param: 'y',vis_on_end: false,func: 'easeInBack',val: ['y',-200],	speed: 0.03});

	}).catch((err)=>{
		alert(err.stack + " " + err);
	});


	//устанавливаем начальный вид шашек
	board_func.tex_1=game_res.resources.chk_quad_1_tex.texture;
	board_func.tex_2=game_res.resources.chk_quad_2_tex.texture;

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
	game_res.add("m2_font", git_src+"m_font.fnt");

	game_res.add('receive_move',git_src+'receive_move.mp3');
	game_res.add('note',git_src+'note.mp3');
	game_res.add('receive_sticker',git_src+'receive_sticker.mp3');
	game_res.add('message',git_src+'message.mp3');
	game_res.add('lose',git_src+'lose.mp3');
	game_res.add('win',git_src+'win.mp3');
	game_res.add('click',git_src+'click.mp3');
	game_res.add('close',git_src+'close.mp3');
	game_res.add('move',git_src+'move.mp3');
	game_res.add('locked',git_src+'locked.mp3');
	game_res.add('clock',git_src+'clock.mp3');


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

	//обработка передвижения шашек
	board_func.process_checker_move();

	//глобальная функция
	g_process();

	game_tick+=0.016666666;
	anim.process();
	requestAnimationFrame(main_loop);
}

