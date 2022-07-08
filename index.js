const threeBezier = (t, p1, p2, cp1, cp2) => {
  const [startX, startY] = p1;
  const [endX, endY] = p2;
  const [cpX1, cpY1] = cp1;
  const [cpX2, cpY2] = cp2;
  let x =
    startX * Math.pow(1 - t, 3) +
    3 * cpX1 * t * Math.pow(1 - t, 2) +
    3 * cpX2 * Math.pow(t, 2) * (1 - t) +
    endX * Math.pow(t, 3);
  let y =
    startY * Math.pow(1 - t, 3) +
    3 * cpY1 * Math.pow(1 - t, 2) * t +
    3 * cpY2 * (1 - t) * Math.pow(t, 2) +
    endY * Math.pow(t, 3);
  return {
    x,
    y,
  };
};
let WIDTH, HEIGHT, cxt, raf, points;
window.onload = () => {
  WIDTH = document.body.clientWidth;
  HEIGHT = document.body.clientHeight;
  const canvas = document.getElementById("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx = canvas.getContext("2d");
  points = createViceCanvas();
  init();
};
function init() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  points.forEach((value) => {
    //
    value.draw();
  });
  raf = window.requestAnimationFrame(init);
  if (points[0].item >= 1) {
    window.cancelAnimationFrame(raf);
  }
}
function getFontInfo(ctx) {
  // 文字取点，获取每个文字在画布中的坐标。
  let imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
  const particles = [];
  for (let x = 0; x < WIDTH; x += 4) {
    for (let y = 0; y < HEIGHT; y += 4) {
      const fontIndex = (x + y * WIDTH) * 4 + 3;
      if (imageData[fontIndex] > 0) {
        particles.push(
          new Particle({
            x,
            y,
          })
        );
      }
    }
  }
  return particles;
}
class Particle {
  constructor(center) {
    this.x = center.x; // 记录点位最终应该停留在的x轴位置
    this.y = center.y; // 记录点位最终应该停留在的y轴位置
    this.item = 0; // 贝塞尔曲线系数
    this.vx = 20; // 点位在x轴的移动速度
    this.vy = 16; // 点位在y轴的移动速度
    this.initX = Math.random() * WIDTH; // 点位随机在画布中的x坐标
    this.initY = Math.random() * HEIGHT; // 点位随机在画布中的y坐标
  }
  draw() {
    // 绘制点位
    ctx.beginPath();
    const { x, y } = threeBezier(
      // 贝塞尔曲线，获取每一个tick点位所在位置
      this.item,
      [this.initX, this.initY],
      [this.x, this.y],
      [this.x, this.y],
      [this.x, this.y]
    );
    ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    this.speed(); // 点位下次tick绘制时的坐标
  }
  speed() {
    // 每个点位绘制后的坐标
    this.initX += this.vx;
    this.initY += this.vy;
    this.item += 0.01;
  }
}
function createViceCanvas() {
  const viceCanvas = document.createElement("canvas");
  viceCanvas.width = WIDTH;
  viceCanvas.height = HEIGHT;
  let viceCxt = viceCanvas.getContext("2d");
  initCanvas(viceCxt);
  return getFontInfo(viceCxt);
}
function initCanvas(ctx) {
  const font = "祝 JJ 同 Pat 幸福美满";
  ctx.font =
    '200px "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Helvetica, Arial, Verdana, sans-serif';
  const measure = ctx.measureText(font);
  console.log(measure.width);
  // console.log(ctx.measureText('hello'))
  ctx.fillText(font, (WIDTH - measure.width) / 2, HEIGHT / 2);
}