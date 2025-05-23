#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);

  // Subtle brightness flicker for realism
  float flicker = 0.9 + 0.1 * sin(timeFactor * 5.0);
  color.rgb *= flicker;

  gl_FragColor = color;
}