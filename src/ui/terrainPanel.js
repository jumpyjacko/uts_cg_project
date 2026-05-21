export function initGenerateButton(terrain) {
    const generateBtn = document.getElementById('generate-btn');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            terrain.generate();
        });
    }
}
