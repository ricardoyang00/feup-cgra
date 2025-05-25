#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float time;
uniform vec2 uHeliPos;
uniform float uTurbulence;
uniform float heightScale;
uniform float waterDisturbance;
uniform sampler2D uMaskSampler;

out vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    float mask = texture(uMaskSampler, aTextureCoord).r;
    float isLake = 1.0 - smoothstep(0.05, 0.10, mask);

    // match fragment shader
    vec2 worldCoord = (aTextureCoord - 0.5) * 1000.0;
    float dist = length(worldCoord - uHeliPos);

    float radius = 60.0;
    float proximityFade = 1.0 - smoothstep(0.0, radius, dist);

    float waveFreq = 0.15;
    float waveSpeed = 12.0;
    float wave = 
        sin(dist * waveFreq - time * waveSpeed) +
        0.5 * sin(dist * waveFreq * 1.8 - time * waveSpeed * 1.5 + 1.0) +
        0.3 * sin(dist * waveFreq * 2.5 + time * 4.0 + cos(dist * 0.2) * 2.0);

    float pulse = sin(time * 5.0 + dist * 0.3);
    float turbulenceMod = mix(1.0, 1.0 + 0.5 * pulse, uTurbulence); // fades in with turbulence

    float turbulenceFade = uTurbulence * proximityFade;

    float displacement = isLake * waterDisturbance * heightScale * wave * turbulenceMod * turbulenceFade * 2.0;

    vec3 displacedPosition = aVertexPosition + vec3(0.0, 0.0, displacement);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}
