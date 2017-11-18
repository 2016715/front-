问题1

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
这样absolute元素相对于cell左上角定位。

问题7

怎样判断棋子：
点击时clientY-offsetY = circleY
      clientX -offsetX = circleX
      在得到颜色
      一个棋子就是一个对象
      三个属性
     
init()全局初始化

whowin?
player1   棋子 x, y , color 数组存放 添加的棋子实现悔棋与撤销操作
AI 


gameover()





问题8
怎么判断输赢：
数组存放 圆形坐标x，y 0，1表黑白
cell触发一次点击事件
刷新一次数组，根据x，y 判断数组中是否5子相连

问题9
赢的情况：

 value 0:没越界 ，没棋子
 value 1:黑子
 value 2:白色
2 x-4>=0 value=0,1,2 深度优先搜索 和 x,y相比较
   4 1 4 
3 5子成串算赢

判断 连五 活四 冲四 活三 眠三 活二 眠二

对空位AI 判断AI的最大分数AI，判断人的最大分数people，
空位下棋 
假如下棋的进行打分
活五：livefive = 100000
      livefour = 4000
      disfour =  2000
      livethree = 1000
      sleepthree = 500
      livetwo = 200
      sleeptwo = 100





判断是否能成5, 如果是机器方的话给予100000分，如果是人方的话给予100000 分；

判断是否能成活4或者是双死4或者是死4活3，如果是机器方的话给予10000分，如果是人方的话给予10000分；

判断是否已成双活3，如果是机器方的话给予5000分，如果是人方的话给予5000 分；

判断是否成死3活3（高级），如果是机器方的话给予1000分，如果是人方的话给予1000 分；

判断是否能成死4，如果是机器方的话给予500分，如果是人方的话给予500分；

判断是否能成低级死4，如果是机器方的话给予400分，如果是人方的话给予400分；

判断是否能成单活3，如果是机器方的话给予100分，如果是人方的话给予100分；

判断是否能成跳活3，如果是机器方的话给予90分，如果是人方的话给予90分；

判断是否能成双活2，如果是机器方的话给予50分，如果是人方的话给予50分；

判断是否能成活2，如果是机器方的话给予10分，如果是人方的话给予10分；

判断是否能成低级活2，如果是机器方的话给予9分，如果是人方的话给予9分；

判断是否能成死3，如果是机器方的话给予5分，如果是人方的话给予5分；

判断是否能成死2，如果是机器方的话给予2分，如果是人方的话给予2分。

判断是否其他情况（nothing），如果是机器方的话给予1分，如果是人方的话给予1分。

有棋子，则直接0分。




