
const fov = Math.PI / 4;
const near = 0.1;
const far = 100.0;
let aspect = 1;

const camera = glMatrix.mat4.create();
const projection = glMatrix.mat4.create();
const light = {
  color: [0.8, 0.8, 0.8],
  position: [-15.0, 10.0, -15.0]
};

const sphere_1 = new Demos.Sphere({glContext: Demos.gl, mode: 'WIREFRAME', rho: 2.5, color: [0.2, 0.2, 0.7]});
const model_1 = glMatrix.mat4.create();

const sphere_2 = new Demos.Sphere({rho: 2.5, color: [0.2, 0.7, 0.2]});
const model_2 = glMatrix.mat4.create();

function updateViewport() {
  if (!(Demos.gl instanceof WebGLRenderingContext)) {
    return;
  }

  Demos.gl.viewport(0, 0, Demos.gl.drawingBufferWidth, Demos.gl.drawingBufferHeight);
  aspect = Demos.canvas.width / Demos.canvas.height || 1;
  glMatrix.mat4.perspective(projection, fov, aspect, near, far);
}

function init() {
  updateViewport();

  Demos.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Camera
  glMatrix.mat4.lookAt(
    camera,
    [0, 0, -15], // camera position (Note: make sure to match cameraPosition)
    [0, 0, 0], // look at origin
    [0, 1, 0] // up direction
  );

  sphere_1.init();

  sphere_2.init();

  render();
}


function render() {
  Demos.gl.enable(Demos.gl.DEPTH_TEST);
  Demos.gl.clear(Demos.gl.COLOR_BUFFER_BIT || Demos.gl.DEPTH_BUFFER_BIT);


  glMatrix.mat4.identity(model_1);
  glMatrix.mat4.translate(model_1, model_1, [0.0, 3.0, 0.0]);
  glMatrix.mat4.rotateY(model_1, model_1, performance.now() * 0.0005);
  glMatrix.mat4.rotateX(model_1, model_1, Math.PI/2);

  sphere_1.draw(model_1, camera, projection, light);


  glMatrix.mat4.identity(model_2);
  glMatrix.mat4.translate(model_2, model_2, [0.0, -3.0, 0.0]);

  sphere_2.draw(model_2, camera, projection, light);


  requestAnimationFrame(render);
}

window.handleCanvasResize = updateViewport;

window.onload = function() {
  init();
}
