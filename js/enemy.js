/**
 * 敌人构造函数
 */
var Enemy = function(props) {
    GameElements.call(this, props);
    this.boomKeyFrame = 0;
};

inherit(Enemy, GameElements);

//加载敌人
Enemy.prototype.onload = function() {
    var self = this;
    var enemyIcon = new Image();
    enemyIcon.src = self.icon;
    self.image = enemyIcon;
    //加载敌人图像
    enemyIcon.onload = function() {
        context.drawImage(self.image, self.x, self.y, self.width, self.height);
    };
    //移动敌人
    self.enemyMove();
};

//敌人移动
Enemy.prototype.enemyMove = function() {
    var self = this;
    //如果检测到游戏结束，立刻结束动画，如果检测到自己爆炸，则加分并执行爆炸动画后结束
    if (self.checkGameOver()) {
        return;
    } else if (self.checkBoom()) {
        scorePanel.innerHTML = `分数: ${++score}`;
        self.boomAimation();
        return;
    }
    //检测当前应当移动的方向
    self.moveDirection();
    if (self.direction === 'right') {
        self.move('right');
    } else if (self.direction === 'left') {
        self.move('left');
    }
    requestAnimationFrame(self.enemyMove.bind(self));
};

//检测边界
Enemy.prototype.checkBorder = function(direction) {
    var self = this;
    switch (direction) {
        case 'left':
            var leftBorderArr = [];
            for (var i = 0; i < enemy.length; i++) {
                leftBorderArr.push(enemy[i].x);
            }
            //选出所有敌人中最靠左的敌人的边界并记录
            self.leftBorder = leftBorderArr.sort(function(a, b) {
                return a - b;
            })[0];
            if (self.leftBorder <= 0) {
                return true;
            }
            break;
        case 'right':
            var rightBorderArr = [];
            for (var i = 0; i < enemy.length; i++) {
                rightBorderArr.push(enemy[i].x + enemy[i].width);
            }
            //选出所有敌人中最靠右的敌人的边界并记录
            self.rightBorder = rightBorderArr.sort(function(a, b) {
                return b - a;
            })[0];
            if (self.rightBorder + 2 * CONFIG().canvasPadding >= canvasWidth) {
                return true;
            }
    }
};

//检测应当移动的方向
Enemy.prototype.moveDirection = function() {
    var self = this;
    if (self.direction === undefined) {
        self.direction = CONFIG().enemyDirection;
    } else if (self.checkBorder('left') && self.direction === 'left') {
        self.direction = 'right';
        self.move('down');
    } else if (self.checkBorder('right') && self.direction === 'right') {
        self.direction = 'left';
        self.move('down');
    }
};

//检测爆炸
Enemy.prototype.checkBoom = function() {
    var self = this;
    if (plane.bullet.length) {
        for (var i = 0; i < plane.bullet.length; i++) {
            if ((plane.bullet[i].y - plane.bullet[i].length <= self.y + self.height && plane.bullet[i].x >= self.x && plane.bullet[i].x <= self.x + self.width && plane.bullet[i].y >= self.y + self.height)) {
                return true;
            }
        }
    }
};

//爆炸动画
Enemy.prototype.boomAimation = function() {
    var self = this;
    //爆炸动画关键帧执行3帧后停止
    if (self.boomKeyFrame === 3) {
        self.boomKeyFrame = 0;
        self.clear();
        //把当前的敌人从敌人数组中卸载删除
        enemy.splice(enemy.indexOf(self), 1);
        //爆炸后检测游戏是否通关
        self.checkGameSuccess();
        return;
    }
    self.boomKeyFrame++;
    self.clear();
    var enemyBoomIcon = new Image();
    enemyBoomIcon.src = CONFIG().enemyBoomIcon;
    self.image = enemyBoomIcon;
    self.draw();
    requestAnimationFrame(self.boomAimation.bind(self));
};

//检测游戏是否通关
Enemy.prototype.checkGameSuccess = function() {
    if (enemy.length === 0) {
        gameLevel++;
        //检测游戏是否完全通关
        if (gameLevel <= CONFIG().totalLevel) {
            nextLevelPanel.innerHTML = `下一个Level: ${gameLevel}`;
            GAME.unloadGame();
            GAME.setStatus('success');
        } else {
            gameLevel = CONFIG().level;
            GAME.unloadGame();
            GAME.setStatus('all-success');
            finalScorePanelAllSuccess.innerHTML = score;
        }
    }
};

//检测游戏是否结束
Enemy.prototype.checkGameOver = function() {
    var self = this;
    // 若检测都数组中的最后一个敌人的下边界大于飞机的上边界则游戏结束
    if (enemy.length && enemy[enemy.length - 1].y + enemy[enemy.length - 1].height >= plane.y) {
        //清除并卸载当前敌人
        self.clear();
        enemy.shift();
        //当所有敌人卸载完成后
        if (enemy.length === 0) {
            GAME.unloadGame();
            GAME.setStatus('failed');
            finalScorePanelFail.innerHTML = score;
        }
        //复原游戏等级
        gameLevel = CONFIG().level;

        return true;
    }
};

var createEnemy = function(props) {
    return new Enemy(props);
};