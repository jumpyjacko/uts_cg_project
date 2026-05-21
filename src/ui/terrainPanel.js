export function initTerrainPanel(terrain, ocean) {
    const regenerateBtn = document.getElementById('regenerate-btn');
    const islandSizeRange = document.getElementById('island-size-range');
    const noiseScaleRange = document.getElementById('noise-scale-range');

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            terrain.newSeed();
            terrain.generate();
        });
    }

    islandSizeRange.oninput = function() {
        terrain.setSize(this.value);
        terrain.generate();

        ocean.mat.uniforms.uIslandMaskRadius.value = this.value - 10;
    }

    noiseScaleRange.oninput = function() {
        terrain.setNoiseScale(this.value);
        terrain.generate();
    }
}
