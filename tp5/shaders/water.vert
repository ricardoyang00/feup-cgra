attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;
uniform float heightScale;
uniform float timeFactor;

void main() {
    vTextureCoord = aTextureCoord;

    vec2 animatedCoord = aTextureCoord + vec2(0.0, timeFactor / 100.0);
    if (animatedCoord.y > 1.0) {
        animatedCoord.y -= 1.0; // Wrap around the texture coordinates
    }

    float height = texture2D(uSampler2, animatedCoord).r;

    vec3 displacedPosition = aVertexPosition + vec3(0.0, 0.0, height * heightScale);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}

