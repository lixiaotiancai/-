var container = document.getElementById('game');

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var scorePanel = document.querySelector('.game-playing .gameScore'); // 游戏中的分数
var nextLevelPanel = document.querySelector('.game-success .game-next-level'); //下一关
var finalScorePanelFail = document.querySelector('.game-failed .score'); //最终得分（失败）
var finalScorePanelAllSuccess = document.querySelector('.game-all-success .score'); //最终得分（通关成功）

var playBtn = document.querySelector('.js-play');
var replayBtn = document.querySelectorAll('.js-replay');
var nextBtn = document.querySelector('.js-next');

var plane = null;
var enemy = [];
var gameLevel = CONFIG().level; //当前等级
var score = 0; //当前分数

canvas.style.padding = CONFIG().canvasPadding + 'px';

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts
   * @return {[type]}      [description]
   */
  init: function() {
    this.status = CONFIG().status;
    this.setStatus(this.status);
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    // 下一关游戏按钮绑定
    nextBtn.onclick = function() {
      self.play();
    };
    // 重新游戏按钮绑定
    replayBtn.forEach(function(el) {
      el.onclick = function() {
        //重新游戏分数清0
        score = 0;
        self.play();
      };
    });
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },

  play: function() {
    this.setStatus('playing');
    // 加载游戏
    this.loadGame();
  },

  /**
   * 加载游戏
   */
  loadGame: function() {
    // 创建一个飞机实例
    plane = createPlane({
      width: CONFIG().planeSize.width,
      height: CONFIG().planeSize.height,
      x: canvas.width / 2 - CONFIG().planeSize.width / 2 - CONFIG().canvasPadding,
      y: canvas.height - CONFIG().canvasPadding * 2 - CONFIG().planeSize.height,
      icon: CONFIG().planeIcon,
      speed: CONFIG().planeSpeed
    });

    // 按照游戏等级创建相应数量的敌人实例
    for (var i = 0; i < gameLevel; i++) {
      for (var j = 0; j < CONFIG().numPerLine; j++) {
        enemy.push(createEnemy({
          width: CONFIG().enemySize,
          height: CONFIG().enemySize,
          x: (canvasWidth - (CONFIG().enemyGap + CONFIG().enemySize) * (CONFIG().numPerLine + 1)) / 2 + (CONFIG().enemyGap + CONFIG().enemySize) * j,
          y: (CONFIG().enemyGap + CONFIG().enemySize) * i,
          icon: CONFIG().enemyIcon,
          speed: CONFIG().enemySpeed
        }));
      }
    }

    //加载飞机
    plane.onload();

    //加载敌人
    for (var i = 0; i < gameLevel * CONFIG().numPerLine; i++) {
      enemy[i].onload();
    }
    //加载得分
    scorePanel.innerHTML = `分数: ${score}`;
  },

  /**
   * 卸载游戏
   */
  unloadGame: function() {
    //移除键盘相应的监听事件
    document.removeEventListener('keydown', keydownFn);
    document.removeEventListener('Keyup', keyupFn);
    //初始化游戏实例
    plane = {};
    plane.bullet = [];
    enemy = [];
    //清除画布
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  },


};


// 初始化
GAME.init(CONFIG);