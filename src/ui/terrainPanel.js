export function initTerrainPanel(terrain) {
    const regenerateBtn = document.getElementById('regenerate-btn');
    const islandSizeRange = document.getElementById('island-size-range');

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            terrain.newSeed();
            terrain.generate();
        });
    }

    islandSizeRange.oninput = function() {
        terrain.setSize(this.value);
        terrain.generate();
    }
}
