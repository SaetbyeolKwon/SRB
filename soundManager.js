const audioConfig = {
    "Polar Express by Chris": { id: "seeingIsBelieving", src: "sounds/Seeing Is Believing.mp3", loop: true, volume: 0.4 },
    "From outside came the": { id: "steam01", src: "sounds/steam01.m4a", volume: 1.0 },
    "and out the door": { id: "allAboard01", src: "sounds/allAboard01.m4a", volume: 1.0 },
    "to the North Pole": { id: "whyToTheNorthPole01", src: "sounds/whyToTheNorthPole01.m4a", volume: 1.0 },
    "The train was filled": { id: "trainWithOtherChildren01", src: "sounds/trainWithOtherChildren01.m4a", volume: 1.0 },
};

// Because i want to flag the sounds to false until they're played
let soundPlayed = {};
let currentlyPlaying = []; // list of currently playing sounds
let pausedSounds = [];

// Create audio elements and set up triggers
Object.values(audioConfig).forEach(config => {
    const audio = document.createElement("audio");
    audio.id = config.id;
    audio.src = config.src;
    if (config.loop) {
        audio.setAttribute("loop", true);
    }
    // Set default volume to 1.0
    audio.volume = config.volume || 1.0;
    document.body.appendChild(audio);

    // Flag soundPlayed to false
    soundPlayed[config.id] = false;
});

function playSound(text) {
    Object.keys(audioConfig).forEach(trigger => {
        if (text.includes(trigger)) {
            const soundInfo = audioConfig[trigger];
            const soundElement = document.getElementById(soundInfo.id);
            if (soundElement) {
                if (!soundPlayed[soundInfo.id]) {
                    console.log(`Playing sound: ${soundInfo.id}`);
                    soundElement.currentTime = 0; // I needed to set currentTime to 0 to play the sound
                    soundElement.play();
                    // Flagging the sound to true
                    soundPlayed[soundInfo.id] = true;
                    if (!currentlyPlaying.includes(soundInfo.id)) {
                        currentlyPlaying.push(soundInfo.id); // Add to currently playing list
                    }
                }
            } else {
                console.error(`Sound not found: ${soundInfo.id}`);
            }
        }
    });
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
    currentlyPlaying.forEach(id => {
        const soundElement = document.getElementById(id);
        if (soundElement && soundElement.paused) {
            soundElement.play();
        }
    });
    pausedSounds = []; 
}

function stopAllSounds() {
    Object.values(audioConfig).forEach(config => {
        const soundElement = document.getElementById(config.id);
        if (soundElement) {
            soundElement.pause();
            soundElement.currentTime = 0;
        }
        soundPlayed[config.id] = false;
    });
    currentlyPlaying = []; // To clear the current playing list
    pausedSounds = [];
}