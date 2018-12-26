//这里为了防止游戏配置被修改，用了函数工厂的形式将配置以对象的形式返回
//在本程序中都是以CONFIG()的形式来调用游戏配置

function CONFIG() {
    var opts = {
        status: 'start', // 游戏开始默认初始状态
        level: 1, // 游戏默认开始等级
        totalLevel: 6, // 总共6关
        numPerLine: 7, // 游戏默认每行多少个怪兽
        canvasPadding: 10, // 默认画布的间隔
        bulletSize: 10, // 默认子弹长度
        bulletSpeed: 10, // 默认子弹的移动速度
        enemySpeed: 2, // 默认敌人移动速度
        enemySize: 50, // 默认敌人的尺寸
        enemyGap: 10, // 默认敌人之间的间距
        enemyIcon: './img/enemy.png', // 怪兽的图像
        enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
        enemyDirection: 'left', // 默认敌人一开始移动方向
        planeSpeed: 5, // 默认飞机速度
        planeSize: {
            width: 60,
            height: 100
        }, // 默认飞机的尺寸,
        planeIcon: './img/plane.png',
    };
    return opts;
}