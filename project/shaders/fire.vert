attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float normScale;

varying vec2 vTextureCoord;

void main() {
  vec3 offset = vec3(0.0, 0.0, 0.0);
  vTextureCoord = aTextureCoord;

  // Pseudo-random seed for per-triangle variation
  float seed = fract(sin(dot(aTextureCoord, vec2(12.9898, 78.233))) * 43758.5453);

  // Waving motion: sinusoidal displacement along x-axis
  float waveAmplitude = 0.3 * normScale; // Increased for visibility
  float waveFrequency = 2.0 + seed * 1.0;
  float wavePhase = seed * 6.28318;
  float wave = waveAmplitude * sin(timeFactor * waveFrequency + wavePhase);

  // Apply waving to the top vertex (y > 0) to simulate flame tip movement
  if (aVertexPosition.y > 0.0) {
    offset.x = wave;
    offset.y = 0.15 * normScale * sin(timeFactor * (waveFrequency + 0.5) + wavePhase); // Increased for visibility
  }

  // Optional: Normal-based displacement
  offset += aVertexNormal * normScale * 0.05 * sin(timeFactor + seed);

  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}