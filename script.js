window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let listening = false;
let displayText = ''; // Original text

document.addEventListener('DOMContentLoaded', loadTextFile);

// Original code
function loadTextFile() {
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            displayText = text;
            document.getElementById('written-text').innerHTML = displayText.replace(/\n/g, '<br>');
        });
}

// For test -------
// function loadTextFile() {
//     fetch('text.txt')
//         .then(response => response.text())
//         .then(text => {
//             displayText = text;
//             const processedText = text.split('\n').map(line => 
//                 line.split(' ').map(word => 
//                     `<span class="clickable-word">${word}</span>`
//                 ).join(' ')
//             ).join('<br>');
//             document.getElementById('written-text').innerHTML = processedText;
//             clickWord();
//         });
// }

// function clickWord() {
//     const wordElements = document.querySelectorAll('.clickable-word');
//     wordElements.forEach((wordElement, index) => {
//         wordElement.addEventListener('mouseover', () => highlightSequence(wordElements, index));
//         wordElement.addEventListener('mouseout', () => clearHighlights());
//         wordElement.addEventListener('click', () => triggerActionFromWord(wordElements, index));
//     });
// }

// function highlightSequence(wordElements, startIndex) {
//     clearHighlights();
//     const endIndex = Math.min(startIndex + 3, wordElements.length - 1);
//     for (let i = startIndex; i <= endIndex; i++) {
//         wordElements[i].classList.add('highlighted');
//     }
// }

// function clearHighlights() {
//     document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
// }

// function triggerActionFromWord(wordElements, startIndex) {
//     const endIndex = Math.min(startIndex + 3, wordElements.length - 1);
//     let sequence = "";
//     for (let i = startIndex; i <= endIndex; i++) {
//         sequence += wordElements[i].textContent + " ";
//     }
//     sequence = sequence.trim();
//     updateReadingPosition(sequence);
// }
// ---------------------

function sanitizeText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
}

// Original code
function updateReadingPosition(spokenText) {
    let words = sanitizeText(spokenText).split(/\s+/);
    let wordCount = Math.min(words.length, 4);
    let sequence = words.slice(-wordCount).join(' ');

    let position = sanitizeText(displayText).indexOf(sequence);

    if (position >= 0) {
        document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));

        let regex = new RegExp(sequence, 'i');
        let match = displayText.match(regex);

        if (match) {
            let actualPosition = displayText.indexOf(match[0]);
            let before = displayText.substring(0, actualPosition).replace(/\n/g, '<br>');
            let after = displayText.substring(actualPosition + match[0].length).replace(/\n/g, '<br>');
            let highlightedText = `${before}<span class="highlighted">${match[0]}</span>${after}`;

            document.getElementById('written-text').innerHTML = highlightedText;
            playSound(match[0]);
        }
    }
}

// Test Code
// function updateReadingPosition(sequence) {
//     let position = sanitizeText(displayText).indexOf(sanitizeText(sequence));

//     if (position >= 0) {
//         document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));

//         let regex = new RegExp(sanitizeText(sequence), 'i');
//         let match = displayText.match(regex);

//         if (match) {
//             let actualPosition = displayText.indexOf(match[0]);
//             let before = displayText.substring(0, actualPosition).replace(/\n/g, '<br>');
//             let after = displayText.substring(actualPosition + match[0].length).replace(/\n/g, '<br>');
//             let highlightedText = `${before}<span class="highlighted">${match[0]}</span>${after}`;

//             document.getElementById('written-text').innerHTML = highlightedText;
//             playSound(match[0]);
//         }
//     }
// }

recognition.addEventListener('result', e => {
    const spokenText = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
    updateReadingPosition(spokenText);
});

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
let isPaused = false;

startBtn.addEventListener('click', toggleReading);
pauseBtn.addEventListener('click', togglePause);

function toggleReading() {
    listening = !listening;
    if (listening) {
        recognition.start();
        startBtn.textContent = 'Stop Reading';
        resumeAllSounds();
    } else {
        recognition.stop();
        startBtn.textContent = 'Start Reading';
        stopAllSounds();
    }
    isPaused = false;
}

function togglePause() {
    if (!isPaused) {
        pauseAllSounds();
        pauseBtn.textContent = 'Resume';
    } else {
        resumeAllSounds();
        pauseBtn.textContent = 'Pause';
    }
    isPaused = !isPaused;
}