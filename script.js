window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let listening = false;
let displayText = '';  // Original text with proper casing and punctuation

function loadTextFile() {
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            displayText = text;
            document.getElementById('written-text').innerHTML = displayText.replace(/\n/g, '<br>'); // Preserving line breaks
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

const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    listening = !listening;
    startBtn.textContent = listening ? 'Stop Listening' : 'Start Listening';
    listening ? recognition.start() : recognition.stop();
});
