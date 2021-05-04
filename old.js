var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}; 

g_board=[];
var players="";
var my_data={},opp_data={};
var g_process=function(){};
var net_state=0;

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
		
		console.log("Нет свободных слотов для анимации");
		
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
		
		console.log("Нет свободных слотов для анимации");
		
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

var minimax_solver={
	
		
	bad_2:[[19.119,17.822,16.664,15.678,14.896,14.351,14.071,14.071],[17.705,16.295,15.021,13.919,13.033,12.408,12.083,12.083],[16.412,14.881,13.474,12.234,11.216,10.484,10.099,10.099],[15.273,13.614,12.06,10.657,9.472,8.595,8.123,8.123],[14.324,12.539,10.831,9.243,7.849,6.768,6.162,6.162],[13.605,11.71,9.857,8.078,5.434,4.064,3.236,3.236],[13.154,11.182,9.222,7.285,4.398,2.65,1.414,1.414],[13,11,9,7,4,2,0,0]],
	bad_1:[[0,0,2,4,7,9,11,13],[1.414,1.414,2.65,4.398,7.285,9.222,11.182,13.154],[3.236,3.236,4.064,5.434,8.078,9.857,11.71,13.605],[6.162,6.162,6.768,7.849,9.243,10.831,12.539,14.324],[8.123,8.123,8.595,9.472,10.657,12.06,13.614,15.273],[10.099,10.099,10.484,11.216,12.234,13.474,14.881,16.412],[12.083,12.083,12.408,13.033,13.919,15.021,16.295,17.705],[14.071,14.071,14.351,14.896,15.678,16.664,17.822,19.119]],
	bad_2_:[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
	bad_1_:[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],

	get_childs: function(board_data, checkers){
				
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

	},

	update_weights_board: function(move) {
		
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {
				this.bad_2_[y][x]=Math.pow(this.bad_2[y][x],1+move/30);				
				this.bad_1_[y][x]=Math.pow(this.bad_1[y][x],1+move/100);	
			}
		}

	},
	
	how_bad_board_2: function(board) {

		var bad_val_2=0;
		var bad_val_1=0;
						
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {			
			
				if (board[y][x]===2)
					bad_val_2+=this.bad_2_[y][x];	
				
				if (board[y][x]===1)
					bad_val_1+=this.bad_1_[y][x];	
			}
		}				
				
		return bad_val_2;
	},
		
	minimax_3: function(board,move) {
				
				
		this.update_weights_board(move);
		var m_data={};
		
		var min_bad_0=9999999;	
		var childs0=this.get_childs(board,2);		
		for (let c0=0;c0<childs0.length;c0++) {

				
			var max_bad_1=-9999999;
			var childs1=this.get_childs(childs0[c0][0],1);
			for (let c1=0;c1<childs1.length;c1++) {

				
				var min_bad_2=9999999;
				var childs2=this.get_childs(childs1[c1][0],2);
				for (let c2=0;c2<childs2.length;c2++) {
					
					var cur_val=this.how_bad_board_2(childs2[c2][0]);
					
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

	},
	
	minimax_4_single: function(board) {
				
				
		//this.update_weights_board();
		var m_data={};
		var min_bad=99999;
		var min_depth=999;
		
		var childs0=this.get_childs(board,2);		
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

			

			var childs1=this.get_childs(childs0[c0][0],2);
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

				
				var childs2=this.get_childs(childs1[c1][0],2);
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

var board_func={
	
	checker_to_move: "",
	target_point: 0,
	move_path: [],
	move_end_callback: function(){},
	
	update_board: function() {
		
		//сначала скрываем все шашки
		objects.checkers.forEach((c)=>{	c.visible=false});

		var ind=0;
		for (var x=0;x<8;x++) {
			for (var y=0;y<8;y++) {	

				if (g_board[y][x]!==0)
				{					
					if (g_board[y][x]===2)
						objects.checkers[ind].texture=game_res.resources["white_checkers"].texture;
				
					if (g_board[y][x]===1)
						objects.checkers[ind].texture=game_res.resources["black_checkers"].texture;
	
					objects.checkers[ind].x=x*50+objects.board_sprite.x+10;
					objects.checkers[ind].y=y*50+objects.board_sprite.y+10;
					
					objects.checkers[ind].ix=x;
					objects.checkers[ind].iy=y;
					objects.checkers[ind].m_id=g_board[y][x];
					
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
	
	get_valid_moves: function(ix,iy){
		
		var move_archive=[[ix,iy]];
		var valid_moves=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
				
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
			

		left(ix,iy,JSON.parse(JSON.stringify(g_board)));
		right(ix,iy,JSON.parse(JSON.stringify(g_board)));
		up(ix,iy,JSON.parse(JSON.stringify(g_board)));
		down(ix,iy,JSON.parse(JSON.stringify(g_board)));
		
		return valid_moves;
	
	},
	
	get_moves_path: function(move_data){
		
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
		left(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		right(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		up(		move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		down(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
			
		
		return g_archive;
	},
	
	start_gentle_move: function(move_data,callback) {
	
		//подготавливаем данные для перестановки
		this.move_end_callback=callback;
		this.checker_to_move=this.get_checker_by_pos(move_data.x1,move_data.y1);		
		this.move_path=this.get_moves_path(move_data);
		this.target_point=1;
		this.set_next_cell();
	
	},
	
	process_checker_move: function () {
		
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
		if (this.target_point===this.move_path.length) {
			
			this.target_point=0;
			
			var [sx,sy]=this.move_path[0];			
			var [tx,ty]=this.move_path[this.move_path.length-1];	
			
			//меняем старую и новую позицию шашки
			[g_board[ty][tx],g_board[sy][sx]]=[g_board[sy][sx],g_board[ty][tx]];
			
			//обновляем доску
			board_func.update_board();
			
			//вызываем функцию которая обозначает завершение движения шашки
			this.move_end_callback();
			
			return;			
		}
		

		
		var [next_ix,next_iy]=this.move_path[this.target_point];
		
		this.checker_to_move.tx=next_ix*50+objects.board_sprite.x+10;
		this.checker_to_move.ty=next_iy*50+objects.board_sprite.y+10;
		
		this.checker_to_move.dx=(this.checker_to_move.tx-this.checker_to_move.x)/10;
		this.checker_to_move.dy=(this.checker_to_move.ty-this.checker_to_move.y)/10;		
	
		this.target_point++;	
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

	any_home: function(boardv, checker) {
		
		let shift_x=0, shift_y=0;	
		if (checker===1) {shift_x=4, shift_y=5};				
					
		for (var y=shift_y;y<shift_y+3;y++)
			for (var x=shift_x;x<shift_x+4;x++)
				if (boardv[y][x]===checker)
					return 1;
		return 0;	
	},

	get_board_state: function(board, cur_move) {	
		
		var w1=this.finished1(board);
		var w2=this.finished2(board);
		var w1_at_home=this.any2home(board)*(cur_move>=30);
		var w2_at_home=this.any1home(board)*(cur_move>=30);

		//кодируем сосотяние игры в одно значение
		return w1*1+w2*2+w1_at_home*4+w2_at_home*5;

	}

}

var episode_start={

	user_data_loaded:0,
	
	init: function() {
		
		if (this.user_data_loaded===0)
			this.load_user_data.local();
		
		objects.online_users_text.visible=true;
		
		anim.add_pos({obj:objects.start_buttons_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450, 	'sy'],	speed:0.02});
		g_process=this.process;
		
	},
	
	leaders_button_down: function() {
		
		
		if (objects.start_buttons_cont.ready===false)
			return;		
		
		game_res.resources.click.sound.play();
		
		anim.add_pos({obj:objects.leaderboard_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450, 	'sy'],	speed:0.02});
		
		this.update_leaderboard();
		
	},
	
	close_leaderboard: function() {
		
		if (objects.leaderboard_cont.ready===false)
			return;
		
		game_res.resources.click.sound.play();		
		anim.add_pos({obj:objects.leaderboard_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	450],	speed:0.02});		
		
	},
	
	update_leaderboard: function () {
		
		firebase.database().ref("players").orderByChild('rating').limitToLast(5).once('value').then((snapshot) => {
			
			if (snapshot.val()===null) {
			  console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {				
				
				var players_array = [];
				snapshot.forEach(players_data=> {					
				players_array.push([players_data.val().first_name, players_data.val().last_name, players_data.val().rating, players_data.val().pic_url]);	
				});
				

				players_array.sort(function(a, b) {	return b[2] - a[2];});
				
				
				//загружаем аватар соперника
				var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
				var loader = new PIXI.Loader();
								
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
		
	},
	
	load_user_data: {
			
		req_result: "",
				
		vk: function() {
			
			if(typeof(VK)==='undefined')
			{		
				this.req_result='vk_sdk_error';
				process_results();	
			}
			else
			{
				
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
								this.req_result="vk_ok";	
								this.process_results();
							}
						)			
					},	
					
					//функция неудачной инициализации вконтакте
					function()
					{
						this.req_result='vk_init_error';
						this.process_results();				
					},

					//версия апи
					'5.130');		
				
			}

		},

		yandex: function() {
		
			
			var sdk_res='';
			if(typeof(YaGames)==='undefined')
			{		
				this.req_result='yndx_sdk_error';
				this.process_results();	
			}
			else
			{
				//если sdk яндекса найден
				YaGames.init({}).then(ysdk => {
					
					//фиксируем SDK в глобальной переменной
					window.ysdk=ysdk;
					
					//получаем данные игрока
					ysdk.getPlayer().then(_player => {
			
						my_data.first_name 	=	_player.getName();
						my_data.last_name	=	"";
						my_data.uid			=	_player.getUniqueID().replace("/", "Z");	
						my_data.pic_url		=	_player.getPhoto('medium');		
						
						
						this.req_result='ok';
						
						/*
						if (my_data.first_name==='')
							sdk_res='no_personal_data'
						else
							sdk_res='ok'*/
						
						
					}).catch(err => {
						this.req_result='yndx_get_play_error';
					}).finally(()=>{				
						this.process_results();				
					})
					
				}).catch(err => {			
					this.req_result='yndx_init_error';			
				}).finally(()=>{			
					this.process_results();			
				})		
				
			}				

		},

		local: function() {	
			
			let test_id = prompt('Введите ID (будет добавле test)');
			
			this.req_result='ok'		
			my_data.first_name="LOCAL"+test_id; ;
			my_data.last_name="test"+test_id;
			my_data.uid="test"+test_id;
			my_data.pic_url=null;
			
			this.process_results();
			
			net_state=1;

		},
		
		process_results: function() {
			
			//загружаем мою аватарку на табло
			if (my_data.pic_url!=undefined) {			
				let loader2 = new PIXI.Loader();
				loader2.add('my_avatar', my_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
				loader2.load((loader, resources) => {objects.my_avatar.texture = resources.my_avatar.texture;});				
			}
				
			
			if (this.req_result!=="ok") {			
				my_data.first_name 	=	"Я";
				my_data.last_name	=	"";
				my_data.uid			=	"";	
				my_data.pic_url		=	undefined;				
			}		
			
			//считываем рейтинг и обновляем данные об имени, фамилии и фото
			if (this.req_result==="ok") {				
				this.read_and_update_db();				
				episode_start.init_firebase();
			}			

			
			//подписываемся на новые сообщения
			firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { episode_play.process_new_message(snapshot.val());});
			
			//Отображаем мое имя и фамилию на табло
			let t=my_data.first_name;
			objects.player_name_text.text=t.length > 15 ?  t.substring(0, 12) + "..." : t;	
			
			episode_start.user_data_loaded=1;
		},
		
		read_and_update_db: function() {
			
			//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
			firebase.database().ref().child("players/"+my_data.uid).get().then((snapshot) => {			
				var data=snapshot.val();
				if (data===null)
				{
					//если я первый раз в игре
					my_data.rating=1400;			  
					firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
				}
				else
				{
					//если я уже есть в базе то считыавем мой рейтинг
					my_data.rating=data.rating;	
					
					//на всякий случай обновляет данные так как могло поменяться имя или фамилия или фото
					firebase.database().ref("players/"+my_data.uid).set({first_name:my_data.first_name, last_name: my_data.last_name, rating: my_data.rating, pic_url: my_data.pic_url});	
				}			
				
				//и обновляем информацию на табло так как считали рейтинг
				objects.player_rating_text.text=my_data.rating;	
				
			}).catch((error) => {		
				console.error(error);
				net_state=0;
				return;
			});
			
		}
		
	},

	init_firebase: function() {
		
		//обновляем почтовый ящик и подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",timestamp:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});
				
		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => { players_list_updated(snapshot.val());});
				
		//устанавливаем мой статус в онлайн
		firebase.database().ref("states/"+my_data.uid).set("online");	
				
		//отключение от игры и удаление не нужного
		firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		
	},

	bot_play_button_down: function () {
		
		if (objects.start_buttons_cont.ready===false)
			return;				
				
		game_res.resources.click.sound.play();
		
		objects.online_users_text.visible=false;
		
		anim.add_pos({obj:objects.start_buttons_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	450],	speed:0.02});	
		
		episode_bot_play.init();
		
	},
	
	online_play_button_down: function() {
		
		if(objects.start_buttons_cont.ready===false)
			return;	
	   
		game_res.resources.click.sound.play();
		episode_play.init();
		
	},
	
	process: function() {
		
		
		
	}
	
}

var episode_bot_play={
	
	my_checkers: 1,
	who_play_next: 1,
	selected_checker: 0,	
	move:0,

	init: function () {
		
		this.move=0;
		
		g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		
		//нужно загрузить данные о сопернике и его фото
		objects.opponent_name_cont.visible=true;
		objects.opponent_name_text.text="БОТ";
		objects.opponent_rating_text.visible=false;
		objects.opponent_avatar.visible=false;
		objects.finish_game_button_cont.visible=true;	
		
		board_func.update_board();
		
		
		objects.cur_move_cont.visible=true;
		
		//подписываемся на события нажатия на доску
		objects.board_sprite.interactive=true;
		objects.board_sprite.pointerdown=this.mouse_down_on_board.bind(this);
		
		
		//сообщение о цвете шашек
		var ch_col={1:"красные",2:"белые"};
		add_message("Цвет ваших шашек: "+ch_col[this.my_checkers]);
		
		
		//обозначаем кто ходит
		anim.add_pos({obj:objects.whose_move_cont,param:'y',vis_on_end:true,func:'easeOutCubic',val:[-200, 	'sy'],	speed:0.02});
				
		if (this.who_play_next===this.my_checkers)
			this.who_play_next_text="Ваш ход";
		else
			this.who_play_next_text="Ход соперника";
		
		objects.text_4.text=this.who_play_next_text;
		
		objects.cur_move_text.text="Сделано ходов: "+this.move;
		
		
		g_process=this.process;
		
	},
	
	process: function () {
		
		
		board_func.process_checker_move();
	},
	
	mouse_down_on_board(e) {
		
				
		//проверяем что моя очередь
		if (this.who_play_next!==this.my_checkers) {
			add_message("не твоя очередь");			
			return;			
		}

		
		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;
		
		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board_sprite.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board_sprite.y-10)/400);
				
		
		//если выбрана новая шашка
		if (episode_bot_play.selected_checker===0)
		{		
			//находим шашку по координатам
			episode_bot_play.selected_checker=board_func.get_checker_by_pos(new_x,new_y);
						
			if (episode_bot_play.selected_checker.m_id===episode_bot_play.my_checkers)
			{
				objects.selected_frame.x=episode_bot_play.selected_checker.x;
				objects.selected_frame.y=episode_bot_play.selected_checker.y;
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
				
		if (episode_bot_play.selected_checker!==0)
		{			

			
			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===episode_bot_play.selected_checker.ix && new_y===episode_bot_play.selected_checker.iy)
			{				
				game_res.resources.move.sound.play();
				episode_bot_play.selected_checker=0;
				objects.selected_frame.visible=false;				
				return;
			}
			
			//получаем перечень доступных ходов для проверки
			
			let valid_moves=board_func.get_valid_moves(this.selected_checker.ix,this.selected_checker.iy);
			
			if (valid_moves[new_y][new_x]===1)
			{				
		
				//формируем объект содержащий информацию о ходе
				let m_data={x1:episode_bot_play.selected_checker.ix,y1:episode_bot_play.selected_checker.iy,x2:new_x, y2:new_y};
				
				//начинаем процесс плавного перемещения шашки				
				board_func.start_gentle_move(m_data,function(){episode_bot_play.make_bot_move()});
				
			
				episode_bot_play.selected_checker=0;
				objects.selected_frame.visible=false;		
				this.who_play_next=3-this.who_play_next;				
				
			}
			else
			{
				add_message("сюда нельзя ходить");
			}		
		}		
	},
	
	make_bot_move: function() {
		
		//обновляем текущий ход		
		this.move++;
		objects.cur_move_text.text="Сделано ходов: "+this.move;
		
				
		if (this.move>30)
			var move_data=minimax_solver.minimax_4_single(g_board);
		else
			var move_data=minimax_solver.minimax_3(g_board,this.move);
		
		
		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(g_board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=board_func.get_board_state(new_board, this.move);
		
		//проверяем не закончена ли игра
		if (board_state!==0)
			this.finish_game_bot(board_state);	
		this.finish_game_bot(1);
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.receive_move.sound.play();
		
		//плавно перемещаем шашку
		board_func.start_gentle_move(move_data,()=>{});
						
		//обозначаем кто ходит
		this.who_play_next=1;		
		this.who_play_next_text="Ваш ход";
		
	},

	finish_game_bot: function(state) {
		
		
		//убираем кнопку завершить
		objects.finish_game_button_cont.visible=false;	
				
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

		add_big_message(game_result_text);
		
		objects.board_sprite.interactive=false;
		objects.close_big_message.pointerdown=this.close_bot_game;
	
	},
	
	close_bot_game: function() {
		
		game_res.resources.click.sound.play();
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-180],	speed:0.02});
		anim.add_pos({obj:objects.start_buttons_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450, 	'sy'],	speed:0.02});
		
		objects.whose_move_cont.visible=false;
		objects.opponent_name_cont.visible=false;
		objects.cur_move_cont.visible=false;
		
		//сначала скрываем все шашки
		objects.checkers.forEach((c)=>{	c.visible=false});
		
		episode_start.init();
	}

}

var episode_play={
	
	state: "online",
	pending_player: "sf",
	search_timeout_handler: 0,
	opponent_conf_play:0,
	me_conf_play:0,
	my_checkers: 0,
	who_play_next: 0,
	wait_start: 0,
	who_play_next_text: "",
	move_start_time:0,
	move: 0,
	selected_checker:0,
	move_ticker:0,
	
	init : function() {
			
		
		//устанавливаем статус локальный и в базе данных
		this.state="idle";
		firebase.database().ref("states/"+my_data.uid).set("idle");
				
		this.start_idle_wait();
		g_process=this.process.bind(this);
		
	},
	
	calc_my_new_rating: function(res)	{
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1) 
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (res===0) 
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (res===-1)
			return Math.round(my_data.rating + 16 * (0 - Ea));
	},
	
	calc_oppnent_new_rating: function(res)	{
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (res===1) 
			return Math.round(opp_data.rating + 16 * (1 - Ea));
		if (res===0) 
			return Math.round(opp_data.rating + 16 * (0.5 - Ea));
		if (res===-1) 
			return Math.round(opp_data.rating + 16 * (0 - Ea));
	},

	opponent_state_changed: function(s) {			
		if (s==="offline" || s==="online" || s===null)
			this.finish_game(12);
	},

	start_idle_wait: function() {
		

		if (objects.start_buttons_cont.ready===false || net_state===0)
			return;
				
		//показываем контейнер с ожиданием
		if (objects.search_opponent_window.visible===false)			
			anim.add_pos({obj:objects.search_opponent_window,param:'y',vis_on_end:true,func:'easeOutCubic',val:[-390, 	'sy'],	speed:0.02});
		
		//убираем контейнер с кнопками
		if (objects.start_buttons_cont.visible===true)
			anim.add_pos({obj:objects.start_buttons_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', M_HEIGHT],speed:0.02});


		//запускаем поиск через определенное время
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), 2+Math.floor(Math.random()*3000));
	},
	
	search_and_send_request: function() {
			
		if (this.state!=="idle") return;
			
		for (var player_id in players) {

			if (player_id!==my_data.uid && players[player_id]==="idle")	{			
				firebase.database().ref("inbox/"+player_id).set({sender:my_data.uid,message:"REQ",timestamp:Date.now(),data:"-"});	
				this.pending_player=player_id;
				this.wait_start=Date.now();
				this.state="wait_response";
				console.log("sent REQ to "+player_id);
				return;
			}
		}
		
		//если пользователей не нашли то через некоторое время запускаем новый поиск
		this.search_timeout_handler=setTimeout(this.search_and_send_request.bind(this), Math.floor(Math.random()*5000)+1000);
	},
		
	process_new_message: function(msg) {
					
		if (this.state==="idle") {		
		
			//в данном состоянии принимаем только запросы о новой игре
			if (msg.message==="REQ") {		
			
				//отправляем сообщение о начале игры
				firebase.database().ref("inbox/"+msg.sender).set({sender:my_data.uid,message:"OK",timestamp:Date.now(),data:0});	
				this.start_confirm_dialog(msg.sender, 2, 1);	
				this.start_normal_game();
			}			
		}
				
		//получение положительного ответа от игрока которому мы отправляли запрос и который уже создал игру
		if (this.state==="wait_response") {
			
			//принимаем только положительный ответ от соответствующего соперника и начинаем игру
			if (msg.message==="OK"  && this.pending_player===msg.sender)	 {
				this.start_confirm_dialog(msg.sender, 1, 1);				
				this.start_normal_game();
			}		
					
		}		
		
		//получение сообщение в состояни игры
		if (this.state==="playing") {
			
			//учитываем только сообщения от соперника
			if (msg.sender===opp_data.uid) {
				
				//получение отказа от игры
				if (msg.message==="REFUSE")
					this.opponent_confirm_play(false);
				
				//получение согласия на игру
				if (msg.message==="CONF")
					this.opponent_confirm_play(true);
				
				//получение стикера
				if (msg.message==="MSG")
					this.receive_sticker(msg.data);
				
				//получение сообщение с сдаче
				if (msg.message==="END" )
					this.finish_game(msg.data.board_state);	
				
				//получение сообщение с ходом игорка
				if (msg.message==="MOVE")
					this.receive_move(msg.data);
			}
		}
		
	},
	
	opponent_confirm_play: function(res) {
		
		if (res===false) {
			
			this.opponent_conf_play=0;	
			if (objects.confirm_cont.visible===true)
				anim.add_pos({obj:objects.confirm_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', -60],	speed:0.02});	
			
			add_big_message("Соперник отказался от игры");
			
			objects.close_big_message.pointerdown=function(){
				anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', -60],	speed:0.02});	
				episode_start.init();
			};

			objects.board_sprite.interactive=false;			
			
		} else {			
			
			this.opponent_conf_play=1;	
			
		}
	
	},
	
	start_confirm_dialog: function(sender_id, my_checker, who_move_first) {

		this.who_play_next=who_move_first;
		this.my_checkers=my_checker;

		//оппонент пока не подтвердил игру
		this.opponent_conf_play=0;

		//устанавливаем статус в базе данных
		this.state="playing";			
		firebase.database().ref("states/"+my_data.uid).set("playing");	
		
		//записываем id оппонента
		opp_data.uid=sender_id,
				
		//удаляем все таймеры
		clearTimeout(this.search_timeout_handler);		
		
		//убираем контейнер с окном ожидания
		anim.add_pos({obj:objects.search_opponent_window,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', 	M_HEIGHT],	speed:0.02});
		
		//добавляем окно соперника
		anim.add_pos({obj:objects.opponent_name_cont,param:'y',vis_on_end:true,func:'easeInCubic',val:[-200, 	'sy'],	speed:0.02});		
		
		//запрашиваем и показываем данные соперника
		this.show_opponent_data();
		
		//показываем окно подтверждения игры
		anim.add_pos({obj:objects.confirm_cont,param:'y',vis_on_end:true,func:'easeOutCubic',val:[-200, 	'sy'],	speed:0.02});	
		
	},
	
	start_normal_game: function() {
		
		//сообщение о цвете шашек
		var ch_col={1:"красные",2:"белые"};
		add_message("Цвет ваших шашек: "+ch_col[this.my_checkers]);
		
		

		
		//включаем нажатие на доску
		objects.board_sprite.interactive=true;
		objects.board_sprite.pointerdown=this.mouse_down_on_board.bind(this);
				
		//убираем сколько онлайн игроков
		objects.online_users_text.visible=false;
		
		//отображаем ход
		anim.add_pos({obj:objects.cur_move_cont,param:'y',vis_on_end:true,func:'easeOutCubic',val:[450, 	'sy'],	speed:0.02});
		
		//отображаем кнопки
		anim.add_pos({obj:objects.game_buttons_cont,param:'y',vis_on_end:true,func:'easeOutCubic',val:[450, 	'sy'],	speed:0.02});
		
		//отображаем чей ход
		anim.add_pos({obj:objects.whose_move_cont,param:'y',vis_on_end:true,func:'easeOutCubic',val:[-50, 	'sy'],	speed:0.02});
		
		//отключаем подписку на обновление пользователей
		firebase.database().ref("states").off();
		
		//добавляем подписку на состояние оппонента
		firebase.database().ref("states/"+opp_data.uid).on('value', (snapshot) => { this.opponent_state_changed(snapshot.val());});
		
		
		//отображаем доску
		objects.checkers.forEach((c)=>{	c.visible=true});
		g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		board_func.update_board();
		
		
		//записываем кто первый ходит
		if (this.who_play_next===this.my_checkers)
			this.who_play_next_text="Ваш ход";
		else
			this.who_play_next_text="Ход соперника";
		
		objects.text_4.text=this.who_play_next_text+" (30)";
		
		
		//очищаем таймаут		
		this.move_start_time=Date.now()+30000;
		this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);		
		
		
	},
		
	send_sticker: function(id) {
		
		if (objects.stickers_cont.ready===false)
			return;		

		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy',450],	speed:0.02});	

		
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


	},
		
	mouse_down_on_board(e) {
		
		
		if (this.state!=="playing")
			return;
				
		//проверяем что моя очередь
		if (this.who_play_next!==this.my_checkers) {
			add_message("не твоя очередь");			
			return;			
		}
		
		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;
		
		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board_sprite.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board_sprite.y-10)/400);
				
		
		//если выбрана новая шашка
		if (this.selected_checker===0)
		{		
			//находим шашку по координатам
			this.selected_checker=board_func.get_checker_by_pos(new_x,new_y);
						
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
				game_res.resources.move.sound.play();
				this.selected_checker=0;
				objects.selected_frame.visible=false;				
				return;
			}
			
			//получаем перечень доступных ходов для проверки
			
			let valid_moves=board_func.get_valid_moves(this.selected_checker.ix,this.selected_checker.iy);
			
			if (valid_moves[new_y][new_x]===1)
			{				
		
				//формируем объект содержащий информацию о ходе
				let m_data={x1:this.selected_checker.ix,y1:this.selected_checker.iy,x2:new_x, y2:new_y};
				
				//отправляем ход сопернику
				this.process_my_move(m_data);				
				
				//начинаем процесс плавного перемещения шашки				
				board_func.start_gentle_move(m_data,function(){});
					
			
				this.selected_checker=0;
				objects.selected_frame.visible=false;		
				this.who_play_next=3-this.who_play_next;				
				
			}
			else
			{
				add_message("сюда нельзя ходить");
			}		
		}		
	},
	
	process_my_move: function (move_data) {
		
		
		this.move++;
		
		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(g_board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=0;
		if (this.my_checkers===2) // если я супервайзер (шашки №2)
			board_state=board_func.get_board_state(new_board, this.move);
		
		//уведомление что нужно вывести шашки из дома
		if (this.move>24 && this.move<31 ) {
			if (any_home(new_board,this.my_checkers))
				add_message("После 30 ходов не должно остаться шашек в доме");
		}
		
			
		//отправляем ход с состоянием оппоненту
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",timestamp:Date.now(),data:{...move_data,board_state:board_state}});
		
		
		//проверяем не закончена ли игра
		if (board_state!==0)
			this.finish_game(board_state);		
				
		//проверяем первое действие после которого нельзя отказаться от игры
		if (this.me_conf_play===0) {
			this.me_conf_play=1;
			
			//убираем окно подтверждения игры
			if (objects.confirm_cont.ready===true && objects.confirm_cont.visible===true)	
				anim.add_pos({obj:objects.confirm_cont,param:'y',vis_on_end:false,func:'easeOutCubic',val:['sy', 450],	speed:0.02});		
		
		}
				
		//обновляем текущий ход		
		objects.cur_move_text.text="Сделано ходов: "+this.move;
		
		//обновляем таймер хода
		this.move_start_time=Date.now()+30000;
				
		//обозначаем кто ходит
		this.who_play_next_text="Ход соперника";
	},
		
	receive_move: function(move_data) {
		
		//воспроизводим уведомление о том что соперник произвел ход
		game_res.resources.receive_move.sound.play();
		
		//плавно перемещаем шашку
		board_func.start_gentle_move(move_data,function(){});
		
		//если игра заверщена то переходим
		if (move_data.board_state!==0)	{
			this.finish_game(move_data.board_state);			
			return;			
		}
		
		//перезапускаем таймер хода
		this.move_start_time=Date.now()+30000;
		
		//обозначаем кто ходит
		this.who_play_next=3-this.who_play_next;		
		this.who_play_next_text="Ваш ход";

	},
		
	receive_sticker: function(id) {

		//воспроизводим соответствующий звук
		game_res.resources.receive_sticker.sound.play();

		objects.sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
			
		anim.add_pos({obj:objects.sticker_area,param:'x',vis_on_end:true,func:'easeOutCubic',val:[800,'sx'],	speed:0.02});	
		
		//убираем стикер через 5 секунд
		if (objects.sticker_area.timer_id!==undefined)
			clearTimeout(objects.sticker_area.timer_id);		
		objects.sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.sticker_area,param:'x',vis_on_end:false,func:'easeInCubic',val:['sx',800],	speed:0.02});}, 5000);
	},
		
	show_stickers_panel: function() {
		
		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || this.state!=="playing" || this.me_conf_play===0)
			return;
		
		objects.stickers_cont.show();
		
		//анимационное появление панели стикеров
		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450,'sy'],	speed:0.02});	
	},
		
	send_sticker: function(id) {
		
		if (objects.stickers_cont.ready===false)
			return;		

		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', 450],	speed:0.02});	
			
		if (id!==-1){
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",timestamp:Date.now(),data:id});			
			add_message("Стикер отправлен сопернику");
			
			
			//показываем какой стикер мы отправили
			objects.my_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
			anim.add_pos({obj:objects.my_sticker_area,param:'x',vis_on_end:true,func:'easeOutCubic',val:[-170, 'sx'],	speed:0.02});	
			
			//убираем стикер через 5 секунд
			if (objects.my_sticker_area.timer_id!==undefined)
				clearTimeout(objects.my_sticker_area.timer_id);		

			
			objects.my_sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.my_sticker_area,param:'x',vis_on_end:false,func:'easeOutCubic',val:['sx',-170],	speed:0.02});}, 5000);
			
		}


	},
			
	finish_game: function(state) {
		
		if (this.state!=='playing')
			return;
		
		//отключаем подписку на обновление состояния оппонента
		firebase.database().ref("states/"+opp_data.uid).off();
		
		//подписываемся на изменения состояний пользователей
		//firebase.database().ref("states").on('value', (snapshot) => { this.players_list_updated(snapshot.val());});
		
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
				if (this.opponent_conf_play===1) {
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
				if (this.me_conf_play===1) {
					game_result_text="Вы проиграли!\nзакончилось время на ход!";
					game_result=-1;	
				} else {
					game_result_text="Вы не дали согласия на игру!";
					game_result=999;		
				}
			break;
			
			case 14:	
				if (this.opponent_conf_play===1) {
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
	
	
		//показыаем сообщение с результатом игры
		add_big_message(game_result_text);
		objects.close_big_message.pointerdown=function(){
			
			anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', -60],	speed:0.02});	
			episode_play.close_game();
		};
		
		opp_data.uid="";
		this.state="online";
		
		//если диалоги еще открыты
		objects.stickers_cont.visible=false;
		objects.confirm_cont.visible=false;
		
		
		
		//устанавливаем статус в базе данных
		firebase.database().ref("states/"+my_data.uid).set("online");	
		
	},
	
	close_game: function() {
		
		objects.whose_move_cont.visible=false;
		objects.opponent_name_cont.visible=false;
		objects.cur_move_cont.visible=false;
		objects.game_buttons_cont.visible=false;
		
		objects.checkers.forEach((c)=>{	c.visible=false});
		episode_start.init();
	},
	
	giveup: function(i) {
		
		if (objects.giveup_dialog.ready===false || objects.giveup_dialog.visible===false)
			return;
		
		//убираем диалог
		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy',450],	speed:0.02});	
		

		//если нажали кнопку отмена то выходим и ничего не отравляем и не завершаем игру
		if (i==false) return;
				
		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:10}});
		this.finish_game(11);
		
	},
	
	show_giveup_menu: function() {
		
		if (objects.giveup_dialog.ready===false || objects.giveup_dialog.visible===true || this.state!=="playing" || this.me_conf_play===0)
			return;

		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:true,func:'easeOutCubic',val:[450,'sy'],	speed:0.02});	
	},
	
	confirm_down: function(res) {
				
		if (objects.confirm_cont.ready===false)
			return;
		
		if (res===true) {			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"CONF"});
			this.me_conf_play=1;
			
		} else {			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"REFUSE"});				
			
			//устанавливаем локальный и удаленный статус
			this.state="online";
			firebase.database().ref("states/"+my_data.uid).set("online");
			
			
			add_big_message("Вы отказались от игры");
			objects.close_big_message.pointerdown=function(){
				
				anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', -60],	speed:0.02});	
				episode_start.init();
			};
			
		}
		
		//убираем окно подтверждения игры
		anim.add_pos({obj:objects.confirm_cont,param:'y',vis_on_end:false,func:'easeOutCubic',val:['sy', 450],	speed:0.02});	
	},
	
	show_opponent_data: function() {
				
		firebase.database().ref("players/"+opp_data.uid).once('value').then((snapshot) => {
			
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
			
			//Отображаем  имя и фамилию на табло и рейтинг
			let t=opp_data.first_name +" "+opp_data.last_name;
			objects.opponent_name_text.text=t.length > 15 ?  t.substring(0, 12) + "..." : t;				
			objects.opponent_rating_text.text=opp_data.rating;
			
		  }
		  
		});	
		
	},
	
	close_search_window_down: function() {
						
		if (objects.search_opponent_window.ready===false)
			return;
				
		game_res.resources.click.sound.play();
		
		//удаляем все таймеры
		clearTimeout(this.search_timeout_handler);
		
		//устанавливаем статус в базе данных
		this.state="online";			
		firebase.database().ref("states/"+my_data.uid).set("online");	
		
		//убираем контейнер с окном ожидания
		anim.add_pos({obj:objects.search_opponent_window,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy', 	M_HEIGHT],	speed:0.02});
		
		//показываем контейнер с кнопками
		anim.add_pos({obj:objects.start_buttons_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450, 	'sy'],	speed:0.02});
		
	},
	
	process: function() {
		
		objects.search_opponent_progress.rotation+=0.1;
		
		//если долго ждем ответа, то перезапускаем поиск соперника
		if (this.state==="wait_response")	{
			var wait_time=(Date.now()-this.wait_start)/1000;
			if(wait_time>4) {
				this.state="idle";
				this.start_idle_wait();				
			}

		}
		
		
		board_func.process_checker_move();
		
	},
	
	timer_tick: function() {
		
		var sec_left=Math.round((this.move_start_time-Date.now())/1000);
		objects.text_4.text=this.who_play_next_text+" ("+sec_left+")";
				
		if (sec_left<0 && this.who_play_next===this.my_checkers)	{			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:14}});
			this.finish_game(13);
			return;			
		}
		
		if (sec_left<-5) {
			if (this.who_play_next===(3-this.my_checkers))	{			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",timestamp:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:13}});
			this.finish_game(14);
			return;
			}
		}
				
		this.move_ticker=setTimeout(this.timer_tick.bind(this), 1000);
	}
	
}

function players_list_updated(_players) {
	
	players=_players;
	objects.online_users_text.text="Игроков онлайн: "+(Object.keys(_players).length+10);
	
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

function add_big_message(text) {		
	objects.big_message_text.text=text;
	objects.big_message_cont.visible=true;		
	anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-180, 	'sy'],	speed:0.02});
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

function init_game_env() {
	
	document.getElementById("m_bar").outerHTML = "";		
	document.getElementById("top_w").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";
	document.getElementById("m_button_win").outerHTML = "";
	
	//minimax_solver=new minimax_solver_class();
	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:true,backgroundColor : 0x000000});
	document.body.appendChild(app.view);

	resize();
	window.addEventListener("resize", resize);	

	//игра
	//game=new game_class();
	
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


	//загружаем данные игрока из яндекса или вконтакте
	/*
	 let env=window.location.href;
	 if (env.includes('vk.com')) {
		social_network='vk';
		load_vk();				 
	 }
	 
	 if (env.includes('yandex')) {
		social_network='yandex';
		load_yandex();	 			 
	 }
	 */
	 
	
	//показыаем основное меню
	episode_start.init();

	//запускаем главный цикл
	main_loop(); 

}

function load_resources() {
	
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
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, "stickers/"+i+".png");
		

	game_res.load(init_game_env);		
	game_res.onProgress.add(progress);
	
	function progress(loader, resource) {
		
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
}

function main_loop() {
		
	g_process();
	anim.process();
    app.render(app.stage);
	requestAnimationFrame(main_loop);
}




