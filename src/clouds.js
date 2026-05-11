import * as THREE from 'three';

const CLOUD_CONFIG = {
    count:  10,   // clouds in the ring
    radius: 150,   // ring radius around island centre
    height: 50,   // base height
    size:   8,    // base cloud size (puffs + count auto-randomise per cloud)
};

export class Clouds {
    constructor() {
        this.group = new THREE.Group();
        this.clouds = [];

        this.mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            brightness: 1.5,
            roughness: 1.0,
            metalness: 0.0,
        });

        this.create();
    }

    create() {
        const { count, radius, height, size } = CLOUD_CONFIG;

        for (let i = 0; i < count; i++) {
            // evenly distribute around ring with a little random offset
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const r     = radius + (Math.random() - 0.5) * 24;
            const cx    = Math.cos(angle) * r;
            const cz    = Math.sin(angle) * r;
            const cy    = height + (Math.random() - 0.5) * 16;
            const s     = size * (0.7 + Math.random() * 0.7);

            const cloud = this._makeCloud(cx, cy, cz, s);
            this.clouds.push(cloud);
            this.group.add(cloud);
        }
    }

    _makeCloud(cx, cy, cz, size) {
        const cloud  = new THREE.Group();
        const nPuffs = Math.round(7 + Math.random() * 9); // 7–16

        // centre puff
        const centre = new THREE.Mesh(new THREE.SphereGeometry(size, 7, 7), this.mat);
        centre.castShadow = true;
        cloud.add(centre);

        // surrounding puffs arranged in a flat-ish ring with some vertical variation
        for (let i = 0; i < nPuffs; i++) {
            const angle  = (i / nPuffs) * Math.PI * 2;
            const dist   = (0.3 + Math.random() * 0.8) * size;
            const puff   = new THREE.Mesh(
                new THREE.SphereGeometry((0.4 + Math.random() * 0.45) * size, 7, 7),
                this.mat
            );
            puff.castShadow = true;
            puff.position.set(
                Math.cos(angle) * dist,
                (-0.3 + Math.random() * 0.9) * size,
                Math.sin(angle) * dist * 0.5
            );
            cloud.add(puff);
        }

        cloud.position.set(cx, cy, cz);
        cloud.rotation.y = Math.random() * Math.PI * 2;

        // store per-cloud drift data
        cloud.userData.driftSpeed = 0.3 + Math.random() * 0.5;
        cloud.userData.driftOffset = Math.random() * Math.PI * 2; // so they don't all sync up

        return cloud;
    }

    update(delta) {
        // slowly rotate the whole ring so clouds drift around the island
        this.group.rotation.y += 0.0008 * delta * 60; // delta-normalised

        // subtle individual bob per cloud
        const t = performance.now() * 0.001;
        this.clouds.forEach(cloud => {
            cloud.position.y += Math.sin(t * cloud.userData.driftSpeed + cloud.userData.driftOffset) * 0.005;
        });
    }
}
