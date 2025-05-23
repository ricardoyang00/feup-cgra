#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
    // Sample the texture at the current coordinates
    vec4 color = texture2D(uSampler, vTextureCoord);
    
    // Create a more dynamic pulsing effect
    float pulseBase = sin(timeFactor * 0.1) * 0.5 + 0.5; // 0.0 to 1.0 range
    float pulseVariation = sin(timeFactor * 0.05 + vTextureCoord.y * 5.0) * 0.3; // Variation based on Y texture coordinate
    float pulseEffect = 0.05 * (pulseBase + pulseVariation);
    
    // Enhance reds and yellows for the fire effect, varying with time
    color.r = min(1.0, color.r * (1.0 + pulseEffect * 1.2));
    color.g = min(1.0, color.g * (1.0 + pulseEffect * 0.8));
    
    // Preserve the alpha channel for proper blending
    gl_FragColor = color;
}
