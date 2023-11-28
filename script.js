window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let listening = false;
let displayText = '';  // Original text

function loadTextFile() {
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            displayText = text;
            document.getElementById('written-text').innerHTML = displayText.replace(/\n/g, '<br>');
        });
}

loadTextFile();

function updateReadingPosition(spokenText) {
    const cleanedSpokenText = spokenText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~""()]/g, "");

    const regex = /\s+/g;
    const words = cleanedSpokenText.split(regex);

    let wordCount = Math.min(words.length, 4);
    let spokenWords = words.slice(-wordCount);
    let sequence = spokenWords.join(' ');

    let lowerCaseDisplayText = displayText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~""()]/g, "");
    let position = lowerCaseDisplayText.indexOf(sequence);

    if (position >= 0) {
        document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));

        // Find the position in the display text
        let regex = new RegExp(sequence, 'i');
        let match = displayText.match(regex);
        if (match) {
            let actualPosition = displayText.indexOf(match[0]);
            // Replace white space to line breaks
            let before = displayText.substring(0, actualPosition).replace(/\n/g, '<br>');
            let after = displayText.substring(actualPosition + match[0].length).replace(/\n/g, '<br>');
            let highlightedText = `${before}<span class="highlighted">${match[0]}</span>${after}`;

            // Highlight the text
            document.getElementById('written-text').innerHTML = highlightedText;
            // To play the sound!
            playSound(match[0]);
        }
    }
}

recognition.addEventListener('result', e => {
    const spokenText = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
    updateReadingPosition(spokenText);
});

// Start&stop and pause buttons
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
let isPaused = false;

startBtn.addEventListener('click', () => {
    listening = !listening;
    if (listening) {
        recognition.start();
        startBtn.textContent = 'Stop Reading';
        if (isPaused) {
            resumeAllSounds();
            isPaused = false;
        }
    } else {
        recognition.stop();
        startBtn.textContent = 'Start Reading';
        stopAllSounds();
    }
});

pauseBtn.addEventListener('click', () => {
    if (!isPaused) {
        pauseAllSounds();
        pauseBtn.textContent = 'Resume';
        isPaused = true;
    } else {
        resumeAllSounds();
        pauseBtn.textContent = 'Pause';
        isPaused = false;
    }
});

// const testBtn = document.getElementById('test-btn');

// testBtn.addEventListener('click', () => {
//     const testText = "Polar Express by Chris"; // Replace with the text you want to test
//     updateReadingPosition(testText);
// });