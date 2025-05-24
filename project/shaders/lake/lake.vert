attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float time;
uniform vec2 uHeliPos;
uniform float uTurbulence;
uniform float heightScale;
uniform float waterDisturbance;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    // world coordinates matching the fragment shader
    vec2 worldCoord = (aTextureCoord - 0.5) * 1000.0;
    float dist = length(worldCoord - uHeliPos);

    
    // sine function based on distance and time
    float waveSpeed = 10.0;
    float waveFrequency = 0.1;
    float phase = dist * waveFrequency - time * waveSpeed;
    float wave = sin(phase);
    
    // small radius for the turbulence effect
    float radius = 20.0;
    float fade = 1.0 - smoothstep(0.0, radius, dist);  // 1 at center, 0 at radius
    
    // displacement calculation, weak at center, stronger at radius
    float displacement = uTurbulence * waterDisturbance * fade * wave * heightScale;

    vec3 displacedPosition = aVertexPosition + vec3(0.0, 0.0, displacement);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}