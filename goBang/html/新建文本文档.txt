
解决点击出现棋子后，让棋子所在区域无效
设置一个边框包围元素 内层元素设置样式 
这样外层可以起到隔离作用，遮挡了radius产生的间隙


问题2

棋盘设计：
cell设置为box-sizing:border-box固定宽高 
利用inline-block元素设置宽高成小方块
row利用font-size：0 去除cell间隙
cell保留右边界
row保留 下边界
棋盘内边框：
所有row 设置 border-left right width 27px
.row:first-child 选择 row 中的第一个给border-top高度
.row:last-child 选择row 的最后一个元素，设置
border-bottom 来实现

注意:inline-block 元素的所有style-top 都是border-box
 模式，不能利用这个来定位。
但是可以向下压元素。

问题3

棋子设计：
利用.chessouter>.chessinter ，chessouter
遮盖圆角裁剪掉的部分，chessinter 设置圆角，
chessouter来定位，每个cell绑定onclick响应
函数 ，点击触发事件得到事件对象event操作该cell.

问题4

cell上有4个棋子取消该cell点击事件：
 
这样一个棋子组件就可以覆盖4个cell中间的正方形
区域，效果相当于4/16响应事件区域被覆盖，不在
响应点击事件。一个cell上可以有4个棋子
(都占该cell的1/4区域)，出现4个cell就刚好被完全
遮盖，该cell效果上不再响应点击事件。

问题5

点击cell的1/4 区域添加棋子到对应象限：

e.cell事件对象offsetX/Y可以得到该事件源在cell中的位置，
offsetX/Y的起点是在cell左上角，棋子组件根据鼠标点击的位置，
判断事件触发，addChess(target,chessStyle,position) 根据不同的
cssstyle className设置位置即可。

问题6

棋子添加问题：

棋子添加到该cell中，开始位置与cell重叠，
利用absolute 脱离 cell，但是希望脱离文档的chess组件能将cell作为父容器，cell设置 ps:relative 即可。
这样absolute元素相对于cell四个角定位

问题7 
棋子onclick问题

棋子被添加到cell的1/4 上，一个棋子占4个 cell的4/16 分 构成一个棋子，
由于利用的cell.appendchild(child) 方法，所有棋子会冒泡到cell上触发onclick 事件这是不允许的。
所有在添加一个棋子的同时cancelBabble取消冒泡事件。这样就实现了添加棋子。

问题8

数组坐标与浏览器坐标转换

棋子落下得到棋子对象，在根据piece.x，piece.y添加到this.data数组 保存棋子在棋盘的位置。
二维数组 行列有18个元素 0-17  四边设置为无穷大，1-16存放 15*15的棋盘就行，
  得到浏览器的坐标在二维数组data中要在x,y上加一个单位，同时关于y= x 对称 存放的位置如下：      
  var piece = new Piece(
        chessY + 1,
        chessX + 1,
        this.currentPlayer,
        chessouter,
        target
    );
这样就 同步到与row col 来定位棋子。

问题 9
var piece = this.addchess(target, this.currentPlayer, position);
    //addchess处理后，现在 x,y 是this.data行列
    this.data[piece.x][piece.y] = this.currentPlayer;
    this.gameOver = this.judge(piece.x, piece.y, piece.player);
    
    
问题9

怎样判断 输赢

Game.prototype.judge = function(row, col, color) 
判断的要点就是从中心向四周发散,遇见color不等 退出
不在有数组越界问题。最后结果有一个方向5子结束游戏
否则turn player

补充问题10
棋子为什么存放自己的DOM和父节点：

      在得到颜色
      一个棋子就是一个对象
     Piece(x, y, player, selfObj, parent)
     保存棋子的DOM对象 还有保存他的parent节点，
     因为在悔棋后piecesArr从棋子出栈到backandaheadArr中，而在backandahead中的棋子脱离了document
     父DOM为null ，在点击撤销需要得到棋子与父元素的联系所有需要保存父节点。




debug 问题：
错误：
if(a=3)是可以通过jslint的 在查错时要注意
正确： if(a === 3)

人机模式
boolean 绑定触发 人机模式

问题 11
怎么处理AI下棋问题

利用打分机制，白棋落盘没赢，轮到AI下棋 遍历整个this.data 中为0的位置，
计算白胜利的分数最大值，在计算AI黑子的分数最大值，如果AI分数>=人分数（白）攻 下黑最大位置 否则 守 下白子最大位置。

问题12

分数问题：
很明显白棋先手了有一手优先级，分不能相当，因此在分数设计的时候应该考虑的是第white分数的2,3步不应该大于black 1,2步，
到第3步时白可能要赢了在给高分给白4，一个大概打分。

问题13

黑子第一步应该随机，不能打分不然总是在一个方向上。
给1-8的随机数即可。

问题 14
AI下棋 
根据上面判断得到 棋子的row col 
查询cell 位置在最后一列和最后一行需要修正，和最后一个棋子进行修正。
(0,0)  ->(14,14) leftup
(m,15) ->(m,14)  rightup
(15,m) ->(14,m)  leftdown
(15,15)->(14,14) rightdown

问题15
判断是否截断

判断是否截断上下 左右 ，交叉，需要都一行列这就在this.data的外围都是无穷数，因此可以判断截断，不然报1-15...undefind 的错。

