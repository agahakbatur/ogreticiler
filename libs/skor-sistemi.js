/* =====================================================================
   ÖĞRETİCİLER – ORTAK SKOR SİSTEMİ  (skor-sistemi.js)
   ---------------------------------------------------------------------
   Bir oyuna eklemek için:
     1) <script src="skor-sistemi.js"></script>
     2) Oyun bitince:
        Skor.oyunBitti({ oyun: 'carpma', liste: '5-kolay', listeAd: '5 içinde · Kolay',
                         oyunAd: 'Çarpma Arabası', puan: 820, detay: '50 doğru, 3 yanlış' });
     3) (İsteğe bağlı) Rekorları göstermek için:
        Skor.listeGoster({ oyun: 'carpma', liste: '5-kolay', listeAd: '...', oyunAd: '...' });

   Kurulum: aşağıdaki ADRES satırına Google Apps Script "Web uygulaması" adresini yapıştırın.
   Adres yazılmadıysa sistem hiçbir şey göstermez, oyunlar her zamanki gibi çalışır.
   ===================================================================== */
(function () {
'use strict';

const ADRES = 'https://script.google.com/macros/s/AKfycbz_pGKUhdyUgaizkAxlXyj4lTKmQP5z9F0dDQFtxojxidp8PVx8Re8Kvuqko8W6a0mQSg/exec';   // örn: https://script.google.com/macros/s/AKfy..../exec

// ---- Takma adlar (Kod.gs içindeki liste ile AYNI olmalı) ----
const SIFATLAR = ['Hızlı', 'Neşeli', 'Cesur', 'Minik', 'Akıllı', 'Şirin', 'Güçlü', 'Çevik', 'Parlak', 'Sevimli',
                  'Meraklı', 'Usta', 'Yaman', 'Gülen', 'Sakin', 'Mavi', 'Yeşil', 'Altın', 'Gümüş', 'Kırmızı'];
const HAYVANLAR = [['Kartal', '🦅'], ['Yunus', '🐬'], ['Panda', '🐼'], ['Aslan', '🦁'], ['Tilki', '🦊'],
                   ['Baykuş', '🦉'], ['Kaplumbağa', '🐢'], ['Penguen', '🐧'], ['Tavşan', '🐰'], ['Ejder', '🐲']];
const ADLAR = [];
HAYVANLAR.forEach(([h, e], hi) => SIFATLAR.forEach((s, si) => ADLAR[hi * SIFATLAR.length + si] = { no: hi * SIFATLAR.length + si, ad: s + ' ' + h, e }));
const SIRALI = [...ADLAR].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

const KURULU = /^https:\/\/script\.google(usercontent)?\.com\//.test(ADRES) || /^http:\/\/localhost[:/]/.test(ADRES);

// ---- Cihaz hafızası ----
const hafiza = {
  al(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  sil(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const kimlik = () => { const k = hafiza.al('skorKimlik'); return k && ADLAR[k.no] && /^\d{4}$/.test(k.kod) ? k : null; };

// ---- Sunucu ----
async function istek(veri, oku) {
  if (!KURULU) throw new Error('kurulmadi');
  const ctrl = new AbortController(), tm = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = oku
      ? await fetch(ADRES + '?' + new URLSearchParams(veri).toString(), { signal: ctrl.signal })
      : await fetch(ADRES, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(veri), signal: ctrl.signal });
    return await r.json();
  } finally { clearTimeout(tm); }
}

// Çevrimdışıyken: her liste için yalnızca en iyi puan saklanır, bağlantı gelince gönderilir.
function kuyrugaEkle(k, o) {
  const q = hafiza.al('skorKuyruk') || [];
  const i = q.findIndex(x => x.no === k.no && x.oyun === o.oyun && x.liste === o.liste);
  const kayit = { no: k.no, kod: k.kod, oyun: o.oyun, liste: o.liste, puan: o.puan, detay: o.detay || '' };
  if (i < 0) q.push(kayit); else if (q[i].puan < o.puan) q[i] = kayit;
  hafiza.yaz('skorKuyruk', q);
}
let gonderiliyor = false;
async function kuyruguGonder() {
  if (!KURULU || gonderiliyor) return;
  const q = hafiza.al('skorKuyruk') || [];
  if (!q.length) return;
  gonderiliyor = true;
  const kalan = [];
  for (const x of q) {
    try { const r = await istek(Object.assign({ islem: 'kaydet' }, x)); if (!r.ok && r.hata === 'cok_hizli') kalan.push(x); }
    catch (e) { kalan.push(x); }
  }
  hafiza.yaz('skorKuyruk', kalan);
  gonderiliyor = false;
}

// ---- Görünüm ----
const norm = s => s.toLocaleLowerCase('tr-TR').replace(/[çğıöşüâî]/g, c => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i' })[c]).replace(/\s+/g, ' ').trim();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function stilEkle() {
  if (document.getElementById('skr-stil')) return;
  const st = document.createElement('style'); st.id = 'skr-stil';
  st.textContent = `
#skr{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:10px;background:#050a1ccc;backdrop-filter:blur(3px);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-user-select:none;user-select:none}
#skr .kt{width:min(100%,520px);max-height:94vh;display:flex;flex-direction:column;background:#0d1530;border:4px solid #ffd23f;border-radius:18px;box-shadow:0 0 0 4px #0d1530,0 0 40px #ffd23f55;color:#e8eefc;overflow:hidden}
#skr .bas{padding:14px 16px 8px;text-align:center}
#skr h2{margin:0;font-size:clamp(20px,5vw,28px);color:#ffd23f;letter-spacing:.08em;text-shadow:0 0 10px #ffd23f88}
#skr .alt{font-size:13px;color:#9fb0d8;margin-top:3px}
#skr .gov{padding:6px 16px 10px;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;flex:1;min-height:0}
#skr .ayak{padding:10px 16px 14px;display:flex;gap:8px;flex-wrap:wrap;border-top:2px solid #1e2a52}
#skr button{font:inherit;cursor:pointer}
#skr .bt{flex:1;min-width:120px;padding:11px 12px;border-radius:12px;border:0;font-weight:900;font-size:16px;background:#ffd23f;color:#1a1400}
#skr .bt.ik{background:#1e2a52;color:#e8eefc}
#skr .bt:disabled{opacity:.5}
#skr .sekme{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}
#skr .sekme button{padding:9px;border-radius:10px;border:2px solid #2a3a6e;background:#121c3d;color:#b9c6ea;font-weight:800;font-size:14px}
#skr .sekme button.on{border-color:#ffd23f;color:#ffd23f}
#skr input{width:100%;font:inherit;font-size:18px;padding:11px 12px;border-radius:12px;border:2px solid #2a3a6e;background:#060c20;color:#fff;outline:none;-webkit-user-select:text;user-select:text}
#skr input:focus{border-color:#ffd23f}
#skr .izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin-top:8px}
#skr .ad{display:flex;align-items:center;gap:6px;padding:9px 8px;border-radius:10px;border:2px solid #2a3a6e;background:#121c3d;color:#e8eefc;font-weight:800;font-size:15px;text-align:left}
#skr .ad .e{font-size:20px}
#skr .ad:disabled{opacity:.35;cursor:not-allowed;text-decoration:line-through}
#skr .ad:not(:disabled):active{border-color:#ffd23f}
#skr .bos{color:#9fb0d8;text-align:center;padding:18px 0}
#skr .buyuk{font-size:clamp(46px,14vw,80px);font-weight:950;color:#ffd23f;letter-spacing:.15em;text-align:center;margin:6px 0;text-shadow:0 0 14px #ffd23f88}
#skr .kim{font-size:clamp(22px,6vw,30px);font-weight:900;text-align:center;margin:8px 0}
#skr p{line-height:1.45;margin:8px 0;text-align:center}
#skr .tablo{font-family:"Courier New",ui-monospace,monospace;font-weight:900}
#skr .sat{display:grid;grid-template-columns:3ch 1.6em 1fr auto;gap:8px;align-items:center;padding:6px 8px;border-radius:8px;font-size:clamp(14px,4vw,18px)}
#skr .sat:nth-child(1){color:#ffd23f}#skr .sat:nth-child(2){color:#d9e2f5}#skr .sat:nth-child(3){color:#ffae6b}
#skr .sat .pu{color:#7dffb0}
#skr .sat.ben{background:#ffd23f;color:#1a1400!important;animation:skrYan .8s steps(2) infinite}
#skr .sat.ben .pu{color:#1a1400}
#skr .nokta{text-align:center;color:#55658f;letter-spacing:.3em}
#skr .rekor{font-size:clamp(24px,7vw,36px);font-weight:950;color:#ff5d8f;text-align:center;animation:skrYan .6s steps(2) infinite;letter-spacing:.06em}
#skr .ben-cubuk{display:flex;justify-content:center;align-items:center;gap:8px;font-size:13px;color:#9fb0d8;margin-top:6px;flex-wrap:wrap}
#skr .ben-cubuk button{background:none;border:1px solid #2a3a6e;color:#b9c6ea;border-radius:8px;padding:4px 8px;font-size:12px;font-weight:800}
#skr .hata{color:#ff8a8a;text-align:center;font-weight:800;min-height:1.2em}
#skr .yukl{display:inline-block;width:22px;height:22px;border:3px solid #ffd23f;border-top-color:transparent;border-radius:50%;animation:skrDon 0.8s linear infinite;vertical-align:middle;margin-right:8px}
@keyframes skrYan{50%{opacity:.55}}
@keyframes skrDon{to{transform:rotate(360deg)}}`;
  document.head.appendChild(st);
}

let kapanis = null;
function pencere(bas, gov, ayak) {
  stilEkle();
  let el = document.getElementById('skr');
  if (!el) { el = document.createElement('div'); el.id = 'skr'; document.body.appendChild(el); }
  el.innerHTML = `<div class="kt" role="dialog" aria-modal="true"><div class="bas">${bas}</div><div class="gov">${gov}</div><div class="ayak">${ayak || ''}</div></div>`;
  // Oyunun klavye kısayolları pencere açıkken çalışmasın
  el.onkeydown = e => e.stopPropagation();
  return el;
}
function kapat() { const el = document.getElementById('skr'); if (el) el.remove(); const f = kapanis; kapanis = null; if (f) f(); }
const $ = s => document.querySelector('#skr ' + s);
const baslik = (o, ek) => `<h2>🏆 REKORLAR</h2><div class="alt">${esc(o.oyunAd || '')}${o.listeAd ? ' · ' + esc(o.listeAd) : ''}${ek ? '<br>' + ek : ''}</div>`;
const adGoster = no => `${ADLAR[no].e} ${esc(ADLAR[no].ad)}`;

function bekle(o, metin) { pencere(baslik(o), `<p><span class="yukl"></span>${esc(metin)}</p>`); }
function mesaj(o, metin, dugmeler) {
  pencere(baslik(o), `<p>${metin}</p>`, dugmeler || '<button class="bt" data-k="kapat">Tamam</button>');
  document.querySelectorAll('#skr [data-k="kapat"]').forEach(b => b.onclick = kapat);
}

/* ---------- Rekor tablosu ---------- */
function tabloGoster(o, r, yeniPuan) {
  const k = kimlik();
  const satir = x => `<div class="sat${k && x.no === k.no ? ' ben' : ''}"><span>${x.sira}.</span><span>${ADLAR[x.no] ? ADLAR[x.no].e : '❔'}</span><span>${ADLAR[x.no] ? esc(ADLAR[x.no].ad.toLocaleUpperCase('tr-TR')) : '?'}</span><span class="pu">${x.puan}</span></div>`;
  let gov = '';
  if (yeniPuan != null && r.yeniRekor) gov += `<div class="rekor">★ YENİ REKOR! ★</div>`;
  if (yeniPuan != null && r.ben) gov += `<p>Bu oyunda <b>${yeniPuan}</b> puan aldın. Listede <b>${r.ben.sira}.</b> sıradasın.${!r.yeniRekor && r.oncekiRekor != null ? `<br><span style="color:#9fb0d8">En iyi puanın: ${r.oncekiRekor}</span>` : ''}</p>`;
  if (!r.ilk.length) gov += `<div class="bos">Bu listede henüz puan yok. İlk sen ol!</div>`;
  gov += `<div class="tablo">${r.ilk.map(satir).join('')}`;
  if (r.ben && r.ben.sira > r.ilk.length) gov += `<div class="nokta">• • •</div>${satir(r.ben)}`;
  gov += `</div><div class="alt" style="text-align:center;margin-top:6px">${r.toplam} oyuncu</div>`;
  gov += k ? `<div class="ben-cubuk">Sen: ${adGoster(k.no)} <button data-k="degil">Ben değilim</button></div>`
           : `<div class="ben-cubuk"><button data-k="degil">Adımı seç</button></div>`;
  pencere(baslik(o), gov, '<button class="bt" data-k="kapat">Kapat</button>');
  $('[data-k="kapat"]').onclick = kapat;
  $('[data-k="degil"]').onclick = () => { hafiza.sil('skorKimlik'); adSec(o, yeniPuan != null ? () => kaydet(o) : () => listeAc(o)); };
}

/* ---------- Ad seçme ---------- */
async function adSec(o, sonra) {
  bekle(o, 'Adlar yükleniyor…');
  let alinan;
  try { const r = await istek({ islem: 'adlar' }, true); if (!r.ok) throw 0; alinan = new Set(r.alinan); }
  catch (e) { return mesaj(o, o.basta ? 'İnternete bağlanılamadı, ad listesi açılamıyor.<br>Ad seçmeden oynayabilirsin.' : 'İnternete bağlanılamadı, ad listesi açılamıyor.<br>Puanın bu sefer kaydedilemedi.'); }

  let sekme = 'yeni';
  const ciz = () => {
    const q = norm($('input').value);
    const liste = SIRALI.filter(a => (sekme === 'yeni' || alinan.has(a.no)) && (!q || norm(a.ad).includes(q)));
    $('.izgara').innerHTML = liste.length
      ? liste.map(a => `<button class="ad" data-no="${a.no}" ${sekme === 'yeni' && alinan.has(a.no) ? 'disabled title="Bu ad alınmış"' : ''}><span class="e">${a.e}</span>${esc(a.ad)}</button>`).join('')
      : `<div class="bos">${sekme === 'yeni' ? 'Bu aramaya uyan ad yok.' : 'Bu aramaya uyan alınmış ad yok.'}</div>`;
    document.querySelectorAll('#skr .ad[data-no]').forEach(b => b.onclick = () => sekme === 'yeni' ? onayla(+b.dataset.no) : kodSor(+b.dataset.no));
  };
  const bosSay = ADLAR.length - alinan.size;
  pencere(`<h2>👾 ADINI SEÇ</h2><div class="alt">${o.basta ? 'Oyuna başlamadan adını seç. ' : ''}Puanın rekor listesine bu adla yazılır.</div>`,
    `<div class="sekme"><button class="on" data-s="yeni">Yeni ad seç</button><button data-s="var">Benim adım var</button></div>
     <input type="search" placeholder="🔍 Ara… (ör: kartal)" autocomplete="off" enterkeyhint="search">
     <div class="alt" id="skr-bilgi" style="margin-top:6px">${bosSay} ad boşta. Gri adlar başkasına ait.</div>
     <div class="izgara"></div>`,
    `<button class="bt ik" data-k="kapat">${o.basta ? 'Ad seçmeden oyna' : 'Kaydetmeden kapat'}</button>`);
  $('[data-k="kapat"]').onclick = kapat;
  $('input').oninput = ciz;
  document.querySelectorAll('#skr .sekme button').forEach(b => b.onclick = () => {
    sekme = b.dataset.s;
    document.querySelectorAll('#skr .sekme button').forEach(x => x.classList.toggle('on', x === b));
    $('#skr-bilgi').textContent = sekme === 'yeni' ? `${bosSay} ad boşta. Gri adlar başkasına ait.` : 'Daha önce seçtiğin adı bul, 4 haneli kodunu gir.';
    ciz();
  });
  ciz();

  function onayla(no) {
    pencere('<h2>👾 ADINI SEÇ</h2>', `<div class="kim">${adGoster(no)}</div><p>Bu adı seçiyorsun. Bu ad artık başkasına verilmeyecek.</p><div class="hata"></div>`,
      '<button class="bt ik" data-k="geri">Vazgeç</button><button class="bt" data-k="evet">Evet, bu benim</button>');
    $('[data-k="geri"]').onclick = () => adSec(o, sonra);
    $('[data-k="evet"]').onclick = async () => {
      $('[data-k="evet"]').disabled = true; $('.hata').textContent = '';
      try {
        const r = await istek({ islem: 'al', no });
        if (r.ok) { hafiza.yaz('skorKimlik', { no, kod: r.kod }); return kodGoster(no, r.kod); }
        if (r.hata === 'alinmis') { $('.hata').textContent = 'Bu ad az önce başkası tarafından alındı. Başka bir ad seç.'; setTimeout(() => adSec(o, sonra), 1800); return; }
        throw 0;
      } catch (e) { $('.hata').textContent = 'Bağlantı sorunu. Tekrar dene.'; $('[data-k="evet"]').disabled = false; }
    };
  }
  function kodGoster(no, kod) {
    pencere('<h2>🔑 GİZLİ KODUN</h2>', `<div class="kim">${adGoster(no)}</div><div class="buyuk">${kod}</div>
      <p>Bu kodu bir yere yaz ya da öğretmenine söyle.<br>Başka bir cihazda adını kullanmak için gerekir.<br>Bu cihaz seni hatırlayacak.</p>`,
      `<button class="bt" data-k="tamam">${o.basta ? 'Tamam, oyuna başla' : 'Tamam, devam'}</button>`);
    $('[data-k="tamam"]').onclick = sonra;
  }
  function kodSor(no) {
    pencere('<h2>🔑 KODUNU GİR</h2>', `<div class="kim">${adGoster(no)}</div>
      <input inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="4 haneli kod" style="text-align:center;font-size:30px;letter-spacing:.3em">
      <div class="hata" style="margin-top:8px"></div>`,
      '<button class="bt ik" data-k="geri">Geri</button><button class="bt" data-k="giris">Giriş</button>');
    const inp = $('input'); setTimeout(() => inp.focus(), 50);
    inp.oninput = () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 4); };
    inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') $('[data-k="giris"]').click(); };
    $('[data-k="geri"]').onclick = () => adSec(o, sonra);
    $('[data-k="giris"]').onclick = async () => {
      const kod = inp.value;
      if (!/^\d{4}$/.test(kod)) { $('.hata').textContent = 'Kod 4 haneli olmalı.'; return; }
      $('[data-k="giris"]').disabled = true;
      try {
        const r = await istek({ islem: 'giris', no, kod });
        if (r.ok) { hafiza.yaz('skorKimlik', { no, kod }); return sonra(); }
        $('.hata').textContent = 'Kod yanlış. Kodunu bilmiyorsan öğretmenine sor.';
      } catch (e) { $('.hata').textContent = 'Bağlantı sorunu. Tekrar dene.'; }
      $('[data-k="giris"]').disabled = false;
    };
  }
}

/* ---------- Puan kaydetme ---------- */
async function kaydet(o) {
  const k = kimlik();
  if (!k) return adSec(o, () => kaydet(o));
  bekle(o, `${ADLAR[k.no].ad} için ${o.puan} puan kaydediliyor…`);
  try {
    const r = await istek({ islem: 'kaydet', no: k.no, kod: k.kod, oyun: o.oyun, liste: o.liste, puan: o.puan, detay: o.detay || '' });
    if (r.ok) return tabloGoster(o, r, o.puan);
    if (r.hata === 'kod') {   // öğretmen adı serbest bırakmış ya da dönem sıfırlanmış
      hafiza.sil('skorKimlik');
      mesaj(o, 'Bu cihazdaki adın artık geçerli değil (öğretmenin listeyi yenilemiş olabilir).<br>Lütfen yeniden ad seç.', '<button class="bt" data-k="sec">Ad seç</button>');
      $('[data-k="sec"]').onclick = () => adSec(o, () => kaydet(o));
      return;
    }
    if (r.hata === 'cok_hizli') return mesaj(o, 'Çok kısa süre önce puan gönderdin. Bu puan kaydedilmedi.');
    if (r.hata === 'puan') return mesaj(o, 'Bu puan kaydedilemedi.');
    throw 0;
  } catch (e) {
    kuyrugaEkle(k, o);
    mesaj(o, `İnternete bağlanılamadı.<br><b>${o.puan}</b> puanın bu cihazda saklandı; internet gelince kendiliğinden kaydedilecek.`);
  }
}

async function listeAc(o) {
  bekle(o, 'Rekorlar yükleniyor…');
  const k = kimlik();
  try {
    const r = await istek({ islem: 'liste', oyun: o.oyun, liste: o.liste, no: k ? k.no : -1 }, true);
    if (!r.ok) throw 0;
    tabloGoster(o, r, null);
  } catch (e) { mesaj(o, 'Rekorlar şu an yüklenemedi. İnternet bağlantını kontrol et.'); }
}

/* ---------- Dışarıya açılan işlevler ---------- */
window.Skor = {
  kurulu: KURULU,
  // Oyun bitince çağrılır. Pencere kapanınca Promise tamamlanır.
  oyunBitti(o) {
    return new Promise(res => {
      if (!KURULU || !(o.puan >= 0)) return res();
      o.puan = Math.round(o.puan);
      kapanis = res;
      kuyruguGonder().finally(() => kaydet(o));
    });
  },
  // Oyun başında ad seçtirir. Ad zaten seçiliyse hemen döner. Sonuç: { no, ad, e } ya da null (adsız oynuyor)
  adSor(o) {
    return new Promise(res => {
      if (!KURULU) return res(null);
      if (kimlik()) return res(this.oyuncu());
      kapanis = () => res(this.oyuncu());
      adSec(Object.assign({}, o, { basta: true }), kapat);
    });
  },
  adDegistir(o) { hafiza.sil('skorKimlik'); return this.adSor(o); },
  oyuncu() { const k = kimlik(); return k ? { no: k.no, ad: ADLAR[k.no].ad, e: ADLAR[k.no].e } : null; },
  listeGoster(o) {
    return new Promise(res => { if (!KURULU) return res(); kapanis = res; listeAc(o); });
  },
  adlar: ADLAR
};
if (KURULU) { window.addEventListener('online', kuyruguGonder); setTimeout(kuyruguGonder, 3000); }
})();
