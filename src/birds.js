import * as THREE from 'three';

import { assets } from './assets.js';

const BIRD_CONFIG = {
    maxBirds: 25,
    spawnRadius: 140,
    despawnRadius: 190,
    minHeight: 25,
    maxHeight: 50,
    minSpeed: 10,
    maxSpeed: 20,
    scale: 2,
    minSpawnDelay: 1,
    maxSpawnDelay: 3,
    maxLife: 25,
    bobStrength: 0.02,
    bobSpeed: 0.003,
    flockRadius: 45,
    separationRadius: 14,
    separationStrength: 1.8,
    alignmentStrength: 0.8,
    groupStrength: 0.6,
    turnStrength: 2.5,
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
        const bird = assets.bird.clone();
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

    getBoidForce(bird) {
        const separation = new THREE.Vector3();
        const alignment = new THREE.Vector3();
        const group = new THREE.Vector3();

        let flockCount = 0;

        for (const other of this.birds) {
            if (other === bird) continue;
            const distance = bird.position.distanceTo(other.position);
            if (distance < BIRD_CONFIG.flockRadius) {
                alignment.add(other.userData.velocity);
                group.add(other.position);
                flockCount++;
            }

            if (distance < BIRD_CONFIG.separationRadius) {
                const away = new THREE.Vector3().subVectors(bird.position, other.position).normalize().divideScalar(Math.max(distance, 0.001));
                separation.add(away);
            }
        }

        const force = new THREE.Vector3();
        if (flockCount > 0) {
            alignment.divideScalar(flockCount).normalize();
            alignment.sub(bird.userData.velocity);
            group.divideScalar(flockCount);
            group.sub(bird.position).normalize();
            force.addScaledVector(separation, BIRD_CONFIG.separationStrength);
            force.addScaledVector(alignment, BIRD_CONFIG.alignmentStrength);
            force.addScaledVector(group, BIRD_CONFIG.groupStrength);
        }

        if(bird.position.y < BIRD_CONFIG.minHeight) {
            force.y += 2;
        }

        if (bird.position.y > BIRD_CONFIG.maxHeight) {
            force.y -= 2;
        }

        return force;
    }

    update(delta) {
        this.spawnTimer += delta;

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

            const force = this.getBoidForce(bird);
            bird.userData.velocity.addScaledVector(
                force,
                BIRD_CONFIG.turnStrength * delta
            );

            bird.userData.velocity.y = THREE.MathUtils.clamp(
                bird.userData.velocity.y,-0.25, 0.25
            );

            bird.userData.velocity.normalize();
            bird.position.addScaledVector(
                bird.userData.velocity,
                bird.userData.speed * delta
            );

            bird.lookAt(
                bird.position.x + bird.userData.velocity.x,
                bird.position.y + bird.userData.velocity.y,
                bird.position.z + bird.userData.velocity.z
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
