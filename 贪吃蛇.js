function draw() {
      var canvas = document.querySelector('#canvas');

      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var isEatFood = false;

        /* 
        贪吃蛇步骤
        1.先把蛇画出来
            1.1 蛇头和蛇身

        2.让蛇动起来
            2.1 添加键盘事件
            2.2 animate

        3.随机投放食物
            3.1 坐标位置
            3.2 食物是否投放到了蛇头和蛇身上(数组排重)

        4.吃食物
            4.1 碰撞检测
            4.2 将食物添加到蛇身上

        5.边缘检测，判断游戏是否结束
            5.1 碰撞检测
            5.2 GameOver
        */

        function Rect(x, y, width, height, color) { //画小方块
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.color = color;
        }

        Rect.prototype.rDraw = function () {
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        //var rect = new Rect(canvas.width / 2 - 20, canvas.height / 2 - 20, 40, 40, 'green');


        //创建snake对象
        function Snake() {
          //画蛇头
          this.head = new Rect(canvas.width / 2, canvas.height / 2, 40, 40, 'green');

          //画蛇身
          this.body = new Array();

          var x = this.head.x;
          var y = this.head.y;
          var position = 40;
          this.direction = 2;
          this.key = 2;

          for (var i = 0; i < 3; i++) {
            var rect = new Rect(x - 40 * (i + 1), y, 40, 40, 'gray');
            this.body.push(rect);

          }
        }

        Snake.prototype.sDraw = function () {
          //绘制蛇头
          this.head.rDraw();
          //绘制蛇身
          for (var i = 0; i < this.body.length; i++) {
            this.body[i].rDraw();

          }

        }

        Snake.prototype.move = function () {
          //加头
          var rect = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, 'gray');

          this.body.splice(0, 0, rect);

          //去尾
          if (isEatFood == false) {
            this.body.pop();
          } else {
            isEatFood = false;

          };



          switch (this.direction) {
            case 0: {
              if (this.key != 2) {

                this.head.x -= this.head.width;
                this.key = 0;
              } else {
                this.head.x += this.head.width;

              }
              break;
            }
            case 1: {
              if (this.key != 3) {
                this.head.y -= this.head.height;
                this.key = 1;
              } else {
                this.head.y += this.head.height;

              }

              break;
            }
            case 2: {
              if (this.key != 0) {
                this.head.x += this.head.width;
                this.key = 2;
              } else {
                this.head.x -= this.head.width;

              }

              break;
            }
            case 3: {
              if (this.key != 1) {
                this.head.y += this.head.height;
                this.key = 3;
              } else {
                this.head.y -= this.head.height;

              }
              break;
            }
          }
        }

        var snake = new Snake();
        snake.sDraw();

        var food = randForFood();


        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          snake.move();
          snake.sDraw();
          food.rDraw();
          gameover();

          if (isRectHit(snake.head, food)) {
            isEatFood = true;
            food = randForFood();
          }
        }

        var stop = setInterval(() => {
          animate()
        }, 200);

        document.onkeydown = function (event) {
          var event = event || window.event;

          switch (event.keyCode) {

            case 37: {

              snake.direction = 0;
              break;
            }
            case 38: {

              snake.direction = 1;
              break;
            }
            case 39: {

              snake.direction = 2;
              break;
            }
            case 40: {

              snake.direction = 3;
              break;
            }
          }
        }

        function randForFood() {
          var isInSnake = true;
          while (isInSnake) {

            var x = getRandInRange(0, (canvas.width - 40) / 40) * 40;
            var y = getRandInRange(0, (canvas.height - 40) / 40) * 40;
            //食物矩形
            var rect = new Rect(x, y, 40, 40, 'blue');

            //判断食物是否与蛇头重叠
            if (isRectHit(snake.head, rect)) {
              isInSnake = true;
              continue;
            }

            isInSnake = false;

            //判断食物是否与蛇身重叠
            for (var i = 0; i < snake.body.length; i++) {
              if (isRectHit(snake.body[i], rect)) {
                isInSnake = true;
                break;
              }
            }
          }
          return rect;
        }

        function isRectHit(rect1, rect2) {
          var minX1 = rect1.x;
          var minX2 = rect2.x;
          var minY1 = rect1.y;
          var minY2 = rect2.y;

          var maxX1 = rect1.x + rect1.width;
          var maxX2 = rect2.x + rect2.width;
          var maxY1 = rect1.y + rect1.height;
          var maxY2 = rect2.y + rect2.height;

          //判断矩形相交的最大/最小值
          var minX = Math.max(minX1, minX2);
          var minY = Math.max(minY1, minY2);
          var maxX = Math.min(maxX1, maxX2);
          var maxY = Math.min(maxY1, maxY2);

          if (minX < maxX && minY < maxY) {
            return true;
          } else {
            return false;
          }
        }

        //获取随机数方法
        function getRandInRange(min, max) {
          return Math.round(Math.random() * (max - min) + min);
        }

        function gameover() {
          if (snake.head.x == -40 || snake.head.x == canvas.width || snake.head.y == -40 || snake.head.y == canvas
            .height) {
            alert('游戏结束');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearTimeout(stop);
          }

          for (var i = 0; i < snake.body.length; i++) {
            if (snake.body[i].x == snake.head.x && snake.body[i].y == snake.head.y) {
              alert('游戏结束');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              clearTimeout(stop);
            }
          }
        }


      }
    }