
Demos.TriangularMeshes = class {
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


    this._sphere_1 = new Demos.Sphere({
      scene: this._scene,
      mode: 'WIREFRAME',
      rho: 2.5,
      color: [0.2, 0.2, 0.7]
    });

    this._sphere_2 = new Demos.Sphere({
      scene: this._scene,
      rho: 2.5, 
      color: [0.2, 0.7, 0.2]
    });
  }

  destroy() {
    this._sphere_1.destroy();

    this._sphere_2.destroy();
  }

  run() {
    this.#init();
  }

  #init() {
    this._scene.updateViewport();

    Demos.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this._sphere_1.init();

    this._sphere_2.init();

    this.#render();
  }

  #render() {
    Demos.gl.enable(Demos.gl.DEPTH_TEST);
    Demos.gl.clear(Demos.gl.COLOR_BUFFER_BIT || Demos.gl.DEPTH_BUFFER_BIT);


    glMatrix.mat4.identity(this._sphere_1.model);
    glMatrix.mat4.translate(this._sphere_1.model, this._sphere_1.model, [0.0, 3.0, 0.0]);
    glMatrix.mat4.rotateY(this._sphere_1.model, this._sphere_1.model, performance.now() * 0.0005);
    glMatrix.mat4.rotateX(this._sphere_1.model, this._sphere_1.model, Math.PI/2);

    this._sphere_1.draw();


    glMatrix.mat4.identity(this._sphere_2.model);
    glMatrix.mat4.translate(this._sphere_2.model, this._sphere_2.model, [0.0, -3.0, 0.0]);

    this._sphere_2.draw();

    requestAnimationFrame(this.#render.bind(this));
  }
}

