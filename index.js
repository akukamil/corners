var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, minimax_solver; 

var my_data={},opp_data={};
var valid_moves;
var g_process=()=>{};
var is_multiplayer=true;;

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

function get_childs(board_data, checkers){
			
	function clone_board(board) {
		
		r_board=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
		for (let y=0;y<8;y++)
			for (let x=0;x<8;x++)
				r_board[y][x]=board[y][x];
		return r_board;
	}
	
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
			
			if (d_move>-3)
				boards_array.push([clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
			
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
			
			if (d_move>-3)
				boards_array.push([clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
			
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
			
			if (d_move>-3)
				boards_array.push([clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
			
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
			
			if (d_move>-3)
				boards_array.push([clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
			
			//продолжаем попытки комбо
			right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			left_combo(new_x,new_y,cur_board,moves_hist,boards_array);			
		}
	}
	
	var boards_array=[];
	
	for (let y=0;y<8;y++) {
		for (let x=0;x<8;x++) {			
			if (board_data[y][x]===checkers) {
				var moves_hist=[[x,y]];
				left	(		x,y,	clone_board(board_data),	moves_hist, boards_array);
				right	(		x,y,	clone_board(board_data),	moves_hist, boards_array);
				up		(		x,y,	clone_board(board_data),	moves_hist, boards_array);
				down	(		x,y,	clone_board(board_data),	moves_hist, boards_array);					
			}
		}
	}
	
	
	return boards_array;

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
	
class minimax_solver_class {
	
	constructor() {
		
		this.bad_2=[[19.119,17.822,16.664,15.678,14.896,14.351,14.071,14.071],[17.705,16.295,15.021,13.919,13.033,12.408,12.083,12.083],[16.412,14.881,13.474,12.234,11.216,10.484,10.099,10.099],[15.273,13.614,12.06,10.657,9.472,8.595,8.123,8.123],[14.324,12.539,10.831,9.243,7.849,6.768,6.162,6.162],[13.605,11.71,9.857,8.078,5.434,4.064,3.236,3.236],[13.154,11.182,9.222,7.285,4.398,2.65,1.414,1.414],[13,11,9,7,4,2,0,0]];
		this.bad_1=[[0,0,2,4,7,9,11,13],[1.414,1.414,2.65,4.398,7.285,9.222,11.182,13.154],[3.236,3.236,4.064,5.434,8.078,9.857,11.71,13.605],[6.162,6.162,6.768,7.849,9.243,10.831,12.539,14.324],[8.123,8.123,8.595,9.472,10.657,12.06,13.614,15.273],[10.099,10.099,10.484,11.216,12.234,13.474,14.881,16.412],[12.083,12.083,12.408,13.033,13.919,15.021,16.295,17.705],[14.071,14.071,14.351,14.896,15.678,16.664,17.822,19.119]];
		this.bad_2_=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
		this.bad_1_=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
	}
	
	update_weights_board() {
		
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_2_[y][x]=Math.pow(this.bad_2[y][x],1+game.move/30);				
				this.bad_1_[y][x]=Math.pow(this.bad_1[y][x],1+game.move/100);	
				
			}
		}

		
	}
	
	how_bad_board_2(board, move) {

		var bad_val_2=0;
		var bad_val_1=0;
						
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {			
			
				if (board[y][x]===2)
					bad_val_2+=this.bad_2_[y][x];	
				
				if (board[y][x]===1)
					bad_val_1+=this.bad_1[y][x];	
			}
		}				
				
		return bad_val_2;
	}
		
	minimax_3(board,move) {
				
				
		this.update_weights_board();
		var m_data={};
		
		var min_bad_0=9999999;	
		var childs0=get_childs(board,2);		
		for (let c0=0;c0<childs0.length;c0++) {

				
			var max_bad_1=-9999999;
			var childs1=get_childs(childs0[c0][0],1);
			for (let c1=0;c1<childs1.length;c1++) {

				
				var min_bad_2=9999999;
				var childs2=get_childs(childs1[c1][0],2);
				for (let c2=0;c2<childs2.length;c2++) {
					
					var cur_val=this.how_bad_board_2(childs2[c2][0],move+2);
					
				min_bad_2=Math.min(cur_val,min_bad_2);
				if (min_bad_2<max_bad_1)
					break;
				}
				
			max_bad_1=Math.max(max_bad_1,min_bad_2);
			if (max_bad_1>min_bad_0)
				break;
			}
			

		if (min_bad_0>max_bad_1) {
			min_bad_0=max_bad_1;
			m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
		}		
		}
		

		return m_data;

	}
	
	minimax_4(board) {
				
				
		this.update_weights_board();
		var m_data={};
		
		var min_bad_0=99999;	
		var childs0=get_childs(board,2);		
		for (let c0=0;c0<childs0.length;c0++) {

				
			var max_bad_1=-99999;
			var childs1=get_childs(childs0[c0][0],1);
			for (let c1=0;c1<childs1.length;c1++) {

				
				var min_bad_2=99999;
				var childs2=get_childs(childs1[c1][0],2);
				for (let c2=0;c2<childs2.length;c2++) {
					
					
					var max_bad_3=-99999;
					var childs3=get_childs(childs2[c2][0],1);
					for (let c3=0;c3<childs3.length;c3++) {
						
						var cur_val=this.how_bad_board_2(childs3[c3][0]);
								
						
					max_bad_3=Math.max(cur_val,max_bad_3);
					if (max_bad_3>min_bad_2)
						break;
					}

					
				min_bad_2=Math.min(cur_val,min_bad_2);
				if (min_bad_2<max_bad_1)
					break;
				}
				
			max_bad_1=Math.max(max_bad_1,min_bad_2);
			if (max_bad_1>min_bad_0)
				break;
			}
			

		if (min_bad_0>max_bad_1) {
			min_bad_0=max_bad_1;
			m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
		}		
		}
		

		return m_data;

	}
	
	minimax_4_single(board) {
				
				
		this.update_weights_board();
		var m_data={};
		var min_bad=99999;
		var min_depth=999;
		
		var childs0=get_childs(board,2);		
		for (let c0=0;c0<childs0.length;c0++) {
			let val=this.how_bad_board_2(childs0[c0][0]);
			if (val===min_bad && min_depth>1) {
				min_depth=1;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}		
			if (val<min_bad) {
				min_bad=val;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}

			

			var childs1=get_childs(childs0[c0][0],2);
			for (let c1=0;c1<childs1.length;c1++) {
				let val=this.how_bad_board_2(childs1[c1][0]);				
				if (val===min_bad && min_depth>2) {
					min_depth=2;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}				
				if (val<min_bad) {
					min_bad=val;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}

				
				var childs2=get_childs(childs1[c1][0],2);
				for (let c2=0;c2<childs2.length;c2++) {
					let val=this.how_bad_board_2(childs2[c2][0]);
					if (val<min_bad) {
						min_bad=val;
						min_depth=3;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}

				}

			}

		}
		

		return m_data;

	}
	
	
	
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
		
		//тип игры
		this.bot_play=false;
		
		
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
		
		//указатель сделал ли игрок какое-либо движение шашкой
		this.me_confirmed_play=false;
		this.opp_confirmed_play=false;
		
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
	
		//воспроизводим звук
		game_res.resources.message.sound.play();
	
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
	
	close_leaderboard() {
		
		if (objects.leaderboard_cont.ready===false)
			return;
		
		//убираем лидербоард
		c.add_animation(objects.leaderboard_cont,'y',false,'easeInCubic',objects.leaderboard_cont.sy,M_HEIGHT,0.04);
		
	}
		
	close_search_window() {
				
		if (objects.search_opponent_window.ready===false)
			return;
		
		this.state="online";		
		
		//показываем контейнер с кнопками
		objects.start_buttons_cont.show();
		c.add_animation(objects.start_buttons_cont,'y',true,'easeOutCubic',-390, objects.start_buttons_cont.sy,0.02);
		
		//убираем контейнер с окном ожидания
		c.add_animation(objects.search_opponent_window,'y',false,'easeInCubic',objects.search_opponent_window.sy,M_HEIGHT,0.04);
	}
	
	close_rules() {
				
		if (objects.rules_cont.ready===false)
			return;
		
		
		//убираем контейнер
		c.add_animation(objects.rules_cont,'y',false,'easeInCubic',objects.rules_cont.sy,M_HEIGHT,0.04);
	}
	
	confirm_play (cp) {
		
		if (objects.confirm_cont.ready===false)
			return;
		
		if (cp===false) {
			this.finish_game(15);			
		} else {
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"CONF"});
			this.me_confirmed_play=true;			
		}
		
		c.add_animation(objects.confirm_cont,'y',false,'easeInCubic', objects.confirm_cont.sy,-150,0.03);	
	}  
	
	finish_game(state) {
		
		//отключаем подписку на обновление состояния оппонента
		firebase.database().ref("states/"+opp_data.uid).off();
		
		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => { this.players_list_updated(snapshot.val());});
		
	
		objects.game_buttons_cont.visible=false;
		
		objects.cur_move_cont.visible=false;
		objects.opponent_name_cont.visible=false;
		objects.whose_move_cont.visible=false;
		objects.confirm_cont.visible=false;		
		
		//показываем сколько игроков онлайн
		objects.online_users_text.visible=true;
		
		//показыаем главное меню
		this.show_main_menu();
				
		//удаляем счетчик оставшегося на ход времени
		clearTimeout(this.move_ticker);
			
				
		var game_result=0;
		var game_result_text="";
		
		switch (state) {
			
			case 1: // шашки 1 завершили игру
				if (this.my_checkers===1)	{
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли\nоппонент быстрее Вас перевел шашки в новый дом";	
					game_result=-1;	
				}
				
			break;
			
			case 2:	// шашки 2 завершили игру
				if (this.my_checkers===2)	{
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nоппонент быстрее Вас перевел шашки в новый дом";	
					game_result=-1;	
				}
			break;
			
			case 3:	// шашки 1 и 2 завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;	
			break;
			
			case 4: // шашки 2 не успели вывести из дома за 30 ходов
				if (this.my_checkers===1)	{
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;	
				}
			break;
			
			case 5:	// шашки 1 не успели вывести из дома за 30 ходов
				if (this.my_checkers===2)	{
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;	
				}
			break;
			
			case 9:	// шашки 1 и 2 не успели вывести из дома за 30 ходов
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
				if (this.opp_confirmed_play===true) {
					game_result_text="Победа!\nСоперник поникул игру!";
					var new_opponent_rating=this.calc_oppnent_new_rating(-1);
					firebase.database().ref("players/"+[opp_data.uid]+"/rating").set(new_opponent_rating);
					game_result=1;					
				} else {
					game_result_text="Соперник не дал согласия на игру!";
					game_result=999;						
				}			
			break;
			
			case 13:	
				if (this.me_confirmed_play===true) {
					game_result_text="Вы проиграли!\nзакончилось время на ход!";
					game_result=-1;	
				} else {
					game_result_text="Вы не дали согласия на игру!";
					game_result=999;		
				}
			break;
			
			case 14:	
				if (this.opp_confirmed_play===true) {
					game_result_text="Победа!\nсоперник не сделал ход!"; //возможно пропала связь
					var new_opponent_rating=this.calc_oppnent_new_rating(-1);
					firebase.database().ref("players/"+[opp_data.uid]+"/rating").set(new_opponent_rating);
					game_result=1;	
				} else {
					game_result_text="Соперник не дал согласия на игру!";
					game_result=999;						
				}	
			break;
			
			case 15:	//я отказываюсь от игры
				game_result_text="Вы отказались от игры!"; 
				firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"REFUSE"});
				game_result=999;	
			break;
			
			case 16:	//получение отказа от игры
				game_result_text="Соперник отказался от игры!";
				game_result=999;	
			break;
		}
		
		//обновляем мой рейтинг в базе и на экране
		var old_rating=my_data.rating;		
		
		if (game_result!==999) {
			my_data.rating=this.calc_my_new_rating(game_result);		
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
			objects.player_rating_text.text=my_data.rating;		
			game_result_text=game_result_text+"\nрейтинг: "+old_rating+" > "+my_data.rating		

			//воспроизводим звук
			if (game_result===-1)
				game_res.resources.lose.sound.play();
			else
				game_res.resources.win.sound.play();	
			
		}
	

		this.add_big_message(game_result_text);
		
		opp_data.uid="";
		this.state="online";
		
		//устанавливаем статус в базе данных
		firebase.database().ref("states/"+my_data.uid).set("online");		
	}
		
	finish_game_bot(state) {
		
		
		objects.game_buttons_cont.visible=false;
		
		objects.cur_move_cont.visible=false;
		objects.opponent_name_cont.visible=false;
		objects.whose_move_cont.visible=false;
		objects.confirm_cont.visible=false;		
		objects.finish_game_button_cont.visible=false;		
		
		//показываем сколько игроков онлайн
		objects.online_users_text.visible=true;
		
		//показыаем главное меню
		objects.start_buttons_cont.show();

		c.add_animation(objects.start_buttons_cont,'y',true,'easeOutBack',M_HEIGHT,objects.start_buttons_cont.sy,0.02);
		objects.start_buttons_cont.alpha=0.8;
				
		var game_result=0;
		var game_result_text="";
		
		switch (state) {
			
			case 1: // шашки 1 завершили игру
				if (this.my_checkers===1)	{
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли\nоппонент быстрее Вас перевел шашки в новый дом";	
					game_result=-1;	
				}
				
			break;
			
			case 2:	// шашки 2 завершили игру
				if (this.my_checkers===2)	{
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nоппонент быстрее Вас перевел шашки в новый дом";	
					game_result=-1;	
				}
			break;
			
			case 3:	// шашки 1 и 2 завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;	
			break;
			
			case 4: // шашки 2 не успели вывести из дома за 30 ходов
				if (this.my_checkers===1)	{
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;	
				}
			break;
			
			case 5:	// шашки 1 не успели вывести из дома за 30 ходов
				if (this.my_checkers===2)	{
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;	
				}
				else	{
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;	
				}
			break;
			
			case 9:	// шашки 1 и 2 не успели вывести из дома за 30 ходов
				game_result_text="НИЧЬЯ!\nникто не успел вывести шашки из дома за 30 ходов";
				game_result=0;	
			break;
			
			case 10:	
				game_result_text="Победа!\nСоперник сдался!";
				game_result=1;	
			break;
			
			case 11:	
				game_result_text="Игра закончена!";
				game_result=-1;	
			break;
		}
		
	

		//воспроизводим звук
		if (game_result===-1)
			game_res.resources.lose.sound.play();
		else
			game_res.resources.win.sound.play();	

		this.add_big_message(game_result_text);
		
		opp_data.uid="";
	
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
		
		//если нажали кнопку отмена то выходим и ничего не отравляем и не завершаем игру
		if (i==false) return;
				
		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:10}});
		this.finish_game(11);
		
	}
	
	make_bot_move() {
				
		//обновляем текущий ход		
		this.move++;
		objects.cur_move_text.text="Сделано ходов: "+this.move;
		
		if (game.move>30)
			var move_data=minimax_solver.minimax_4_single(this.board,2);
		else
			var move_data=minimax_solver.minimax_3(this.board,this.move);
		
		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(this.board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=get_board_state(new_board, this.move);
				
		//проверяем не закончена ли игра
		if (board_state!==0)
			this.finish_game_bot(board_state);	
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.receive_move.sound.play();
		
		//плавно перемещаем шашку
		this.start_gentle_move(move_data);
						
		//обозначаем кто ходит
		this.who_play_next=my_data.uid;		
		this.who_play_next_text="Ваш ход";
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
				
				//воспроизводим соответствующий звук
				game_res.resources.move.sound.play();
				console.log("move_sound");
				
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
			
			//получаем перечень доступных ходов для проверки
			get_valid_moves(this.selected_checker.ix,this.selected_checker.iy,this.board);
			
			if (valid_moves[new_y][new_x]===1)
			{				
		
				//формируем объект содержащий информацию о ходе
				let m_data={x1:this.selected_checker.ix,y1:this.selected_checker.iy,x2:new_x, y2:new_y};
				
				//начинаем процесс плавного перемещения шашки				
				this.start_gentle_move(m_data);
				
				//отправляем обновленное сосотяние доски оппоненту
				if (this.bot_play===false)
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
		if (s==="offline" || s==="online")
			this.finish_game(12);
	}
		
	players_list_updated(players) {

		this.players_states=players;
		var cnt=0;
		for (var player_id in this.players_states)
			if (this.players_states[player_id]!=="offline")
				cnt++;
		
		objects.online_users_text.text="Игроков онлайн: "+cnt;
	}
		
	process_new_message(msg) {	

		//Получили запрос на новую игру
		console.log("Сообщение: "+msg.message+ " Состояние: "+this.state +" sender:"+msg.sender +" pending: "+this.pending_player);
		
		if (this.state==="idle") {		
		
			//в данном состоянии принимаем только запросы о новой игре
			if (msg.message==="REQ") {		
			
				//отправляем сообщение о начале игры
				firebase.database().ref("inbox/"+msg.sender).set({sender:my_data.uid,message:"OK",timestamp:Date.now(),data:0});			
				this.start_game(msg.sender, 2, my_data.uid);				
			}			
		}
				
		//получение положительного ответа от игрока которому мы отправляли запрос и который уже создал игру
		if (this.state==="wait_response") {
			
			//принимаем только положительный ответ от соответствующего соперника и начинаем игру
			if (msg.message==="OK"  && this.pending_player===msg.sender)			
				this.start_game(msg.sender, 1, msg.sender);					

		}
		
		//получение сообщение в состояни игры
		if (this.state==="playing") {
			
			//учитываем только сообщения от соперника
			if (msg.sender===opp_data.uid) {
				
				//получение сообщение с ходом игорка
				if (msg.message==="MOVE")
					this.receive_move(msg.data);

				//получение сообщение с сдаче
				if (msg.message==="END" )
					this.finish_game(msg.data.board_state);	

				//получение стикера
				if (msg.message==="MSG")
					this.receive_sticker(msg.data);
				
				//получение отказа от игры
				if (msg.message==="REFUSE")
					this.finish_game(16);
				
				//получение согласия на игру
				if (msg.message==="CONF")
					this.opp_confirmed_play=true;
				
			}
		}
	
	}
		
	process() {
		
		//если долго ждем ответа, то перезапускаем поиск соперника
		if (this.state==="wait_response")	{
			var wait_time=(Date.now()-this.wait_start)/1000;
			if(wait_time>4)
				this.start_idle_wait();
		}
		
		
		//анимируем окно ожидания соперника
		if (objects.search_opponent_window.visible===true)
			objects.search_opponent_progress.rotation+=0.1;
		
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
		
		//анимация
		c.process();
	}
			
	receive_move(move_data) {
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.receive_move.sound.play();
		
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
	
	receive_sticker(id) {

		//воспроизводим соответствующий звук
		game_res.resources.receive_sticker.sound.play();

		objects.sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		c.add_animation(objects.sticker_area,'x',true,'easeOutCubic',M_WIDTH,objects.sticker_area.sx,0.02);
		
		//убираем стикер через 5 секунд
		if (objects.sticker_area.timer_id!==undefined)
			clearTimeout(objects.sticker_area.timer_id);		
		objects.sticker_area.timer_id=setTimeout(()=>{c.add_animation(objects.sticker_area,'x',false,'easeInCubic',objects.sticker_area.sx,M_WIDTH,0.02);}, 5000);
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




		if (this.state==="idle" || objects.start_buttons_cont.ready===false)
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
			loader.add('opponent_avatar', opp_data.pic_url,loaderOptions);
			loader.load((loader, resources) => {objects.opponent_avatar.texture = resources.opponent_avatar.texture;});
			
			//также отображаем имя
			let trimmed_text=opp_data.first_name +" "+opp_data.last_name;
			trimmed_text = trimmed_text.length > 15 ?  trimmed_text.substring(0, 12) + "..." : trimmed_text;
			objects.opponent_name_text.text=trimmed_text;
			objects.opponent_rating_text.text=opp_data.rating;
			
		  }
		});
		
	}
	
	search_and_send_request() {
			
		if (this.state!=="idle") return;
			

		for (var player_id in this.players_states) {

			if (player_id!==my_data.uid && this.players_states[player_id]==="idle")	{			
				firebase.database().ref("inbox/"+player_id).set({sender:my_data.uid,message:"REQ",timestamp:Date.now(),data:"-"});	
				this.pending_player=player_id;
				this.state="wait_response";
				this.wait_start=Date.now();
				console.log("sent REQ to "+player_id);
				return;
			}
		}
		
		//если пользователей не нашли то через некоторое время запускаем новый поиск
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000)+1000);
	}	

	start_gentle_move(move_data) {
		
		//подготавливаем данные для перестановки
		this.checker_to_move=this.get_checker_by_pos(move_data.x1,move_data.y1);		
		this.move_path=get_moves_path(move_data,this.board);
		this.target_point=1;
		this.set_next_cell();
		
	}
	
	start_game(opp_uid, checkers, who_next) {

		this.bot_play=false;
		this.state="playing";
		
		opp_data.uid=opp_uid;
		
		this.my_checkers = checkers;
		this.who_play_next=who_next;
		this.selected_checker=0;
		console.log(who_next);
		
		//убираем информацию о том сколько игроков онлайн
		objects.online_users_text.visible=false;
		
		//нужно загрузить данные о сопернике и его фото
		this.read_opponent_data(opp_data.uid);
		
		//указатель сделал ли игрок какое-либо движение шашкой
		this.me_confirmed_play=false;
		this.opp_confirmed_play=false;
		
		//сообщение о цвете шашек
		var ch_col={1:"красные",2:"белые"};
		this.add_message("Цвет ваших шашек: "+ch_col[this.my_checkers]);

		//очищаем таймаут
		this.move_start_time=Date.now()+30000;
		clearTimeout(this.search_timeout_handler);
		this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);
		
		//добавляем окно подтверждения игры
		c.add_animation(objects.confirm_cont,'y',true,'easeOutCubic', -150,objects.confirm_cont.sy,0.02);
				
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
		//objects.player_name_text.text=my_data.first_name+" "+my_data.last_name;				
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
			
	start_bot_play() {
		
		
		this.bot_play=true;
		
		this.state="playing";
				
		this.my_checkers = 1;
		this.who_play_next=my_data.uid;
		this.selected_checker=0;
		
		
		//убираем информацию о том сколько игроков онлайн
		objects.online_users_text.visible=false;
		
		//нужно загрузить данные о сопернике и его фото
		objects.opponent_name_text.text="БОТ";
		objects.opponent_rating_text.visible=false;
		objects.finish_game_button_cont.visible=true;	
		
		
		//сообщение о цвете шашек
		var ch_col={1:"красные",2:"белые"};
		this.add_message("Цвет ваших шашек: "+ch_col[this.my_checkers]);

		//очищаем таймаут
		//this.move_start_time=Date.now()+30000;
		//clearTimeout(this.search_timeout_handler);
		//this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);
						
		//убираем контейнер с кнопками
		if (objects.start_buttons_cont.visible===true)
			c.add_animation(objects.start_buttons_cont,'y',false,'easeInCubic',objects.start_buttons_cont.sy,M_HEIGHT,0.02);
					

		//устанавливаем начальное расположение шашек на доске
		this.board=[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		this.redraw_board();	
		
		//отображаем информацию об игроках
		c.add_animation(objects.player_name_cont,'x',true,'easeOutCubic',-190,objects.player_name_cont.sx,0.02);
		c.add_animation(objects.opponent_name_cont,'x',true,'easeOutCubic',M_WIDTH,objects.opponent_name_cont.sx,0.02);

		//включаем информацию о текущем ходе	
		c.add_animation(objects.cur_move_cont,'x',true,'easeOutCubic',-190,objects.cur_move_cont.sx,0.02);
		objects.cur_move_text.text="Ход";
		
		
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
			
	set_next_cell() {
		

		
		if (this.target_point===this.move_path.length) {
			
			this.target_point=0;
			
			var [sx,sy]=this.move_path[0];			
			var [tx,ty]=this.move_path[this.move_path.length-1];	
			
			//меняем старую и новую позицию шашки
			[this.board[ty][tx],this.board[sy][sx]]=[this.board[sy][sx],this.board[ty][tx]];
			
			this.redraw_board();
			
			//если в режиме бота то делаем ход ботом
			if(this.bot_play===true && this.who_play_next===opp_data.uid)
				this.make_bot_move();
			
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
		if (this.move>24 && this.move<31 ) {
			if (any_home(new_board,this.my_checkers))
				this.add_message("После 30 ходов не должно остаться шашек в доме");
		}
		
			
		//отправляем ход с состоянием оппоненту
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",timestamp:Date.now(),data:{...move_data,board_state:board_state}});
		
		//проверяем не закончена ли игра
		if (board_state!==0)
			this.finish_game(board_state);		
				
		//проверяем первое действие после которого нельзя отказаться от игры
		if (this.me_confirmed_play===false) {
			this.me_confirmed_play=true;
			if (objects.confirm_cont.ready===true && objects.confirm_cont.visible===true) {				
				//убираем окно отказа
				c.add_animation(objects.confirm_cont,'y',false,'easeInCubic', objects.confirm_cont.sy,-150,0.03);				
			}			
		}
				
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
				
		objects.leaderboard_cont.show();		
				
		c.add_animation(objects.leaderboard_cont,'y',true,'easeOutBack',M_HEIGHT,objects.leaderboard_cont.sy,0.02);
		
		//обновляем или записываем информацию о рейтинге
		firebase.database().ref("players").once('value').then((snapshot) => {
			if (snapshot.val()===null) {
			  alert("Что-то не получилось получить данные о рейтингах");
			}
			else {
				
				var players_data=snapshot.val();				
				var players_array = [];
				for (var player in players_data)
					players_array.push([players_data[player].first_name, players_data[player].last_name, players_data[player].rating, players_data[player].pic_url]);

				players_array.sort(function(a, b) {	return b[2] - a[2];});
				
				
				//загружаем аватар соперника
				var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
				var loader = new PIXI.Loader(); // PixiJS exposes a premade instance for you to use.
				
				
				
				
				var len=Math.min(5,players_array.length);
				for (let i=0;i<len;i++) {
					let player_name=players_array[i][0]+" "+players_array[i][1];					
					player_name = player_name.length > 18 ?  player_name.substring(0, 15) + "..." : player_name;
					
					objects['leaders_name_text_'+i].text=player_name;
					objects['leaders_rating_text_'+i].text=players_array[i][2];
					
					loader.add('leaders_avatar_'+i, players_array[i][3],loaderOptions);
				};
				
				
				loader.load((loader, resources) => {
					for (let i=0;i<len;i++)						
						objects['leaders_avatar_'+i].texture=resources['leaders_avatar_'+i].texture;
				});
			}

		});
		
		
		
		
		
		
	}

	show_rules() {
		
		//показываем
		c.add_animation(objects.rules_cont,'y',true,'easeOutCubic',-390, objects.rules_cont.sy,0.04);
		
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


function load_vk() {
		
	if(window.name==="") {
		//вк не работают устанавливаем тестовый вариант
		my_data.first_name='Я';
		is_multiplayer=false;
		load(); 
	}
	else {
		VK.init(
		
			//функция удачной инициализации вконтакте
			function()
			{
				VK.api(
					"users.get",
					{access_token: '03af491803af491803af4918d103d800b3003af03af491863c040d61bee897bd2785a50',fields: 'photo_100'},
					function (data) {
						my_data.first_name=data.response[0].first_name;
						my_data.last_name=data.response[0].last_name;
						my_data.uid="vk"+data.response[0].id;
						my_data.pic_url=data.response[0].photo_100;
						my_data.rating=0;
						load();
					}
				)			
			},	
			
			//функция неудачной инициализации вконтакте
			function() {alert("VK.init error")},

			//версия апи
			'5.130');		
	}
}

function load_yandex() {
		
		
	YaGames.init({}).then(ysdk => {

		ysdk.getPlayer().then(_player => {			
			
			player = _player;   
			
			my_data.first_name=player.getName();
			my_data.last_name='';
			my_data.uid=player.getUniqueID();
			my_data.pic_url=player.getPhoto('medium');
			my_data.rating=0;
			load();
			
		}).catch(err => {
			my_data.first_name='Я';
			is_multiplayer=false;
			load();
		});

	});
		
	
}



function load() {
	
	
	var t_board=[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
	var res=get_childs(t_board,1);
	
	
	game_res=new PIXI.Loader();	
	game_res.add("m2_font", "m_font.fnt");
	
	game_res.add('receive_move','receive_move.mp3');
	game_res.add('load_complete','load_complete.mp3');
	game_res.add('receive_sticker','receive_sticker.mp3');
	game_res.add('message','message.mp3');
	game_res.add('lose','lose.mp3');
	game_res.add('win','win.mp3');
	game_res.add('click','click.mp3');
	game_res.add('close','close.mp3');
	game_res.add('move','move.mp3');

	//добавляем из листа загрузки
	for (var i=0;i<load_list.length;i++)
		if (load_list[i][0]=="sprite" || load_list[i][0]=="image") 
			game_res.add(load_list[i][1], "res/"+load_list[i][1]+".png");
	
	//добавляем текстуры стикеров
	for (var i=0;i<16;i++) {
		game_res.add("sticker_texture_"+i, "stickers/"+i+".png");
	}
	
	

	game_res.load(load_complete);		
	game_res.onProgress.add(progress);
	
	function load_complete() {
		
		
		minimax_solver=new minimax_solver_class();
		
		//воспроизводим соответствующий звук
		//game_res.resources.load_complete.sound.play();
		
		
		document.getElementById("m_bar").outerHTML = "";		
		document.getElementById("m_progress").outerHTML = "";
		
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
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
			}
			else {
				my_data.rating=data.rating;
				//на всякий случай обновляет данные так как могло поменяться имя или фамилия или фото
				firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
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
		loader2.add('my_avatar', my_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader2.load((loader, resources) => {
			objects.my_avatar.texture = resources.my_avatar.texture;
			
		});
		
		
		//отключаем кнопку мультиплеера
		if (is_multiplayer===false) {			
			objects.start_game_button.pointerdown=function(){game.add_message("Это только для авторизованых пользователей")};			
			objects.player_name_text.text='Я';
		}

		
		//запускаем главный цикл
		main_loop(); 		
	
	}
	
	function progress(loader, resource) {
		
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	
	
}

function main_loop() {
			
	game.process();
    app.render(app.stage);
	requestAnimationFrame(main_loop);
}


