
Demos.SphereLattice = class {
  constructor(args) {
    this.#constructorValidator(args);

    this._thetaN = args.thetaN;
    this._phiN = args.phiN;
    
    this.#buildVertexData();
    this.#buildNormalData();

    // The setter calls the build index data too
    this._mode = args.mode;
    if(args.mode === 'WIREFRAME') {
      this.#buildWireframeIndexData();
    }else {
      this.#buildSurfaceIndexData();
    }
  }

  get thetaN() {
    return this._thetaN;
  }

  get phiN() {
    return this._phiN;
  }

  get verticesN() {
    return this._vDataSize / 2;
  }

  get vDataSize() {
    return this._vDataSize;
  }

  get vData() {
    return this._vData;
  }

  get iDataSize() {
    return this._iDataSize;
  }

  get iData() {
    return this._iData;
  }

  get nDataSize() {
    return this._nDataSize;
  }

  get nData() {
    return this._nData;
  }

  get mode() {
    return this._mode;
  }

  #constructorValidator(args) {
    if(
      !(typeof args.thetaN === 'number') ||
      !(typeof args.phiN === 'number')
    ) {
      throw "SphereLatticeError: Invalid argument provided, thetaN and phiN must be of type 'number'";
    }

    if(!['SURFACE', 'WIREFRAME'].includes(args.mode)) {
      throw "SphereLatticeError: Invalid argument provided, mode must be one of (SURFACE,WIREFRAME)";
    }
  }

  #buildVertexData() {
    this._vDataSize = 2 * 2 + 2 * this._thetaN * (this._phiN - 1);

    this._vData = new Float32Array(this._vDataSize);

    // Fill from the top down

    this._vData[0] = 0.0; // theta of north pole
    this._vData[1] = 0.0; // phi of north pole

    // Theta rings are full 0 to 2PI
    let thetaFactor = 2.0*Math.PI/(this._thetaN - 1);

    // Phi ranges from 0 to PI
    let phiFactor = Math.PI/this._phiN;

    // The index within the contiguous lattice (not i,j)
    let index = 2;

    // Note we start phi at 1 and end 1 early because we already set the poles as a single point
    for(let i = 1; i < this._phiN; i++) {
      for(let j = 0; j < this._thetaN; j++) {
        this._vData[index] = thetaFactor*j;
        this._vData[index + 1] = phiFactor*i;

        index += 2;
      }
    }

    this._vData[index] = 0.0; // theta of south pole
    this._vData[index + 1] = Math.PI; // phi of south pole
  }

  #buildSurfaceIndexData() {
    // 3 indices per triangle.
    // a theta ring of triangles on both bottom and top hat.
    // 2 triangles per theta in the theta strips.
    // 1 less than phiN number of strips.
    this._iDataSize = 3 * this._thetaN * 2 + 2 * 3 * this._thetaN * (this._phiN - 1);

    this._iData = new Uint16Array(this._iDataSize);
    let index = 0; // index within the indices list, not i,j, etc.

    // Skip vIndex 0 because that is the north pole
    let topHatStart = 1;

    // Skip noth pole, and all theta rings up to the last, so 1 less then phiN - 2
    let bottomHatStart = 1 + this._thetaN * (this._phiN - 2);

    // 2 floats per vertex, so divide that out to get number of vertices
    let verticesSize = this._vDataSize / 2;

    // 3 indices per triangle, and topHatStart triangles up to this point
    let bottomHatIndexOffset = 3 * this._thetaN + 3 * 2 * this._thetaN * (this._phiN - 2);

    for(let i = 0; i < this._thetaN; i++) {
      // Top Hat
      let quadBottomLeft = topHatStart + i;
      
      let quadBottomRight = topHatStart + i + 1;
      if(i == this._thetaN - 1) {
        quadBottomRight = topHatStart;
      }

      let northPole = 0;

      this._iData[index] = northPole;
      this._iData[index + 1] = quadBottomRight;
      this._iData[index + 2] = quadBottomLeft;

      // -----------------------------------------

      // Bottom Hat
      let quadTopLeft = bottomHatStart + i;

      let quadTopRight = bottomHatStart + i + 1;
      if(i == this._thetaN - 1) {
        quadTopRight = bottomHatStart;
      }

      let southPole = verticesSize - 1;

      this._iData[bottomHatIndexOffset + index] = southPole;
      this._iData[bottomHatIndexOffset + index + 1] = quadTopLeft;
      this._iData[bottomHatIndexOffset + index + 2] = quadTopRight;

      index += 3;
    }

    // Now fill the strips between bottom hat and top hat

    // 1st index is north pole so offset my vIndex by that
    let stripStart = 1;

    // Note we don't have a strip on the topmost theta ring, so < this._phiN - 2 instead of 1
    for(let i = 1; i < this._phiN - 1; i++) {
      for(let j = 0; j < this._thetaN; j++) {
        // Gotta offset the north pole, and then the theta rings above me
        let quadTopLeft = stripStart + j + (i - 1) * this._thetaN;

        let quadTopRight = quadTopLeft + 1;

        // I'm a whole ring below
        let quadBottomLeft = quadTopLeft + this._thetaN;

        let quadBottomRight = quadBottomLeft + 1;

        // Put me at start of this ring if I reach the last vertex, to complete that circle
        if(j == this._thetaN - 1) {
          quadTopRight = stripStart + (i - 1) * this._thetaN;
          quadBottomRight = quadTopRight + this._thetaN;
        }

        // Left Triangle
        this._iData[index] = quadBottomLeft;
        this._iData[index + 1] = quadTopLeft;
        this._iData[index + 2] = quadTopRight;

        // Right triangle
        this._iData[index + 3] = quadTopRight;
        this._iData[index + 4] = quadBottomRight;
        this._iData[index + 5] = quadBottomLeft; 


        // 2 triangles per theta, 3 vertices per triangle
        index += 6;
      }
    }
  }

  #buildNormalData() {
    this._nDataSize = 3 * this._vDataSize/2;

    this._nData = new Float32Array(this._nDataSize);

    this._nData[0] = 0.0;
    this._nData[1] = 1.0;
    this._nData[2] = 0.0;

    this._nData[this._nDataSize - 3] = 0.0;
    this._nData[this._nDataSize - 2] = -1.0;
    this._nData[this._nDataSize - 1] = 0.0;

    let index = 3;

    for(let i = 2; i < this._vDataSize - 2; i += 2) {
      this._nData[index] = Math.sin(this._vData[i + 1]) * Math.cos(this._vData[i]);
      this._nData[index + 1] = Math.cos(this._vData[i + 1]);
      this._nData[index + 2] = Math.sin(this._vData[i + 1]) * Math.sin(this._vData[i]);

      index += 3;
    }
  }

  #buildWireframeIndexData() {
    // 2 indices per line.
    // Bottom and Top have 1 vertical line per theta.
    // The strips make the right side triangle and bottom horizontal line
    // per theta, and it wraps around nicely.
    this._iDataSize = 2 * 2 * this._thetaN + 2 * 4 * this._thetaN * (this._phiN - 1);

    this._iData = new Uint16Array(this._iDataSize);
    let index = 0; // index within indices list, not i,j, etc.

    // Skip vIndex 0 because that is the north pole
    let topHatStart = 1;

    // Skip north pole, and theta rings up to phiN - 2 instead of
    // phiN - 1 so that the bottom of the last strip is the top of the
    // bottom hat
    let bottomHatStart = 1 + this._thetaN * (this._phiN - 2);

    // 2 floats per vertex, so divide that out to get number of vertices
    let verticesSize = this._vDataSize / 2;

    // 2 indices per line.
    // Theta ring of lines on bottom row.
    // 4 lines per theta in the theta strip.
    // phiN - 2 instead phiN - 1 because last strip is top of bottom hat
    let bottomHatIndexOffset = 2 * this._thetaN + 2 * 4 * this._thetaN * (this._phiN - 2);

    for(let i = 0; i < this.thetaN; i++) {
      // North pole to each theta
      this._iData[index] = 0;
      this._iData[index + 1] = topHatStart + i;

      // Each theta to south pole
      this._iData[bottomHatIndexOffset + index] = bottomHatStart + i;
      this._iData[bottomHatIndexOffset + index + 1] = verticesSize - 1;

      index += 2;
    }

    // 1st index is north pole, so offset by that
    let stripStart = 1;

    for(let i = 1; i < this._phiN - 1; i++) {
      for(let j = 0; j < this._thetaN; j++) {
        // Gotta offset the north pole, and then the theta rings above me
        let quadTopLeft = stripStart + j + (i - 1) * this._thetaN;

        let quadTopRight = quadTopLeft + 1;

        // I'm a whole ring below
        let quadBottomLeft = quadTopLeft + this._thetaN;

        let quadBottomRight = quadBottomLeft + 1;

        // Put me at start of this ring if I reach the last vertex, to complete that circle
        if(j == this._thetaN - 1) {
          quadTopRight = stripStart + (i - 1) * this._thetaN;
          quadBottomRight = quadTopRight + this._thetaN;
        }

        // horizontal top
        this._iData[index] = quadTopLeft;
        this._iData[index + 1] = quadTopRight;

        // vertical right
        this._iData[index + 2] = quadTopRight;
        this._iData[index + 3] = quadBottomRight;

        // diagnol
        this._iData[index + 4] = quadBottomRight;
        this._iData[index + 5] = quadTopLeft;

        // horizontal bottom
        this._iData[index + 6] = quadBottomLeft;
        this._iData[index + 7] = quadBottomRight;

        // 2 indices per line, 4 lines per theta
        index += 8;
      }
    }
  }
}


Demos.Sphere = class {
  // TODO: Make scene object so that surface can have same light as other
  // Objects. Update wireframe to use lighting as well.
  constructor(args) {
    this.#constructorValidator(args);

    this._scene = args.scene;

    this._thetaN = args.thetaN ?? 50;
    this._phiN = args.phiN ?? 50;
    this._rho = args.rho ?? 5.0;
    this._mode = args.mode ?? 'SURFACE';

    this._color = args.color ?? [0.8, 0.2, 0.2];

    this._latticeArgs = {
      thetaN: this._thetaN,
      phiN: this._phiN,
      mode: this._mode
    };

    this._model = glMatrix.mat4.create();
  }


  get model() {
    return this._model;
  }

  set model(newModel) {
    this._model = newModel;
  }

  get color() {
    return this._color;
  };

  set color(newColor) {
    if(!(typeof newColor === 'array' && newColor.length() === 3)) {
      throw 'SphereError: color must be an array of 3 floats between 0 and 1';
    }

    for(let i = 0 ; i < newColor.length(); i++) {
      if(newColor[i] < 0 || newColor[i] > 1) {
        throw 'SphereError: color must be an array of 3 floats between 0 and 1';
      }
    }

    this._color = newColor;
  };


  init() {
    this.#buildProgram();

    this.#initBuffers();

    this.#initUniforms();
  }

  destroy() {
    this.#destroyProgram();

    this.#destroyBuffers();
  }

  draw() {
    this._scene.gl.useProgram(this._program);

    this.#loadBuffers();

    this.#loadUniforms();

    if(this._mode === 'WIREFRAME') {
      this._scene.gl.drawElements(this._scene.gl.LINES, this._iDataSize, this._scene.gl.UNSIGNED_SHORT, 0);
    }else {
      this._scene.gl.drawElements(this._scene.gl.TRIANGLES, this._iDataSize, this._scene.gl.UNSIGNED_SHORT, 0);
    }
  }


  #constructorValidator(args) {
    if(!(args.glContext instanceof WebGLRenderingContext || Demos.gl instanceof WebGLRenderingContext)) {
      throw "SphereError: Invalid argument provided, glContext must be a WebGLRenderingContext";
    }

    let invalidNumberArg = null

    if(
      !([null, undefined].includes(args.thetaN) || typeof args.thetaN === 'number')
    ) {
      invalidNumberArg = 'thetaN';
    }else if(
      !([null, undefined].includes(args.phiN) || typeof args.phiN === 'number')
    ) {
      invalidNumberArg = 'phiN';
    }else if(
      !([null, undefined].includes(args.rho) || typeof args.rho === 'number')
    ) {
      invalidNumberArg = 'rho';
    }

    if(invalidNumberArg) {
      throw `SphereError: Invalid argument provided, ${invalidNumberArg} must be of type 'number' or not provided`
    }

    if(![null, undefined, 'SURFACE', 'WIREFRAME'].includes(args.mode)) {
      throw "SphereError: Invalid argument provided, mode must be empty or one of (SURFACE,WIREFRAME)";
    }
  }

  #buildProgram() {
    const fShaderSource = `
      #version 100

      precision mediump float;

      // Uses Blinn-Phong Lighting

      varying vec3 vNormal;
      varying vec3 vFragmentPosition;

      uniform vec3 uLightPosition; // in world space
      uniform vec3 uCameraPosition; // in world space
      uniform vec3 uLightColor;
      uniform vec3 uObjectColor;

      void main() {
        // Normalize interpolated normal
        vec3 N = normalize(vNormal);

        // Direction from fragment to light
        vec3 L = normalize(uLightPosition - vFragmentPosition);

        // Diffuse
        float diff = max(dot(N, L), 0.0);

        // Ambient
        float ambientStrength = 0.1;
        vec3 ambient = ambientStrength * uLightColor;

        // Specular
        float specularStrength = 0.5;
        vec3 V = normalize(uCameraPosition - vFragmentPosition);
        vec3 H = normalize(L + V); // half vector
        float spec = pow(max(dot(N, H), 0.0), 32.0);

        vec3 diffuse = diff * uLightColor;
        vec3 specular = specularStrength * spec * uLightColor;

        vec3 result = (ambient + diffuse + specular) * uObjectColor;

        gl_FragColor = vec4(result, 1.0);
      }
    `;

    const vShaderSource = `
      #version 100

      attribute vec2 aPosition;

      attribute vec3 aNormal;

      uniform mat4 uModel;
      uniform mat4 uCamera;
      uniform mat4 uProjection;

      uniform float rho;

      // Inverse-Transpose of upper-left 3x3 matrix of uModel
      uniform mat3 uNormalMatrix;

      varying vec3 vNormal;
      varying vec3 vFragmentPosition;

      void main() {
        float x = rho * sin(aPosition.y) * cos(aPosition.x);
        float y = rho * cos(aPosition.y);
        float z = rho * sin(aPosition.y) * sin(aPosition.x);

        vec4 worldPosition = uModel * vec4(x, y, z, 1.0);

        vFragmentPosition = worldPosition.xyz;

        vNormal = normalize(uNormalMatrix * aNormal);

        gl_Position = uProjection * uCamera * worldPosition;
      }
    `;

    const vertexShader = this._scene.gl.createShader(this._scene.gl.VERTEX_SHADER);
    this._scene.gl.shaderSource(vertexShader, vShaderSource);
    this._scene.gl.compileShader(vertexShader);

    const fragmentShader = this._scene.gl.createShader(this._scene.gl.FRAGMENT_SHADER);
    this._scene.gl.shaderSource(fragmentShader, fShaderSource);
    this._scene.gl.compileShader(fragmentShader);

    this._program = this._scene.gl.createProgram();

    this._scene.gl.attachShader(this._program, vertexShader);
    this._scene.gl.attachShader(this._program, fragmentShader);

    this._scene.gl.linkProgram(this._program);

    this._scene.gl.detachShader(this._program, vertexShader);
    this._scene.gl.detachShader(this._program, fragmentShader);

    this._scene.gl.deleteShader(vertexShader);
    this._scene.gl.deleteShader(fragmentShader);

    if(!this._scene.gl.getProgramParameter(this._program, this._scene.gl.LINK_STATUS)) {
      const linkErrLog = this._scene.gl.getProgramInfoLog(this._program);
      Demos.webgl_status.style.display = 'block';
      Demos.webgl_status.textContent = `SphereError: Shader program did not link successfully. Error log: ${linkErrLog}`;
      throw new Error(`Program failed to link: ${linkErrLog}`);
    }
  }

  #destroyProgram() {
    this._scene.gl.useProgram(null);

    if(this._program) {
      this._scene.gl.deleteProgram(this._program);
    }
  }

  #initBuffers() {
    const lattice = new Demos.SphereLattice(this._latticeArgs);

    this._iDataSize = lattice.iDataSize;

    this._aPosition = this._scene.gl.getAttribLocation(this._program, "aPosition");
    this._scene.gl.enableVertexAttribArray(this._aPosition);

    this._aNormal = this._scene.gl.getAttribLocation(this._program, "aNormal");
    this._scene.gl.enableVertexAttribArray(this._aNormal);

    this._latticeBuffer = this._scene.gl.createBuffer();
    this._scene.gl.bindBuffer(this._scene.gl.ARRAY_BUFFER, this._latticeBuffer);
    this._scene.gl.vertexAttribPointer(this._aPosition, 2, this._scene.gl.FLOAT, false, 0, 0);
    this._scene.gl.bufferData(this._scene.gl.ARRAY_BUFFER, lattice.vData, this._scene.gl.STATIC_DRAW);

    this._indexBuffer = this._scene.gl.createBuffer();
    this._scene.gl.bindBuffer(this._scene.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    this._scene.gl.bufferData(this._scene.gl.ELEMENT_ARRAY_BUFFER, lattice.iData, this._scene.gl.STATIC_DRAW);

    this._normalBuffer = this._scene.gl.createBuffer();
    this._scene.gl.bindBuffer(this._scene.gl.ARRAY_BUFFER, this._normalBuffer);
    this._scene.gl.vertexAttribPointer(this._aNormal, 3, this._scene.gl.FLOAT, false, 0, 0);
    this._scene.gl.bufferData(this._scene.gl.ARRAY_BUFFER, lattice.nData, this._scene.gl.STATIC_DRAW);
  }

  #destroyBuffers() {
    if(this._latticeBuffer) {
      this._scene.gl.deleteBuffer(this._latticeBuffer);
    }

    if(this._indexBuffer) {
      this._scene.gl.deleteBuffer(this._indexBuffer);
    }

    if(this._normalBuffer) {
      this._scene.gl.deleteBuffer(this._normalBuffer);
    }
  }

  #initUniforms() {
    this._uModel = this._scene.gl.getUniformLocation(this._program, "uModel");
    this._uCamera = this._scene.gl.getUniformLocation(this._program, "uCamera");
    this._uProjection = this._scene.gl.getUniformLocation(this._program, "uProjection");

    this._uNormalMatrix = Demos.gl.getUniformLocation(this._program, "uNormalMatrix");

    this._uRho = this._scene.gl.getUniformLocation(this._program, "rho");

    this._uLightPosition = Demos.gl.getUniformLocation(this._program, "uLightPosition");
    this._uCameraPosition = Demos.gl.getUniformLocation(this._program, "uCameraPosition");

    this._uLightColor = this._scene.gl.getUniformLocation(this._program, "uLightColor");
    this._uObjectColor = this._scene.gl.getUniformLocation(this._program, "uObjectColor");
  }

  #loadBuffers() {
    this._scene.gl.enableVertexAttribArray(this._aPosition);
    this._scene.gl.enableVertexAttribArray(this._aNormal);

    this._scene.gl.bindBuffer(this._scene.gl.ARRAY_BUFFER, this._latticeBuffer);
    this._scene.gl.vertexAttribPointer(this._aPosition, 2, this._scene.gl.FLOAT, false, 0, 0);

    this._scene.gl.bindBuffer(this._scene.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

    this._scene.gl.bindBuffer(this._scene.gl.ARRAY_BUFFER, this._normalBuffer);
    this._scene.gl.vertexAttribPointer(this._aNormal, 3, this._scene.gl.FLOAT, false, 0, 0);
  }

  #loadUniforms() {
    this._scene.gl.uniformMatrix4fv(this._uModel, false, this._model);
    this._scene.gl.uniformMatrix4fv(this._uCamera, false, this._scene.camera.matrix);
    this._scene.gl.uniformMatrix4fv(this._uProjection, false, this._scene.projection.matrix);

    const normalMatrix = glMatrix.mat3.create();
    glMatrix.mat3.fromMat4(normalMatrix, this._model);
    glMatrix.mat3.invert(normalMatrix, normalMatrix);
    glMatrix.mat3.transpose(normalMatrix, normalMatrix);
    this._scene.gl.uniformMatrix3fv(this._uNormalMatrix, false, normalMatrix);

    this._scene.gl.uniform1f(this._uRho, this._rho);

    const cameraPosition = this._scene.camera.position
    this._scene.gl.uniform3fv(this._uCameraPosition, [cameraPosition[0], cameraPosition[1], cameraPosition[2]]);

    this._scene.gl.uniform3fv(this._uLightPosition, this._scene.light.position);
    this._scene.gl.uniform3fv(this._uLightColor, this._scene.light.color);

    this._scene.gl.uniform3fv(this._uObjectColor, this._color);
  }
};
