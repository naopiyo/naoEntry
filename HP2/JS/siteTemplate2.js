
function containerWrite(){
    var html = "";
    html += '<div id="container">';
    html += '<a href="../works.html" class="square_btn">グラフィック関連作品</a>';
    html += '<a href="../knowledge.html" class="square_btn">知見・活動集</a>';
    html += '<a href="../program.html" class="square_btn">プログラム関連作品</a> ';
    html += '<p><a href="#">ページ上部へ</a></p>';
    html += '<p><a href="../index.html">ホームへ</a></p>';
    html += '</div>';
    document.write(html);
}


function leftWrite(){
    var html = "";
    html += '<br><br><p>記事の紹介</p>';
    var titles = new Array();
    var pages = new Array();

    titles[0] = '<p>ワンドロ作品集</p>'
    pages[0] = '<a href="../HP2/worksTwitter.html"><img src="../IMG/メロン.jpg" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[1] = '<p>BlenderからUnityへの移植</p>'
    pages[1] = '<a href="../HP2/proDoTween.html"><img src="../IMG/BtoU.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[2] = '<p>迷路作成（穴掘り法）</p>'
    pages[2] = '<a href="../HP2/proMaze.html"><img src="../IMG/Maze.PNG" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[3] = '<p>門の崩壊</p>'
    pages[3] = '<a href="../HP2/worksGate.html"><img src="../IMG/0045.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[4] = '<p>ゴブリン作成</p>'
    pages[4] = '<a href="../HP2/worksGoblin.html"><img src="../IMG/ゴブリン.jpg" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[5] = '<p>工大際アプリ</p>'
    pages[5] = '<a href="../HP2/worksKoudaisai.html"><img src="../IMG/0136.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[6] = '<p>ピンボケした草</p>'
    pages[6] = '<a href="../HP2/worksMame.html"><img src="../IMG/DPEvIamUQAEthYI.jpg" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[7] = '<p>ゲームキャラ制作（Clay Plate`s Story）</p>'
    pages[7] = '<a href="../HP2/worksNadia.html"><img src="../IMG/Na.PNG" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[8] = '<p>レッドブル</p>'
    pages[8] = '<a href="../HP2/worksRedbull.html"><img src="../IMG/redbull.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[9] = '<p>進捗どうですか？</p>'
    pages[9] = '<a href="../HP2/worksSintyoku.html"><img src="../IMG/TechSpeed.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'

    titles[10] = '<p>スライム制作</p>'
    pages[10] = '<a href="../HP2/worksSuraimu.html"><img src="../IMG/スライム.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[11] = '<p>キャラ制作（Sky High Fight）</p>'
    pages[11] = '<a href="../HP2/worksTori.html"><img src="../IMG/F3.PNG" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[12] = '<p>水面に映る桜と木</p>'
    pages[12] = '<a href="../HP2/worksTree.html"><img src="../IMG/0236.png" alt="icon" width="100%" height="100%" class="twitter_button"></a>'
    titles[13] = '<p>迷路作成（部屋あり）</p>'
    pages[13] = '<a href="../HP2/proRogueMaze.html"><img src="../IMG/rogueMaze.PNG" alt="icon" width="100%" height="100%" class="twitter_button"></a>'



    var pagesNum = new Array();
    for(var i = 0;i < 3;i++){
        pagesNum[i] = Math.floor(Math.random()*14);
        for(var j = i-1;j >= 0;j--){
            if(pagesNum[i] === pagesNum[j]){
                i--;
                break;
            }
        }
    }


    for(var i = 0;i < 3; i++){
        html += titles[pagesNum[i]];
        html += pages[pagesNum[i]];
    }
    //console.log(html);
    document.write(html);
}


