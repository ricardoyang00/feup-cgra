attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float waveFactor;

varying vec2 vTextureCoord;

void main() {
    // Create a flame-like waving effect
    vec3 position = aVertexPosition;
    
    // Only apply the effect to the top vertex (y is positive)
    // The intensity of the effect decreases as we move down the triangle
    float waveAmount = max(0.0, aVertexPosition.y);
    
    if (waveAmount > 0.0) {
        // Random-like movement using sin/cos with different frequencies
        float offset1 = sin(timeFactor * 0.06 + position.x * 3.0) * 0.15 * waveAmount * waveFactor;
        float offset2 = cos(timeFactor * 0.04 + position.z * 2.5) * 0.1 * waveAmount * waveFactor;
        
        // Apply displacement proportional to how high the vertex is
        position.x += offset1;
        position.z += offset2;
        
        // Add a slight up/down movement for the top point only
        if (aVertexPosition.y > 0.9) {
            position.y += sin(timeFactor * 0.05) * 0.05 * waveFactor;
        }
    }
    
    // Pass texture coordinates to fragment shader
    vTextureCoord = aTextureCoord;
    
    // Apply transformations
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
