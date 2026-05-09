import * as THREE from 'three';

import { Perlin } from './noise.js';

export const terrain = (world, noiseScale = 0.05, elevationScale = 40) => {
    const perlin = new Perlin();
    const terrain = new THREE.Group();

    const size = 2;
    const gridWidth = 40;
    const gridHeight = 45;

    const hexW = Math.sqrt(3) * size + 0.25;
    const hexH = (3 / 2) * size + 0.01;

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
            const maxDist = Math.sqrt(Math.pow(totalWidth / 2, 2) + Math.pow(totalHeight / 2, 2)) * 0.50;

            if (dist > maxDist) { continue; }

            let noiseValue = perlin.get(finalX * noiseScale, finalZ * noiseScale);
            noiseValue = (noiseValue + 1) * 0.5;

            if (noiseValue === 0) continue;

            const height = (noiseValue * elevationScale) - 15;
            const cell = new Cell(height, size, finalX, finalZ);
            
            terrain.add(cell.mesh);
        }
    }

    world.add(terrain);
};

class Cell {
    constructor(height, size, x, z) {
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHex(0x6a7a4a),
            flatShading: true,
        });
        const sandMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHex(0x9c8463),
            flatShading: true,
        });

        const geometry = new THREE.CylinderGeometry(size, size, height, 6);
        this.mesh = new THREE.Mesh(geometry, height < 2 ? sandMaterial : grassMaterial);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.position.set(x, height/2, z);

        this.structure = null;
    }
}
