
Demos.SphereVertexShader = class extends Demos.Shader {
  constructor() {
    super();
    this._shaderSource = `
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

    this._shaderType = Demos.gl.VERTEX_SHADER;
  }
}
