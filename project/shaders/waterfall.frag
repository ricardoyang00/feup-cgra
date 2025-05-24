precision mediump float;
uniform float uTime;
uniform sampler2D uSampler;

varying vec2 vTexCoord;

void main(void) {
    vec2 animatedCoord = fract(vTexCoord + vec2(0.0, uTime * 0.7));
    vec4 texColor = texture2D(uSampler, animatedCoord);
    vec3 waterColor = mix(texColor.rgb, vec3(0.2, 0.5, 1.0), 0.5);
    float alpha = 0.7 * (1.0 - smoothstep(0.8, 1.0, vTexCoord.y)); // fade out at bottom
    gl_FragColor = vec4(waterColor, alpha);
}