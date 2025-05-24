#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uWaterSampler;
uniform float textureScale;
uniform float time;
uniform vec2 uHeliPos;
uniform float uTurbulence;

void main() {
    vec2 scaledTexCoord = vTextureCoord * textureScale;

    // grass movement
    vec2 grassWind = vec2(
        sin(time * 0.3 + vTextureCoord.y * 10.0), 
        cos(time * 0.2 + vTextureCoord.x * 8.0)) * 0.01;
    vec2 grassTexCoord = scaledTexCoord + grassWind;

    // water movement
    vec2 waterMove = vec2(
        sin(time * 0.07 + vTextureCoord.y * 12.0) * 0.02,
        cos(time * 0.09 + vTextureCoord.x * 15.0) * 0.02
    );
    vec2 waterTexCoord = scaledTexCoord + waterMove + vec2(time * 0.05, time * 0.02);

    vec2 worldCoord = (vTextureCoord - 0.5) * 1000.0;
    float dist = length(worldCoord - uHeliPos);

    float radius = 80.0;
    float fade = smoothstep(radius, radius * 0.7, dist);

    // dynamic wave pattern with turbulence influence
    float baseWave = sin(10.0 * dist - time * 8.0)
                   + 0.5 * sin(15.0 * dist - time * 12.0)
                   + 0.3 * sin(22.0 * dist + time * 6.0 + cos(time + dist) * 2.0);

    // add turbulence modulation for extra movement
    float turbulenceMod = 1.0 + uTurbulence * 0.5 * sin(time * 2.0 + dist * 0.2);
    float wave = baseWave * turbulenceMod;

    float mask = texture2D(uMaskSampler, vTextureCoord).r;
    float turbulence = uTurbulence * fade * wave * 0.015 * (1.0 - mask);

    // some randomness to turbulence direction
    float angle = sin(dist * 0.1 + time) * 3.1415;
    vec2 dir = normalize(worldCoord - uHeliPos + vec2(cos(angle), sin(angle)) * 0.2);
    waterTexCoord += dir * turbulence;

    // color variation for water
    vec4 waterColor = texture2D(uWaterSampler, waterTexCoord);
    waterColor.rgb += vec3(0.00, -0.01, 0.04) * sin(time + vTextureCoord.xyx * 20.0) * 0.7;

    vec4 grassColor = texture2D(uGrassSampler, grassTexCoord);

    gl_FragColor = mix(waterColor, grassColor, mask);
}