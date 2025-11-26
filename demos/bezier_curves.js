
Demos.BezierCurves = class {
  constructor() {
    this._scene = new Demos.Scene({
      camera: new Demos.Camera({
        position: [0, 0, -15]
      }),

      projection: new Demos.Projection({
        fov: Math.PI / 4,
        near: 0.1,
        far: 100.0,
        aspect: 1
      }),

      light: new Demos.Light({
        color: [0.8, 0.8, 0.8],
        position: [-15.0, 10.0, -15.0]
      })
    });


    this._curve_1 = new Demos.BezierCurve({scene: this._scene});
  }

  destroy() {
    this._curve_1.destroy();
  }

  run() {
    this.#init();
  }

  #init() {
    this._scene.updateViewport();

    Demos.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this._curve_1.init();

    this.#render();
  }

  #render() {
    Demos.gl.enable(Demos.gl.DEPTH_TEST);
    Demos.gl.clear(Demos.gl.COLOR_BUFFER_BIT || Demos.gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.identity(this._curve_1.model);

    this._curve_1.draw();

    requestAnimationFrame(this.#render.bind(this));
  }
}

