// ==========================================
// 1. 3D GLOBUS (MAHMALAKATLAR CHIZIQLARI BILAN)
// ==========================================
function initGlobe() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    document.head.appendChild(script);

    script.onload = () => {
        const canvas = document.getElementById('globeCanvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(240, 240);
        camera.position.z = 210;

        const geometry = new THREE.SphereGeometry(75, 48, 48);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            wireframe: true,
            color: 0x00ffcc
        });

        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const ringGeo = new THREE.RingGeometry(85, 87, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0055, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        scene.add(ring);

        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.005;
            ring.rotation.z -= 0.003;
            renderer.render(scene, camera);
        }
        animate();
    };
}
initGlobe();


// ==========================================
// 2. MATRIX & BINARY YOMG'IRI
// ==========================================
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '010101010101ABCDEFGHJKLMNPQRSTUVXYZ#@$%&*';
const fontSize = 15;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff55';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);


// ==========================================
// 3. ACCOUNT HACK LOGS
// ==========================================
const hackLog = document.getElementById('hack-log');
const hackActions = [
    "[!] INFILTRATING TELEGRAM SESSION...",
    "[>] BYPASSING 2FA AUTHENTICATION...",
    "[>] EXTRACTING SAVED CHATS...",
    "[!] BANK CARD PIN CRACKED: **** 4892",
    "[>] INSTAGRAM SESSION HIJACKED",
    "[!] DECRYPTING SYSTEM ROOT KEYS...",
    "[CRITICAL] GPS LOCATION DUMPED!"
];

function triggerAccountHack() {
    if (!hackLog) return;
    const randomAction = hackActions[Math.floor(Math.random() * hackActions.length)];
    const line = document.createElement('div');
    line.innerText = randomAction;
    hackLog.appendChild(line);
    if (hackLog.childNodes.length > 9) hackLog.removeChild(hackLog.firstChild);
}
setInterval(triggerAccountHack, 500);


// ==========================================
// 4. METRIKA VA SOAT
// ==========================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock-time').innerText = `${h}:${m}:${s}`;
    document.getElementById('clock-date').innerText = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
}
setInterval(updateClock, 1000); updateClock();

function updateMetrics() {
    const cpu = Math.floor(Math.random() * 50) + 40;
    const ram = Math.floor(Math.random() * 20) + 70;
    document.querySelector('.cpu-bar').style.width = cpu + '%';
    document.querySelector('.ram-bar').style.width = ram + '%';
    document.getElementById('cpu-text').innerText = `CPU USAGE: ${cpu}%`;
    document.getElementById('ram-text').innerText = `RAM USAGE: ${ram}%`;
}
setInterval(updateMetrics, 1000);


// ==========================================
// 5. TERMINAL VA ALMASHTIRILUVCHI DAHSHATLI HACKER JAVOBLARI
// ==========================================
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');
const scareOverlay = document.getElementById('scare-overlay');
const scareText = document.getElementById('scare-text');

let attackIndex = 0;

// Har bir kiritilgan so'z uchun alohida dahshatli javoblar ro'yxati:
const attackPayloads = [
    `<span class="danger-text">[ATTACK 01] TELEGRAM & INSTAGRAM INFILTRATION</span><br>` +
    `> Injecting Trojan.AndroidOS.Agent.bt... [OK]<br>` +
    `> Bypassing 2FA Verification Code... [GRANTED]<br>` +
    `<span style="color:#00ffcc">>> SAVED SESSIONS EXFILTRATED TO REMOTE SERVER 185.220.101.5</span>`,

    `<span class="danger-text">[ATTACK 02] BANKING & CREDIT CARD EXFILTRATION</span><br>` +
    `> Scanning Chrome Saved Passwords... [FOUND 14]<br>` +
    `> Cardholder: VICTIM USER | VISA **** **** **** 8812<br>` +
    `<span style="color:#00ffcc">>> CVV & PIN DATA EXTRACTED SUCCESSFULLY!</span>`,

    `<span class="danger-text">[ATTACK 03] WEBCAM & MICROPHONE STREAMING</span><br>` +
    `> Initializing DirectShow Camera Interface... [CONNECTED]<br>` +
    `> Video Stream: 1920x1080 30FPS [RECORDING]<br>` +
    `<span style="color:#00ffcc">>> LIVE FEED TRANSMITTING TO C2 COMMAND NODE...</span>`,

    `<span class="danger-text">[ATTACK 04] ROOT DIRECTORY SYSTEM HIJACK</span><br>` +
    `> Exploiting Kernel Buffer Overflow Vulnerability...<br>` +
    `> Gaining privileges: uid=0(root) gid=0(root)<br>` +
    `<span style="color:#00ffcc">>> ALL SYSTEM FILES ENCRYPTED WITH RSA-4096. RANSOM NOTE GENERATED.</span>`,

    `<span class="danger-text">[ATTACK 05] REAL-TIME GEOLOCATION TRACE</span><br>` +
    `> IP Triangulation: 192.168.1.104 -> ISP Node Samarkand<br>` +
    `> Coordinates: 39.6542° N, 66.9597° E<br>` +
    `<span style="color:#00ffcc">>> ACCURACY: 1.2 METERS. TARGET LOCKED.</span>`
];

function showScareOverlay(message) {
    if (!scareOverlay) return;
    scareText.innerText = message;
    scareOverlay.classList.remove('hidden');
    // Pop-up oyna 0.6 soniyada avtomatik yo'qoladi va matnlar ko'rinadi
    setTimeout(() => {
        scareOverlay.classList.add('hidden');
    }, 600);
}

termInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const cmd = this.value.trim();
        if (cmd !== '') {
            processCommand(cmd);
            this.value = '';
        }
    }
});

function processCommand(cmd) {
    showScareOverlay(`EXECUTION DETECTED: '${cmd.toUpperCase()}' // EXPLOITING TARGET...`);

    let responseText = '';

    if (cmd.toLowerCase() === 'clear') {
        termOutput.innerHTML = '';
        return;
    } else if (cmd.toLowerCase() === 'help') {
        responseText = `COMMANDS: <span style="color:#00ffcc">help, clear, scan, hack, bypass</span> (or type ANY key to breach)`;
    } else {
        // Navbatdagi dahshatli hujum javobini tanlash
        responseText = attackPayloads[attackIndex % attackPayloads.length];
        attackIndex++;
    }

    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt">root@cyber-node:~#</span> ${cmd}<br>${responseText}<br><br>`;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
}