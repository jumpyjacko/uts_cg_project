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
    minSpawnDelay: 1,
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

        bird.position.set(
            x,
            THREE.MathUtils.randFloat(BIRD_CONFIG.minHeight, BIRD_CONFIG.maxHeight),
            z
        );

        const target = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(radius),
            THREE.MathUtils.randFloat(BIRD_CONFIG.minHeight, BIRD_CONFIG.maxHeight),
            THREE.MathUtils.randFloatSpread(radius)
        );

        const direction = target.sub(bird.position).normalize();

        bird.userData.velocity = direction;
        bird.userData.speed = THREE.MathUtils.randFloat(
            BIRD_CONFIG.minSpeed,
            BIRD_CONFIG.maxSpeed
        );
        bird.userData.life = 0;
        bird.userData.bobOffset = Math.random() * Math.PI * 2;

        bird.lookAt(
            bird.position.x + direction.x,
            bird.position.y + direction.y,
            bird.position.z + direction.z
        );

        bird.scale.setScalar(BIRD_CONFIG.scale);
        bird.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        this.group.add(bird);
        this.birds.push(bird);
    }

    update(delta) {
        this.spawnTimer += delta

        if (this.spawnTimer >= this.spawnDelay && this.birds.length < BIRD_CONFIG.maxBirds) {
            this.spawnBird();
            this.spawnTimer = 0;
            this.spawnDelay = THREE.MathUtils.randFloat(
                BIRD_CONFIG.minSpawnDelay,
                BIRD_CONFIG.maxSpawnDelay
            );
        }

        for (let i = this.birds.length - 1; i >= 0; i--) {
            const bird = this.birds[i];
            bird.position.addScaledVector(
                bird.userData.velocity,
                bird.userData.speed * delta
            );

            bird.position.y += Math.sin(Date.now() * BIRD_CONFIG.bobSpeed + bird.userData.bobOffset) * BIRD_CONFIG.bobStrength;
            bird.userData.life += delta;
            if (bird.userData.life > BIRD_CONFIG.maxLife || Math.abs(bird.position.x) > BIRD_CONFIG.despawnRadius || Math.abs(bird.position.z) > BIRD_CONFIG.despawnRadius) {
                this.group.remove(bird);
                this.birds.splice(i, 1);
            }
        }
    }
}