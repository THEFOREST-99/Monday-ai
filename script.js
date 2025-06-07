const output = document.getElementById('output');
const btn = document.getElementById('start-btn');

btn.onclick = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    output.textContent = "Sorry, your browser doesn't support Speech Recognition.";
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  output.textContent = 'Listening...';

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    output.textContent = `You said: "${text}"`;

    // Send to backend proxy
    const response = await fetch('https://replit.com/join/jfsbsvtexx-rajpaljai0203' {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      output.textContent = 'Error communicating with backend.';
      return;
    }

    const data = await response.json();
    output.textContent = `Monday AI: ${data.reply}`;

    // Use speech synthesis for voice reply on certain commands (like time, math)
    if (/time|what is|calculate|weather/.test(text)) {
      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  recognition.onerror = (event) => {
    output.textContent = `Error occurred: ${event.error}`;
  };
};
