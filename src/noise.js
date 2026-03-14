// Perlin noise algorithm from https://joeiddon.github.io/projects/javascript/perlin.html
export class PerlinNoise {
    constructor(n_nodes) {
        this.grid = [];
        this.nodes = n_nodes;
    }
    
    generate() {
        this.grid.length = 0;

        for (let i = 0; i < this.nodes; i++) {
            let row = [];
            for (let j = 0; j < this.nodes; j++) {
                row.push(random_unit_vector());
            }
            this.grid.push(row);
        }
    }
}

function random_unit_vector() {
    let theta = Math.random() * 2 * Math.PI;
    return { x: Math.cos(theta), y: Math.sin(theta) };
}
