var SIZE = 18;
var BLACK = 1;
var WHITE = 2;
function Piece(x, y, player, selfObj, parent) {
    this.x = x;
    this.y = y;
    this.player = player;
    //回退操作
    this.selfObj = selfObj;
    this.parent = parent;
}
function Game() {
    //模式不初始化
    //重新开始还是上一次的模式
    this.isAI = false;
    this.init();
}
Game.prototype.init = function() {
    this.gameOver = false;
    var chessArr = new Array(SIZE);
    for (var x = 0; x < SIZE; x++) {
        chessArr[x] = new Array(SIZE);
        for (var y = 0; y < SIZE; y++) {
            chessArr[x][y] = 0;
            if (x === 0 || x === SIZE - 1) {
                chessArr[x][y] = Infinity;
            }
            if (y === 0 || y === SIZE - 1) {
                chessArr[x][y] = Infinity;
            }
        }
    }
    this.data = chessArr;
    this.currentPlayer = WHITE;
    //棋子栈
    this.piecesArr = [];
    //回退栈
    this.backOrAheadArr = [];
    console.log(this);
    this.isAIfirstStep = false;
};
Game.prototype.start = function() {
    var cellArr = document.querySelectorAll(".cell");
    for (var i = 0; i < cellArr.length; i++) {
    //绑定Game的this到cellHander上
        cellArr[i].addEventListener("click", cellHander.bind(this));
    }
    var btnBack = document.querySelector(".back");
    var btnAhead = document.querySelector(".ahead");
    var btnRestart = document.querySelector(".restart");
    var btnSingle = document.querySelector(".single");
    var btnDouble = document.querySelector(".double");

    btnSingle.addEventListener(
        "click",
        function() {
            this.isAI = true;
            this.deletepiece();
            this.init();
            console.log("AI");
        }.bind(this)
    );

    btnDouble.addEventListener(
        "click",
        function() {
            this.isAI = false;
            this.deletepiece();
            this.init();
        }.bind(this)
    );

    btnBack.addEventListener(
        "click",
        function() {
            this.back();
        }.bind(this)
    );
    btnAhead.addEventListener(
        "click",
        function() {
            this.ahead();
        }.bind(this)
    );
    btnRestart.addEventListener(
        "click",
        function() {
            // 顺序先删除DOM在删除DOM数组
            this.deletepiece();
            this.init();
        }.bind(this)
    );
};
/**
 * { 下棋事件函数 }
 * @param {<Object>}  e {点击的cell，要在cell的四个角上添加棋子}
 */
function cellHander(celle) {
    var e = celle || window.event;
    var position = "";
    //左上
    if (e.offsetX < 16 && e.offsetY < 16) {
        position = "leftup";
    } else if (e.offsetX > 16 && e.offsetY < 16) {
    //右上
        position = "rightup";
    } else if (e.offsetX > 16 && e.offsetY > 16) {
    //右下
        position = "rightdown";
    } else if (e.offsetX < 16 && e.offsetY > 16) {
    //左下
        position = "leftdown";
    } else {
    //点击到中间
    //本次操作无效
    //触发彩蛋
        console.log("彩蛋");
        return;
    }
    //这个this是Game 的this
    //这样直接就能调用Game类的方法
    //继续游戏逻辑
    //游戏分支
    if (this.isAI) {
        this.singleplay(e.target, position);
    } else {
        this.doubleplay(e.target, position);
    }
}
//单人模式
/**
 * @param {eventObject} target 
 * @param {string} position 
 */
Game.prototype.singleplay = function(target, position) {
    var piece = {};
    piece = this.addchess(target, WHITE, position);
    this.data[piece.x][piece.y] = WHITE;
    this.judge(piece.x, piece.y, piece.player);
    console.log("玩家完成，等待AI下棋", piece);
    if (this.gameOver) {
        return;
    }
    piece = this.AIlogic();
    this.data[piece.x][piece.y] = BLACK;
    this.judge(piece.x, piece.y, piece.player);
    console.log("AI完成,等待玩家下棋", piece);
    console.table(this.data);
};
/**
 * 电脑逻辑
 */
Game.prototype.AIlogic = function() {
    var piece = {};
    if (!this.isAIfirstStep) {
        piece = this.AIfirststep();
        this.isAIfirstStep = true;
        return piece;
    }
    //判断 白棋最大值
    var Wmax = -Infinity;
    //判断 黑棋最大值
    var Bmax = -Infinity;
    var WmaxPiece = {
        x: 0,
        y: 0,
        max: Wmax
    };
    var BmaxPiece = {
        x: 0,
        y: 0,
        max: Bmax
    };
    //白色打分
    var WhiteArr = new Array(SIZE);
    for (var x = 0; x < SIZE; x++) {
        WhiteArr[x] = new Array(SIZE);
        for (var y = 0; y < SIZE; y++) {
            WhiteArr[x][y] = 0;
        }
    }
    //黑色打分
    var BlackArr = new Array(SIZE);
    for (x = 0; x < SIZE; x++) {
        BlackArr[x] = new Array(SIZE);

        for (y = 0; y < SIZE; y++) {
            BlackArr[x][y] = 0;
        }
    }
    for (var i = 1; i < SIZE - 1; i++) {
        for (var j = 1; j < SIZE - 1; j++) {
            if (this.data[i][j] === 0) {
                WhiteArr[i][j] = this.Mark(i, j, WHITE);
                BlackArr[i][j] = this.Mark(i, j, BLACK);
                if (WhiteArr[i][j] > Wmax) {
                    Wmax = WhiteArr[i][j];
                    WmaxPiece.x = i;
                    WmaxPiece.y = j;
                    WmaxPiece.max = Wmax;
                }
                if (BlackArr[i][j] > Bmax) {
                    Bmax = BlackArr[i][j];
                    BmaxPiece.x = i;
                    BmaxPiece.y = j;
                    BmaxPiece.max = Bmax;
                }
            }
        }
    } //双循环结束
    console.log(BmaxPiece.max, WmaxPiece.max);
    console.table(BlackArr);
    console.table(WhiteArr);
    // console.table(this.data);
    //人机分高 攻
    piece = {};
    if (BmaxPiece.max >= WmaxPiece.max) {
        console.log("人机分高，人机攻", BmaxPiece.x, BmaxPiece.y);
        piece = this.AIaddchess(BmaxPiece.x, BmaxPiece.y);
    } else {
    //       低 守（下白旗最大）
        piece = this.AIaddchess(WmaxPiece.x, WmaxPiece.y);
        console.log("玩家分高，人机守", WmaxPiece.x, WmaxPiece.y);
    }
    return piece;
};
/**
 * 电脑第一步下棋应该出现不同的位置
 */
Game.prototype.AIfirststep = function() {
    var firstW = this.piecesArr[0];
    var Brow = firstW.x;
    var Bcol = firstW.y;
    //第一个棋子一定成功(Max -min)*random
    var random = Math.floor(Math.random() * 8 + 1);
    console.log("AIfirststeprandom", random);
    switch (random) {
    //向上
    case 1:
        if (Brow - 1 >= 0) {
            Brow = Brow - 1;
        }
        break;
    //向rightup
    case 2:
        if (Bcol + 1 < SIZE && Brow - 1 >= 0) {
            Bcol++;
            Brow--;
        }
        break;
    //right
    case 3:
        if (Bcol + 1 < SIZE) {
            Bcol++;
        }
        break;
    //rightdown
    case 4:
        if (Brow + 1 < SIZE && Bcol + 1 < SIZE) {
            Brow++;
            Bcol--;
        }
        break;
    //leftdown
    case 5:
        if (Brow + 1 < SIZE && Bcol - 1 >= 0) {
            Brow++;
            Bcol--;
        }
        break;
    //left
    case 6:
        if (Bcol - 1 >= 0) {
            Bcol--;
        }
        break;
    //leftup
    case 7:
        if (Bcol - 1 >= 0 && Brow - 1 >= 0) {
            Bcol--;
            Brow--;
        }
        break;
    //down
    case 8:
        if (Brow + 1 < SIZE) {
            Brow++;
        }
        break;
    }
    console.log("Brow ,Bcol", Brow, Bcol);
    var piece = this.AIaddchess(Brow, Bcol);
    return piece;
};
/**
 * 
 * @param {number} x 相当于 数组的row 
 * @param {number} y 相当于 数组的col 
 */
Game.prototype.AIaddchess = function(x, y) {
    var cellArr = document.querySelectorAll(".cell");
    //棋位置
    var cpos = "";
    var piece = {};
    var chessouter = document.createElement("div");
    var chessinner = document.createElement("div");
    // console.log('chessouter ',chessouter);
    // console.log('chessinner ',chessinner);
    for (var i = 0; i < cellArr.length; i++) {
        if (this.ispieceparent(cellArr[i], x, y)) {
            cpos = this.cellposition(cellArr[i], x, y);
            chessouter.className = "chessouter " + cpos;
            chessinner.className = "ch-black";
            chessouter.appendChild(chessinner);
            cellArr[i].appendChild(chessouter);
            piece = new Piece(x, y, BLACK, chessouter, cellArr[i]);
            console.log("AI棋子落盘", piece);
            break;
        }
    }
    //取消事件委任
    chessouter.onclick = function(e) {
        e.cancelBubble = true;
    };
    chessinner.onclick = function(e) {
        e.cancelBubble = true;
    };
    //入栈方便悔棋操作
    this.piecesArr.push(piece);
    console.log("AI棋子入栈", this.piecesArr);
    return piece;
};
/**
 * 
 * @param {object} cell 判断下棋的父节点 
 * @param {number} x 相当于 数组的row 
 * @param {number} y 相当于 数组的col 
 */
Game.prototype.ispieceparent = function(cell, x, y) {
    var cellRect = cell.getBoundingClientRect();
    var celldeLeft = 447;
    var celldeTop = 49;
    var cellWidth = 32;
    var cellHeight = 32;
    var cRTop = cellRect.top + window.scrollY;
    var cRLeft = cellRect.left + window.scrollX;
    var cellX = (cRLeft - celldeLeft) / cellWidth;
    var cellY = (cRTop - celldeTop) / cellHeight;
    // console.log('cellRect cellY/X', cellY,cellX);
    var cArrX = cellY;
    var cArrY = cellX;
    var isparent = false;

    //因为棋子棋子在处理数组时多了一个边界
    //将棋子坐标与cell坐标对齐
    x = x - 1;
    y = y - 1;
    if (
        (cArrX === x && cArrY === y) ||
    (cArrX === x && y === 15) ||
    (cArrY === y && x === 15)
    ) {
        isparent = true;
    } else if (x === 15 && y === 15) {
        isparent = true;
    }
    return isparent;
};
/**
 * { 根据查询到的cell 判断棋子出现位置 }
 *
 */
Game.prototype.cellposition = function(cell, x, y) {
    var cellRect = cell.getBoundingClientRect();
    console.log("cellposition棋子与parent", cell, x, y, cellRect);
    var celldeLeft = 447;
    var celldeTop = 49;
    var cellWidth = 32;
    var cellHeight = 32;
    var cRTop = cellRect.top + window.scrollY;
    var cRLeft = cellRect.left + window.scrollX;
    var cellX = (cRLeft - celldeLeft) / cellWidth;
    var cellY = (cRTop - celldeTop) / cellHeight;
    console.log("AI棋子的parent", cellY, cellX);

    var cArrX = cellY;
    var cArrY = cellX;
    var cpos = "";
    //因为棋子棋子在处理数组时多了一个边界
    //将棋子坐标与cell坐标对齐
    x = x - 1;
    y = y - 1;
    //数组
    //(m,15) ->(m,14)  rightup
    if (y === 15 && cArrY === 14 && x === cArrX) {
        cpos = "rightup";
    } else if (x === 15 && cArrX === 14 && y === cArrY) {
    //(15,m) ->(14,m)  leftdown
        cpos = "leftdown";
    } else if (x === 15 && y === 15) {
    //(15,15)->(14,14) rightdown
        cpos = "rightdown";
    } else {
    //(0,0)->(14,14) leftup
        cpos = "leftup";
    }
    console.log("cops", cpos);
    return cpos;
};
/**
 * { 四个方向上打分 }
 *
 * @param      {number}  x       { 数组下标}
 * @param      {number}  y       { 数组下标}
 * @param      {number}  color   player
 * @return     {number}  { 四个方向值的和为该点的权重}
 */
Game.prototype.Mark = function(row, col, color) {
    //test
    // console.count() ;
    // row = 15;
    // col = 15;
    // color = WHITE;
    var count = 0;
    var side1 = false;
    var side2 = false;
    var weight = 0;
    var gameData = this.data;
    var i = 0;
    var j = 0;
    gameData[row][col] = color;
    //左
    for (i = col; i >= 0; i--) {
        if (gameData[row][i] != color) {
            if (gameData[row][i] === 0) {
                side1 = true;
            }
            break;
        }
        count++;
    }
    //右判断
    for (i = col + 1; i < SIZE; i++) {
        if (gameData[row][i] != color) {
            if (gameData[row][i] === 0) {
                side2 = true;
            }
            break;
        }
        count++;
    }
    //水平打分
    console.log("水平打分", side1, side2, color === 1 ? "black" : "white", "row", row, "col", col, "count", count);
    weight += this.scoretable(side1, side2, count, color);
    count = 0;
    side1 = false;
    side2 = false;
    //上
    for (i = row; i >= 0; i--) {
        if (gameData[i][col] !== color) {
            if (gameData[i][col] === 0) {
                side1 = true;
            }
            break;
        }
        count++;
    }
    //下判断
    for (i = row + 1; i < SIZE; i++) {
        if (gameData[i][col] !== color) {
            if (gameData[i][col] === 0) {
                side2 = true;
            }
            break;
        }
        count++;
    }
    //垂直打分
    console.log("垂直打分", side1, side2, color === 1 ? "black" : "white", "row", row, "col", col, "count", count);
    weight += this.scoretable(side1, side2, count, color);
    count = 0;
    side1 = false;
    side2 = false;
    //左上
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (gameData[i][j] !== color) {
            if (gameData[i][j] === 0) {
                side1 = true;
            }
            break;
        }
        count++;
    }
    //右下判断
    for (i = row + 1, j = col + 1; i < SIZE && j < SIZE; i++, j++) {
        if (gameData[i][j] !== color) {
            if (gameData[i][j] === 0) {
                side2 = true;
            }
            break;
        }
        count++;
    }
    //捺 打分
    console.log("左上右下", side1, side2, color === 1 ? "black" : "white", "row", row, "col", col, "count", count);
    weight += this.scoretable(side1, side2, count, color);
    count = 0;
    side1 = false;
    side2 = false;

    //左下判断
    for (i = row + 1, j = col - 1; i < SIZE && j >= 0; i++, j--) {
        if (gameData[i][j] !== color) {
            if (gameData[i][j] === 0) {
                side1 = true;
            }
            break;
        }
        count++;
    }
    //右上
    for (i = row, j = col; i >= 0 && j < SIZE; i--, j++) {
        console.log("i", i, "j", j, this.data[i][j]);

        if (gameData[i][j] !== color) {
            if (gameData[i][j] === 0) {
                side2 = true;
            }

            break;
        }
        count++;
    }

    //丿撇打分
    console.log("右上左下", side1, side2, color === 1 ? "black" : "white", "row", row, "col", col, "count", count);
    weight += this.scoretable(side1, side2, count, color);
    gameData[row][col] = 0;
    return weight;
};
/**
 * { 根据连续棋子的个数 是否被截断的  打分表 }
 * @param      {<boolean>}  side1   一端是否被堵
 * @param      {<boolean>}  side2   ...
 * @param      {<number>}  num     连续最大棋子
 */
Game.prototype.scoretable = function(side1, side2, num, color) {
    var score = 0;
    console.log("num", num);
    switch (num) {
    case 1:
        if (side1 && side2) {
            score = color === BLACK ? 100 : 50;
        } else {
            score = color === BLACK ? 10 : 5;
        }
        break;

    case 2:
        if (side1 && side2) {
            score = color === BLACK ? 800 : 100;
        } else if (side1 || side2) {
            score = color === BLACK ? 400 : 50;
        } else {
            score = 20;
        }
        break;

    case 3:
        if (side1 && side2) {
            score = color === BLACK ? 2000 : 300;
        } else if (side1 || side2) {
            score = color === BLACK ? 1000 : 200;
        } else {
            score = 250;
        }
        break;

    case 4:
        if (side1 && side2) {
            score = color === BLACK ? 8000 : 9000;
        } else if (side1 || side2) {
            score = color === BLACK ? 6000 : 7000;
        } else {
            score = 5500;
        }
        break;

    case 5:
        score = 100000;
        break;

    default:
        score = 200000;
        break;
    }

    return score;
};
//双人模式
/**
 * { 游戏逻辑 }
 * @param      {<DOM object>}  target  current click object
 * @param      {<string>}  position  chessClassName定位棋子
 */
Game.prototype.doubleplay = function(target, position) {
    if (this.gameOver) {
        return;
    }
    var piece = this.addchess(target, this.currentPlayer, position);
    //addchess处理后，现在 x,y 是this.data 坐标了
    this.data[piece.x][piece.y] = this.currentPlayer;
    this.gameOver = this.judge(piece.x, piece.y, piece.player);
};
/**
 * 一次下棋结束，判断棋子情况
 */
Game.prototype.gameover = function() {
    console.log(this.currentPlayer);
    var temp = "";
    for (var i = 1; i < SIZE - 1; i++) {
        if (this.data[i].indexOf(0) > -1) {
            temp = this.currentPlayer === 2 ? "WHITE" : "BLACK";
            alert("恭喜" + temp + "赢了");
            break;
        }
    }
    if (temp === "") {
        temp = "平局";
        alert("平局");
    }
    this.deletepiece();
    this.init();
};
/**
 * { 删除棋子 }
 */
Game.prototype.deletepiece = function() {
    /*  this.cellArr = document.querySelectorAll('.cell');
	//删除棋子方法1 遍全部删除第一个递归
	if(hasPiece){
       this.cellArr.forEach( function (element, index) {
 		while ( element.firstChild ) {
			element.removeChild( element.firstChild );
		}      	
	});
	}*/
    //删除棋子DOM
    for (var i = this.piecesArr.length - 1; i >= 0; i--) {
        var child = this.piecesArr[i].selfObj;
        child.parentNode.removeChild(child);
    }
    console.log("删除棋子成功");
};

/**
 * { turn player }
 */
Game.prototype.swapPlayer = function() {
    var turn = document.querySelector(".player");
    if (this.currentPlayer === WHITE) {
        turn.classList.remove("white");
        turn.classList.add("black");
        this.currentPlayer = BLACK;
    } else {
        turn.classList.add("white");
        turn.classList.remove("black");
        this.currentPlayer = WHITE;
        console.log("changePlayer");
    }
};

/**
 * { 原则：从x,y 为中向8边扩散，累加同色}
 *
 * @param      {number}   x       { piece在数组中的row }
 * @param      {number}   y       { piece在数组中的col }
 * @param      {number}   color   {黑与白}
 */
Game.prototype.judge = function(row, col, color) {
    var horizontal = 0,
        vertical = 0,
        cross1 = 0,
        cross2 = 0,
        gameData = this.data,
        WIN = 5,
        i = 0,
        j = 0;
    //左
    for (i = col; i >= 0; i--) {
        if (gameData[row][i] != color) {
            break;
        }
        horizontal++;
    }
    //右判断
    for (i = col + 1; i < SIZE; i++) {
        if (gameData[row][i] != color) {
            break;
        }
        horizontal++;
    }
    //上
    for (i = row; i >= 0; i--) {
        if (gameData[i][col] !== color) {
            break;
        }
        vertical++;
    }
    //下判断
    for (i = row + 1; i < SIZE; i++) {
        if (gameData[i][col] !== color) {
            break;
        }
        vertical++;
    }
    //左上
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (gameData[i][j] !== color) {
            break;
        }
        cross1++;
    }
    //右下判断
    for (i = row + 1, j = col + 1; i < SIZE && j < SIZE; i++, j++) {
        if (gameData[i][j] !== color) {
            break;
        }
        cross1++;
    }
    //左下判断
    for (i = row + 1, j = col - 1; i < SIZE && j >= 0; i++, j--) {
        if (gameData[i][j] !== color) {
            break;
        }
        cross2++;
    }
    //右上
    for (i = row, j = col; i >= 0 && j < SIZE; i--, j++) {
        if (gameData[i][j] !== color) {
            break;
        }
        cross2++;
    }
    if (horizontal >= WIN || vertical >= WIN || cross1 >= WIN || cross2 >= WIN) {
    //遍历this.data 都不为 0
        this.gameOver = true;
    }
    if (this.gameOver) {
        setTimeout(
            function() {
                this.gameover();
            }.bind(this),
            100
        );
    } else {
        this.swapPlayer();
    }
};
/**
 * {动态添加棋子并设置棋子位置}
 *
 * @param      {<一个棋子的作用域>}   target      点击事件触发对象 
 * @param      {棋子内层css样式类名}  chessStyle  设置白黑和圆角
 * @param      {棋子外层css样式类名}  position    设置该棋子添加位置
 */
Game.prototype.addchess = function(target, chessStyle, position) {
    var chessouter = document.createElement("div");
    var chessinner = document.createElement("div");
    chessouter.className = "chessouter " + position;
    if (this.currentPlayer === WHITE) {
        chessinner.className = "ch-white";
    } else {
        chessinner.className = "ch-black";
    }
    chessouter.appendChild(chessinner);
    target.appendChild(chessouter);
    //取消事件委任
    chessouter.onclick = function(e) {
        e.cancelBubble = true;
    };
    chessinner.onclick = function(e) {
        e.cancelBubble = true;
    };
    var Rect = chessouter.getBoundingClientRect();
    var defaultTop = 33;
    var defaultLeft = 431;
    var chessWidth = 32;
    var chessHeight = 32;
    var RTop = Rect.top + window.scrollY;
    var RLeft = Rect.left + window.scrollX;
    var chessX = (RLeft - defaultLeft) / chessWidth;
    var chessY = (RTop - defaultTop) / chessHeight;
    //记录坐标 并记下DOM，悔棋操作
    // console.log(chessouter.getBoundingClientRect());
    // 浏览器的坐标 与数组的坐标是关于Y = X对称。
    console.log("人玩家", [chessY + 1, chessX + 1, chessouter]);
    var piece = new Piece(
        chessY + 1,
        chessX + 1,
        this.currentPlayer,
        chessouter,
        target
    );
    //入栈
    this.piecesArr.push(piece);
    console.log("人玩家", this.piecesArr);
    return piece;
};
/**
 * { 后退 } 
 */
Game.prototype.back = function() {
    //错误处理2
    try {
        var piece = this.piecesArr.pop();
        var lastChild = piece.selfObj;
        if (lastChild.parentNode) {
            lastChild.parentNode.removeChild(lastChild);
        }
        console.log("back piecesArr", this.piecesArr);
    } catch (e) {
        if (e instanceof TypeError) {
            console.log("没棋可以悔了");
        }
    }
    this.backOrAheadArr.push(piece);
};
/**
 * { 撤销 }删除的基调还在内存中，但是脱离父元素，所于需要
 *         将parent作为对象属性传递过来。
 */
Game.prototype.ahead = function() {
    //错误处理一
    if (this.backOrAheadArr.length <= 0) {
        return;
    }
    var piece = this.backOrAheadArr.pop();
    var lastChild = piece.selfObj;
    var parentNode = piece.parent;
    parentNode.appendChild(lastChild);
    this.piecesArr.push(piece);
    console.log("ahead", this.piecesArr);
};
console.log("js加载成功");
document.addEventListener("DOMContentLoaded", function() {
    var game = new Game();
    game.start();
    console.log(game.currentPlayer);
    console.log("DOMContentLoaded", game);
});
