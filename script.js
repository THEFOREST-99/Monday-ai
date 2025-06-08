const API_URL = "https://monday-backend.your‑name.repl.co/api/chat";   // <-- put your backend URL
const startBtn = document.getElementById("start");
const screen = document.getElementById("screen");
const bar = document.getElementById("bar");
let memory = JSON.parse(localStorage.getItem("mondayMem") || "[]");

function speak(text){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.pitch = 1.15;
  speechSynthesis.speak(u);
}

async function askBackend(msg){
  const res = await fetch(https://replit.com/@ANGADGAMER321/Monday-backend-1?s=app,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ message: msg, memory })
  });
  if(!res.ok) throw new Error("Backend error");
  const data = await res.json();
  return data.reply;
}

function listen(){
  if(!("webkitSpeechRecognition"in window || "SpeechRecognition"in window)){
    screen.textContent="Browser has no speech input.";
    return;
  }
  const Rec = window.SpeechRecognition||window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang="en-US"; rec.interimResults=false;
  rec.start(); bar.classList.add("on"); screen.textContent="Listening…";

  rec.onresult = async e=>{
    bar.classList.remove("on");
    const user = e.results[0][0].transcript.trim();
    screen.textContent="You: "+user;
    memory.push({role:"user",content:user});            // save to memory

    try{
      const reply = await askBackend(user);
      screen.textContent = reply;
      speak(reply);
      memory.push({role:"assistant",content:reply});
      localStorage.setItem("mondayMem", JSON.stringify(memory));
    }catch(err){
      screen.textContent = err.message;
      speak("Sorry, something went wrong.");
    }
  };

  rec.onerror = e=>{
    bar.classList.remove("on");
    screen.textContent = "Speech error: "+e.error;
  };
}

startBtn.addEventListener("click", listen);