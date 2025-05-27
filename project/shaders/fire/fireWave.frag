#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

// color flickering effect

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    
    // dynamic flickering effect for realistic fire
    float flicker = sin(timeFactor * 0.15) * 0.5 + 0.5; // Base flicker
    flicker += sin(timeFactor * 0.3 + vTextureCoord.y * 8.0) * 0.2;
    flicker *= 0.07; // Scale down the effect

    // reds more intense near the bottom, yellows more intense at the top
    float yFactor = vTextureCoord.y; // Higher = closer to top
    
    // enhance colors based on vertical position and flicker
    color.r = min(1.0, color.r * (1.0 + flicker * 1.2));
    color.g = min(1.0, color.g * (1.0 + flicker * (0.8 + yFactor * 0.3)));
    color.b = min(1.0, color.b * 0.8);
    
    gl_FragColor = color;
}
