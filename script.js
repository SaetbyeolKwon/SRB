window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-US';

let listening = false;

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
    
    // To split the text by spaces and punctuation marks.. not working. need to dig more
    const regex = /\s+|[.!?]+/g;
    const words = spokenText.split(regex);

    let wordCount = Math.min(words.length, 5);
    let spokenWords = words.slice(-wordCount);
    let sequence = spokenWords.join(' ').toLowerCase();

    let position = writtenText.toLowerCase().indexOf(sequence);

    // To highlight the spoken text
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });

    if (position >= 0) {
        let before = writtenText.substring(0, position);
        let after = writtenText.substring(position + sequence.length);
        let highlightedText = `${before}<span class="highlighted">${sequence}</span>${after}`;
        document.getElementById('written-text').innerHTML = highlightedText;
    }
}

recognition.addEventListener('result', e => {
    const spokenText = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    updateReadingPosition(spokenText);
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
