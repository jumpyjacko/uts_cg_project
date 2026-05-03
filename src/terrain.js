import * as THREE from 'three';

import { Perlin } from './noise.js';

export const terrain = (world, noiseScale = 0.05, elevationScale = 40) => {
    const perlin = new Perlin();
    const terrain = new THREE.Group();

    const size = 2;
    const gridWidth = 20;
    const gridHeight = 25;

    const hexW = Math.sqrt(3) * size + 0.25;
    const hexH = (3 / 2) * size + 0.1;

    const totalWidth = (gridWidth - 1) * hexW;
    const totalHeight = (gridHeight - 1) * hexH;

    const offsetX = -totalWidth / 2;
    const offsetZ = -totalHeight / 2;

    for (let q = 0; q < gridWidth; q++) {
        for (let r = 0; r < gridHeight; r++) {
            let posX = q * hexW;
            if (r % 2 === 1) posX += hexW / 2;
            let posZ = r * hexH;

            const finalX = posX + offsetX;
            const finalZ = posZ + offsetZ;

            let dist = Math.sqrt(finalX * finalX + finalZ * finalZ);
            const maxDist = Math.sqrt(Math.pow(totalWidth / 2, 2) + Math.pow(totalHeight / 2, 2)) * 0.8;


            if (dist > maxDist) { continue; }

            let noiseValue = perlin.get(finalX * noiseScale, finalZ * noiseScale);
            noiseValue = (noiseValue + 1) * 0.5;

            if (noiseValue === 0) continue;

            const grassMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHex(0x6a994e),
                flatShading: true,
            });
            const sandMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHex(0xfefae0),
                flatShading: true,
            });


            const height = (noiseValue * elevationScale);
            const geometry = new THREE.CylinderGeometry(size, size, height, 6);
            const hex = new THREE.Mesh(geometry, noiseValue < 0.15 ? sandMaterial : grassMaterial);
            hex.castShadow = true;
            hex.receiveShadow = true;

            hex.position.set(finalX, height / 2, finalZ);

            terrain.add(hex);
        }
    }

    world.add(terrain);
};
