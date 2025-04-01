#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {
    vec2 animatedTexCoord = vTextureCoord + vec2(timeFactor / 100.0);
    
    animatedTexCoord = fract(animatedTexCoord);

    vec4 color = texture2D(uSampler, animatedTexCoord);
    
    float displacement = texture2D(uSampler2, animatedTexCoord).r * 0.15;
    color.rgb += displacement;

    gl_FragColor = color;
}