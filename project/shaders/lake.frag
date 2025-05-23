#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uWaterSampler;
uniform float textureScale;
uniform float time;

void main() {
    vec2 scaledTexCoord = vTextureCoord * textureScale;
    vec2 waterTexCoord = scaledTexCoord + vec2(time * 0.05, time * 0.02);
    float mask = texture2D(uMaskSampler, vTextureCoord).r;
    vec4 grassColor = texture2D(uGrassSampler, scaledTexCoord);
    vec4 waterColor = texture2D(uWaterSampler, waterTexCoord);
    gl_FragColor = mix(waterColor, grassColor, mask);
}