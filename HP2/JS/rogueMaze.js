

function Maze(mapSizeX,mapSizeY,posX,posY){ //mapのタイルサイズxy,区画の数st

    var cv = document.getElementById("maze");
    var c = cv.getContext("2d");
    c.fillStyle = "rgb(119, 136, 153)";
    c.fillRect(0, 0, 660, 660);
     


    //区画範囲の修正
    if(mapSizeX % 2 === 0){
        mapSizeX ++;
    }if(mapSizeY % 2 === 0){
        mapSizeY ++;
    }


    //部屋の作成
    var mazeMap = new Array(mapSizeX);
    for (x = 0; x < mapSizeX; x++) {
        mazeMap[x] = new Array(mapSizeY);
    }
    //console.log(mazeMap.length + " " + mazeMap[0].length);
    var mazeMapAll = new Array(mapSizeX * posX);
    for (x = 0; x < mapSizeX * posX; x++) {
        mazeMapAll[x] = new Array(mapSizeY * posY);
    }

    for(var i = 0;i < posX;i++){
        for(var j = 0;j < posY;j++){
            var p = Math.floor(Math.random()*(mapSizeX-1)/3) + Math.floor((mapSizeX-1)/3) + 1;
            var q = Math.floor(Math.random()*(mapSizeY-1)/3) + Math.floor((mapSizeY-1)/3) + 1;
            makeRoom(mapSizeX,mapSizeY,mazeMap,p,q);
            //配列のコピー
            for(var s = 0;s < mapSizeX;s++){
                for(var t = 0;t < mapSizeY;t++){
                    //console.log((j*mapSizeY) + t);
                    mazeMapAll[i*mapSizeX + s][j*mapSizeY + t] = mazeMap[s][t]
                }
            }

        }
    }


    //道の作成
    makeload(mapSizeX,mapSizeY,posX,posY,mazeMapAll);


    //部屋の追加
    for(var i = 0;i < posX-1;i++){
        for(var j = 0;j < posY-1;j++){
            if(Math.floor(Math.random() * 10) >= 2){ //8割で、部屋の拡大なし。
                continue;
            }
            var p=0;
            var q=0;
            for(var s = 1;s < mapSizeX-1;s++){
                for(var t = 1;t < mapSizeY-1;t++){
                    if(mazeMapAll[i*mapSizeX + ((mapSizeX+1)/2) + s][j*mapSizeY + ((mapSizeY+1)/2) + t] === 0){
                        if(Math.abs(((mapSizeX+1)/2) - s) + Math.abs(((mapSizeY+1)/2) - t) < Math.abs(((mapSizeX+1)/2) - p) + Math.abs(((mapSizeY+1)/2) - q)){
                            p = s;
                            q = t;
                        }
                    }
                }
            }
            makeRoom(mapSizeX,mapSizeY,mazeMap,p,q);
            //配列のコピー
            for(var s = 0;s < mapSizeX;s++){
                for(var t = 0;t < mapSizeY;t++){
                    //console.log((j*mapSizeY) + t);
                    if(mazeMap[s][t] === 6){
                        mazeMapAll[i*mapSizeX + ((mapSizeX+1)/2) + s][j*mapSizeY + ((mapSizeY+1)/2) + t] = mazeMap[s][t];
                    }
                }
            }
        }
    }


    var massSize = 5;
    //描画
    var cv = document.getElementById("maze");
    var c = cv.getContext("2d");
    //c.fillRect(0, 0, 660, 660);
    //c.fillRect(30 + posX, 30 + posY, massSize * mapSizeX, massSize * mapSizeY);  
    c.fillStyle = "rgb(0, 0, 0)";
    //c.fillRect(30, 30, 10*mapSizeX, 10*mapSizeY);
    

    for (x = 0; x < mapSizeX*posX; x++) {
        for (y = 0; y < mapSizeY*posY; y++) {
            if(mazeMapAll[x][y] === 0 || mazeMapAll[x][y] === 5){    //掘られた0の部分を抜く //
                c.fillStyle = "rgb(255, 255, 255)";
                c.fillRect(15 + massSize*x, 15 + massSize*y, massSize, massSize);  
            }else if(mazeMapAll[x][y] === 3){
                c.fillStyle = "rgb(0, 0, 255)";
                c.fillRect(15 + massSize*x, 15 + massSize*y, massSize, massSize);  
            }else if(mazeMapAll[x][y] === 4){
                c.fillStyle = "rgb(255, 0, 0)";
                c.fillRect(15 + massSize*x, 15 + massSize*y, massSize, massSize);  
            }else if(mazeMapAll[x][y] === 6){
                c.fillStyle = "rgb(0, 255, 0)";
                c.fillRect(15 + massSize*x, 15 + massSize*y, massSize, massSize);  
            }else{  //  12  //0空間　1掘れる　2壁　3スタート　4ゴール　5行き止まり 6部屋
                c.fillStyle = "rgb(0, 0, 0)";
                c.fillRect(15 + massSize*x, 15 + massSize*y, massSize, massSize);  
            }
        }
    }

    

    return false;
}


//0空間　1掘れる　2壁　3スタート　4ゴール　5行き止まり 6部屋
function makeRoom(mapSizeX,mapSizeY,mazeMap,x,y){
    //var mazeMap = new Array();

    // 準備
    for (var i = 0; i < mapSizeX; i++) {
        mazeMap[i] = new Array();
        for (var j = 0; j < mapSizeY; j++) {
            if (i == 0 || i == mapSizeX -1 || j == 0 || j == mapSizeY - 1) {
                mazeMap[i][j] = 2; // 壁
            } else {
                mazeMap[i][j] = 1; // 掘ることが可能な部分
            }
        }
    }

    //部屋の作成
    if(true){                   //  普通の部屋を作成
    //if(1 <= Math.floor(Math.random()*10)){  //迷宮作成  //迷路の数
        mazeMap[x][y] = 6;
        makeRoom3(x,y);
    }else{                      //　確率で特殊部屋を作成する（迷路を作成）
        //迷路作成

        x = Math.floor(Math.random()*((mapSizeX-1)/2))*2 + 1
        y = Math.floor(Math.random()*((mapSizeY-1)/2))*2 + 1
        mazeMap[x][y] = 0;
        var count = 0;    //掘った数
        var ableDig = ((mapSizeX-1)/2) * ((mapSizeY-1)/2);
                
        while(ableDig > count){
            if(count === 0){
                mazeMap[x][y] = 0;
                count++;
            }
            if(mazeMap[x][y] === 0){
                WallDig(x,y);
            }
        }
    }
    

    function makeRoom3(s,t){
        var roomSize = Math.floor(Math.random()*(mapSizeX-2)*(mapSizeY-2)*2/5) + Math.floor((mapSizeX-2)*(mapSizeY-2)/24);
        makeRoom2(s,t,roomSize);
        return false;
    }

    function makeRoom2(s,t,roomSize){
        var roomSizeMove = new Array();
        roomSizeMove[0] = Math.round(roomSize * Math.random());
        roomSizeMove[2] = roomSize - roomSizeMove[0];
        roomSizeMove[1] = Math.round(roomSizeMove[0] * Math.random());
        roomSizeMove[0] = roomSizeMove[0] - roomSizeMove[1]
        roomSizeMove[3] = Math.round(roomSizeMove[2] * Math.random());
        roomSizeMove[2] = roomSizeMove[2] - roomSizeMove[3]
        //console.log(roomSize + " = " + roomSizeMove[0] + " " + roomSizeMove[1] + " " + roomSizeMove[2] + " " + roomSizeMove[3]);
        
        var vx = [0,1,0,-1];
        var vy = [-1,0,1,0];    //下・右・上・左
        //端っこですか？
        for(var rot = 0;rot < 4;rot++){
            if(roomSizeMove[rot] <= 0){
                continue;
            }else if((rot === 0 && t <= 1) || (rot === 1 && s+1 >= mapSizeX) || (rot === 2 && t+1 >= mapSizeY) || (rot === 3 && s <= 1)){   //  端っこ。
                makeRoom2(s,t,roomSizeMove[rot]);
            }else{
                if(mazeMap[s + vx[rot]][t + vy[rot]] === 1){
                    mazeMap[s + vx[rot]][t + vy[rot]] = 6;
                    makeRoom2(s + vx[rot],t + vy[rot],roomSizeMove[rot]-1);
                }else if(mazeMap[s + vx[rot]][t + vy[rot]] === 6){
                    mazeMap[s + vx[rot]][t + vy[rot]] = 6;
                    makeRoom2(s + vx[rot],t + vy[rot],roomSizeMove[rot]);
                }
            }
        }
        return false;
    }


    function WallDig(s,t){
        var searchError = 0;
        var vx = [0,2,0,-2];
        var vy = [-2,0,2,0];    //下・右・上・左
        var search = new Array(0,1,2,3);
        search.sort(
            function() {
                return Math.random() - 0.5;
            }
        );

        var rot = 0;
        for(var i = 0;i < 4; i++){
            rot = search[i];
            //端っこですか？
            if((rot === 0 && t <= 1) || (rot === 1 && s+2 >= mapSizeX) || (rot === 2 && t+2 >= mapSizeY) || (rot === 3 && s <= 1)){
                searchError++;
                continue;
            }

            //端でないなら次にいけますか？
            //console.log(s2 + " " + t2);
            if(mazeMap[s + vx[rot]][t + vy[rot]] === 1){
                mazeMap[s + vx[rot]][t + vy[rot]] = 0;
                mazeMap[s + vx[rot]/2][t + vy[rot]/2] = 0;
                count++;
                WallDig(s + vx[rot],t + vy[rot]);
            }else{
                searchError++;
            }
        }
        if(searchError >= 4){
            mazeMap[s][t] = 5;
        }
    }
}

//mapのタイルサイズxy,区画の数st,全体マップ //部屋同士で迷路を作るわけではない
function makeload(mapSizeX,mapSizeY,posX,posY,mazeMapAll){
    //部屋がつながってるかどうか確かめるMapを作成   //0でまだ通ってない　1でとおってる

    var count = 0;    //掘った数
    var ableDig = posX * posY;

    var loadMap = new Array(posX);
    for(var i = 0;i < posX;i++){
        loadMap[i] = new Array(posY);
        for(var j = 0;j < posY;j++){
            loadMap[i][j] = posX * posY;
        }
    }
    var x;  //注目点
    var y;  //注目点
    var typeRoom = 1;

    //とりま木構造を作る
    while(ableDig > count){
        x = Math.floor(Math.random()*posX);
        y = Math.floor(Math.random()*posY);
        if(loadMap[x][y] === posX * posY){
            count = makeload2(x,y,count,loadMap,posX,posY,mapSizeX,mapSizeY,mazeMapAll,typeRoom);
            typeRoom++;
        }
        //console.log(count);
        //console.log(typeRoom);
    }

    //ランダムに道を追加。
    count = 0;
    ableDig = posX * posY / 3;
    for(var i = 0;i < posX;i++){
        for(var j = 0;j < posY;j++){
            loadMap[i][j] = posX * posY;
        }
    }
    typeRoom = 1;
    while(ableDig > count){
        x = Math.floor(Math.random()*posX);
        y = Math.floor(Math.random()*posY);
        if(loadMap[x][y] === posX * posY){
            count = makeload2(x,y,count,loadMap,posX,posY,mapSizeX,mapSizeY,mazeMapAll,typeRoom);
            typeRoom++;
        }
        //console.log(count);
        //console.log(typeRoom);
    }
    
}


//注目点xy,つながった部屋数,へやのつながりMap,区画の数st,mapのタイルサイズxy,全体マップ
function makeload2(x,y,count,loadMap,posX,posY,mapSizeX,mapSizeY,mazeMapAll,typeRoom){
    var vx = [0,1,0,-1];
    var vy = [-1,0,1,0];    //下・右・上・左
    loadMap[x][y] = typeRoom;
    count ++;
    //console.log((x) +" "+(y) +" "+(count));

    var search = new Array(0,1,2,3);
    search.sort(
        function() {
            return Math.random() - 0.5;
        }
    );

    var rot;
    for(var i = 0;i<4;i++){
        rot = search[i];
        //端っこですか？
        if((rot === 0 && y <= 0) || (rot === 1 && x+1 >= posX) || (rot === 2 && y+1 >= posY) || (rot === 3 && x <= 0)){
            continue;
        }else if(loadMap[x+vx[rot]][y+vy[rot]] === typeRoom){
            continue;
        }
        //はしでないならつなげる
        connectLoad(rot,mapSizeX,mapSizeY,mazeMapAll,vx,vy,x,y);

        //まだ掘ってなかった？
        if(loadMap[x+vx[rot]][y+vy[rot]] === posX * posY){
            count = makeload2(x+vx[rot],y+vy[rot],count,loadMap,posX,posY,mapSizeX,mapSizeY,mazeMapAll,typeRoom);
        }
    }
    return count;
}

function connectLoad(rot,mapSizeX,mapSizeY,mazeMapAll,vx,vy,x,y){
    //つなげる
    var s = new Array(2);
    var t = new Array(2);
    for(var j = 0;j < 2;j++){
        var rot2 = (rot + 2*j)%4;
        while(1){
            s[j] = Math.floor(Math.random()*mapSizeX) + ((x+vx[rot]*j)*mapSizeX);
            t[j] = Math.floor(Math.random()*mapSizeY) + ((y+vy[rot]*j)*mapSizeY);
            //console.log(s1 +" "+t1+" "+mazeMapAll[s1][t1]);
            if(mazeMapAll[s[j]][t[j]] === 6){
                var m = s[j];
                var n = t[j];
                //出入り口の発見
                while((x+vx[rot]*j)*mapSizeX <= m && m < ((x+vx[rot]*j)+1)*mapSizeX && (y+vy[rot]*j)*mapSizeY <= n && n < ((y+vy[rot]*j)+1)*mapSizeY){
                    m += vx[rot2];
                    n += vy[rot2];
                    if((mazeMapAll[m][n] === 6) || (mazeMapAll[m + vx[(rot2+1)%4]][n + vy[(rot2+1)%4]] === 6) || (mazeMapAll[m + vx[(rot2+3)%4]][n + vy[(rot2+3)%4]] === 6)){
                        s[j] = m;
                        t[j] = n;
                    }
                }
                //console.log(m +" "+n);
                while((x+vx[rot]*j)*mapSizeX <= s[j] && s[j] < ((x+vx[rot]*j)+1)*mapSizeX && (y+vy[rot]*j)*mapSizeY <= t[j] && t[j] < ((y+vy[rot]*j)+1)*mapSizeY){
                    mazeMapAll[s[j]][t[j]] = 0;
                    s[j] += vx[rot2];
                    t[j] += vy[rot2];
                }
                s[j] -= vx[rot2];
                t[j] -= vy[rot2];
                break;
            }
        }
    }
    //通路同士を連結する。
    while(1){
        mazeMapAll[s[0]][t[0]] = 0;
        if(s[0] < s[1]){
            s[0]++;
        }else if(s[0] > s[1]){
            s[0]--;
        }else if(t[0] < t[1]){
            t[0]++;
        }else if(t[0] > t[1]){
            t[0]--;
        }else{
            break;
        }
    }
}




