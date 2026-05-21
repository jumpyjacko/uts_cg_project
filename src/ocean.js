import * as THREE from 'three';
import oceanvert from './shaders/ocean.vert?raw';
import oceanfrag from './shaders/ocean.frag?raw';
import texture from './textures/water.png';

export class Ocean {
    constructor() {
        this.mat = new THREE.ShaderMaterial({
            uniforms:{uMap:{value: null},
                uTime:{value: 0},
                uColor:{value:new THREE.Color('#4682b4')},
                uIslandMaskRadius:{value: 35.0},
            },
            vertexShader: oceanvert,
            fragmentShader: oceanfrag,
            transparent:true
        });
        const loader = new THREE.TextureLoader();
            loader.load(texture, (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.mat.uniforms.uMap.value = texture;
        });

        const geo = new THREE.PlaneGeometry(500, 500, 500,500 );
        this.mesh = new THREE.Mesh(geo, this.mat);
        this.mesh.rotateX(-Math.PI / 2);
        this.mesh.position.set(0, -0.1, 0);
    }
    update() {
        this.mat.uniforms.uTime.value = performance.now() * 0.001;
    }
}
