
Demos.Renderer = class {
  constructor(args) {
    this._vertexShader = args.vertexShader;

    this._fragmentShader = args.fragmentShader;

    this._gl = args.glContext ?? Demos.gl;

    this.#buildProgram();
  }

  get program() {
    return this._program;
  }

  #buildProgram() {
    const vertexShader = this._gl.createShader(this._vertexShader.shaderType);
    this._gl.shaderSource(vertexShader, this._vertexShader.shaderSource);
    this._gl.compileShader(vertexShader);

    const fragmentShader = this._gl.createShader(this._fragmentShader.shaderType);
    this._gl.shaderSource(fragmentShader, this._fragmentShader.shaderSource);
    this._gl.compileShader(fragmentShader);

    this._program = this._gl.createProgram();

    this._gl.attachShader(this._program, vertexShader);
    this._gl.attachShader(this._program, fragmentShader);

    this._gl.linkProgram(this._program);

    this._gl.detachShader(this._program, vertexShader);
    this._gl.detachShader(this._program, fragmentShader);

    this._gl.deleteShader(vertexShader);
    this._gl.deleteShader(fragmentShader);

    if(!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
      const linkErrLog = this._gl.getProgramInfoLog(this._program);
      Demos.webgl_status.style.display = 'block';
      Demos.webgl_status.textContent = `SphereError: Shader program did not link successfully. Error log: ${linkErrLog}`;
      throw new Error(`Program failed to link: ${linkErrLog}`);
    }
  }
}
