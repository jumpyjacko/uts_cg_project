import * as THREE from 'three';

import { Perlin } from './noise.js';

export const terrain = (world, noiseScale = 0.1, elevationScale = 10) => {
    const perlin = new Perlin();
    const terrain = new THREE.Group();
    
    const size = 1; 
    const gridWidth = 20;
    const gridHeight = 25;

    const hexW = Math.sqrt(3) * size;
    const hexH = (3/2) * size;

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
            
            let t = dist / maxDist;
            t = Math.min(Math.max(t, 0), 1);
            
            let falloff = 1 - Math.pow(t, 2); 
            falloff = Math.max(0, falloff);

            let noiseValue = perlin.get(finalX * noiseScale, finalZ * noiseScale);
            noiseValue = (noiseValue + 1) * 0.5; 
            noiseValue *= falloff;

            const height = 1 + (noiseValue * elevationScale);
            const geometry = new THREE.CylinderGeometry(size, size, height, 6);
            const material = new THREE.MeshStandardMaterial({ 
                color: new THREE.Color().setHSL(0.3, 0.5, 0.2 + noiseValue * 0.5) 
            });
            
            const hex = new THREE.Mesh(geometry, material);
            hex.castShadow = true;
            hex.receiveShadow = true;
            
            hex.position.set(finalX, height / 2, finalZ);
            
            terrain.add(hex);
        }
    }

    world.add(terrain);
};
