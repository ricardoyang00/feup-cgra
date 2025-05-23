precision mediump float;

uniform sampler2D uSampler;
uniform float uTime;

varying vec2 vTexCoord;

void main(void) {
    vec2 animatedCoord = fract(vTexCoord + vec2(uTime * 0.1, 0.0));
    vec4 texColor = texture2D(uSampler, animatedCoord);
    vec3 waterColor = mix(texColor.rgb, vec3(0.2, 0.5, 0.8), 0.4);
    gl_FragColor = vec4(waterColor, 0.9);
}