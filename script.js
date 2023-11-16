window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true; // Enable continuous recognition
recognition.lang = 'en-US';

let listening = false; // Flag to keep track of whether we're currently listening

// to load and display the text file
function loadTextFile() {
    fetch('text.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('written-text').innerText = text;
        });
}

// Call the function on page load
loadTextFile();

// Function to track the reading position
function updateReadingPosition(spokenText) {
    const writtenText = document.getElementById('written-text').innerText;
    const words = writtenText.split(/\s+/); // Split the text into words

    // Find the word that matches the spoken text, might require more advanced algorithms. For now it just finds the first word that matches
    let position = words.findIndex(word => word.toLowerCase() === spokenText.toLowerCase());

    // To highlight the word
    if (position >= 0) {
        let highlightedText = words.map((word, index) => {
            if (index === position) {
                return `<span style="background-color: yellow;">${word}</span>`;
            }
            return word;
        }).join(' ');
        document.getElementById('written-text').innerHTML = highlightedText;
    }
}

recognition.addEventListener('result', e => {
    const lastWord = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        .split(' ').pop(); //Get the last spoken word
        
    // Call the function to update the reading position
    updateReadingPosition(lastWord);
});

const startBtn = document.getElementById('start-btn');

// Toggle the listening state with button
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