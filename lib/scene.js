
// TODO: Fill out these classes and use them


Demos.Light = class {
  constructor(args) {
    this._color = args.color;

    this._position = args.position;
  }

  get color() {
    return this._color;
  }

  set color(newColor) {
    this._color = newColor;
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
  }
}


Demos.Camera = class {
  constructor(args) {
    this._position = args.position ?? [0.0, 0.0, -5.0];

    this._lookAt = args.lookAt ?? [0.0, 0.0, 0.0];

    this._up = args.up ?? [0.0, 1.0, 0.0];

    this._matrix = glMatrix.mat4.create();
    this.#reset();
  }

  get matrix() {
    return this._matrix;
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
  }

  get lookAt() {
    return this._lookAt;
  }

  set lookAt(newLookAt) {
    this._lookAt = newLookAt;
  }

  get up() {
    return this._up;
  }

  set up(newUp) {
    this._up = newUp;
  }

  #reset() {
    glMatrix.mat4.lookAt(
      this._matrix,
      this._position,
      this._lookAt,
      this._up
    );
  }
}


// TODO: Make ortho projection option
Demos.Projection = class {
  constructor(args) {
    this._fov = args.fov;
    this._near = args.near;
    this._far = args._far;
    this._aspect = args.aspect;

    this._matrix = glMatrix.mat4.create();
    this.#reset();
  }

  get matrix() {
    return this._matrix;
  }

  set aspect(newAspect) {
    this._aspect = newAspect;

    this.#reset();
  }

  #reset() {
    glMatrix.mat4.perspective(this._matrix, this._fov, this._aspect, this._near, this._far);
  }
}


Demos.Scene = class {
  constructor(args) {
    this.#constructorValidator(args);

    // If you have a global Demos.gl rendering context, then it will use that
    this._gl = args.glContext ?? Demos.gl;

    this._camera = args.camera;

    this._projection = args.projection;

    this._light = args.light;

    window.handleCanvasResize = this.updateViewport();
  }

  get gl() {
    return this._gl;
  }

  get camera() {
    return this._camera;
  }

  get projection() {
    return this._projection;
  }

  get light() {
    return this._light;
  }

  destroy() {
    window.handleCanvasResize = null;
  }

  updateViewport() {
    if (!(Demos.gl instanceof WebGLRenderingContext)) {
      return;
    }

    Demos.gl.viewport(0, 0, Demos.gl.drawingBufferWidth, Demos.gl.drawingBufferHeight);
    this._projection.aspect = Demos.canvas.width / Demos.canvas.height || 1;
  }

  #constructorValidator(args) {
    if(!(args.glContext instanceof WebGLRenderingContext || Demos.gl instanceof WebGLRenderingContext)) {
      throw "SceneError: Invalid argument provided, glContext must be a WebGLRenderingContext";
    }

    if(!([null, undefined].includes(args.light) || args.light instanceof Demos.Light)) {
      throw "SceneError: Invalid argument provided, (light) can be blank or an instance of Demos.Light"
    }

    if(!([null, undefined].includes(args.projection) || args.projection instanceof Demos.Projection)) {
      throw "SceneError: Invalid argument provided, (projection) must be an instance of Demos.Projection"
    }

    if(!([null, undefined].includes(args.camera) || args.camera instanceof Demos.Camera)) {
      throw "SceneError: Invalid argument provided, (camera) must be an instance of Demos.Camera"
    }
  }
}
