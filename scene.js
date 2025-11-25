
// TODO: Fill out these classes and use them


Demos.Light = class {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {

  }
}


Demos.Camera = class {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {
    
  }
}


Demos.Projection = class {
  constructor(args) {
    this.#constructorValidator(args);

  }

  #constructorValidator(args) {

  }
}


Demos.Scene = class {
  constructor(args) {
    this.#constructorValidator(args);

    // If you have a global Demos.gl rendering context, then it will use that
    this._gl = args.glContext ?? Demos.gl;

    this._camera = args.camera ?? glMatrix.mat4
  }

  #constructorValidator(args) {
    if(!(args.glContext instanceof WebGLRenderingContext || Demos.gl instanceof WebGLRenderingContext)) {
      throw "SceneError: Invalid argument provided, glContext must be a WebGLRenderingContext";
    }

    if(!([null, undefined].includes(args.light) || args.light instanceof Demos.Light)) {
      throw "SceneError: Invalid argument provided, (light) can be blank or an instance of Demos.Light"
    }

    if(!(args.projection instanceof Demos.Projection)) {
      throw "SceneError: Invalid argument provided, (projection) must be an instance of Demos.Projection"
    }

    if(!(args.camera instanceof Demos.Camera)) {
      throw "SceneError: Invalid argument provided, (camera) must be an instance of Demos.Camera"
    }
  }
}
