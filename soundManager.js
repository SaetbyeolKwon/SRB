const soundTriggers = {
    "The Polar Express by Chris": "background",
    // "From outside came the sounds": "train01",
    // More triggers and sound id
};

function playSound(text) {
    Object.keys(soundTriggers).forEach(trigger => {
        if (text.includes(trigger)) {
            const soundId = soundTriggers[trigger];
            const soundElement = document.getElementById(soundId);
            if (soundElement && !soundElement.playing) {
                soundElement.play();
            }
        }
    });
}

// To check if an audio is playing
HTMLAudioElement.prototype.playing = function() {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
};
