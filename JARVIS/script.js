// ==========================================
// 1. CHASY I TAYMER HUD
// ==========================================
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toTimeString().split(' ')[0];
}
setInterval(updateClock, 1000);
updateClock();

function playBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) { }
}

// ==========================================
// 2. YADRO ANIMATSIYASI
// ==========================================
const canvas = document.getElementById('coreCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 220;
canvas.height = 220;

let angle = 0;
function drawCore() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 1.2);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle * 1.5);
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 0.8);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();

    angle += 0.02;
    requestAnimationFrame(drawCore);
}
drawCore();

// ==========================================
// 3. WIKIPEDIA I UMNAYA LOXIKA (RUSSKIY YAZYK)
// ==========================================
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const chatLogs = document.getElementById('chat-logs');
const jarvisState = document.getElementById('jarvis-state');
const subText = document.getElementById('sub-text');

// Ochistka zaprosa ot stop-slov
function cleanQuery(text) {
    let clean = text.toLowerCase();
    const stopWords = [
        "информация о", "расскажи про", "что такое", "кто такой", "найди",
        "haqida ma'lumot ber", "haqida", "ma'lumot", "rasm", "haqida ayt", "информацию"
    ];
    stopWords.forEach(word => {
        clean = clean.replace(word, "");
    });
    return clean.trim();
}

async function fetchWikipediaData(query) {
    const searchTerm = cleanQuery(query);
    if (!searchTerm) return null;

    try {
        const url = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.extract) return data.extract;
        }
    } catch (e) { }

    return null;
}

async function processJarvisCommand(command) {
    playBeep();
    const cmd = command.toLowerCase().trim();
    jarvisState.innerText = "ПОИСК В БАЗЕ...";
    subText.innerText = "Анализ данных...";

    let reply = "";

    if (cmd.includes("привет") || cmd.includes("джарвис") || cmd.includes("салом")) {
        reply = "Приветствую, сэр! Все системы функционируют в штатном режиме.";
    } else if (cmd.includes("как дела") || cmd.includes("статус") || cmd.includes("состояние")) {
        reply = "Все системы работают на 100%. Нагрузка на процессор минимальна.";
    } else if (cmd.includes("время") || cmd.includes("часы") || cmd.includes("soat")) {
        reply = `Текущее время: ${new Date().toLocaleTimeString('ru-RU')}`;
    } else if (cmd.includes("очистить") || cmd.includes("tozala")) {
        chatLogs.innerHTML = '';
        reply = "Консоль очищена, сэр.";
    } else {
        const wikiResult = await fetchWikipediaData(cmd);
        if (wikiResult) {
            reply = wikiResult;
        } else {
            reply = `К сожалению, в глобальной сети не найдено точной информации по запросу "${command}", сэр.`;
        }
    }

    addMessage("JARVIS", reply);
    speakJarvis(reply);
    jarvisState.innerText = "JARVIS ACTIVE";
    subText.innerText = "Ожидание команд...";
}

// ==========================================
// 4. ОЗВУЧКА НА РУССКОМ (VOICE SYNTHESIS)
// ==========================================
function speakJarvis(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = 'ru-RU'; // Rus tili
        utterance.pitch = 0.9;    // Chuqurroq va salobatli ovoz
        utterance.rate = 1.0;

        // Ruscha tabiiy ovozni tanlash (agar brauzerda bo'lsa)
        const voices = window.speechSynthesis.getVoices();
        const ruVoice = voices.find(v => v.lang.includes('ru'));
        if (ruVoice) utterance.voice = ruVoice;

        window.speechSynthesis.speak(utterance);
    }
}

// ==========================================
// 5. KAMERA I GESTY (MEDIAPIPE)
// ==========================================
const videoElement = document.getElementById('webcam');
const gestureCanvas = document.getElementById('gestureCanvas');
const gestureCtx = gestureCanvas.getContext('2d');
const gestureText = document.getElementById('gesture-text');
const targetInfo = document.getElementById('target-info');
const camBtn = document.getElementById('cam-btn');

let cameraActive = false;

function onResults(results) {
    gestureCtx.save();
    gestureCtx.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        gestureText.innerText = "ЦЕЛЬ ЗАХВАЧЕНА";
        targetInfo.innerText = "HAND LOCK: ACTIVE\nX: " + Math.round(results.multiHandLandmarks[0][0].x * 100) + "%";

        const lm = results.multiHandLandmarks[0][8];
        gestureCtx.beginPath();
        gestureCtx.arc(lm.x * gestureCanvas.width, lm.y * gestureCanvas.height, 15, 0, Math.PI * 2);
        gestureCtx.strokeStyle = '#00f0ff';
        gestureCtx.lineWidth = 2;
        gestureCtx.stroke();
    } else {
        gestureText.innerText = "ПОИСК ЦЕЛИ...";
        targetInfo.innerText = "NO TARGET DETECTED";
    }
    gestureCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5 });
hands.onResults(onResults);

camBtn.addEventListener('click', async () => {
    playBeep();
    if (!cameraActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            cameraActive = true;
            camBtn.classList.add('active');

            const cameraLoop = async () => {
                if (cameraActive) {
                    await hands.send({ image: videoElement });
                    requestAnimationFrame(cameraLoop);
                }
            };
            cameraLoop();
            addMessage("JARVIS", "Визуальный модуль слежения активирован, сэр.");
            speakJarvis("Визуальный модуль слежения активирован, сэр.");
        } catch (err) {
            alert("Ошибка подключения к камере.");
        }
    } else {
        cameraActive = false;
        camBtn.classList.remove('active');
        if (videoElement.srcObject) videoElement.srcObject.getTracks().forEach(t => t.stop());
        gestureText.innerText = "КАМЕРА ВЫКЛ";
    }
});

// ==========================================
// 6. RASPONAVANIE RECHI (RUSSKIY YAZYK)
// ==========================================
const micBtn = document.getElementById('mic-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU'; // Ovozni ham rus tilida qabul qiladi

    recognition.onstart = () => {
        playBeep();
        micBtn.classList.add('active');
        jarvisState.innerText = "СЛУШАЮ...";
    };

    recognition.onend = () => {
        micBtn.classList.remove('active');
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        addMessage("USER", text);
        processJarvisCommand(text);
    };

    micBtn.addEventListener('click', () => recognition.start());
}

sendBtn.addEventListener('click', () => {
    const text = textInput.value;
    if (text) {
        addMessage("USER", text);
        processJarvisCommand(text);
        textInput.value = '';
    }
});

function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg');
    msgDiv.classList.add(sender === "JARVIS" ? 'jarvis-msg' : 'user-msg');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatLogs.appendChild(msgDiv);
    chatLogs.scrollTop = chatLogs.scrollHeight;
}