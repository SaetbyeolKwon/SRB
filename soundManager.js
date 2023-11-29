const audioConfig = {
    "Polar Express by Chris": { id: "seeingIsBelieving", src: "sounds/Seeing Is Believing.mp3", loop: true, volume: 0.2, fadeOutTrigger: "thundered through the quiet"},
    "From outside came the": { id: "steam01", src: "sounds/steam01.m4a", volume: 1.0 },
    "and out the door": { id: "allAboard01", src: "sounds/allAboard01.m4a", volume: 1.0 },
    "to the North Pole": { id: "whyToTheNorthPole01", src: "sounds/whyToTheNorthPole01.m4a", volume: 1.0 },
    "The train was filled": { id: "trainWithOtherChildren01", src: "sounds/trainWithOtherChildren01.m4a", volume: 1.0 },
    "Soon there were no": { id: "wolves01", src: "sounds/wolves01.m4a", volume: 1.0 },
    "from our train as": { id: "thunder01", src: "sounds/thunder01.wav", volume: 1.0 },
    "Faster and faster we": { id: "theNorthPole", src: "sounds/TheNorthPole.mp3", volume: 0.2 },
};

// Because i want to flag the sounds to false until they're played
let soundPlayed = {};
let currentlyPlaying = []; // list of currently playing sounds
let pausedSounds = [];

document.addEventListener('DOMContentLoaded', setupAudioElements);

// Create audio elements and set up triggers
function setupAudioElements() {
    Object.values(audioConfig).forEach(config => {
        const audio = new Audio(config.src);
        audio.id = config.id;
        // By default no loop and volume is 1.0
        audio.loop = config.loop || false;
        audio.volume = config.volume || 1.0;
        document.body.appendChild(audio);
        soundPlayed[config.id] = false;
    });
}

function playSound(text) {
    Object.keys(audioConfig).forEach(trigger => {
        if (text.includes(trigger)) {
            const soundInfo = audioConfig[trigger];
            const soundElement = document.getElementById(soundInfo.id);

            if (soundElement) {
                if (!soundPlayed[soundInfo.id]) {
                    console.log(`Playing sound: ${soundInfo.id}, volume: ${soundInfo.volume}`);
                    soundElement.currentTime = 0;
                    soundElement.play();
                    // Flagging the sound to true
                    soundPlayed[soundInfo.id] = true;
                    currentlyPlaying.push(soundInfo.id);
                }

                // Trigger fade out
                if (soundInfo.fadeOutTrigger && text.includes(soundInfo.fadeOutTrigger)) {
                    fadeOutSound(soundElement);
                    console.log ("fadout trigger");
                }
            }
        }
    });
}

function fadeOutSound(soundElement) {
    let volume = soundElement.volume;
    const fadeOutInterval = setInterval(() => {
        volume -= 0.1;
        if (volume <= 0) {
            clearInterval(fadeOutInterval);
            soundElement.pause();
            soundElement.currentTime = 0;
            soundElement.volume = audioConfig[soundElement.id].volume; // Reset volume
        } else {
            soundElement.volume = volume;
        }
    }, 200); // Fadeout time
}

function pauseAllSounds() {
    pausedSounds = [];
    currentlyPlaying.forEach(id => {
        const soundElement = document.getElementById(id);
        if (soundElement && !soundElement.paused) {
            soundElement.pause();
            pausedSounds.push(id);
        }
    });
}

function resumeAllSounds() {
    pausedSounds.forEach(id => {
        const soundElement = document.getElementById(id);
        if (soundElement) {
            soundElement.play();
        }
    });
    pausedSounds = [];
}

function stopAllSounds() {
    currentlyPlaying.forEach(id => {
        const soundElement = document.getElementById(id);
        if (soundElement) {
            soundElement.pause();
            soundElement.currentTime = 0;
            soundPlayed[id] = false;
        }
    });
    currentlyPlaying = []; // To clear the current playing list
}
