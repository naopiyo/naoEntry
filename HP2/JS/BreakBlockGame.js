var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");




var ballRadius = 10;    //ボールの半径
var x = canvas.width/2;     //ボールの最初の座標
var y = canvas.height-30;

var paddleHeight = 10;  //跳ね返り版の大きさ
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//Playerの操作キー
var rightPressed = false;
var leftPressed = false;

var dx = 2; //ボールの動く速さ
var dy = -2;

//ブロック
var blockRowCount = 3;  //ブロックの行
var blockColumnCount = 7;  //ブロックの列
var blockWidth = 75;  //ブロックの幅
var blockHeight = 20;  //ブロックの高さ
var blockPadding = 10;  //ブロックの隙間
var blockOffsetTop = 30;  //ブロックの描画範囲の上端
var blockOffsetLeft = 35;  //ブロックの描画範囲の左の端
//ブロックの行列
var blocks = [];
for(var c=0; c<blockColumnCount; c++) {
    blocks[c] = [];
    for(var r=0; r<blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function draw() {  //全体の描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //描画のリセット
    drawBall(); //ボールの描画
    drawPaddle();   //Playerの表示
    drawblocks();   //ブロックの表示
    collisionDetection();   //衝突判定

    //ボールの弾み
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius*3) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            if(rightPressed && dx < 4){
                dx += 1;
            }else if(leftPressed && dx > -4){
                dx -= 1;
            }
        }else if(y > canvas.height) {
            alert("GAME OVER");
            document.location.reload();
        }
    }



    x += dx;    //ボールの移動
    y += dy;

    //Playerの移動
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

//キーイベント発生
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//ボールの描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);    //座標中心/半径/開始角度/終わり角度
    ctx.fillStyle = "#DC143C";
    ctx.fill();
    ctx.closePath();
}

//跳ね返り版の描画
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight*2, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FF8C00";
    ctx.fill();
    ctx.closePath();
}

//ブロックの描画
function drawblocks() {
    for(var c=0; c<blockColumnCount; c++) {
        for(var r=0; r<blockRowCount; r++) {
            if(blocks[c][r].status == 1) {
                var blockX = (c*(blockWidth+blockPadding))+blockOffsetLeft;
                var blockY = (r*(blockHeight+blockPadding))+blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);      //ブロック中心/幅/高さ
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//衝突判定
function collisionDetection() {
    for(var c=0; c<blockColumnCount; c++) {
        for(var r=0; r<blockRowCount; r++) {
            var b = blocks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+blockWidth && y > b.y && y < b.y+blockHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}


//キーイベントの応答
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

var interval = setInterval(draw, 10);


