
Demos.Curve = class {
  constructor() {

  }

  init() {
    this.#buildProgram();

    this.#initBuffers();
  }

  destroy() {
    this.#destroyProgram();

    this.#destroyBufers();
  }

  #buildProgram() {

  }

  #buildBuffers() {

  }

  #destroyProgram() {

  }

  destroyBuffers() {
    if(this._vertexBuffer) {
      this._scene.gl.deleteBuffer(this._vertexBuffer);
    }

    if(this._indexBuffer) {
      this._scene.gl.deleteBuffer(this._indexBuffer);
    }

    if(this._normalBuffer) {
      this._scene.gl.deleteBuffer(this._normalBuffer);
    }
  }
}
