#define SCALE 10.0
varying vec2 vUv;
uniform float uTime;

float calculateSurface(float x, float z) {
    float y = 0.0;
    y += (sin(x * 1.0 / SCALE + uTime * 1.0) + sin(x * 2.3 / SCALE + uTime * 1.5) + sin(x * 3.3 / SCALE + uTime * 0.4)) / 3.0;
    y += (sin(z * 0.2 / SCALE + uTime * 1.8) + sin(z * 1.8 / SCALE + uTime * 1.8) + sin(z * 2.8 / SCALE + uTime * 0.8)) / 3.0;
    return y;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += calculateSurface(pos.x, pos.z) * 1.5 * smoothstep(60.0, 90.0, length(vec2(pos.x, pos.y)));    
    pos.z = max(pos.z, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}