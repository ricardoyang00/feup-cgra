#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uWaterSampler;

void main() {
    float mask = texture2D(uMaskSampler, vTextureCoord).r; // 0=water, 1=grass
    vec4 grassColor = texture2D(uGrassSampler, vTextureCoord);
    vec4 waterColor = texture2D(uWaterSampler, vTextureCoord);
    gl_FragColor = mix(waterColor, grassColor, mask);
}