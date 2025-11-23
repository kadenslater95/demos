
// TODO: Fill out these classes and use them


class Light {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {

  }
}


class Camera {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {

  }
}


class Projection {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {

  }
}


class Scene {
  constructor(args) {
    this.#constructorValidator(args);

    // If you have a global gl rendering context, then it will use that
    this._gl = args.glContext ?? gl;

    this._camera = args.camera ?? glMatrix.mat4
  }

  #constructorValidator(args) {
    if(!(args.glContext instanceof WebGLRenderingContext || gl instanceof WebGLRenderingContext)) {
      throw "SceneError: Invalid argument provided, glContext must be a WebGLRenderingContext";
    }

    if(!([null, undefined].includes(args.camera) || args.camera instanceof Camera)) {
      throw "SceneError: Invalid argument provided, camera must be a Float32Array (may come frm glMatrix.mat4)"
    }
  }
}
