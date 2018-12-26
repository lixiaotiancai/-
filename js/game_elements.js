// 父子继承函数
function inherit(child, parent) {
  var F = function() {};
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
}

/**
 * 游戏元素构造函数
 */
var GameElements = function(props) {
  this.x = props.x; //横坐标
  this.y = props.y; //纵坐标
  this.width = props.width; //元素宽
  this.height = props.height; //元素高
  this.icon = props.icon; //元素图标
  this.speed = props.speed; //元素移动速度
  this.leftBorder = props.leftBorder; //左界
  this.rightBorder = props.rightBorder; // 右界
  this.bottomBorder = props.bottomBorder; // 下界
  this.topBorder = props.topBorder; // 上界
};

//擦除游戏元素
GameElements.prototype.clear = function() {
  context.clearRect(this.x, this.y, this.width, this.height);
};

//绘制游戏元素
GameElements.prototype.draw = function() {
  context.drawImage(this.image, this.x, this.y, this.width, this.height);
};

//移动游戏元素
GameElements.prototype.move = function(direction) {
  var self = this;
  self.clear();
  switch (direction) {
    case 'left':
      self.x -= self.speed;
      break;
    case 'right':
      self.x += self.speed;
      break;
    case 'down':
      self.y += self.height;
      break;
    default:
      break;
  }
  self.draw(self.image);
};