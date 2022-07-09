function drawText() {
  const canvas = document.getElementById("glcanvas");

  const gl = canvas.getContext("webgl");

  // 顶点着色器 vertex shader
  const vsSource = `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
    gl_Position = a_Position;
    v_Color = a_Color;
}
`;

  // 片元着色器 fragment shader
  const fsSource = `
precision mediump float;
varying vec4 v_Color;

void main() {
    gl_FragColor = v_Color;
}
`;

  const vShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
  const fShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

  composeProgram(gl, vShader, fShader);

  initVertexBuffer(gl);

  draw(gl);

  /** 创建着色器 shader */
  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    return shader;
  }

  /** 把两个着色器组成着色器程序，绑定上下文 */
  function composeProgram(gl, vShader, fShader) {
    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    gl.useProgram(program);
    gl.program = program;
  }

  /**
   * 初始化缓存区
   * 1. 创建缓冲区对象 gl.createBuffer()
   * 2. 绑定缓冲区对象 gl.bindBuffer()
   * 3. 将数据写入缓冲区对象 gl.bufferData()
   * 4. 将缓冲区对象分配给一个 attribute 变量 gl.vertexAttribPointer()
   * 5. 开启 attribute 变量 gl.enableVertexAttribArray()
   */
  function initVertexBuffer(gl) {
    // 定义三个顶点的 x y
    const vertices = getVerticesArray();
    const vertexBuffer = window.buffer || gl.createBuffer();
    if (!window.buffer) {
      window.buffer = vertexBuffer;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const fSize = vertices.BYTES_PER_ELEMENT;
    const aPosition = gl.getAttribLocation(gl.program, "a_Position");
    const aColor = gl.getAttribLocation(gl.program, "a_Color");

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, fSize * 5, 0);
    gl.vertexAttribPointer(aColor, 2, gl.FLOAT, false, fSize * 5, fSize * 2);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
  }

  function draw(gl) {
    // 定义清除缓冲区颜色
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // 清空画布
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // 画三角形
    gl.drawArrays(gl.POINT, 0, window.points.length);

    // window.requestAnimationFrame(() => {
      // initVertexBuffer(gl);
      // draw(gl);
    // });
  }

  function getVerticesArray() {
    const points = window.points;
    const arr = [];
    points.forEach(p => {
      const position = p.draw();
      const x = (position.x / window.ScreenWidth / 2) - 0.25;
      const y = 1 - position.y / window.ScreenHeight - 0.1;
      arr.push(x, y, 0, 0, 0);
    });
    return new Float32Array(arr);
  }
}
window.drawText = drawText;