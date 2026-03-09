
Demos.BlinnPhongFragementShader = class extends Demos.Shader {
  constructor() {
    super();
    this._shaderSource = `
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

    this._shaderType = Demos.gl.FRAGMENT_SHADER;
  }
}
