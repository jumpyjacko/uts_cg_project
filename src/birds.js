import * as THREE from 'three';

const BIRD_CONFIG = {
    maxBirds: 20,
    spawnRadius: 140,
    despawnRadius: 190,
    minHeight: 25,
    maxHeight: 70,
    minSpeed: 8,
    maxSpeed: 18,
    scale: 2,
    minSpawnDelya: 1,
    maxSpawnDelay: 3,
    maxLife: 25,
    bobStrength: 0.02,
    bobSpeed: 0.003,
};

export class Birds {
    constructor(world) {
        this.world = world;
        this.group = new THREE.Group();
        this.birds = [];
        this.spawnTimer = 0;
        this.spawnDelay = THREE.MathUtils.randFloat(
            BIRD_CONFIG.minSpawnDelay,
            BIRD_CONFIG.maxSpawnDelay
        );
    }

    spawnBird() {
        const bird = this.world.assets.bird.clone();
        const side = Math.floor(Math.random() * 4);
        const radius = BIRD_CONFIG.spawnRadius;

        let x;
        let z;

        if (side === 0) {
            x = -radius;
            z = THREE.MathUtils.randFloatSpread(radius * 2);
        } else if (side === 1) {
            x = radius;
            z = THREE.MathUtils.randFloatSpread(radius * 2);
        } else if (side === 2) {
            x = THREE.MathUtils.randFloatSpread(radius * 2);
            z = -radius;
        } else {
            x = THREE.MathUtils.randFloatSpread(radius * 2);
            z = radius;
        }
    }
}