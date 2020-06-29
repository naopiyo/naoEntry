
var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var FPS = 24;         //更新のはやさ
var BOID_SIZE = 100;    //群れの大きさ
var MAX_SPEED = 6;   //鳥一匹の最大速度
var BIRD_SIZE = 4;    //鳥の大きさ
var BOID_PX = BIRD_SIZE * 5;    //鳥の避ける距離

var COHESION_WEIGHT = 0.4;    //凝集の強さ
var SEPARATION_WEIGHT = 1; //分離の強さ
var ALIGNMENT_WEIGHT = 0.5;  //周りに従う強さ

class BIRD{
    constructor(x,y,dx,dy,ddx,ddy,color){
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.ddx = ddx
        this.ddy = ddy
        this.color = color
        let buff = 0.3;
        this.maxSpeed = (MAX_SPEED * (Math.random()*buff + (1 - buff)))
    }
    upDatePos(ddx,ddy){
        //加速度を更新
        this.ddx = ddx
        this.ddy = ddy
        //更新する速度を計算
        if(Math.pow(this.dx + this.ddx,2) + Math.pow(this.dy + this.ddy,2) > Math.pow(this.maxSpeed,2)){
            var buff = this.maxSpeed / Math.sqrt(Math.pow(this.dx + this.ddx,2) + Math.pow(this.dy + this.ddy,2))
            this.dx = (this.dx + this.ddx) * buff
            this.dy = (this.dy + this.ddy) * buff
        }else{
            this.dx += this.ddx;
            this.dy += this.ddy;
        }
        
        if(this.x + this.dx < 0){
            this.dx = Math.abs(this.dx)
        }else if(canvas.width < this.x + this.dx){
            this.dx = -Math.abs(this.dx)
        }
        this.x += this.dx

        if(this.y + this.dy < 0){
            this.dy = Math.abs(this.dy)
        }else if(canvas.height < this.y + this.dy){
            this.dy = -Math.abs(this.dy)
        }
        this.y += this.dy
    }

    calcDistance(s,t){
        return Math.sqrt(Math.pow(Math.abs(s-this.x),2) + Math.pow(Math.abs(t-this.y),2));
    }
}

class BOID {
    constructor(boidSize){
        //鳥の位置と色をランダムに取得
        this.boidSize = boidSize
        this.birds = []
        for(let i = 0;i < this.boidSize;i++){
            //var AA = [2,2]
            //AA.push(2)
            //console.log(AA)
            
            this.birds.push(new BIRD(   Math.floor(Math.random() * (canvas.width + 1))      //x
                                        ,Math.floor(Math.random() * (canvas.height + 1))    //y
                                        ,Math.floor(Math.random()*11 - 5)                   //dx
                                        ,Math.floor(Math.random()*11 - 5)                   //dy
                                        ,Math.floor(Math.random()*11 - 5)                   //ddx
                                        ,Math.floor(Math.random()*11 - 5)                   //ddy
                                        ,"rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256)  + ")"))
                                        //console.log(this.birds[i])
        }
    }
}


class TRUEBOID extends BOID{
    drawBoid(s,t){
        //描画コンテキストの取得
        //var context = canvas.getContext('2d');
        this.upDateBirdsPos(s,t)
        //console.log(this.birds[0])
        this.drawBirds()
    }

    upDateBirdsPos(s,t){
        for(let i = 0;i < this.boidSize;i++){
            //let buff = this.cohesion(i)
            let buff = [0,0];
            
            buff = this.sumMat(buff,this.multiMat(this.cohesion(i),COHESION_WEIGHT))
            buff = this.sumMat(buff,this.multiMat(this.separation(i),SEPARATION_WEIGHT))
            buff = this.sumMat(buff,this.multiMat(this.alignment(i),ALIGNMENT_WEIGHT))
            buff = this.sumMat(buff,this.multiMat(this.evasionWall(i),1))
            buff = this.sumMat(buff,this.multiMat(this.evasionPlayer(i,s,t),1))

            this.birds[i].upDatePos(buff[0],buff[1])
        }
        //console.log(this.cohesion(0))
        //console.log(this.evasionWall(0))
        /*
        console.log(this.cohesion(0))
        console.log(this.separation(0))
        console.log(this.alignment(0))
        console.log(this.multiMat(this.cohesion(0),COHESION_WEIGHT))
        console.log(this.multiMat(this.separation(0),SEPARATION_WEIGHT))
        console.log(this.multiMat(this.alignment(0),ALIGNMENT_WEIGHT))
        */
    }

    multiMat(A,B){
        let C = [];
        for(let i =0;i < A.length;i++){
            C.push(A[i] * B);
        }
        return C;       
    }

    sumMat(A,B){
        let C = [];
        if(A.length != B.length){
            return [0,0]
        }
        for(let i =0;i < A.length;i++){
            C.push(A[i] + B[i]);
        }
        return C;
    }

    drawBirds(){
        //console.log(this.birds.length)
        for(let i = 0;i < this.boidSize;i++){
            ctx.fillStyle = this.birds[i].color;
            //円（塗りつぶし）
            ctx.beginPath();
            ctx.arc(this.birds[i].x, this.birds[i].y, BIRD_SIZE, 0, Math.PI*2, false);
            ctx.fill();
        }
    }

    //壁への忌避
    evasionWall(index){
        let wall = []
        for(let i = 0;i < canvas.width;i += canvas.width/50){
            wall.push([i,0]);
            wall.push([i,canvas.height]);
        }
        for(let j = 0;j < canvas.height;j += canvas.height/50){
            wall.push([0,j]);
            wall.push([canvas.width,j]);
        }
        return this.evasion(index,wall);
    }

    //Playerへの忌避
    evasionPlayer(index,s,t){
        let distance = this.birds[index].calcDistance(s,t);
        let vectorA = {x:(this.birds[index].x - s) , y:(this.birds[index].y - t)};
        if(distance < BOID_PX * 5){
            return [vectorA.x,vectorA.y]
        }
        return [0,0]
    }

    //忌避
    evasion(index,A){
        //console.log("aaaaaa")
        //近接する忌避点Aの場所から測る．
        let buff = {x:0,y:0}
        for(let i = 0;i < A.length;i++){
            let distance = this.birds[index].calcDistance(A[i][0],A[i][1]);
            //近い忌避点に対して離れる方向に加速する
            if(distance < BOID_PX * 2){
                let vectorA = {x:A[i][0] - this.birds[index].x , y:A[i][1] - this.birds[index].y};
                if(Math.abs(vectorA.x) < BIRD_SIZE){
                    if(Math.random() < 0.5){
                        buff.x -= BOID_PX / BIRD_SIZE;
                    }else{
                        buff.x -= -BOID_PX / BIRD_SIZE;
                    }
                }else{
                    buff.x -= vectorA.x;
                }
                
                if(Math.abs(vectorA.y) < BIRD_SIZE){
                    if(Math.random() < 0.5){
                        buff.y -= BOID_PX / BIRD_SIZE;
                    }else{
                        buff.y -= -BOID_PX / BIRD_SIZE;
                    }
                }else{
                    buff.y -= vectorA.y;
                }
                //console.log(buff)
            }
        }
        
        
        /*
        if(index === 0 && buff.x != 0){
            console.log("aaaaaaaaaa")
            console.log(buff.x)
            console.log(Math.abs(buff.x))
            console.log(Math.pow(Math.abs(buff.x),2))
            console.log(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2))
            console.log(Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2)))
        }*/
        if(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2) > 0){
            let bunbo = Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2))
            buff.x /= bunbo;
            buff.y /= bunbo;
        }
        /*
        if(index === 0 && buff.x != 0){
            console.log(buff)
            console.log(Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2)))
        }
        */
        
        return [buff.x ,   buff.y];
    }

    //凝集
    cohesion(index){
        let center = {x:0,y:0}
        let count = 0;
        //群れの中心地を割り出す．
        for(let i =0;i < this.boidSize;i++){
            if(i === index){
                continue;
            }
            let distance = this.birds[index].calcDistance(this.birds[i].x,this.birds[i].y);
            //近い鳥に対して
            if(distance < BOID_PX * 5){
                center.x += this.birds[i].x;
                center.y += this.birds[i].y;
                count++;
            }
        }
        if(count === 0){
            return [0,0];
        }
        //群れの中心に向かう加速度を与える
        center.x = (center.x / count) - this.birds[index].x;
        center.y = (center.y / count) - this.birds[index].y;
        
        if(Math.pow(Math.abs(center.x),2) + Math.pow(Math.abs(center.y),2) > 0){
            let bunbo = Math.sqrt(Math.pow(Math.abs(center.x),2) + Math.pow(Math.abs(center.y),2))
            center.x /= bunbo;
            center.y /= bunbo;
        }
        return [center.x ,   center.y];
    }
    //分離
    separation(index){
        //console.log("aaaaaa")
        //近接する鳥の位置を割り出す．
        let buff = {x:0,y:0}
        for(let i = 0;i < this.boidSize;i++){
            if(i === index){
                continue;
            }
            let distance = this.birds[index].calcDistance(this.birds[i].x,this.birds[i].y);
            //近い鳥に対して離れる方向に加速する
            if(distance < BOID_PX){
                let vectorA = {x:this.birds[i].x - this.birds[index].x , y:this.birds[i].y - this.birds[index].y};
                if(Math.abs(vectorA.x) < BIRD_SIZE){
                    if(Math.random() < 0.5){
                        buff.x -= BOID_PX / BIRD_SIZE;
                    }else{
                        buff.x -= -BOID_PX / BIRD_SIZE;
                    }
                }else{
                    buff.x -= vectorA.x;
                }
                
                if(Math.abs(vectorA.y) < BIRD_SIZE){
                    if(Math.random() < 0.5){
                        buff.y -= BOID_PX / BIRD_SIZE;
                    }else{
                        buff.y -= -BOID_PX / BIRD_SIZE;
                    }
                }else{
                    buff.y -= vectorA.y;
                }
                //console.log(buff)
            }
        }
        
        
        /*
        if(index === 0 && buff.x != 0){
            console.log("aaaaaaaaaa")
            console.log(buff.x)
            console.log(Math.abs(buff.x))
            console.log(Math.pow(Math.abs(buff.x),2))
            console.log(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2))
            console.log(Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2)))
        }*/
        if(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2) > 0){
            let bunbo = Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2))
            buff.x /= bunbo;
            buff.y /= bunbo;
        }
        /*
        if(index === 0 && buff.x != 0){
            console.log(buff)
            console.log(Math.sqrt(Math.pow(Math.abs(buff.x),2) + Math.pow(Math.abs(buff.y),2)))
        }
        */
        
        return [buff.x ,   buff.y];
    }
    //整列
    alignment(index){
        let avarage = {dx:0,dy:0};
        for(let i = 0;i < this.boidSize;i++){
            if(i === 0){
                continue;
            }
            let distance = this.birds[index].calcDistance(this.birds[i].x,this.birds[i].y);
            //近い鳥に対して
            if(distance < BOID_PX){
                avarage.dx += this.birds[i].dx;
                avarage.dy += this.birds[i].dy;
            }
        }
        avarage.dx /= this.boidSize - 1;
        avarage.dy /= this.boidSize - 1;
        if(Math.pow(avarage.dx,2) + Math.pow(avarage.dy,2) > 0){
            let bunbo = Math.sqrt(Math.pow(avarage.dx,2) + Math.pow(avarage.dy,2))
            avarage.dx /= bunbo;
            avarage.dy /= bunbo;
        }
        return [avarage.dx ,   avarage.dy];
    }
}

function upDateData(A,B,C){
    COHESION_WEIGHT = A;    //凝集の強さ
    SEPARATION_WEIGHT = B; //分離の強さ
    ALIGNMENT_WEIGHT = C;  //周りに従う強さ
}

class PLAYER{
    constructor(x,y,color){
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.ddx = 0
        this.ddy = 0
        this.a = {ddx:0,ddy:0}
        this.color = color
        this.maxSpeed = MAX_SPEED * 1.5
    }
    upDatea(){
        this.ddx = this.a.ddx
        this.ddy = this.a.ddy
        //console.log(this.a)
    }
    upDatePos(){
        //加速度を更新
        //更新する速度を計算
        if(Math.pow(this.dx + this.ddx,2) + Math.pow(this.dy + this.ddy,2) > Math.pow(this.maxSpeed,2)){
            var buff = this.maxSpeed / Math.sqrt(Math.pow(this.dx + this.ddx,2) + Math.pow(this.dy + this.ddy,2))
            this.dx = (this.dx + this.ddx) * buff
            this.dy = (this.dy + this.ddy) * buff
        }else{
            this.dx += this.ddx;
            this.dy += this.ddy;
        }
        
        if(this.x + this.dx < 0){
            this.dx = Math.abs(this.dx)
            this.ddx = 0
        }else if(canvas.width < this.x + this.dx){
            this.dx = -Math.abs(this.dx)
            this.ddx = 0
        }
        this.x += this.dx

        if(this.y + this.dy < 0){
            this.dy = Math.abs(this.dy)
            this.ddy = 0
        }else if(canvas.height < this.y + this.dy){
            this.dy = -Math.abs(this.dy)
            this.ddy = 0
        }
        this.y += this.dy
    }
    drawPlayer(){
        this.upDatePos()
        ctx.fillStyle = this.color;
        //円（塗りつぶし）
        ctx.beginPath();
        ctx.arc(this.x, this.y, BIRD_SIZE*2, 0, Math.PI*2, false);
        ctx.fill();
    }
}

function draw() {  //全体の描画
    addEventListener("keydown", this.keydownfunc, false);//キーイベント（押す）
    addEventListener("keyup", this.keyupfunc, false);//キーイベント（離す）
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //描画のリセット
    boid.drawBoid(player.x,player.y)     //鳥の群れの描画
    player.drawPlayer() //人を描画
}
function keydownfunc(event) {
    var key_code = event.keyCode;
    //console.log(key_code);
    if( key_code === 65 ) player.a.ddx = -1;    //左
    if( key_code === 87 ) player.a.ddy = -1;    //上
    if( key_code === 68 ) player.a.ddx = 1;     //右
    if( key_code === 83 ) player.a.ddy = 1;     //下
    player.upDatea()
}
function keyupfunc(event) {
    var key_code = event.keyCode;
    if( key_code === 65 ) player.a.ddx = 0;     //左
    if( key_code === 87 ) player.a.ddy = 0;     //上
    if( key_code === 68 ) player.a.ddx = 0;     //右
    if( key_code === 83 ) player.a.ddy = 0;     //下
    player.upDatea()
}

var player = new PLAYER(canvas.width / 2,canvas.height / 2,"#df0a2a")
var boid = new TRUEBOID(BOID_SIZE)

var interval = setInterval(draw, 1000/FPS);


