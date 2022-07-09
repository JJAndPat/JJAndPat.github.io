/**
 * 三阶贝塞尔曲线公式
 *
 * @param {*} t 贝塞尔曲线系数
 * @param {*} p1 轨迹移动的起点
 * @param {*} p2 轨迹移动的终点
 * @param {*} cp1 第一个控制点
 * @param {*} cp2 第二个控制点
 * @returns
 */
function threeBezier(t, p1, p2, cp1, cp2) {
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
}

let ScreenWidth;
let ScreenHeight;
let raf;
let points;
function textOnload() {
  ScreenWidth = document.body.clientWidth;
  ScreenHeight = document.body.clientHeight;
  const canvas = document.getElementById("textcanvas");
  canvas.width = ScreenWidth;
  canvas.height = ScreenHeight;
  ctx = canvas.getContext("2d");
  points = createViceCanvas();
  init();
};
function init() {
  ctx.clearRect(0, 0, ScreenWidth, ScreenHeight);
  points.forEach((value) => {
    value.draw();
  });
  raf = window.requestAnimationFrame(init);
  if (points[0].item >= 1) {
    window.cancelAnimationFrame(raf);
  }
}
function getFontInfo(ctx) {
  // 文字取点，获取每个文字在画布中的坐标。
  let imageData = ctx.getImageData(0, 0, ScreenWidth, ScreenHeight).data;
  const particles = [];
  for (let x = 0; x < ScreenWidth; x += 4) {
    for (let y = 0; y < ScreenHeight; y += 4) {
      const fontIndex = (x + y * ScreenWidth) * 4 + 3;
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
  console.log('👻== particles', particles);
  return particles;
}
class Particle {
  constructor(center) {
    this.x = center.x; // 记录点位最终应该停留在的x轴位置
    this.y = center.y; // 记录点位最终应该停留在的y轴位置
    this.item = 0; // 贝塞尔曲线系数
    this.vx = 20; // 点位在x轴的移动速度
    this.vy = 16; // 点位在y轴的移动速度
    this.initX = Math.random() * ScreenWidth; // 点位随机在画布中的x坐标
    this.initY = Math.random() * ScreenHeight; // 点位随机在画布中的y坐标
  }
  draw() {
    // 绘制点位
    ctx.beginPath();
    // 贝塞尔曲线，获取每一个 tick 点位所在位置
    const { x, y } = threeBezier(
      this.item,
      [this.initX, this.initY],
      [this.x, this.y],
      [this.x, this.y],
      [this.x, this.y]
    );
    ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
    // ctx.fillStyle = "rbaled";
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
  // document.body.appendChild(viceCanvas);
  // viceCanvas.style = 'position: fixed; top: 0; left: 0;'
  viceCanvas.width = ScreenWidth;
  viceCanvas.height = ScreenHeight;
  let viceCxt = viceCanvas.getContext("2d");
  initCanvas(viceCxt);
  return getFontInfo(viceCxt);
}
function initCanvas(ctx) {
  const fonts = ['祝', 'JJ 同 Pat', '幸福美满']
  let initHeight = 100;
  fonts.forEach(font => {
    ctx.font = '100px PingFangSC-Regular, sans-serif';
    let measure = ctx.measureText(font);
    console.log('👻== measure text', measure);
    ctx.fillText(font, (ScreenWidth - measure.width) / 2, initHeight);
    initHeight += 100 + 10;
  });
}
