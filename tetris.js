//定数関係

//ステージ
var Block_Size = 24; //1ブロックのサイズ
var Block_Raws = 22; //ステージの高さ
var Block_Cols = 12; //ステージの幅
var Screen_Width = Block_Size * Block_Cols;
var Screen_Height = Block_Size * Block_Raws;

//ゲーム状態
var Game = 1;
var GameOver = 0;
var Effect = 3;

//テトリスミノの状態
var Non_Block = 0;
var Nomal_Block = 1;
var Lock_Block = 2;
var CLEAR_BLOCK = 3;	// 消去するブロック（1ライン揃ったとき）
var WALL = 9;			// 壁
// エフェクト
var EFFECT_ANIMATION = 2;	// エフェクト時のちかちかする回数
// 色
var BACK_COLOR = "#ddd";			// 背景色
var GAMEOVER_COLOR = "#fff";			// ゲームオーバー時のブロックの色
var BLOCK_COLOR = "#000";			// 操作ブロックの色
var LOCK_COLOR = "#333";			// ロックしたブロックの色
var WALL_COLOR = "#666";			// 壁の色
var ERROR_COLOR = "#f00";			// エラーブロックの色
var EFFECT_COLOR1 = "#fff";			// エフェクト時の色1
var EFFECT_COLOR2 = "#000";			// エフェクト時の色2
// ゲーム要素
var NEXTLEVEL = 10;					// 次のレベルまでの消去ライン数

/*
 * グローバル変数
 */
var canvas = null;						// キャンバス取得
var g = null;							// コンテキスト取得
var stage = new Array(BLOCK_COLS);	// ゲームのステージ枠（壁の情報のみ、変化しない）
var field = new Array(BLOCK_COLS);		// ゲーム中のステージ枠とブロック表示用（変化する）
var bs;								// ブロックサイズ
var speed;							// 落下速度
var frame;							// ゲームフレーム番号
var block = new Array();				// 落ちてくるブロックの種類（７種類）
var oBlock = new Array();				// 操作中のブロック
var blockType;						// ブロックの種類番号
var x, y;								// ブロックの現在位置
var sx, sy;							// ブロックの元位置
var mode;							// ゲームの状態  GAME/GAMEOVER/EFFECT
var timer1;							// ゲームループ用のタイマー
var FPS;								// 描画書き換え速度
var clearLine;							// 消去したライン数
// エフェクト時（色の反転/エフェクトスピード/エフェクト回数）
var effectState = {flipFlop: 0, speed: 0, count: 0};

/*
	初期化
*/
function init(){
	clearTimeout(timer1);
	FPS = 60;
	clearLine = 0;
	//キャンバスの設定
	canvas = document.getElementById("canvas");
	canvas.width = Screen_Width;
	canvas.height = Screen_Height;
	g = canvas.getContext("2d");
	effectState.flipFlop = 0;
	effectState.speed = 4;
	effectState.count = 0;
	bs = Block_Size;
	
	block = [[  [0, 0, 0, 0],
			 	[0, 1, 1, 0],
			 	[0, 1, 1, 0],
			 	[0, 0, 0, 0]],
			
			[	[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0]],
			
			[	[0, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 0]],
			 
			[	[0, 0, 1, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 0]],
			
			[	[0, 0, 0, 0],
				[0, 1, 0, 0],
				[1, 1, 1, 0]
				[0, 0, 0, 0]]
			];
	
	stage = [
			  [0 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 0],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
		      [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [9 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 9],
			  [0 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 0]];
	
}
	function setStage(){
		for(var i = 0; i < Block_Raws; i++){
			field[i] = [0 ,0, 0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 0];
		}
		
		oBlock = [	[0, 0, 0, 0],
				 	[0, 0, 0, 0],
				 	[0, 0, 0, 0],
				 	[0, 0, 0, 0]
				 ];
		for(i = 0; i < Block_Raws; i++){
			for(j = 0; j < Block_Cols; j++){
				field[i][j] = stage[i][j];
			}
		}
}

//ゲームの開始処理
function newGeme(){
	setStage();
	mode = Game;
	frame = 1;
	speed = 30;
	clearTimeout(timer1);
	cleateBlock();
	mainLoop();
}

//新しいブロックを作成
function cleateBlock(){
	if(mode == Effect) return;
	x = sx = Math.floor(Block_Cols / 3);
	y = sy = 0;
	blockType = Math.floor(Math.random() * 7);
	
	for(i = 0; i < 4; i++){
		for(j = 0; j < 4; j++){
			oBlock[i][j] = block[blockType][i][j];
		}
	}
	
	if(hitCheck()){
		mode = GameOver;
		console.log("GAMEOVER!");
	}
	putBlock();
}

function lockBlock(){
	if(mode == Effect) 
		return;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(oBlock[i][j])
				field[i+y][j+x] = Lock_Block;
		}
	}
}


function putBlock(){
	if(mode == Effect) 
		return;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(oBlock[i][j])
				field[i+y][j+x] = oBlock[i][j];
		}
	}
}

function clearBlock(){
	if(mode == Effect) 
		return;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(oBlock[i][j])
				field[i+y][j+x] = Non_Block;
		}
	}
}