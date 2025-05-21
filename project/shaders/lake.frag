#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uWaterSampler;
uniform float textureScale;

void main() {
    vec2 scaledTexCoord = vTextureCoord * textureScale;
    float mask = texture2D(uMaskSampler, vTextureCoord).r;
    vec4 grassColor = texture2D(uGrassSampler, scaledTexCoord);
    vec4 waterColor = texture2D(uWaterSampler, scaledTexCoord);
    gl_FragColor = mix(waterColor, grassColor, mask);
}