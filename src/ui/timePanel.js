const timescale = new Proxy({
    timescale: 1,
}, {
    set(target, property, value) {
        target[property] = value;

        if (property === 'timescale') {
            let timeElement = document.getElementById('current-timescale');
            timeElement.textContent = value;
        }

        return true;
    }
})

let paused = false;

export function initTimePanel(world) {
    const pauseBtn = document.getElementById('pause-btn');
    const speedupBtn = document.getElementById('speed-up-btn');
    const slowdownBtn = document.getElementById('slow-down-btn');

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            paused = !paused;

            if (paused) {
                timescale.timescale = 0;
            } else {
                timescale.timescale = 1;
            }

            world.timer.setTimescale(timescale.timescale); // NOTE: gross, im too lazy to change the name
        })
    }

    if (slowdownBtn) {
        slowdownBtn.addEventListener('click', () => {
            timescale.timescale = Math.max(0, timescale.timescale - 1);
            world.timer.setTimescale(timescale.timescale);
        })
    }
    if (speedupBtn) {
        speedupBtn.addEventListener('click', () => {
            timescale.timescale += 1;
            world.timer.setTimescale(timescale.timescale);
        })
    }
}
