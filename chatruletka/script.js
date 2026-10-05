const $ = (id) => document.getElementById(id);
const SLOTS = 20;
const PREFIX = "rchat-v2-";
let stream, peer, call, conn, session = 0, started = false;

// ===== Mamlakatlar ("KOD|Nomi") =====
const countries = `UZ|O'zbekiston;KZ|Qozog'iston;KG|Qirg'iziston;TJ|Tojikiston;TM|Turkmaniston;AZ|Ozarbayjon;TR|Turkiya;RU|Rossiya;UA|Ukraina;BY|Belarus;GE|Gruziya;AM|Armaniston;AF|Afg'oniston;PK|Pokiston;IN|Hindiston;BD|Bangladesh;LK|Shri-Lanka;NP|Nepal;CN|Xitoy;JP|Yaponiya;KR|Janubiy Koreya;MN|Mo'g'uliston;TH|Tailand;VN|Vyetnam;MY|Malayziya;ID|Indoneziya;PH|Filippin;SG|Singapur;AU|Avstraliya;NZ|Yangi Zelandiya;AE|BAA;SA|Saudiya Arabistoni;QA|Qatar;KW|Quvayt;OM|Ummon;JO|Iordaniya;LB|Livan;IQ|Iroq;IR|Eron;IL|Isroil;SY|Suriya;YE|Yaman;EG|Misr;MA|Marokash;DZ|Jazoir;TN|Tunis;LY|Liviya;NG|Nigeriya;ZA|Janubiy Afrika;KE|Keniya;ET|Efiopiya;GH|Gana;SN|Senegal;US|AQSh;CA|Kanada;MX|Meksika;BR|Braziliya;AR|Argentina;CL|Chili;CO|Kolumbiya;PE|Peru;VE|Venesuela;CU|Kuba;GB|Buyuk Britaniya;IE|Irlandiya;FR|Fransiya;DE|Germaniya;IT|Italiya;ES|Ispaniya;PT|Portugaliya;NL|Niderlandiya;BE|Belgiya;CH|Shveytsariya;AT|Avstriya;PL|Polsha;CZ|Chexiya;SK|Slovakiya;HU|Vengriya;RO|Ruminiya;BG|Bolgariya;GR|Gretsiya;RS|Serbiya;HR|Xorvatiya;BA|Bosniya va Gertsegovina;AL|Albaniya;MK|Shimoliy Makedoniya;SI|Sloveniya;SE|Shvetsiya;NO|Norvegiya;DK|Daniya;FI|Finlyandiya;IS|Islandiya;EE|Estoniya;LV|Latviya;LT|Litva;MD|Moldova;CY|Kipr;MT|Malta;LU|Lyuksemburg`
    .split(";")
    .map((s) => {
        const [code, name] = s.split("|");
        return { code, name };
    });

// Bayroq rasmi (Windows'da emoji bayroqlar ko'rinmaydi)
const flagImg = (code, size = 24) =>
    `<img class="flag" src="https://flagcdn.com/w40/${code.toLowerCase()}.png" alt="${code}" width="${size}">`;

let selectedGender = "all";
let selectedCountry = "all";

// ===== Onlayn hisoblagich =====
let onlineUsers = 385082;
setInterval(() => {
    onlineUsers += Math.floor(Math.random() * 5) - 2;
    $("gate-online-count").textContent = onlineUsers.toLocaleString();
    $("app-online-count").textContent = onlineUsers.toLocaleString();
}, 3000);

// ===== Kirish =====
function handleLogin() {
    if (!$("terms-checkbox").checked) {
        alert("Shartlarni tasdiqlang!");
        return;
    }
    $("gate").style.display = "none";
}
$("login-google").onclick = handleLogin;
$("login-facebook").onclick = handleLogin;

// ===== Jins tanlash =====
document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.onclick = () => {
        document.querySelectorAll(".gender-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedGender = btn.dataset.gender;
    };
});

// ===== Mamlakat ro'yxati (qidiruv va bayroqlar bilan) =====
const cBtn = $("country-btn");
const cMenu = $("country-menu");
const cList = $("country-list");
const cSearch = $("country-search");

function setCountryButton(c) {
    $("country-flag").innerHTML =
        c.code === "all" ? '<i class="fa-solid fa-globe"></i>' : flagImg(c.code);
    $("country-name").textContent = c.name;
}

function renderCountries(filter = "") {
    const q = filter.trim().toLowerCase();
    const items = [{ code: "all", name: "Barcha mamlakatlar" }, ...countries].filter((c) =>
        c.name.toLowerCase().includes(q)
    );

    cList.innerHTML = "";
    items.forEach((c) => {
        const d = document.createElement("div");
        d.className = "country-item" + (c.code === selectedCountry ? " active" : "");
        d.innerHTML = c.code === "all" ? '<i class="fa-solid fa-globe"></i>' : flagImg(c.code);

        const span = document.createElement("span");
        span.textContent = c.name;
        d.appendChild(span);

        d.onclick = () => {
            selectedCountry = c.code;
            setCountryButton(c);
            cMenu.classList.remove("open");
        };
        cList.appendChild(d);
    });
}

cBtn.onclick = (e) => {
    e.stopPropagation();
    cMenu.classList.toggle("open");
    if (cMenu.classList.contains("open")) {
        cSearch.value = "";
        renderCountries();
        cSearch.focus();
    }
};
cSearch.oninput = () => renderCountries(cSearch.value);
cMenu.onclick = (e) => e.stopPropagation();
document.addEventListener("click", () => cMenu.classList.remove("open"));
setCountryButton({ code: "all", name: "Barcha mamlakatlar" });

// ===== Shikoyat oynasi =====
const reportModal = $("report-modal");
$("open-report-btn").onclick = () => { reportModal.style.display = "flex"; };
$("close-report").onclick = () => { reportModal.style.display = "none"; };
$("cancel-report").onclick = () => { reportModal.style.display = "none"; };

$("submit-report").onclick = () => {
    alert("Shikoyatingiz qabul qilindi! Ushbu foydalanuvchi bloklanadi.");
    reportModal.style.display = "none";
    find(); // keyingisiga o'tish
};

// ===== Avto-tarjima (simulyatsiya) =====
function autoTranslate(text) {
    const translateMap = {
        "hello": "Salom (🇺🇸 ingliz tilidan)",
        "hi": "Salom (🇺🇸 ingliz tilidan)",
        "привет": "Salom (🇷🇺 rus tilidan)",
        "как дела": "Ishlar qanday? (🇷🇺 rus tilidan)",
        "merhaba": "Salom (🇹🇷 turk tilidan)",
        "annyeong": "Salom (🇰🇷 koreys tilidan)"
    };
    const clean = text.toLowerCase().trim();
    return translateMap[clean] || `[Tarjima]: ${text}`;
}

function addMsg(text, senderCls) {
    const box = $("msgs");
    const d = document.createElement("div");
    d.className = senderCls;
    d.textContent = text;

    if (senderCls === "them" && $("auto-translate-check").checked) {
        const tr = document.createElement("span");
        tr.className = "translated-text";
        tr.textContent = autoTranslate(text);
        d.appendChild(tr);
    }

    box.appendChild(d);
    box.scrollTop = 1e9;
}

// ===== Kamera va ulanish =====
async function getMedia() {
    if (stream) return;
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    $("local").srcObject = stream;
}

$("bright").oninput = (e) => {
    $("local").style.filter = `brightness(${e.target.value}%)`;
};

function cleanup() {
    session++;
    try { call && call.close(); } catch (e) { }
    try { conn && conn.close(); } catch (e) { }
    try { peer && peer.destroy(); } catch (e) { }
    call = conn = peer = null;
    $("remote").srcObject = null;
    $("remote-country-badge").style.display = "none";
}

function attach(c, my) {
    call = c;

    c.on("stream", (s) => {
        if (my !== session) return;
        $("remote").srcObject = s;

        // Suhbatdoshga tasodifiy mamlakat biriktiriladi (hozircha ko'rinish uchun)
        const rc = countries[Math.floor(Math.random() * countries.length)];
        $("partner-flag").innerHTML = flagImg(rc.code, 22);
        $("partner-country-name").textContent = rc.name;
        $("remote-country-badge").style.display = "flex";

        $("status").style.display = "none";
    });

    c.on("close", () => {
        if (my === session && call === c) {
            $("remote").srcObject = null;
            $("remote-country-badge").style.display = "none";
            $("status").style.display = "block";
            $("status").textContent = "Suhbatdosh tark etdi. Keyingisini bosing.";
        }
    });
}

function setConn(c) {
    conn = c;
    c.on("data", (t) => addMsg(String(t).slice(0, 500), "them"));
}

function trySlot(id, my) {
    return new Promise((resolve) => {
        const p = new Peer(id);
        peer = p;
        let done = false;
        const finish = (r) => { if (!done) { done = true; resolve(r); } };

        p.on("open", () => {
            $("status").style.display = "block";
            $("status").textContent = "Suhbatdosh qidirilmoqda...";
            $("spinner").style.display = "block";

            p.on("call", (c) => {
                if (call || my !== session) { c.close(); return; }
                c.answer(stream);
                attach(c, my);
                finish("connected");
            });
            p.on("connection", (c) => setConn(c));

            setTimeout(() => {
                if (!call) {
                    try { p.destroy(); } catch (e) { }
                    finish("next");
                }
            }, 3000 + Math.random() * 3000);
        });

        p.on("error", () => {
            try { p.destroy(); } catch (e) { }
            finish("next");
        });
    });
}

async function find() {
    try {
        await getMedia();
    } catch (e) {
        alert("Kamera va mikrofonga ruxsat bering!");
        return;
    }
    cleanup();
    const my = session;
    started = true;
    $("start").querySelector("span").textContent = "Keyingi";
    $("msgs").innerHTML = "";

    while (my === session) {
        const n = Math.floor(Math.random() * SLOTS);
        const r = await trySlot(PREFIX + n, my);
        if (r === "connected") {
            $("spinner").style.display = "none";
            return;
        }
    }
}

$("start").onclick = find;

$("stop").onclick = () => {
    cleanup();
    started = false;
    $("start").querySelector("span").textContent = "Boshlash";
    $("status").style.display = "block";
    $("status").textContent = "To'xtatildi";
    $("spinner").style.display = "none";
};

// ===== Xabar yuborish =====
function send() {
    const input = $("text");
    const t = input.value.trim();
    if (!t) return;

    addMsg(t, "me");
    if (conn && conn.open) conn.send(t);
    input.value = "";
}

$("send").onclick = send;
$("text").onkeydown = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        send();
    }
};