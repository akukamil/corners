var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}; 

var my_data={},opp_data={};
var valid_moves;
var g_process=()=>{};

//анимации
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;


class list_item_class {
	
	constructor (x,y,w,h) {
									
			
		this.player_name_text=new PIXI.BitmapText('', {font: '28px Century Gothic'});
		this.player_name_text.x=x+20;
		this.player_name_text.y=y+20;
		this.player_name_text.tint=0x333333;
		
		this.player_rating_text=new PIXI.BitmapText('', {font: '25px Century Gothic'});
		this.player_rating_text.anchor.set(1,0);
		this.player_rating_text.x=x+w-20;
		this.player_rating_text.y=y+20;
		this.player_rating_text.tint=0xff00ff;
	}

}

class anim_class {
	constructor()	{		
		this.anim_array=[null,null,null,null,null,null,null,null,null];		
	}
	
	linear(x) {
		return x
	};
	
	easeOutElastic(x) {
		
		
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	};
		
	easeOutBounce(x) {
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
	};	
	
	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	};
	
	easeOutQuart(x) {
		return 1 - Math.pow(1 - x, 4);
	};
	
	easeOutQuint (x) {
		return 1 - Math.pow(1 - x, 5);
	};
	
	easeInCubic (x) {
		return x * x * x;
	};
	
	easeInQuint (x) {
		return x * x * x * x * x;
	};
	
	easeOutBack (x) {
		return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
	};
	
	easeInBack (x) {
		return c3 * x * x * x - c1 * x * x;
	};

	add_animation(obj,param,vis_on_end,func,start_val,end_val,speed) {
		
		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{
			
			if (this.anim_array[i]===null)	{
			
				obj.visible=true;
				obj.alpha=1;
				obj.ready=false;
				obj[param]=start_val;
				var delta=end_val-start_val;	
				this.anim_array[i]={obj:obj,param:param,vis_on_end:vis_on_end,delta:delta,func:this[func],start_val:start_val,speed:speed,progress:0};	
				return;
			}
			
		}
		
		alert("Нет свободных слотов для анимации");
		
	}
		
	process()
	{
		for (var i=0;i<this.anim_array.length;i++)	{
			if (this.anim_array[i]!==null)	{
				let anim_data=this.anim_array[i];

				anim_data.obj[anim_data.param]=anim_data.start_val+anim_data.delta*anim_data.func(anim_data.progress);
				anim_data.progress+=anim_data.speed;
				
				if (anim_data.progress>=1)	{
					anim_data.obj.visible=anim_data.vis_on_end;
					anim_data.obj.ready=true;
					this.anim_array[i]=null;					
				}
			}
		}
	}
	
}


//это анимации
c = new anim_class();

function get_valid_moves(ix,iy,board_data){
		
	var move_archive=[[ix,iy]];
	
	function left(ix,iy,cur_board) {
		
		var new_x=ix-1;
		var new_y=iy;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			valid_moves[new_y][new_x]=1;
			return			
		}
		else
		{
			left_combo(ix,iy,JSON.parse(JSON.stringify(cur_board)));
		}		
	}
	
	function right(ix,iy,cur_board) {
		var new_x=ix+1;
		var new_y=iy;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			valid_moves[new_y][new_x]=1;
			return			
		}
		else
		{
			right_combo(ix,iy,JSON.parse(JSON.stringify(cur_board)));
		}	
	}
	
	function up(ix,iy,cur_board){
		var new_x=ix;
		var new_y=iy-1;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			valid_moves[new_y][new_x]=1;
			return			
		}
		else
		{
			up_combo(ix,iy,JSON.parse(JSON.stringify(cur_board)));
		}		
	}
	
	function down(ix,iy,cur_board){
		var new_x=ix;
		var new_y=iy+1;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			valid_moves[new_y][new_x]=1;
			return			
		}
		else
		{
			down_combo(ix,iy,JSON.parse(JSON.stringify(cur_board)));
		}	
	}
	
	function left_combo(ix,iy,cur_board) {
		
		var new_x=ix-2;
		var new_y=iy;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[iy][ix-1]===0)
			return;
		
				
		if (valid_moves[new_y][new_x]===1)
			return;
		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[iy][ix];
			cur_board[iy][ix]=0;
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			left_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			up_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			down_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
		}
	}
	
	function right_combo(ix,iy,cur_board) {
		
		var new_x=ix+2;
		var new_y=iy;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[iy][ix+1]===0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[iy][ix];
			cur_board[iy][ix]=0;
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			right_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			up_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			down_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));			
		}
	}
	
	function up_combo(ix,iy,cur_board) {
		
		var new_x=ix;
		var new_y=iy-2;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[iy-1][ix]===0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[iy][ix];
			cur_board[iy][ix]=0;
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			right_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			up_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			left_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));			
		}
	}
	
	function down_combo(ix,iy,cur_board) {
		
		var new_x=ix;
		var new_y=iy+2;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[iy+1][ix]===0)
			return;
		
		if (valid_moves[new_y][new_x]===1)
			return;
		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[iy][ix];
			cur_board[iy][ix]=0;
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			right_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			down_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));
			left_combo(new_x,new_y,JSON.parse(JSON.stringify(cur_board)));			
		}
	}
			
		
	valid_moves=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
	left(ix,iy,JSON.parse(JSON.stringify(board_data)));
	right(ix,iy,JSON.parse(JSON.stringify(board_data)));
	up(ix,iy,JSON.parse(JSON.stringify(board_data)));
	down(ix,iy,JSON.parse(JSON.stringify(board_data)));
}

function get_moves_path(move_data, board_data){
		
	var g_archive=[];
	var move_archive=[[move_data.x1,move_data.y1]];
	
	function left(move_data,cur_board, m_archive) {
		
		var new_x=move_data.x1-1;
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
			left_combo(move_data,JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
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
			right_combo(move_data,JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
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
			up_combo(move_data,JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
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
			down_combo(move_data,JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
		}	
	}
	
	function left_combo(move_data,cur_board, m_archive) {
		
		var new_x=move_data.x1-2;
		var new_y=move_data.y1;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[move_data.y1][move_data.x1-1]===0)
			return;		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			cur_board[move_data.y1][move_data.x1]=0;
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {		
				
				if (g_archive.length>0) {
					if (m_archive.length<g_archive.length)
						g_archive=m_archive;
				}
				else {
					g_archive=m_archive;						
				}
				return;
			}
			
			if (valid_moves[new_y][new_x]===1)
				return;			
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
		}
	}
	
	function right_combo(move_data,cur_board, m_archive) {
		
		var new_x=move_data.x1+2;
		var new_y=move_data.y1;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[move_data.y1][move_data.x1+1]===0)
			return;
		
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			cur_board[move_data.y1][move_data.x1]=0;
						
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				
				if (g_archive.length>0) {
					if (m_archive.length<g_archive.length)
						g_archive=m_archive;
				}
				else {
					g_archive=m_archive;						
				}
				return;
			}
			
			if (valid_moves[new_y][new_x]===1)
				return;			
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			
		}
	}
	
	function up_combo(move_data,cur_board, m_archive) {
		
		var new_x=move_data.x1;
		var new_y=move_data.y1-2;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[move_data.y1-1][move_data.x1]===0)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			cur_board[move_data.y1][move_data.x1]=0;
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				
				if (g_archive.length>0) {
					if (m_archive.length<g_archive.length)
						g_archive=m_archive;
				}
				else {
					g_archive=m_archive;						
				}
				return;
			}
			
			if (valid_moves[new_y][new_x]===1)
				return;			
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			
		}
	}
	
	function down_combo(move_data,cur_board, m_archive) {
		
		var new_x=move_data.x1;
		var new_y=move_data.y1+2;
		
		if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
			return;
		
		if (cur_board[move_data.y1+1][move_data.x1]===0)
			return;
		
		if (cur_board[new_y][new_x]===0)
		{
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			cur_board[move_data.y1][move_data.x1]=0;
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				
				if (g_archive.length>0) {
					if (m_archive.length<g_archive.length)
						g_archive=m_archive;
				}
				else {
					g_archive=m_archive;						
				}
				return;
			}
			
			if (valid_moves[new_y][new_x]===1)
				return;			
			valid_moves[new_y][new_x]=1;
			
			//продолжаем попытки комбо
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			
		}
	}
			
		
	valid_moves=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
	left(	move_data,	JSON.parse(	JSON.stringify(board_data)),	JSON.parse(JSON.stringify(move_archive)));
	right(	move_data,	JSON.parse(	JSON.stringify(board_data)),	JSON.parse(JSON.stringify(move_archive)));
	up(		move_data,	JSON.parse(	JSON.stringify(board_data)),	JSON.parse(JSON.stringify(move_archive)));
	down(	move_data,	JSON.parse(	JSON.stringify(board_data)),	JSON.parse(JSON.stringify(move_archive)));
		
	
	return g_archive;
}
	
	

{//здесь функции для работы с состоянием доски
	
function finished1 (boardv) {
	for (var y=0;y<3;y++)
		for (var x=0;x<4;x++)
			if (boardv[y][x]!==1)
				return 0;
	return 1;
}

function finished2 (boardv) {
	for (var y=5;y<8;y++)
		for (var x=4;x<8;x++)
			if (boardv[y][x]!==2)
				return 0;
	return 1;
}

function any1home(boardv) {
	for (var y=5;y<8;y++)
		for (var x=4;x<8;x++)
			if (boardv[y][x]===1)
				return 1;
	return 0;	
}

function any2home(boardv) {
	for (var y=0;y<3;y++)
		for (var x=0;x<4;x++)
			if (boardv[y][x]===2)
				return 1;
	return 0;	
}

function any_home(boardv, checker) {
	
	let shift_x=0, shift_y=0;	
	if (checker===1) {shift_x=4, shift_y=5};				
				
	for (var y=shift_y;y<shift_y+3;y++)
		for (var x=shift_x;x<shift_x+4;x++)
			if (boardv[y][x]===checker)
				return 1;
	return 0;	
}



function get_board_state(board, cur_move) {	
	
	var w1=finished1(board);
	var w2=finished2(board);
	var w1_at_home=any2home(board)*(cur_move>=30);
	var w2_at_home=any1home(board)*(cur_move>=30);

	//кодируем сосотяние игры в одно значение
	return w1*1+w2*2+w1_at_home*4+w2_at_home*5;

}

}

class game_class {	
	
	constructor() {		
		
		//имя оппонента
		opp_data.uid="";
		opp_data.rating=0;
		
		//это данные для плавного перемещения шашки
		this.target_point=0;
		this.checker_to_move=-1;
		this.move_path=0;
						
		//это состояния игры
		this.state="online" // offline	idle	wait	playing
		
		//указатель кто играет следующий
		this.who_play_next="---";
		this.who_play_next_text="---";
		
		//выбранная шашка
		this.selected_checker=0;
		
		//мой рейтинг
		my_data.rating=0;
		
		//таймаут
		this.my_sticker_show=0;
		
		//указатель какими шашками должен играть
		this.my_checkers=0;
		
		//списко игроков
		this.players_states=[];
		
		//таймаут
		this.search_timeout_handler=0;
		this.move_ticker=1;
		this.move_start_time=0;
		
		//текущий ход
		this.move=0;
		
		//время начала ожидания ответа
		this.wait_start=0;
		
		//игрок от которого ожидаем ответ
		this.pending_player="";
				
		//это доска накоторой играют в шашки		
		this.board=[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];

		
		//************сетевые манипуляции********************//
		
		//записываем что мы в онлайне и простаиваем
		firebase.database().ref("states/"+my_data.uid).set("online");
		
		//обновляем почтовый ящик и подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",timestamp:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { this.process_new_message(snapshot.val());});
				
		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => { this.players_list_updated(snapshot.val());});
				
		//отключение от игры
		firebase.database().ref("states/"+my_data.uid).onDisconnect().set("offline");
		
		
	}	
	
	add_message(text) {		
		objects.message_text.text=text;
		objects.message_cont.visible=true;		
	
		c.add_animation(objects.message_cont,'x',true,'easeOutCubic',-200,objects.message_cont.sx,0.02);
		
		if (objects.message_cont.timer_id!==undefined)
			clearTimeout(objects.message_cont.timer_id);
		objects.message_cont.timer_id=setTimeout(()=>{c.add_animation(objects.message_cont,'x',false,'easeInCubic',objects.message_cont.sx,-200,0.02);}, 6000);		
	}

	add_big_message(text) {		
		objects.big_message_text.text=text;
		objects.big_message_cont.visible=true;		
		c.add_animation(objects.big_message_cont,'y',true,'easeOutCubic',-180,objects.big_message_cont.sy,0.02);
		
		if (objects.big_message_cont.timer_id!==undefined)
			clearTimeout(objects.big_message_cont.timer_id);
		objects.big_message_cont.timer_id=setTimeout(()=>{c.add_animation(objects.big_message_cont,'y',false,'easeInCubic',objects.big_message_cont.sy,-180,0.02);}, 6000);		
	}
	
	calc_my_new_rating(res)	{
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1) 
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (res===0) 
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (res===-1)
			return Math.round(my_data.rating + 16 * (0 - Ea));
	}
	
	calc_oppnent_new_rating(res)	{
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1) 
			return Math.round(opp_data.rating + 16 * (1 - Ea));
		if (res===0) 
			return Math.round(opp_data.rating + 16 * (0.5 - Ea));
		if (res===-1) 
			return Math.round(opp_data.rating + 16 * (0 - Ea));
	}
	
	finish_game(state) {
		
		//отключаем подписку на обновление состояния оппонента
		firebase.database().ref("states/"+opp_data.uid).off();
		
		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => { this.players_list_updated(snapshot.val());});
		
		//устанавливаем статус в базе данных
		firebase.database().ref("states/"+my_data.uid).set("online");	
		

	
		objects.game_buttons_cont.visible=false;
		
		objects.cur_move_cont.visible=false;
		//objects.player_name_cont.visible=false;
		objects.opponent_name_cont.visible=false;
		objects.whose_move_cont.visible=false;
		
		//показыаем главное меню
		this.show_main_menu();
				
		//удаляем счетчик оставшегося на ход времени
		clearTimeout(this.move_ticker);
		
		
		
				
		var game_result=0;
		
		switch (state) {
			
			case 1:			
				if (this.my_checkers===1)	{
					this.add_big_message("Вы выиграли (быстрее оппонента перевели шашки в чужой дом)");	
					game_result=1;	
				}
				else	{
					this.add_big_message("Вы проиграли (оппонент быстрее Вас перевел шашки в чужой дом)");	
					game_result=-1;	
				}
				
			break;
			
			case 2:	
				if (this.my_checkers===2)	{
					this.add_big_message("Вы выиграли (быстрее оппонента перевели шашки в чужой дом)");	
					game_result=1;	
				}
				else	{
					this.add_big_message("Вы проиграли (оппонент быстрее Вас перевел шашки в чужой дом)");	
					game_result=-1;	
				}
			break;
			
			case 3:	
				this.add_big_message("НИЧЬЯ!");
				game_result=0;	
			break;
			
			case 4:		
				if (this.my_checkers===1)	{
					this.add_big_message("Вы выиграли (оппонент не успел вывести шашки из дома за 30 ходов)");	
					game_result=1;	
				}
				else	{
					this.add_big_message("Вы проиграли (не успели вывести шашки из дома за 30 ходов)");	
					game_result=-1;	
				}
			break;
			
			case 5:		
				if (this.my_checkers===2)	{
					this.add_big_message("Вы выиграли (оппонент не успел вывести шашки из дома за 30 ходов)");	
					game_result=1;	
				}
				else	{
					this.add_big_message("Вы проиграли (не успели вывести шашки из дома за 30 ходов)");	
					game_result=-1;	
				}
			break;
			
			case 9:	
				this.add_big_message("НИЧЬЯ! (никто не успел вывести шашки из дома за 30 ходов)");
				game_result=0;	
			break;
			
			case 10:	
				this.add_big_message("Победа! Соперник сдался!");
				game_result=1;	
			break;
			
			case 11:	
				this.add_big_message("Вы сдались!");
				game_result=-1;	
			break;
			
			case 12:	
				this.add_big_message("Победа! Соперник поникул игру!");
				var new_opponent_rating=this.calc_oppnent_new_rating(-1);
				firebase.database().ref("players/"+[opp_data.uid]+"/rating").set(new_opponent_rating);
				game_result=1;	
			break;
			
			case 13:	
				this.add_big_message("Вы проиграли! закончилось время на ход!");
				game_result=-1;	
			break;
			
			case 14:	
				this.add_big_message("Победа! соперник не сделал ход!"); //возможно пропала связь
				var new_opponent_rating=this.calc_oppnent_new_rating(-1);
				firebase.database().ref("players/"+[opp_data.uid]+"/rating").set(new_opponent_rating);
				game_result=1;	
			break;
			
			
		}
		
		//обновляем мой рейтинг
		my_data.rating=this.calc_my_new_rating(game_result);
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		
		
		opp_data.uid="";
		this.state="online";
		
	}
			
	get_checker_by_pos(x,y) {		
	
		for (let c of objects.checkers)
			if (c.ix===x && c.iy===y)	
				return c;
		return 0;
	}

	giveup(i) {
		
		if (objects.giveup_dialog.ready===false || objects.giveup_dialog.visible===false)
			return;
		
		//убираем диалог
		c.add_animation(objects.giveup_dialog,'y',false,'easeInCubic',objects.giveup_dialog.sy,M_HEIGHT,0.02);		
		
		if (i==false) return;
		
		
		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:10}});
		this.finish_game(11);
		
	}

	hide_leaderboard() {
		
		objects.leaderboard_cont.visible=false;
		
	}
		
	mouse_down_on_board() {		
	
	
		//если еще не завершилась отрисовка
		if (this.target_point!==0)	return;
		
		if (this.state!=="playing") {
			this.add_message("Игра не создана");
			return;	
		}	
						
		if (this.who_play_next!==my_data.uid)	{
			this.add_message("Не твоя очередь");
			return;		
		}
			
		var mx = app.renderer.plugins.interaction.eventData.data.global.x/app.stage.scale.x;
		var my = app.renderer.plugins.interaction.eventData.data.global.y/app.stage.scale.y;
		
		var new_x=Math.floor(8*(mx-objects.board_sprite.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board_sprite.y-10)/400);
				
		//если выбрана новая шашка
		if (this.selected_checker===0)
		{		
			//находим шашку по координатам
			this.selected_checker=this.get_checker_by_pos(new_x,new_y);
						
			if (this.selected_checker.m_id===this.my_checkers)
			{
				objects.selected_frame.x=this.selected_checker.x;
				objects.selected_frame.y=this.selected_checker.y;
				objects.selected_frame.visible=true;
				return;
			}	
			else
			{
				this.selected_checker=0;
				return;
			}
		}
				
		if (this.selected_checker!==0)
		{
			
			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===this.selected_checker.ix && new_y===this.selected_checker.iy)
			{			
				this.redraw_board();
				this.selected_checker=0;
				objects.selected_frame.visible=false;
				return;
			}
			
			//получаем перечень досупных ходов для проверки
			get_valid_moves(this.selected_checker.ix,this.selected_checker.iy,this.board);
			
			if (valid_moves[new_y][new_x]===1)
			{				
		
				//формируем объект содержащий информацию о ходе
				let m_data={x1:this.selected_checker.ix,y1:this.selected_checker.iy,x2:new_x, y2:new_y};
				
				//начинаем процесс плавного перемещения шашки				
				this.start_gentle_move(m_data);
				
				//отправляем обновленное сосотяние доски оппоненту
				this.send_move(m_data);		
				
				this.selected_checker=0;
				objects.selected_frame.visible=false;		
				this.who_play_next=opp_data.uid;
			}
			else
			{
				this.add_message("сюда нельзя ходить");
			}
			
		}
		
	}
	
	opponent_state_changed(s) {			
		if (s==="offline")
			this.finish_game(12);
	}
		
	players_list_updated(players) {

		this.players_states=players;
		
		//если при поиске оппонента никого не нашли то заново начинаем поиск
		if (this.state==="search") this.search_and_send_request();
	}
		
	process_new_message(msg) {	

		//Получили запрос на новую игру
		console.log("Сообщение: "+msg.message+ " Состояние: "+this.state +" sender:"+msg.sender +" pending: "+this.pending_player);
		if (msg.message==="REQ" && this.state==="idle")
		{		
			//отправляем сообщение о начале игры
			firebase.database().ref("inbox/"+msg.sender).set({sender:my_data.uid,message:"OK",timestamp:Date.now(),data:0});			
			
			this.start_game(msg.sender, 2, my_data.uid);
		}
		
		//получение положительного ответа от игрока которому мы отправляли запрос который уже создал игру
		if (msg.message==="OK"  && this.state==="wait" && this.pending_player==msg.sender)
			this.start_game(msg.sender, 1, msg.sender);	
		
		//получение сообщение с ходом игорка
		if (msg.message==="MOVE"  && this.state==="playing")
			this.receive_move(msg.data);

		//получение сообщение с сдаче
		if (msg.message==="END"  && this.state==="playing")
			this.finish_game(msg.data.board_state);

		//получение текстового сообщения
		if (msg.message==="MSG"  && this.state==="playing")
			this.sticker_received(msg.data);
		
	}
		
	process() {
		
		//если долго ждем ответа, то перезапускаем поиск соперника
		if (this.state==="wait")	{
			var wait_time=(Date.now()-this.wait_start)/1000;
			if(wait_time>4)
				this.start_idle_wait();
		}
		
		
		//анимируем окно ожидания соперника
		if (objects.search_opponent_window.visible===true) {
			
			objects.search_opponent_progress.rotation+=0.1;
		}
		
		//двигаем шашку 
		if (this.target_point!==0) {
			
			this.checker_to_move.x+=this.checker_to_move.dx;
			this.checker_to_move.y+=this.checker_to_move.dy;
			
			var dx=this.checker_to_move.x-this.checker_to_move.tx;
			var dy=this.checker_to_move.y-this.checker_to_move.ty;	
			
			var d=Math.sqrt(dx*dx+dy*dy);			
			if (d<1) this.set_next_cell();
		}
		
		//анимация
		c.process();
	}
			
	receive_move(move_data) {
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.move_snd.sound.play();
		
		//плавно перемещаем шашку
		this.start_gentle_move(move_data);
		
		//если игра заверщена то переходим
		if (move_data.board_state!==0)	{
			this.finish_game(move_data.board_state);			
			return;			
		}
		
		//перезапускаем таймер хода
		this.move_start_time=Date.now()+30000;
		
		//обозначаем кто ходит
		this.who_play_next=my_data.uid;		
		this.who_play_next_text="Ваш ход";

		

	}
	
	redraw_board() {	

		//сначала скрываем все шашки
		objects.checkers.forEach((c)=>{	c.visible=false});

		var ind=0;
		for (var x=0;x<8;x++) {
			for (var y=0;y<8;y++) {	

				if (this.board[y][x]!==0)
				{					
					if (this.board[y][x]===2)
						objects.checkers[ind].texture=game_res.resources["white_checkers"].texture;
				
					if (this.board[y][x]===1)
						objects.checkers[ind].texture=game_res.resources["black_checkers"].texture;
	
					objects.checkers[ind].x=x*50+objects.board_sprite.x+10;
					objects.checkers[ind].y=y*50+objects.board_sprite.y+10;
					
					objects.checkers[ind].ix=x;
					objects.checkers[ind].iy=y;
					objects.checkers[ind].m_id=this.board[y][x];
					
					objects.checkers[ind].visible=true;
					ind++;	
				}
			}
		}	
	}
			
	start_idle_wait() {

		if (this.state==="idle")
			return;
		
		
		//показываем контейнер с ожиданием
		if (objects.search_opponent_window.visible===false)
			c.add_animation(objects.search_opponent_window,'y',true,'easeOutCubic',-390, objects.search_opponent_window.sy,0.02);
		
		//убираем контейнер с кнопками
		if (objects.start_buttons_cont.visible===true)
			c.add_animation(objects.start_buttons_cont,'y',false,'easeInCubic',objects.start_buttons_cont.sy,M_HEIGHT,0.02);

		//устанавливаем локальный статус
		this.state="idle";
	
		//устанавливаем статус в базе данных
		firebase.database().ref("states/"+my_data.uid).set("idle");

		//запускаем поиск через определенное время
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000));
	}
	
	read_opponent_data(opp_uid) {
		
		firebase.database().ref("players/"+opp_uid).once('value').then((snapshot) => {
		  if (snapshot.val()===null) {
			  alert("Не получилось загрузить данные о сопернике");
		  }
		  else {
			  
			  
			opp_data={...opp_data,...snapshot.val()};			  
		
			//загружаем аватар соперника
			var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
			var player_data=snapshot.val();
			var loader = new PIXI.Loader(); // PixiJS exposes a premade instance for you to use.
			loader.add('opponent_avatar', opp_data.pic128x128,loaderOptions);
			loader.load((loader, resources) => {objects.opponent_avatar.texture = resources.opponent_avatar.texture;});
			
			//также отображаем имя
			let trimmed_text=opp_data.first_name +" "+opp_data.last_name;
			trimmed_text = trimmed_text.length > 15 ?  trimmed_text.substring(0, 12) + "..." : trimmed_text;
			objects.opponent_name_text.text=trimmed_text;
			objects.opponent_rating_text.text=opp_data.rating;
			
		  }
		});
		
	}
	
	start_game(opp_uid, checkers, who_next) {


		opp_data.uid=opp_uid;
		
		this.my_checkers = checkers;
		this.who_play_next=who_next;
		this.selected_checker=0;
		console.log(who_next);
		
		//нужно загрузить данные о сопернике и его фото
		this.read_opponent_data(opp_data.uid);
		
		
		//сообщение о цвете шашек
		var ch_col={1:"серые",2:"белые"};
		this.add_message("Цвет ваших шашек: "+ch_col[this.my_checkers]);

		//очищаем таймаут
		this.move_start_time=Date.now()+30000;
		clearTimeout(this.search_timeout_handler);
		this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);

		this.state="playing";
		
		
		//убираем окно ожидания
		c.add_animation(objects.search_opponent_window,'y',false,'easeInCubic', objects.search_opponent_window.sy,-390,0.02);
				
		
		//отключаем подписку на обновление пользователей
		firebase.database().ref("states").off();
		
		//добавляем подписку на состояние оппонента
		firebase.database().ref("states/"+opp_data.uid).on('value', (snapshot) => { this.opponent_state_changed(snapshot.val());});
		
		//записываем что игрок перешел в сосотяние игры
		firebase.database().ref("states/"+my_data.uid).set("playing");


		//устанавливаем начальное расположение шашек на доске
		this.board=[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		this.redraw_board();	
		
		
		
		//отображаем информацию об игроках
		objects.player_name_text.text=my_data.first_name+"\n"+my_data.rating;				
		c.add_animation(objects.player_name_cont,'x',true,'easeOutCubic',-190,objects.player_name_cont.sx,0.02);
		c.add_animation(objects.opponent_name_cont,'x',true,'easeOutCubic',M_WIDTH,objects.opponent_name_cont.sx,0.02);

		
		//включаем информацию о текущем ходе	
		c.add_animation(objects.cur_move_cont,'x',true,'easeOutCubic',-190,objects.cur_move_cont.sx,0.02);
		objects.cur_move_text.text="Ход";
		
		//отображаем кнопку сдаться
		objects.game_buttons_cont.visible=true;
		
		//обозначаем кто ходит
		c.add_animation(objects.whose_move_cont,'y',true,'easeOutCubic',-200,objects.whose_move_cont.sy,0.02);
				
		if (this.who_play_next===my_data.uid)
			this.who_play_next_text="Ваш ход";
		else
			this.who_play_next_text="Ход соперника";
		
		objects.text_4.text=this.who_play_next_text+" (30)";
		
		
		//тикер хода
		this.move=0;
	}
		
	search_and_send_request() {
			
		if (this.state!=="idle") return;
			

		for (var player_id in this.players_states) {

			if (player_id!=my_data.uid && this.players_states[player_id]==="idle")	{			
				firebase.database().ref("inbox/"+player_id).set({sender:my_data.uid,message:"REQ",timestamp:Date.now(),data:"-"});	
				this.pending_player=player_id;
				this.state="wait";
				this.wait_start=Date.now();
				console.log("sent REQ to "+player_id);
				return;
			}
		}
		
		//если пользователей не нашли то через некоторое время запускаем новый поиск
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000)+1000);
	}	
		
	sticker_received(id) {

		objects.sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		c.add_animation(objects.sticker_area,'x',true,'easeOutCubic',M_WIDTH,objects.sticker_area.sx,0.02);
		
		//убираем стикер через 5 секунд
		if (objects.sticker_area.timer_id!==undefined)
			clearTimeout(objects.sticker_area.timer_id);		
		objects.sticker_area.timer_id=setTimeout(()=>{c.add_animation(objects.sticker_area,'x',false,'easeInCubic',objects.sticker_area.sx,M_WIDTH,0.02);}, 5000);
	}
		
	start_gentle_move(move_data) {
		
		//подготавливаем данные для перестановки
		this.checker_to_move=this.get_checker_by_pos(move_data.x1,move_data.y1);		
		this.move_path=get_moves_path(move_data,this.board);
		this.target_point=0;
		this.set_next_cell();
		
	}
	
	set_next_cell() {
		

		if (this.target_point===this.move_path.length) {
			
			this.target_point=0;
			
			var [sx,sy]=this.move_path[0];			
			var [tx,ty]=this.move_path[this.move_path.length-1];	
			
			//меняем старую и новую позицию шашки
			[this.board[ty][tx],this.board[sy][sx]]=[this.board[sy][sx],this.board[ty][tx]];
			
			this.redraw_board();
			
			return;			
		}
		
		var [next_ix,next_iy]=this.move_path[this.target_point];
		
		this.checker_to_move.tx=next_ix*50+objects.board_sprite.x+10;
		this.checker_to_move.ty=next_iy*50+objects.board_sprite.y+10;
		
		this.checker_to_move.dx=(this.checker_to_move.tx-this.checker_to_move.x)/10;
		this.checker_to_move.dy=(this.checker_to_move.ty-this.checker_to_move.y)/10;		
	
		this.target_point++;	
	}

	send_move(move_data) {
		
		if (this.state!=="playing") {
			//alert("Игра не создана");
			return;			
		}	
				
		
		this.move++;
		
		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(this.board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=0;
		if (this.my_checkers===1) // если я супервайзер (шашки №1)
			board_state=get_board_state(new_board, this.move);
		
		//уведомление что нужно вывести шашки из дома
		if (this.move===25) {
			if (any_home(new_board,this.my_checkers))
			this.add_message("Через 5 ходов не должно остаться шашек в доме");
		}
		
		
		
		
		//отправляем ход с состоянием оппоненту
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",timestamp:Date.now(),data:{...move_data,board_state:board_state}});

		//проверяем не закончена ли игра
		if (board_state!==0)
			this.finish_game(board_state);		
				
		//обновляем текущий ход		
		objects.cur_move_text.text="Сделано ходов: "+this.move;
		
		//обновляем таймер хода
		this.move_start_time=Date.now()+30000;
				
		//обозначаем кто ходит
		this.who_play_next=opp_data.uid;	
		this.who_play_next_text="Ход соперника";
	}
	
	send_sticker(id) {
		
		if (objects.stickers_cont.ready===false)
			return;		

		c.add_animation(objects.stickers_cont,'y',false,'easeInCubic',objects.stickers_cont.sy,M_HEIGHT,0.02);
		
		if (id!==-1){
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",timestamp:Date.now(),data:id});			
			this.add_message("Стикер отправлен сопернику");
			
			
			//показываем какой стикер мы отправили
			objects.my_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
			c.add_animation(objects.my_sticker_area,'x',true,'easeOutCubic',-170,objects.my_sticker_area.sx,0.02);
			
			//убираем стикер через 5 секунд
			if (objects.my_sticker_area.timer_id!==undefined)
				clearTimeout(objects.my_sticker_area.timer_id);			
			objects.my_sticker_area.timer_id=setTimeout(()=>{c.add_animation(objects.my_sticker_area,'x',false,'easeInCubic',objects.my_sticker_area.sx,-170,0.02);}, 5000);
			
		}


	}
	
	show_stickers_panel() {
		
		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true)
			return;
		
		objects.stickers_cont.show();
		
		//анимационное появление панели стикеров
		c.add_animation(objects.stickers_cont,'y',true,'easeOutBack',M_HEIGHT,objects.stickers_cont.sy,0.02);
	}
			
	show_giveup_menu() {
		
		if (objects.giveup_dialog.ready===false || objects.giveup_dialog.visible===true)
			return;
		
		objects.giveup_dialog.show();
		c.add_animation(objects.giveup_dialog,'y',true,'easeOutCubic',M_HEIGHT,objects.giveup_dialog.sy,0.02);		
	}
			
	show_main_menu() {
				
		objects.start_buttons_cont.show();
		c.add_animation(objects.start_buttons_cont,'y',true,'easeOutBack',M_HEIGHT,objects.start_buttons_cont.sy,0.02);
	}

	show_leaderboard() {
		
		
		if (objects.start_buttons_cont.ready===false)
			return;
				
		c.add_animation(objects.leaderboard_cont,'y',true,'easeOutBack',M_HEIGHT,objects.leaderboard_cont.sy,0.02);
		
		//обновляем или записываем информацию о рейтинге
		firebase.database().ref("players").once('value').then((snapshot) => {
			if (snapshot.val()===null) {
			  alert("Что-то не получилось получить данные о рейтингах");
			}
			else {
				
				var players_data=snapshot.val();
				
				
				var players_array = [];
				for (var player in players_data) {
					players_array.push([players_data[player].first_name, players_data[player].last_name, players_data[player].rating]);
				}

				players_array.sort(function(a, b) {	return b[2] - a[2];});
				
				
				let len=Math.min(5,players_array.length);
				for (let i=0;i<len;i++) {
					let player_name=players_array[i][0]+" "+players_array[i][1];					
					player_name = player_name.length > 18 ?  player_name.substring(0, 15) + "..." : player_name;
					
					eval(`objects.list${i}.player_name_text`).text=player_name;
					eval(`objects.list${i}.player_rating_text`).text=players_array[i][2];
				}
			}

		});
		
		
	}

	show_rules() {
		
	}

	timer_tick() {
		
		var sec_left=Math.round((this.move_start_time-Date.now())/1000);
		objects.text_4.text=this.who_play_next_text+" ("+sec_left+")";
				
		if (sec_left<0 && this.who_play_next===my_data.uid)	{			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:14}});
			this.finish_game(13);
			return;			
		}
		
		if (sec_left<-5) {
			if (this.who_play_next===opp_data.uid)	{			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:13}});
			this.finish_game(14);
			return;
			}
		}
				
		this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);
	}
	
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

function change_theme() {
	
	
	function componentToHex(c) {
	  var hex = c.toString(16);
	  return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
	  return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	
	var base_r,base_g,base_b,tbase_r,tbase_g,tbase_b;

	base_r=Math.floor(Math.random() * 225);
	base_g=Math.floor(Math.random() * 225);
	base_b=Math.floor(Math.random() * 225);

	if (base_r+base_g+base_b>382) {
		tbase_r=Math.floor(Math.random() * 50);
		tbase_g=Math.floor(Math.random() * 50);
		tbase_b=Math.floor(Math.random() * 50);
	} else {
		tbase_r=200+Math.floor(Math.random() * 50);
		tbase_g=200+Math.floor(Math.random() * 50);
		tbase_b=200+Math.floor(Math.random() * 50);
	}
	
	function process_obj(obj) {		
		
		if (obj instanceof PIXI.Container) {			
			for (var i = 0;i< obj.children.length; i++)
				process_obj(obj.children[i]);
		}
		
		if (obj instanceof PIXI.Sprite  ) {
			
			var shift_r=Math.floor(Math.random() * 30);
			var shift_g=Math.floor(Math.random() * 30);
			var shift_b=Math.floor(Math.random() * 30);	
			
			var hex_color=rgbToHex(base_r+shift_r, base_g+shift_g, base_b+shift_b);
			obj.base_tint=obj.tint;
		}
		
		
		if (obj instanceof PIXI.BitmapText ) {			
					
			var shift_r=Math.floor(Math.random() * 30);
			var shift_g=Math.floor(Math.random() * 30);
			var shift_b=Math.floor(Math.random() * 30);	
			
			var hex_color=rgbToHex(tbase_r+shift_r, tbase_g+shift_g, tbase_b+shift_b);
			obj.base_tint=obj.tint;
		}
	
	}
	
	
	
	process_obj(app.stage);
	

	
}


var callback_from_ok = function(method,result,data){
	
	if (result) {
			
		//создаем данные об игроке
		//firebase.database().ref("players/"+[result.uid]).set({first_name:result.first_name,last_name:result.last_name,pic_url:result.pic128x128});
		
		
		//получаем информацию об игроке из одноклассников
		my_uid=result.uid;		
		my_first_name=result.first_name;
		my_avatar_url=result.pic128x128;

		//alert("добро пожаловать "+my_first_name);
		load();
	}
};

function load_ok() {
	
	
	
	VK.init(function() {
		 
			VK.api("users.get", {access_token: '03af491803af491803af4918d103d800b3003af03af491863c040d61bee897bd2785a50',fields: 'photo_100'}, function (data) {
			console.log(data);
			
			my_data.first_name=data.response[0].first_name;
			my_data.last_name=data.response[0].last_name;
			my_data.uid=data.response[0].id;
			my_data.pic128x128=data.response[0].photo_100;
			my_data.rating=0;
			load();
		
		});
				 
		 
	  }, function() {
			//вк не работают устанавливаем тестовый вариант
			my_data.uid=prompt('Введите ID', 123);;
			my_data.first_name="test";		
			my_data.last_name="ok";	
			my_data.rating=0;
			my_data.pic128x128="https://i.mycdn.me/i?r=AzEPZsRbOZEKgBhR0XGMT1RkIpjnEpcRUsgZX-7yaqP7KqaKTM5SRkZCeTgDn6uOyic";

			//alert("добро пожаловать "+my_data.first_name);
			load();
	}, '5.130');
	
	/*
	var rParams = FAPI.Util.getRequestParameters();
	FAPI.init(rParams["api_server"], rParams["apiconnection"],

		//успешная инициализация одноклассников
		function() {			
			FAPI.Client.call({"method":"users.getCurrentUser", "fields":"first_name,last_name,uid,pic128x128"}, 			
			function(method,result,data){
				if (result) {
					//получаем информацию об игроке из одноклассников
					my_data=result;
					my_data.rating=0;
					//alert("добро пожаловать "+my_data.first_name);
					load();
				} else {
					alert("Не получилось загрузить информацию из ОК, хотя инициализация прошла успешно.");
				}
			})
		},
		
		//неуспешная инициализация одноклассников
		function(error){
			
			//одноклассники не работают устанавливаем тестовый вариант
			my_data.uid=prompt('Введите ID', 123);;
			my_data.first_name="test";		
			my_data.last_name="ok";	
			my_data.rating=0;
			my_data.pic128x128="https://i.mycdn.me/i?r=AzEPZsRbOZEKgBhR0XGMT1RkIpjnEpcRUsgZX-7yaqP7KqaKTM5SRkZCeTgDn6uOyic";

			//alert("добро пожаловать "+my_data.first_name);
			load();
		}
	);
	*/
}

function load() {
	
	
	
	game_res=new PIXI.Loader();	
	game_res.add("m2_font", "m_font.fnt");
	game_res.add('move_snd','sound.mp3');

	//добавляем из листа загрузки
	for (var i=0;i<load_list.length;i++)
		if (load_list[i][0]=="sprite" || load_list[i][0]=="image") 
			game_res.add(load_list[i][1], "res/"+load_list[i][1]+".png");
	
	
	//добавляем текстуры стикеров
	for (var i=0;i<16;i++) {
		game_res.add("sticker_texture_"+i, "stickers/"+i+".png");
	}
	
	
	game_res.load(()=>{
		
		app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:true,backgroundColor : 0x000000});
		document.body.appendChild(app.view);

		resize();
		window.addEventListener("resize", resize);	

		//игра
		game=new game_class();	
		
		window.onkeydown = function (e)
		{		
            if ((e.keyCode > 47 	&& e.keyCode < 58) || 
				(e.keyCode > 64 	&& e.keyCode < 91) || 
				(e.keyCode > 185 	&& e.keyCode < 193) || 
				(e.keyCode > 218 	&& e.keyCode < 223) ||
				 e.keyCode===32)
				game.send_key(e.key);
			
			if (e.keyCode === 8)
				game.remove_last_key();				
			
			//if (e.keyCode ===13)
			//	game.send_message(-1);
		}		
		
		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		for (var i=0;i<load_list.length;i++) {			
			const obj_class=load_list[i][0];
			const obj_name=load_list[i][1];

			switch(obj_class)
			{			
				case "sprite":
					objects[obj_name]=new PIXI.Sprite(game_res.resources[obj_name].texture);
					eval(load_list[i][2]);
				break;
				
				case "block":
					eval(load_list[i][2]);						
				break;
				
				case "cont":
					eval(load_list[i][2]);						
				break;

				case "array":
					var a_size=load_list[i][2];
					objects[obj_name]=[];
					for (var n=0;n<a_size;n++)
						eval(load_list[i][3]);		
				break;
			}
		}
		
		//обрабатываем вторую часть кода в объектах
		for (var i=0;i<load_list.length;i++) {			
			const obj_class=load_list[i][0];
			const obj_name=load_list[i][1];

			switch(obj_class)
			{			
				case "sprite":
					eval(load_list[i][3]);
				break;
				
				case "block":
					eval(load_list[i][3]);						
				break;
				
				case "cont":
					eval(load_list[i][3]);						
				break;

				case "array":
					var a_size=load_list[i][2];
					for (var n=0;n<a_size;n++)
						eval(load_list[i][4]);		
				break;
			}
		}

		//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
		firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {			
			var data=snapshot.val();
			if (snapshot.val()===null) {
				my_data.rating=1400;			  
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic128x128: my_data.pic128x128});	
			}
			else {
				my_data.rating=data.rating;
				//на всякий случай обновляет данные так как могло поменяться имя или фамилия или фото
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic128x128: my_data.pic128x128});	
			}			
			
			//и обновляем информацию так как считали рейтинг
			let trimmed_text=my_data.first_name+" "+my_data.last_name;
			trimmed_text = trimmed_text.length > 15 ?  trimmed_text.substring(0, 12) + "..." : trimmed_text;
			objects.player_name_text.text=trimmed_text;	
			objects.player_rating_text.text=my_data.rating;	
		});

		//показыаем основное меню
		game.show_main_menu();
		
		
		//обновляем мой аватар и отображаем мою карточку
		var loader2 = new PIXI.Loader();
		loader2.add('my_avatar', my_data.pic128x128,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader2.load((loader, resources) => {
			objects.my_avatar.texture = resources.my_avatar.texture;
			
		});
		

		//запускаем главный цикл
		main_loop(); 		
		
	});		

	
}

function main_loop() {
			
	game.process();
    app.render(app.stage);
	requestAnimationFrame(main_loop);
}


