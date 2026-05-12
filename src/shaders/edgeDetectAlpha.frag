uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform vec2 resolution;
uniform vec3 outlineColor;
uniform float outlineThickness;
varying vec2 vUv;

float robertsCross(float samples[4]) {
    float diff_1 = samples[1] - samples[2];
    float diff_2 = samples[0] - samples[3];
    return sqrt(diff_1 * diff_1 + diff_2 * diff_2);
}

float robertsCrossVec3(vec3 samples[4]) {
    vec3 diff_1 = samples[1] - samples[2];
    vec3 diff_2 = samples[0] - samples[3];
    return sqrt(dot(diff_1, diff_1) + dot(diff_2, diff_2));
}

void main() {
    vec2 texelSize = 1.0 / resolution;
    float hf = floor(outlineThickness * 0.5);
    float hc = ceil(outlineThickness * 0.5);

    vec2 uvs[4];
    uvs[0] = vUv + texelSize * vec2(-hf, hc);
    uvs[1] = vUv + texelSize * vec2(hc, hc);
    uvs[2] = vUv + texelSize * vec2(-hf, -hf);
    uvs[3] = vUv + texelSize * vec2(hc, -hf);

    float depth_samples[4];
    vec3 normal_samples[4];
    float luma_samples[4];

    for (int i = 0; i < 4; i++) {
        depth_samples[i] = texture2D(tDepth, uvs[i]).r;
        normal_samples[i] = texture2D(tNormal, uvs[i]).rgb;
        
        vec3 rgb = texture2D(tDiffuse, uvs[i]).rgb;
        luma_samples[i] = dot(rgb, vec3(0.3, 0.59, 0.11));
    }

    // Edge calculation
    float edgeDepth = robertsCross(depth_samples);
    float edgeNormal = robertsCrossVec3(normal_samples);
    float edgeLuma = robertsCross(luma_samples);

    // Thresholds
    float depthThreshold = 0.005; 
    float normalThreshold = 0.2;
    float lumaThreshold = 2.0;

    float eD = edgeDepth > depthThreshold ? 1.0 : 0.0;
    float eN = edgeNormal > normalThreshold ? 1.0 : 0.0;
    float eL = edgeLuma > lumaThreshold ? 1.0 : 0.0;

    float edge = max(eD, max(eN, eL));

    vec4 sceneColor = texture2D(tDiffuse, vUv);
    
    float edgeDarkness = 0.5;
    vec4 darkenedScene = vec4(sceneColor.rgb * edgeDarkness, sceneColor.a);
    // Final output: if edge, use outline color, else use scene
    gl_FragColor = edge * sceneColor;
}
