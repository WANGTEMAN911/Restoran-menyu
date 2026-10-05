/* Menyuni shu yerdan tahrirlang: nom, tavsif, narx (so'm), teglar */
const MENU = [
  {
    id: 'shorva', title: 'Sho‘rvalar', note: 'Har biri non bilan beriladi', items: [
      { n: 'Mastava', d: 'Guruch, mol go‘shti, sabzavot va qatiq bilan.', p: 38000, t: ['hit'] },
      { n: 'Sho‘rva', d: 'Qo‘y go‘shti, kartoshka, sabzi va yangi ko‘katlar.', p: 52000 },
      { n: 'Chuchvara', d: 'Qo‘lda tugilgan mayda chuchvara, sirka va ko‘katli bulyonda.', p: 42000 },
      { n: 'Nohat sho‘rva', d: 'Nohat, sabzavot, achchiq qalampir bilan.', p: 34000, t: ['veg', 'hot'] }]
  },
  {
    id: 'asosiy', title: 'Asosiy taomlar', note: 'Qozonda va mangalda tayyorlanadi', items: [
      { n: 'Toshkent palovi', d: 'Devzira guruch, qo‘y go‘shti, sariq sabzi, zira va bedana tuxumi.', p: 65000, t: ['hit'] },
      { n: 'Lag‘mon', d: 'Qo‘lda cho‘zilgan xamir, mol go‘shti, bolgar qalampiri va rediska.', p: 48000, t: ['hit'] },
      { n: 'Manti (4 dona)', d: 'Qo‘y go‘shti va piyozli bug‘da pishirilgan manti, smetana bilan.', p: 46000 },
      { n: 'Dimlama', d: 'Go‘sht, kartoshka, sabzavot, o‘z sharbatida sekin dimlanadi.', p: 72000 },
      { n: 'Qo‘y shashlik (1 shish)', d: 'Ko‘mirda pishirilgan, piyoz va zirvak bilan.', p: 28000 },
      { n: 'Qovurma lag‘mon', d: 'Qovurilgan lag‘mon, sabzavot va achchiq sous bilan.', p: 52000, t: ['hot', 'new'] }]
  },
  {
    id: 'salat', title: 'Salatlar', note: 'Yangi sabzavotlardan', items: [
      { n: 'Achichuk', d: 'Pomidor, piyoz, achchiq qalampir, tuz.', p: 22000, t: ['veg', 'hot'] },
      { n: 'Toshkent salati', d: 'Mol go‘shti, rediska, piyoz, qatiq sousi.', p: 35000 },
      { n: 'Bodring va pomidor', d: 'Rayhon va zaytun moyi bilan.', p: 26000, t: ['veg'] }]
  },
  {
    id: 'non', title: 'Non va samsa', note: 'Tandirdan issiq holda', items: [
      { n: 'Tandir samsa', d: 'Qo‘y go‘shti va dumba, kunjut sepilgan.', p: 18000, t: ['hit'] },
      { n: 'Patir', d: 'Qatlamali, yumshoq, sariyog‘li tandir noni.', p: 12000 },
      { n: 'Obi non', d: 'Klassik Toshkent noni.', p: 8000, t: ['veg'] }]
  },
  {
    id: 'ichimlik', title: 'Ichimliklar', note: '', items: [
      { n: 'Ko‘k choy', d: 'Choynak, 2–3 kishiga.', p: 15000, t: ['veg'] },
      { n: 'Qora choy', d: 'Choynak, limon yoki nabot bilan.', p: 15000, t: ['veg'] },
      { n: 'Ayron', d: 'Sovuq, tuzli qatiq ichimligi.', p: 14000 },
      { n: 'Mevali kompot', d: 'Uy retsepti, quritilgan mevalardan.', p: 18000, t: ['veg'] },
      { n: 'Limonad', d: 'Yalpiz va limon bilan, 0,5 litr.', p: 28000, t: ['veg', 'new'] }]
  },
  {
    id: 'shirin', title: 'Shirinliklar', note: '', items: [
      { n: 'Chak-chak', d: 'Asalli qovurilgan xamir, yong‘oq bilan.', p: 30000, t: ['veg'] },
      { n: 'Halva', d: 'Kunjut va asal, choy bilan yaxshi ketadi.', p: 26000, t: ['veg'] },
      { n: 'Paxlava', d: 'Qatlamali xamir, yong‘oq va asal sirop.', p: 32000, t: ['veg', 'hit'] }]
  }
];
const TAGS = { hit: ['Mashhur', 'hit'], hot: ['Achchiq', 'hot'], veg: ['Go‘shtsiz', 'veg'], new: ['Yangi', 'hit'] };
const fmt = n => n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
const $ = s => document.querySelector(s), tabs = $('#tabs'), root = $('#menu'), q = $('#q');
let cat = 'all';

function esc(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }

function drawTabs() {
  const all = [{ id: 'all', title: 'Hammasi' }, ...MENU];
  tabs.innerHTML = all.map(c => `<button data-id="${c.id}" aria-pressed="${c.id === cat}">${c.title}</button>`).join('');
}
function render() {
  const term = q.value.trim().toLowerCase();
  let html = '';
  MENU.filter(c => cat === 'all' || c.id === cat).forEach(c => {
    const items = c.items.filter(i => !term || (i.n + ' ' + i.d).toLowerCase().includes(term));
    if (!items.length) return;
    html += `<section id="${c.id}"><h2>${c.title}</h2>${c.note ? `<p class="sub">${c.note}</p>` : '<p class="sub"></p>'}` +
      items.map(i => `<article class="item"><div class="row"><span class="name">${esc(i.n)}</span><span class="dots"></span><span class="price">${fmt(i.p)} <small>so‘m</small></span></div>
    <p class="desc">${esc(i.d)}</p>${i.t ? `<div class="tags">${i.t.map(k => `<span class="tag ${TAGS[k][1]}">${TAGS[k][0]}</span>`).join('')}</div>` : ''}</article>`).join('') + `</section>`;
  });
  root.innerHTML = html || '<p class="empty">Hech narsa topilmadi. Boshqa so‘z bilan qidirib ko‘ring.</p>';
}
tabs.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  cat = b.dataset.id; drawTabs(); render();
  root.scrollIntoView({ behavior: 'smooth' });
});
q.addEventListener('input', render);
drawTabs(); render();

/* Mobil navigatsiya tugmasi */
const burger = $('#burger'), links = $('#links');
function setNav(open) {
  links.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
}
burger.addEventListener('click', () => setNav(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.closest('a')) setNav(false) });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false) });
