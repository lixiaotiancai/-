/**
 * 子弹构造函数
 */
var Bullet = function(props) {
    GameElements.call(this, props);
    this.length = CONFIG().bulletSize;
};

inherit(Bullet, GameElements);

//绘制子弹
Bullet.prototype.draw = function() {
    context.strokeStyle = '#F5F5F5';
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y - this.length);
    context.closePath();
    context.stroke();
};

//擦除子弹运动的轨迹
Bullet.prototype.clear = function() {
    context.clearRect(this.x - 1, this.y + this.speed, 2, this.speed);
};

//擦除当前子弹（用于子弹出界或者撞击敌人时的擦除）
Bullet.prototype.unload = function() {
    context.clearRect(this.x - 1, this.y, 2, this.speed);
};

//子弹移动
Bullet.prototype.move = function() {
    var self = this;
    if (self.checkUnload()) {
        return;
    }
    self.draw();
    self.y -= self.speed;
    self.clear();
    requestAnimationFrame(self.move.bind(self));
};

//检测子弹是否该被擦除
Bullet.prototype.checkUnload = function() {
    var self = this;
    //如果敌人数组为空（游戏通关）,则擦除并卸载所有存在的子弹
    if (enemy.length === 0){
        self.unload();
        plane.bullet.shift();
        return true;
    }
    //如果子弹出界或撞击敌人，则擦除并卸载当前子弹
    for (var i = 0; i < enemy.length; i++) {
        if (self.y <= 0 || (self.y - self.length <= enemy[i].y + enemy[i].height && self.x >= enemy[i].x && self.x <= enemy[i].x + enemy[i].width && self.y >= enemy[i].y + enemy[i].height)) {
            self.unload();
            plane.bullet.splice(plane.bullet.indexOf(self), 1);
            return true;
        }
    }
};

function createBullet(props) {
    return new Bullet(props);
}