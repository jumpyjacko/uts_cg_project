import * as THREE from 'three';

import { Perlin } from './noise.js';

export const terrain = (world) => {
    let perlin = new Perlin();

    const displacement_map = drawHeightmap(perlin);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50, 25, 25),
        new THREE.MeshStandardMaterial({
            wireframe: true,
            color: 0x666666,
            displacementMap: displacement_map,
            displacementScale: 8,
        }),
    )

    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.position.set(0, 0, 0);
    plane.rotateX(-Math.PI / 2);
    world.add(plane);
}


function drawHeightmap(perlin, scale = 0.01) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const img = ctx.createImageData(width, height);
    const data = img.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let n = perlin.get(x * scale, y * scale) +
                perlin.get(x * (scale*2), y * (scale*2));

            // convert -1..1 → 0..255
            let v = Math.floor((n + 1) * 0.5 * 255);

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
