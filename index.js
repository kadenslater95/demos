
const camera = new Demos.Camera({
  position: [0, 0, -15]
});

const projection = new Demos.Projection({
  fov: Math.PI / 4,
  near: 0.1,
  far: 100.0,
  aspect: 1
});

const light = new Demos.Light({
  color: [0.8, 0.8, 0.8],
  position: [-15.0, 10.0, -15.0]
});

const scene = new Demos.Scene({
  camera: camera,
  projection: projection,
  light: light
});

const sphere_1 = new Demos.Sphere({
  scene: scene,
  mode: 'WIREFRAME',
  rho: 2.5,
  color: [0.2, 0.2, 0.7]
});

const sphere_2 = new Demos.Sphere({
  scene: scene,
  rho: 2.5, 
  color: [0.2, 0.7, 0.2]
});

function updateViewport() {
  if (!(Demos.gl instanceof WebGLRenderingContext)) {
    return;
  }

  Demos.gl.viewport(0, 0, Demos.gl.drawingBufferWidth, Demos.gl.drawingBufferHeight);
  projection.aspect = Demos.canvas.width / Demos.canvas.height || 1;
}

function init() {
  updateViewport();

  Demos.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  sphere_1.init();

  sphere_2.init();

  render();
}


function render() {
  Demos.gl.enable(Demos.gl.DEPTH_TEST);
  Demos.gl.clear(Demos.gl.COLOR_BUFFER_BIT || Demos.gl.DEPTH_BUFFER_BIT);


  glMatrix.mat4.identity(sphere_1.model);
  glMatrix.mat4.translate(sphere_1.model, sphere_1.model, [0.0, 3.0, 0.0]);
  glMatrix.mat4.rotateY(sphere_1.model, sphere_1.model, performance.now() * 0.0005);
  glMatrix.mat4.rotateX(sphere_1.model, sphere_1.model, Math.PI/2);

  sphere_1.draw();


  glMatrix.mat4.identity(sphere_2.model);
  glMatrix.mat4.translate(sphere_2.model, sphere_2.model, [0.0, -3.0, 0.0]);

  sphere_2.draw();


  requestAnimationFrame(render);
}

window.handleCanvasResize = updateViewport;

window.onload = function() {
  init();
}
