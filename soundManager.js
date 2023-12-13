const audioConfig = {
    "Polar Express by Chris": { id: "seeingIsBelieving", src: "sounds/Seeing Is Believing02.mp3", loop: true, fadeOutTrigger: "knew he was wrong", snowflake: true, volume: 0.2 },
    "Late that night I": { id: "aLongTimeAgo", src: "sounds/A Long Time Ago in a Tower Far Far Away.mp3", loop: true, fadeOutTrigger: "he pulled me aboard", volume: 0.2 },
    "From outside came the": { id: "steam01", src: "sounds/steam01.m4a", volume: 1.0 },
    "and out the door": { id: "allAboard01", src: "sounds/allAboard01.m4a", volume: 1.0 },
    "ran up to him": { id: "wellYouComing01", src: "sounds/wellYouComing.m4a", volume: 1.0 },
    "to the North Pole": { id: "whyToTheNorthPole01", src: "sounds/whyToTheNorthPole01.m4a", volume: 1.0 },
    "The train was filled": { id: "xmasStory", src: "sounds/Xmas Story.mp3", loop: true, bgColor: "#c47f11", snowflake: false, fadeOutTrigger: "Polar Express raced northward", volume: 0.1 },
    "filled with other children": { id: "filledWithChildren01", src: "sounds/filledWithChildren01.m4a", volume: 0.6 },
    "Soon there were no": { id: "clearedToGo", src: "sounds/Cleared To Go.mp3", loop: true, bgColor: "#000", fadeOutTrigger: "Polar Express never slowed", volume: 0.2 },
    "lights to be seen": { id: "wolves01", src: "sounds/wolves01.m4a", volume: 1.0 },
    "from our train as": { id: "thunder01", src: "sounds/thunder01.wav", volume: 1.0 },
    "Faster and faster we": { id: "theNorthPole", src: "sounds/TheNorthPole.mp3", loop: true, fadeOutTrigger: "on a frozen sea", volume: 0.2 },
    "on a frozen sea": { id: "thereIsTheNorthPole01", src: "sounds/thereIsTheNorthPole01.m4a", volume: 1.0 },
    "is the North Pole": { id: "theJoyfulSeason", src: "sounds/The Joyful Season.mp3", loop: true, bgColor: "#5a6f7f", fadeOutTrigger: "choose one of you", volume: 0.2 },
    "the conductor told us": { id: "theFirstGift01", src: "sounds/theFirstGift01.m4a", volume: 1.0 },
    "he will choose one": { id: "heWillChooseOneOfYou01", src: "sounds/heWillChooseOneOfYou01.m4a", volume: 1.0 },
    "one of the children": { id: "lookTheElves01", src: "sounds/lookTheElves.m4a", volume: 0.5 },
    "Polar Express could go": { id: "steam01", src: "sounds/steam01.m4a", volume: 1.0 },
    "pressed through the crowd": { id: "christmasEve", src: "sounds/Christmas Eve.mp3",snowflake: true, loop: true, fadeOutTrigger: "jumped into his sleigh" , volume: 0.2 },
    "conductor handed me up": { id: "christmasEve", src: "sounds/Christmas Eve.mp3", loop: true, volume: 0.2 },
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
        const soundInfo = audioConfig[trigger];
        const soundElement = document.getElementById(soundInfo.id);

        // Check to play sound
        if (text.includes(trigger) && soundElement) {
            if (!soundPlayed[soundInfo.id]) {
                console.log(`Playing sound: ${soundInfo.id}, volume: ${soundInfo.volume}`);
                soundElement.currentTime = 0;
                soundElement.play();
                // Flagging the sound as played
                soundPlayed[soundInfo.id] = true;
                currentlyPlaying.push(soundInfo.id);
                // Check bg color input and change
                if (soundInfo.bgColor) {
                    changeBgColor(soundInfo.bgColor);
                }
                if (soundInfo.hasOwnProperty('snowflake')) {
                    controlSnowflake(soundInfo.snowflake);
                }
            }
        }

        // Check for fade out trigger
        if (soundInfo.fadeOutTrigger && text.includes(soundInfo.fadeOutTrigger) && soundElement) {
            fadeOutSound(soundElement);
            console.log("Fadeout trigger");
        }
    });
}

function changeBgColor(color) {
    document.body.style.backgroundColor = color;
}

function controlSnowflake(shouldAnimate) {
    if (shouldAnimate) {
        startSnowflake();
    } else {
        stopSnowflake();
    }
}

function fadeOutSound(soundElement) {
    let volume = soundElement.volume;
    const fadeOutInterval = setInterval(() => {
        volume -= 0.1;
        if (volume <= 0) {
            clearInterval(fadeOutInterval);
            soundElement.pause();
            soundElement.currentTime = 0;
            soundPlayed[soundElement.id] = false; // Reset the played flag
            const currentlyPlayingIndex = currentlyPlaying.indexOf(soundElement.id);
            if (currentlyPlayingIndex > -1) {
                currentlyPlaying.splice(currentlyPlayingIndex, 1); // Remove from currently playing list
            }
        } else {
            soundElement.volume = volume;
        }
    }, 2500); // Fadeout time 3sec
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
