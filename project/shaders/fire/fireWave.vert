attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float waveFactor;

varying vec2 vTextureCoord;

// fire effect with waving effect
// bottom vertex are stable, top flicks
// side-to-side movements (cos and sin)

void main() {
    // flame-like waving effect for top vertex
    vec3 position = aVertexPosition;
    float topVertexThreshold = 0.95;
    
    // effect to vertices that are truly at the top (y > threshold)
    if (aVertexPosition.y > topVertexThreshold) {
        // random-like movement
        float time1 = timeFactor * 0.07;
        float time2 = timeFactor * 0.05;
        float time3 = timeFactor * 0.03;
        
        // noise variation
        float noise1 = sin(time1 + position.x * 4.0 + position.z * 2.5) * cos(time2 + position.z * 3.0);
        float noise2 = cos(time2 + position.z * 3.0 + position.x * 1.8) * sin(time3 + position.x * 2.2);
        
        // horizontal displacement in x and z for top vertex
        position.x += noise1 * 0.2 * waveFactor;
        position.z += noise2 * 0.2 * waveFactor;
        
        //vertical movement for top vertex
        position.y += (sin(time1 * 1.5) * 0.05 + cos(time2 * 2.0) * 0.03) * waveFactor;
    }
    
    vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
