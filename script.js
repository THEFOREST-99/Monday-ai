const output = document.getElementById('output');
const btn = document.getElementById('start-btn');

btn.onclick = () => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    output.textContent = "Your browser does not support voice input.";
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  output.textContent = '🎙️ Listening...';

  recognition.onresult = async (event) => {
    const userInput = event.results[0][0].transcript.toLowerCase();
    output.textContent = `You: "${userInput}"`;

    try {
      const response = await fetch('https://replit.com/@rajpaljai0203/FamiliarInvolvedDevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) throw new Error('Server response not OK');

      const data = await response.json();
      output.textContent = `Monday AI: ${data.reply}`;

      // Only speak if question is not link-related
      if (/time|weather|how|what|calculate/.test(userInput)) {
        const speak = new SpeechSynthesisUtterance(data.reply);
        speak.lang = 'en-US';
        speechSynthesis.speak(speak);
      }

    } catch (err) {
      output.textContent = '❌ Error contacting Monday AI.';
      console.error('Fetch error:', err);
    }
  };

  recognition.onerror = (e) => {
    output.textContent = `Speech error: ${e.error}`;
  };
};
