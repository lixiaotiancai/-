/**
 * 这里我向老师解释一下我的飞机移动的逻辑：
 *
 *        我的大体思路是给左右键各设置一个开关
 *
 *        当左键按下时，左键开关打开,这时开始播放飞机向左移动的动画
 *
 *        松开左键时，左键开关关闭，飞机向左移动的动画停止播放
 *
 *        同时我为了保证按住左键时相应的响应函数只执行一次，防止其多次执行，设置了一个计数器来限制其执行次数
 *
 *        右键原理同上
 */

var left_switch = true; //左键开关
var right_switch = true; //右键开关
var repeatLeftMoveCount = 0; //左键计数器
var repeatRightMoveCount = 0; //右键计数器

//Keydown时的响应函数
function planeKeydownControl(e) {
  var self = this;
  switch (e.keyCode) {
    case 37:
      if (!repeatLeftMoveCount) {
        left_switch = true;
        var leftMovingAimation = function() {
          if (left_switch === false || self.checkBorder('left') || GAME.status !== 'playing') {
            return;
          }
          self.move('left');
          requestAnimationFrame(leftMovingAimation);
        };
        repeatLeftMoveCount++;
        leftMovingAimation();
      }
      break;
    case 39:
      if (!repeatRightMoveCount) {
        right_switch = true;
        var rightMovingAimation = function() {
          if (right_switch === false || self.checkBorder('right') || GAME.status !== 'playing') {
            return;
          }
          self.move('right');
          requestAnimationFrame(rightMovingAimation);
        };
        repeatRightMoveCount++;
        rightMovingAimation();
      }
      break;
    case 32:
      self.fire();
      break;
  }
}

//Keyup时的响应函数
function planeKeyupControl(e) {
  var self = this;
  switch (e.keyCode) {
    case 37:
      if (left_switch === true) {
        left_switch = false;
        repeatLeftMoveCount = 0;
      }
      break;
    case 39:
      if (right_switch === true) {
        right_switch = false;
        repeatRightMoveCount = 0;
      }
      break;
  }
}


/**
 * 飞机构造函数
 */
var Plane = function(props) {
  GameElements.call(this, props);
  this.bullet = [];
};

inherit(Plane, GameElements);

//加载飞机
Plane.prototype.onload = function() {
  var self = this;
  var planeIcon = new Image();
  planeIcon.src = self.icon;
  self.image = planeIcon;
  //加载飞机图像
  planeIcon.onload = function() {
    context.drawImage(self.image, self.x, self.y, self.width, self.height);
  };
  //加载飞机控制
  self.control();
};

// 飞机控制
Plane.prototype.control = function() {
  var self = this;
  //这里是因为removeEventListener只能移除非匿名函数，为了使其又能传参又是非匿名函数，这里我稍做了一下处理。
  keydownFn = planeKeydownControl.bind(self);
  keyupFn = planeKeyupControl.bind(self);
  document.addEventListener('keydown', keydownFn);
  document.addEventListener('keyup', keyupFn);
};

// 检查边界
Plane.prototype.checkBorder = function(direction) {
  var self = this;
  self.leftBorder = self.x;
  self.rightBorder = self.x + self.width + 2 * CONFIG().canvasPadding;
  switch (direction) {
    case 'left':
      if (self.leftBorder <= 0) {
        return true;
      } else {
        return false;
      }
      break;
    case 'right':
      if (self.rightBorder >= canvasWidth) {
        return true;
      } else {
        return false;
      }
  }
};

//开火
Plane.prototype.fire = function() {
  var self = this;
  //每开火一次，就创建一个新的子弹实例并push到plane.bullet数组中
  self.bullet.push(createBullet({
    x: plane.x + plane.width / 2,
    y: plane.y - 10,
    speed: CONFIG().bulletSpeed
  }));
  //移动最新加入数组的子弹
  self.bullet[self.bullet.length - 1].move();
};

var createPlane = function(props) {
  return new Plane(props);
};