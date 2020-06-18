
//0空間　1掘れる　2壁　3スタート　4ゴール　5行き止まり
function Maze(mapSizeX,mapSizeY){



    //console.log(mapSize);
    if(mapSizeX % 2 === 0){
        mapSizeX ++;
        //console.log(mapSizeX);
    }if(mapSizeY % 2 === 0){
        mapSizeY ++;
        //console.log(mapSizeY);
    }

    var mazeMap = new Array();
    var x;  //注目点
    var y;  //注目点

    // 準備
    for (x = 0; x < mapSizeX; x++) {
        mazeMap[x] = new Array();
        for (y = 0; y < mapSizeY; y++) {
            if (x == 0 || x == mapSizeX -1 || y == 0 || y == mapSizeY - 1) {
                mazeMap[x][y] = 2; // 壁
            } else {
                mazeMap[x][y] = 1; // 掘ることが可能な部分
            }
        }
    }


    //迷路作成
    var count = 0;    //掘った数
    var ableDig = ((mapSizeX-1)/2) * ((mapSizeY-1)/2);

    var firstX;
    var firstY;
    while(ableDig > count){
        x = Math.floor(Math.random()*((mapSizeX-1)/2))*2 + 1
        y = Math.floor(Math.random()*((mapSizeY-1)/2))*2 + 1
        if(count === 0){
            mazeMap[x][y] = 0;
            count++;
            firstX = x;
            firstY = y;
        }
        if(mazeMap[x][y] === 0){
            WallDig(x,y);
        }
    }

    if(mazeMap[firstX+1][firstY+1] + mazeMap[firstX+1][firstY-1] + mazeMap[firstX-1][firstY+1] + mazeMap[firstX-1][firstY-1] >= 6){
        mazeMap[firstX][firstY] = 5;
    }

    //スタート・ゴール作成
    while(1){
        x = Math.floor(Math.random()*((mapSizeX-1)/2))*2 + 1
        y = Math.floor(Math.random()*((mapSizeY-1)/2))*2 + 1
        if(mazeMap[x][y] === 5){
            mazeMap[x][y] = 3;
            break;
        }
    }

    while(1){
        x = Math.floor(Math.random()*((mapSizeX-1)/2))*2 + 1
        y = Math.floor(Math.random()*((mapSizeY-1)/2))*2 + 1
        if(mazeMap[x][y] === 5){
            mazeMap[x][y] = 4;
            break;
        }
    }


    var cv = document.getElementById("maze");
    var c = cv.getContext("2d");
    c.fillStyle = "rgb(119, 136, 153)";
    c.fillRect(0, 0, 660, 660);
    c.fillStyle = "rgb(0, 0, 0)";
    c.fillRect(30, 30, 10*mapSizeX-5, 10*mapSizeY-5);
    
    c.fillStyle = "rgb(255, 255, 255)";
    for (x = 0; x < mapSizeX; x++) {
        for (y = 0; y < mapSizeY; y++) {
            if(mazeMap[x][y] === 0 || mazeMap[x][y] === 5){    //掘られた0の部分を抜く //
                c.fillRect(30 + 10*x-5*(x%2), 30 + 10*y-5*(y%2), 5+10*(x%2), 5+10*(y%2));  
            }else if(mazeMap[x][y] === 3){
                c.fillRect(30 + 10*x-5, 30 + 10*y-5, 15, 15);  
                c.fillStyle = "rgb(0, 0, 255)";
                c.fillRect(30 + 10*x, 30 + 10*y, 5, 5);  
                c.fillStyle = "rgb(255, 255, 255)";
            }else if(mazeMap[x][y] === 4){
                c.fillRect(30 + 10*x-5, 30 + 10*y-5, 15, 15);  
                c.fillStyle = "rgb(255, 0, 0)";
                c.fillRect(30 + 10*x, 30 + 10*y, 5, 5);  
                c.fillStyle = "rgb(255, 255, 255)";
            }
        }
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


