
Demos.Renderer = class {
  constructor(args) {
    this._vShader = args.vertexShader;

    this._fShader = args.fragmentShader;
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
}
