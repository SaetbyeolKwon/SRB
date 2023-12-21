const audioConfig = {
    "Express by Chris": { type: 'bg', id: "seeingIsBelieving", src: "sounds/Seeing Is Believing02.mp3", loop: true, snowflake: true, volume: 0.2 },
    "did hear sounds": { type: 'bg', id: "aLongTimeAgo", src: "sounds/A Long Time Ago in a Tower Far Far Away.mp3", loop: true, volume: 0.2 },
    "outside came the sounds": { id: "steam01", src: "sounds/steam01.m4a", type: 'se', volume: 1.0 },
    "and out the door": { id: "allAboard01", src: "sounds/allAboard01.m4a", type: 'se', volume: 1.0 },
    "ran up to him": { id: "wellYouComing01", src: "sounds/wellYouComing.m4a", type: 'se', volume: 1.0 },
    "North Pole of course": { id: "whyToTheNorthPole01", src: "sounds/whyToTheNorthPole01.m4a", type: 'se', volume: 1.0 },
    "and he pulled me": { type: 'bg', id: "xmasStory", src: "sounds/Xmas Story.mp3",loop: true, bgColor: "#ae710f", snowflake: false, volume: 0.1 },
    "with other children": { id: "filledWithChildren01", src: "sounds/filledWithChildren01.m4a", type: 'se', volume: 0.6 },
    "there were no": { id: "clearedToGo", src: "sounds/Cleared To Go.mp3", type: 'bg', loop: true, bgColor: "#000", volume: 0.2 },
    "lights to be": { id: "wolves01", src: "sounds/wolves01.m4a", type: 'se', volume: 1.0 },
    "from our train": { id: "thunder01", src: "sounds/thunder01.wav", type: 'se', volume: 1.0 },
    "Express never slowed": { id: "theNorthPole", src: "sounds/TheNorthPole.mp3", type: 'bg', loop: true, volume: 0.2 },
    "strange ocean liner": { id: "thereIsTheNorthPole01", src: "sounds/thereIsTheNorthPole01.m4a", type: 'se', volume: 1.0 },
    "a huge city": { id: "theJoyfulSeason", src: "sounds/The Joyful Season.mp3", type: 'bg', loop: true, bgColor: "#5a6f7f", volume: 0.2 },
    "where Santa will give": { id: "theFirstGift01", src: "sounds/theFirstGift01.m4a", type: 'se', volume: 1.0 },
    "He will choose one": { id: "heWillChooseOneOfYou01", src: "sounds/heWillChooseOneOfYou01.m4a", type: 'se', volume: 1.0 },
    "one of the children": { id: "lookTheElves01", src: "sounds/lookTheElves.m4a", type: 'se', volume: 0.5 },
    "Express could go no": { id: "steam01-2", src: "sounds/steam01-2.m4a", type: 'se', volume: 1.0 },
    "pressed through the": { id: "christmasEve", src: "sounds/Christmas Eve.mp3", snowflake: true, type: 'bg', loop: true, volume: 0.2 },
    "the silver sleigh": { id: "silverSleightBells01", src: "sounds/silverSleightBells01.wav", type: 'se', volume: 0.7 },
    "The elves cheered": { id: "elvesCheering01", src: "sounds/elvesCheering01.m4a", type: 'se', volume: 0.8 },
    "have this fellow": { id: "letsHaveThisFellowHere01", src: "sounds/letsHaveThisFellowHere01.m4a", type: 'se', volume: 1.0 },
    "handed me up": { id: "iBelieve", src: "sounds/I Believe.mp3", type: 'bg', loop: true, volume: 0.4 },
    "you like for": { id: "whatWouldYouLike01", src: "sounds/whatWouldYouLike01.m4a", type: 'se', volume: 1.0 },
    "holding the bell": { id: "theFirstGift02", src: "sounds/theFirstGift02.m4a", type: 'se', volume: 1.0 },
    "midnight as the": { id: "elvesCheering02", src: "sounds/elvesCheering02.wav", type: 'se', volume: 0.4 },
    "the bell to me": { id: "bell01", src: "sounds/bell01.wav", type: 'se', volume: 1.0 },
    "As soon as": { id: "lessonsGoodbyes", src: "sounds/Lessons Goodbyes.mp3", type: 'bg', loop: true, bgColor: "#c47f11", snowflake: false, volume: 0.4 },
    "gave a sudden": { id: "steam02", src: "sounds/steam02.wav", type: 'se', volume: 1.0 },
    "from the moving": { id: "theFirstGiftOfChristmas", src: "sounds/The First Gift Of Christmas.mp3", type: 'bg', loop: true, volume: 0.2 },
    "around his mouth": { id: "merryChristmas01", src: "sounds/merryChristmas01.m4a", type: 'se', volume: 1.0 },
    "On Christmas morning": { id: "christmasMorningOneLastGift", src: "sounds/Christmas Morning One Last Gift.mp3", type: 'bg', bgColor: "#5a6f7f", loop: true, volume: 0.3 },
    "shook the bell": { id: "bell02", src: "sounds/bell02.wav", type: 'se', volume: 1.0 },
};

// Because i want to flag the sounds to false until they're played
let soundPlayed = {};
let currentlyPlaying = { music: null, effects: [] }; // list of currently playing sounds, object with music and effect
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
            if (soundInfo.type === 'bg') {
                // Fade out currently playing background music
                if (currentlyPlaying.music && currentlyPlaying.music !== soundInfo.id) {
                    const currentMusicElement = document.getElementById(currentlyPlaying.music);
                    fadeOutSound(currentMusicElement);
                }
                currentlyPlaying.music = soundInfo.id;
            } else if (soundInfo.type === 'se') {
                // Add to currently playing effects
                if (!currentlyPlaying.effects.includes(soundInfo.id)) {
                    currentlyPlaying.effects.push(soundInfo.id);
                }
            }

            if (!soundPlayed[soundInfo.id]) {
                console.log(`Playing sound: ${soundInfo.id}, volume: ${soundInfo.volume}`);
                soundElement.currentTime = 0;
                soundElement.play();
                // Flagging the sound as played
                soundPlayed[soundInfo.id] = true;
                // Check bg color input and change
                if (soundInfo.bgColor) {
                    changeBgColor(soundInfo.bgColor);
                }
                if (soundInfo.hasOwnProperty('snowflake')) {
                    controlSnowflake(soundInfo.snowflake);
                }
            }
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
    console.log("Fading out:", soundElement.id); 
    let volume = soundElement.volume;
    const fadeOutInterval = setInterval(() => {
        volume -= 0.1;
        if (volume <= 0) {
            clearInterval(fadeOutInterval);
            soundElement.pause();
            soundElement.currentTime = 0;
            soundPlayed[soundElement.id] = false; // Reset the played flag
        } else {
            soundElement.volume = volume;
        }
    }, 2000); // Fadeout time 3sec
}

function pauseAllSounds() {
    pausedSounds = { music: null, effects: [] };

    const musicElement = currentlyPlaying.music ? document.getElementById(currentlyPlaying.music) : null;
    if (musicElement && !musicElement.paused) {
        musicElement.pause();
        pausedSounds.music = currentlyPlaying.music;
    }

    // Pause sound effects
    currentlyPlaying.effects.forEach(id => {
        const soundElement = document.getElementById(id);
        if (soundElement && !soundElement.paused) {
            soundElement.pause();
            pausedSounds.effects.push(id);
        }
    });
}

function resumeAllSounds() {
    // Resume music
    if (pausedSounds.music) {
        const musicElement = document.getElementById(pausedSounds.music);
        if (musicElement) {
            musicElement.play();
        }
    }

    // Resume sound effects
    if (pausedSounds.effects && Array.isArray(pausedSounds.effects)) {
        pausedSounds.effects.forEach(id => {
            const soundElement = document.getElementById(id);
            if (soundElement) {
                soundElement.play();
            }
        });
    }

    pausedSounds = { music: null, effects: [] };
}

function stopAllSounds() {
     // Stopping music
    if (currentlyPlaying.music) {
        const musicElement = document.getElementById(currentlyPlaying.music);
        if (musicElement) {
            musicElement.pause();
            musicElement.currentTime = 0;
            soundPlayed[currentlyPlaying.music] = false;
        }
    }
 
     // Stopping sound effects
     currentlyPlaying.effects.forEach(id => {
         const soundElement = document.getElementById(id);
         if (soundElement) {
             soundElement.pause();
             soundElement.currentTime = 0;
             soundPlayed[id] = false;
         }
     });
 
     // Resetting currentlyPlaying
     currentlyPlaying = { music: null, effects: [] };
}