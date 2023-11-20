window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let listening = false;
let spokenSentences = []; // Array to store spoken sentences

function loadTextFile() {
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('written-text').innerText = text;
        });
}

loadTextFile();

function updateReadingPosition(spokenText) {
    const writtenText = document.getElementById('written-text').innerText;
    const writtenSentences = writtenText.split(/[.!?]+/); // Split into sentences

    let closestMatchIndex = -1;
    let closestMatchDistance = Infinity;

    // Compare each written sentence with the spoken text
    for (let i = 0; i < writtenSentences.length; i++) {
        let distance = levenshteinDistance(spokenText, writtenSentences[i]);

        if (distance < closestMatchDistance) {
            closestMatchDistance = distance;
            closestMatchIndex = i;
        }
    }

    if (closestMatchIndex >= 0) {
        let highlightedText = writtenSentences.map((sentence, index) => {
            if (index === closestMatchIndex) {
                return `<span style="background-color: yellow;">${sentence}</span>`;
            }
            return sentence;
        }).join('. ');
        document.getElementById('written-text').innerHTML = highlightedText;
    }
}

// Levenshtein Distance algorithm to measure similarity
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    // Store full sentences only
    if (e.results[0].isFinal) {
        spokenSentences.push(transcript);
        updateReadingPosition(transcript);
    }
});

const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    if (listening) {
        recognition.stop();
        startBtn.textContent = 'Start Listening';
    } else {
        recognition.start();
        startBtn.textContent = 'Stop Listening';
    }
    listening = !listening;
});
