import * as THREE from 'three';

import { Perlin } from './noise.js';

export const terrain = (world) => {
    let perlin = new Perlin();

    const displacement_map = drawHeightmap(perlin);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50, 10, 10),
        new THREE.MeshToonMaterial({
            // wireframe: true,
            color: 0xaaffaa,
            displacementMap: displacement_map,
            displacementScale: 10,
        }),
    )

    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.position.set(0, -1, 0);
    plane.rotateX(-Math.PI / 2);
    world.add(plane);
}


function drawHeightmap(perlin, scale = 0.01) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = 128;
    const height = canvas.height = 128;

    const img = ctx.createImageData(width, height);
    const data = img.data;

    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // radial gradient
            let dx = x - cx;
            let dy = y - cy;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let t = dist / maxDist;
            t = Math.min(Math.max(t, 0), 1);
            let falloff = 1 - perlin.smootherstep(t);

            let n =
                perlin.get(x * scale, y * scale) +
                perlin.get(x * scale * 2, y * scale * 2);
            n = (n + 1) * 0.5;

            n *= falloff;

            // convert -1..1 → 0..255
            let v = Math.floor(n * 255);

            let i = (y * width + x) * 4;

            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(canvas);
}
