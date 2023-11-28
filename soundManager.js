const soundTriggers = {
    "Polar Express by Chris": "background",
    // "From outside came the sounds": "train01",
    // More triggers and sound id
};

function playSound(text) {
    Object.keys(soundTriggers).forEach(trigger => {
        if (text.includes(trigger)) {
            const soundId = soundTriggers[trigger];
            const soundElement = document.getElementById(soundId);
            if (soundElement) {
                console.log(`Playing sound: ${soundId}`);
                soundElement.currentTime = 0;
                soundElement.play();
            } else {
                console.log(`Sound not found: ${soundId}`);
            }
        }
    });
}

function pauseAllSounds() {
    Object.values(soundTriggers).forEach(soundId => {
        const soundElement = document.getElementById(soundId);
        if (soundElement && !soundElement.paused) {
            soundElement.pause();
        }
    });
}

function resumeAllSounds() {
    Object.values(soundTriggers).forEach(soundId => {
        const soundElement = document.getElementById(soundId);
        if (soundElement && soundElement.paused) {
            soundElement.play();
        }
    });
}

function stopAllSounds() {
    Object.values(soundTriggers).forEach(soundId => {
        const soundElement = document.getElementById(soundId);
        if (soundElement) {
            soundElement.pause();
            soundElement.currentTime = 0;
        }
    });
}