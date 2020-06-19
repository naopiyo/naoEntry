
function doML(){
    var data = [];
    const CENTERPOS = [330,330];
    var SampleDataLen = 1000;
    var Ans = [];           //答え
    var p;          //pの数値
    var lineSet = [];       //これまで出した答えの線
    let searchCount;

    //pを更新するほう
    setStart();
    setLine(Ans);
    makeData();
    gameStart();
    display();

    //p=0.5
    setStart2(0.00001);
    gameStart2();
    display2("Fig0.5");

    //p=1.0
    setStart2(0.001);
    gameStart2();
    display2("Fig1.0");

    //p=1.5
    setStart2(0.1);
    gameStart2();
    //console.log(p);
    display2("Fig1.5");


    displayDataValue();//サンプルデータを数値で表示する．


    function gameStart(){
        let count = 0,pivot = 0,lineNext = lineSet.length;//何回あってたか，今見てるdata,linesetの次に書き込む場所

        while(count < SampleDataLen){
            searchCount ++;
            count ++;
            //console.log(lineNext);
            if(calcDistance(data[pivot],lineSet[lineNext - 1]) >= 0 && data[pivot][2] == false){
                p = calcDistance(data[pivot],lineSet[lineNext - 1]) / ( Math.pow(data[pivot][0], 2) + Math.pow(data[pivot][1], 2) );
                p *= 1.01;//ぴったりだとtrueだから．
                lineSet[lineNext] = [lineSet[lineNext-1][0] - p*data[pivot][0]
                                        , lineSet[lineNext-1][1] - p*data[pivot][1]
                                        ,lineSet[lineNext-1][2]]
                lineNext ++;
                //p = 0.5;
                count = 0;
            }else if(calcDistance(data[pivot],lineSet[lineNext - 1]) < 0 && data[pivot][2] == true){
                p = - calcDistance(data[pivot],lineSet[lineNext - 1]) / ( Math.pow(data[pivot][0], 2) + Math.pow(data[pivot][1], 2) );
                lineSet[lineNext] = [lineSet[lineNext-1][0] + p*data[pivot][0]
                                        , lineSet[lineNext-1][1] + p*data[pivot][1]
                                        ,lineSet[lineNext-1][2]]
                lineNext ++;
                //p *= 0.5;
                count = 0;
            }
            pivot = (pivot + 1) % SampleDataLen;
        }
    }

    function gameStart2(){
        let count = 0,pivot = 0,lineNext = lineSet.length;//何回あってたか，今見てるdata,linesetの次に書き込む場所

        while(count < SampleDataLen){
            searchCount ++;
            count ++;
            //console.log(lineNext);
            if(calcDistance(data[pivot],lineSet[lineNext - 1]) >= 0 && data[pivot][2] == false){
                lineSet[lineNext] = [lineSet[lineNext-1][0] - p*data[pivot][0]
                                        , lineSet[lineNext-1][1] - p*data[pivot][1]
                                        ,lineSet[lineNext-1][2]]
                lineNext ++;
                //p = 0.5;
                count = 0;
            }else if(calcDistance(data[pivot],lineSet[lineNext - 1]) < 0 && data[pivot][2] == true){
                lineSet[lineNext] = [lineSet[lineNext-1][0] + p*data[pivot][0]
                                        , lineSet[lineNext-1][1] + p*data[pivot][1]
                                        ,lineSet[lineNext-1][2]]
                lineNext ++;
                //p *= 0.5;
                count = 0;
            }
            pivot = (pivot + 1) % SampleDataLen;
            if(searchCount >= SampleDataLen * 30){
                break;
            }
        }
    }

    function calcDistance(A,B){
        return A[0]*B[0] + A[1]*B[1] + B[2];
    }

    function setStart(){
        lineSet[0] = [,,];
        setLine(lineSet[0]);
        lineSet[0][2] = 0;
        //console.log(lineSet[0]);
        searchCount = 0;
    }

    function setStart2(pValue){
        lineSet = [[lineSet[0][0],lineSet[0][1],lineSet[0][2]]];
        //console.log(lineSet.length);
        searchCount = 0;
        p = pValue;
    }

    function setLine(Ans){
        Ans[0] = Math.random();
        Ans[1] = 1 - Ans[0];
        if(Math.random() < 0.5){
            Ans[1] = -Ans[1];
        }
        //Ans[2] = Math.floor( Math.random() * (CENTERPOS[0] * 2 - 19) ) + 10;
        
        //ここでAns[2]を決める
        /*
        if(Ans[1] != 0){
            Ans[2] = -(Math.floor( Math.random() * (CENTERPOS[0] * 2 - 19) ) + 10 - CENTERPOS[0]) * Ans[1];
        }else{
            Ans[2] = -(Math.floor( Math.random() * (CENTERPOS[0] * 2 - 19) ) + 10 - CENTERPOS[0]) * Ans[0];
        }
        */
        Ans[2] = 0;
    }

    function makeData(){
        //console.log('makeData');
        for(var i = 0;i < SampleDataLen;i++){
            data[i] = [Math.floor( Math.random() * (CENTERPOS[0] * 2 - 19) ) + 10 - CENTERPOS[0]
                        ,Math.floor( Math.random() * (CENTERPOS[0] * 2 - 19) ) + 10 - CENTERPOS[1]];
            if(Ans[0]*data[i][0] + Ans[1]*data[i][1] + Ans[2] >= 0){
                data[i][2] = true;
            }else{
                data[i][2] = false;
            }
            //console.log(data[i]);
        }
    }

    function display(){
        //console.log("play");
        var cv = document.getElementById("FigML");
        var c = cv.getContext("2d");
        c.fillStyle = '#ffffff';
        c.fillRect(0, 0, CENTERPOS[0] * 2, CENTERPOS[1] * 2);
        displayGridLine(c);
        displayLineSet(c);
        //displayAnsLine(c,Ans,"#FF0000");
        displayPositiveNegative(c);

        displaySearchCount();
        //displayDataValue();//サンプルデータを数値で表示する．
    }

    function display2(canvasName){
        //console.log("play");
        var cv = document.getElementById(canvasName);
        var c = cv.getContext("2d");
        c.fillStyle = '#ffffff';
        c.fillRect(0, 0, CENTERPOS[0] * 2, CENTERPOS[1] * 2);
        displayGridLine(c);
        displayLineSet(c);
        //displayAnsLine(c,Ans,"#FF0000");
        displayPositiveNegative(c);

        displaySearchCount();
    }

    function displayLineSet(c){
        //console.log(lineSet.length);
        let buff = Math.floor(lineSet.length/10);
        for(i = 0;i < lineSet.length-1;i++){
            displayAnsLine(c,lineSet[i],"rgb("+calcRate(0,90,(i+1+buff)/(lineSet.length +buff))+"%,"
                                                +calcRate(20,90,(i+1+buff)/(lineSet.length+buff))+"%,"
                                                +calcRate(100,90,(i+1+buff)/(lineSet.length+buff))+"%)");
            //console.log(lineSet[i]);
        }
        displayAnsLine(c,lineSet[lineSet.length-1],"#FF0000");
    }

    function calcRate(V1,V2,rate){
        return V1 * rate + V2 * (1-rate);
    }

    function displaySearchCount(){
        console.log("探索回数 = " + searchCount);
        console.log("予測データを更新した回数 = " + (lineSet.length-1));
        document.write("<div>探索回数 = " + searchCount + "</div>");
        document.write("<div>予測データを更新した回数 = " + (lineSet.length-1) + "</div>");
        
    }

    function displayDataValue(){
        for(i = 0;i < SampleDataLen;i++){
            document.write("<div>sample" + i + " || " + data[i][0] + " || " + data[i][1] + " || " + data[i][2] + "</div>");
            document.write("<div>sample" + i + " || " + data[i][0] + " || " + data[i][1] + " || " + data[i][2] + "</div>");
        }
    }

    function displayGridLine(c){
        c.strokeStyle="#000000";  //線の色を指定
        //X軸
        c.beginPath();
        c.moveTo(0,CENTERPOS[1]);
        c.lineTo(CENTERPOS[0]*2,CENTERPOS[1]);
        c.closePath();
        c.stroke();
        //Y軸
        c.beginPath();
        c.moveTo(CENTERPOS[0],0);
        c.lineTo(CENTERPOS[0],CENTERPOS[1]*2);
        c.closePath();
        c.stroke();
    }

    function displayAnsLine(c,Ans,Color){
        var AnsLinePos = [];
        c.strokeStyle=Color;
        if(Ans[0] == 0){
            AnsLinePos[0] = [-CENTERPOS[0],-Ans[2]/Ans[1]];
            AnsLinePos[1] = [CENTERPOS[0],-Ans[2]/Ans[1]];
        }else if(Ans[1] == 0){
            AnsLinePos[0] = [-Ans[2]/Ans[0],-CENTERPOS[1]];
            AnsLinePos[1] = [-Ans[2]/Ans[0],CENTERPOS[1]];
        }else{
            AnsLinePos[0] = [CENTERPOS[0],-(CENTERPOS[0] * Ans[0] + Ans[2])/Ans[1]];
            AnsLinePos[1] = [-CENTERPOS[0],-(-CENTERPOS[0] * Ans[0] + Ans[2])/Ans[1]];
        }
        c.beginPath();
        c.moveTo(AnsLinePos[0][0] + CENTERPOS[0],AnsLinePos[0][1] + CENTERPOS[1]);
        c.lineTo(AnsLinePos[1][0] + CENTERPOS[0],AnsLinePos[1][1] + CENTERPOS[1]);
        c.closePath();
        c.stroke();
    }

    function displayPositiveNegative(c){
        for(i = 0;i < SampleDataLen;i++){
            if(data[i][2] == true){
                displayPositive(c,i);
            }else{
                displayNegative(c,i);
            }
        }
    }

    function displayPositive(c,i){
        c.strokeStyle="#DC143C";  //線の色を指定
        //c.fillStyle="red";     //塗りつぶしの色を赤に指定
        //円
        c.beginPath();
        c.arc(data[i][0] + CENTERPOS[0], data[i][1] + CENTERPOS[1], 5, 0, Math.PI*2, false);
        c.stroke();
    }
    
    function displayNegative(c,i){
        const sizeOfMark = 4;
        c.strokeStyle="#191970";  //線の色を指定
        //c.fillStyle="red";     //塗りつぶしの色を赤に指定
        //斜線１
        c.beginPath();
        c.moveTo(data[i][0] + CENTERPOS[0] - sizeOfMark, data[i][1] + CENTERPOS[1] - sizeOfMark);
        c.lineTo(data[i][0] + CENTERPOS[0] + sizeOfMark, data[i][1] + CENTERPOS[1] + sizeOfMark);
        c.closePath();
        c.stroke();
        //斜線２
        c.beginPath();
        c.moveTo(data[i][0] + CENTERPOS[0] + sizeOfMark, data[i][1] + CENTERPOS[1] - sizeOfMark);
        c.lineTo(data[i][0] + CENTERPOS[0] - sizeOfMark, data[i][1] + CENTERPOS[1] + sizeOfMark);
        c.closePath();
        c.stroke();
        //console.log(data[i][0] + CENTERPOS[0], data[i][1] + CENTERPOS[1]);
    }
}


