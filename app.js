"use strict";

// ---------- Utilità ----------
const $ = (id) => document.getElementById(id);
const euro = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const arrotonda = (n) => Math.round(n * 100) / 100;
const num = (n) => n.toLocaleString("it-IT", { maximumFractionDigits: 2 });

function leggi(chiave, predefinito) {
  try {
    const v = localStorage.getItem(chiave);
    return v ? JSON.parse(v) : predefinito;
  } catch (e) {
    return predefinito;
  }
}
function scrivi(chiave, valore) {
  try {
    localStorage.setItem(chiave, JSON.stringify(valore));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- Listino ----------
// tipo: "griglia" (tabella larghezza × altezza per categoria), "doppia" (struttura + due teli),
// "mq" (prezzo al metro quadro), "binario" (prezzo in base alla larghezza).
const PRODOTTI = window.CATALOGO.map((id) => {
  const p = window.LISTINO[id];
  return { id, tipo: p.tipo || (p.teli === 2 ? "doppia" : "griglia"), ...p };
});
const prodottoCorrente = () => PRODOTTI.find((p) => p.id === $("prodotto").value);
const categorieDi = (p) => Object.keys(p.griglie || {});
const usaAltezza = (p) => p.tipo !== "binario";
const usaCategoria = (p) => p.tipo === "griglia" || p.tipo === "doppia";
const tuboDi = (p, l) => (p.tubo ? (l <= p.tubo.soglia ? p.tubo.sotto : p.tubo.sopra) : "");

/**
 * Prezzo da tabella larghezza × altezza: si usa la misura di tabella uguale o immediatamente superiore.
 * Restituisce { prezzo, lTab, hTab } oppure { errore }.
 */
function cercaPrezzo(prodotto, categoria, larghezza, altezza) {
  const griglia = prodotto.griglie[categoria];
  if (!griglia) {
    return { errore: `${prodotto.nome}: la categoria ${categoria} non è calcolabile dal listino (tabella non valida o assente). Chiedere preventivo.` };
  }
  const larghezze = (prodotto.larghezzePer && prodotto.larghezzePer[categoria]) || prodotto.larghezze;
  const altezze = prodotto.altezze;
  const iL = larghezze.findIndex((l) => l >= larghezza);
  const iH = altezze.findIndex((h) => h >= altezza);
  if (iL === -1) {
    return { errore: `Larghezza oltre il massimo di listino (${larghezze[larghezze.length - 1]} cm) per ${prodotto.nome} cat. ${categoria}: chiedere preventivo.` };
  }
  if (iH === -1) {
    return { errore: `Altezza oltre il massimo di listino (${altezze[altezze.length - 1]} cm): chiedere preventivo.` };
  }
  return { prezzo: griglia[iH][iL], lTab: larghezze[iL], hTab: altezze[iH] };
}

/**
 * Calcola il prezzo base della tenda (senza motore e supplementi) per qualsiasi tipo di prodotto.
 * Restituisce { prezzo, dettagli: [testo], avvisi: [testo] } oppure { errore }.
 */
function prezzoBase(p, scelte) {
  const { larghezza, altezza, categoria, categoria2, variante } = scelte;
  const avvisi = [];

  if (p.tipo === "griglia") {
    const r = cercaPrezzo(p, categoria, larghezza, altezza);
    if (r.errore) return r;
    const dett = [`Listino cat. ${categoria}, misura di tabella ${r.lTab} × ${r.hTab} cm: ${euro(r.prezzo)}`];
    const tubo = tuboDi(p, r.lTab);
    if (tubo) dett.push(tubo);
    return { prezzo: r.prezzo, dettagli: dett, avvisi, lTab: r.lTab, hTab: r.hTab, tubo };
  }

  if (p.tipo === "doppia") {
    const s = p.struttura;
    const iS = s.larghezze.findIndex((l) => l >= larghezza);
    if (iS === -1) return { errore: `Larghezza oltre il massimo della struttura (${s.larghezze[s.larghezze.length - 1]} cm): chiedere preventivo.` };
    const t1 = cercaPrezzo(p, categoria, larghezza, altezza);
    if (t1.errore) return t1;
    const t2 = cercaPrezzo(p, categoria2, larghezza, altezza);
    if (t2.errore) return t2;
    const strutt = s.prezzi[iS];
    return {
      prezzo: strutt + t1.prezzo + t2.prezzo,
      dettagli: [
        `Struttura ${s.larghezze[iS]} cm: ${euro(strutt)}`,
        `Telo 1 cat. ${categoria} (${t1.lTab} × ${t1.hTab}): ${euro(t1.prezzo)}`,
        `Telo 2 cat. ${categoria2} (${t2.lTab} × ${t2.hTab}): ${euro(t2.prezzo)}`
      ],
      avvisi, lTab: t1.lTab, hTab: t1.hTab
    };
  }

  if (p.tipo === "mq") {
    const v = p.varianti.find((x) => x.id === variante);
    const hConteggio = Math.max(altezza, p.altezzaMinima || 0);
    const mqReali = (larghezza / 100) * (hConteggio / 100);
    const mq = Math.max(mqReali, v.minimoMq || 0);
    let prezzo = v.prezzo * mq;
    const dett = [`${v.nome}: ${num(arrotonda(mq))} m² × ${euro(v.prezzo)}/m²`];
    if (hConteggio > altezza) dett.push(`altezza conteggiata ${hConteggio} cm`);
    if (mq > mqReali) dett.push(`minimo fatturabile ${num(v.minimoMq)} m²`);
    const magg = (p.maggiorazioniLarghezza || []).find((m) => larghezza < m.sotto);
    if (magg) {
      prezzo *= 1 + magg.perc / 100;
      dett.push(`maggiorazione +${magg.perc}% (larghezza inferiore a ${num(magg.sotto)} cm)`);
    }
    return { prezzo: arrotonda(prezzo), dettagli: dett, avvisi };
  }

  if (p.tipo === "binario") {
    const lConteggio = Math.max(larghezza, p.minimoCm || 0);
    const r = p.righe.find((x) => x.cm >= lConteggio);
    if (!r) return { errore: `Larghezza oltre il massimo di listino (${p.righe[p.righe.length - 1].cm} cm): chiedere preventivo.` };
    const parti = [`${r.cm} cm`];
    if (r.cadute) parti.push(`${r.cadute} cadute`);
    parti.push(`${r.supporti} supporti`);
    const dett = [`Binario ${parti.join(", ")}: ${euro(r.prezzo)}`];
    if (lConteggio > larghezza) dett.push(`minimo fatturabile ${p.minimoCm} cm`);
    return { prezzo: r.prezzo, dettagli: dett, avvisi, lTab: r.cm };
  }

  return { errore: "Tipo di prodotto sconosciuto." };
}

// ---------- Impostazioni ----------
let impostazioni = Object.assign({}, window.AZIENDA_DEFAULT, { iva: 22, variazione: 0 }, leggi("impostazioni", {}));

function mostraAzienda() {
  const a = impostazioni;
  $("azienda-box").innerHTML = "";
  const righe = [
    ["strong", a.nome],
    ["div", a.sedeOperativa && "Sede operativa: " + a.sedeOperativa],
    ["div", a.sedeLegale && "Sede legale: " + a.sedeLegale],
    ["div", a.piva && "P.IVA " + a.piva],
    ["div", a.telefoni],
    ["div", [a.email, a.sito].filter(Boolean).join(" · ")]
  ];
  for (const [tag, testo] of righe) {
    if (!testo) continue;
    const el = document.createElement(tag);
    el.textContent = testo;
    $("azienda-box").appendChild(el);
    if (tag === "strong") $("azienda-box").appendChild(document.createElement("br"));
  }
}

// ---------- Stato del preventivo ----------
let preventivo;

function nuovoNumero() {
  const anno = new Date().getFullYear();
  const contatori = leggi("contatori", {});
  const n = (contatori[anno] || 0) + 1;
  return { testo: `${n}/${anno}`, anno, n };
}

function nuovoPreventivo() {
  const num = nuovoNumero();
  preventivo = {
    id: "p" + Date.now(),
    numero: num.testo,
    data: new Date().toISOString().slice(0, 10),
    cliente: { nome: "", indirizzo: "", contatti: "" },
    righe: [],
    variazione: Math.abs(Number(impostazioni.variazione) || 0),
    note: ""
  };
  caricaInModulo();
}

function caricaInModulo() {
  $("numero").value = preventivo.numero;
  $("data").value = preventivo.data;
  $("cliente-nome").value = preventivo.cliente.nome;
  $("cliente-indirizzo").value = preventivo.cliente.indirizzo;
  $("cliente-contatti").value = preventivo.cliente.contatti;
  $("variazione").value = Math.abs(preventivo.variazione || 0);
  $("note").value = preventivo.note;
  disegnaRighe();
}

function leggiDalModulo() {
  preventivo.numero = $("numero").value.trim();
  preventivo.data = $("data").value;
  preventivo.cliente = {
    nome: $("cliente-nome").value.trim(),
    indirizzo: $("cliente-indirizzo").value.trim(),
    contatti: $("cliente-contatti").value.trim()
  };
  preventivo.variazione = Math.min(100, Math.abs(Number($("variazione").value) || 0));
  preventivo.note = $("note").value;
}

// ---------- Configuratore ----------
function riempiProdotti() {
  const sel = $("prodotto");
  let gruppo = null;
  let og = null;
  for (const p of PRODOTTI) {
    if (p.gruppo !== gruppo) {
      gruppo = p.gruppo;
      og = document.createElement("optgroup");
      og.label = gruppo;
      sel.appendChild(og);
    }
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.nome;
    og.appendChild(o);
  }
}

function riempiSelect(sel, opzioni, precedente) {
  sel.innerHTML = "";
  for (const [valore, testo] of opzioni) {
    const o = document.createElement("option");
    o.value = valore;
    o.textContent = testo;
    sel.appendChild(o);
  }
  if (opzioni.some(([v]) => v === precedente)) sel.value = precedente;
}

const mostra = (id, visibile) => { $(id).style.display = visibile ? "" : "none"; };

// Menu dei tessuti raggruppati per categoria. Valore dell'opzione: "categoria|indice".
function riempiTessuti(sel, p) {
  const precedente = sel.value;
  const tessuti = (window.TESSUTI && window.TESSUTI[p.id]) || {};
  sel.innerHTML = "";
  for (const cat of categorieDi(p)) {
    const og = document.createElement("optgroup");
    og.label = `Categoria ${cat}` + (p.griglie[cat] ? "" : " — non calcolabile, chiedere preventivo");
    const elenco = tessuti[cat] && tessuti[cat].length ? tessuti[cat] : [{ nome: `Tessuto categoria ${cat}`, max: null }];
    elenco.forEach((t, i) => {
      const o = document.createElement("option");
      o.value = `${cat}|${i}`;
      o.textContent = `${t.nome} (cat. ${cat})` + (t.max ? ` — fino a ${t.max} cm` : "");
      og.appendChild(o);
    });
    sel.appendChild(og);
  }
  if ([...sel.options].some((o) => o.value === precedente)) sel.value = precedente;
}

// Restituisce { categoria, tessuto } dalla scelta del menu
function tessutoScelto(sel, p) {
  const [categoria, i] = sel.value.split("|");
  const elenco = (window.TESSUTI && window.TESSUTI[p.id] && window.TESSUTI[p.id][categoria]) || [];
  return { categoria, tessuto: elenco[Number(i)] || { nome: `Tessuto categoria ${categoria}`, max: null } };
}

function avvisoLarghezza(t, larghezza) {
  if (!t.max || larghezza <= t.max) return null;
  return t.saldabile
    ? `${t.nome}: oltre ${t.max} cm il telo va capovolto e/o saldato`
    : `${t.nome}: larghezza massima del tessuto ${t.max} cm`;
}

// supplementi disponibili per il prodotto (e la variante, se il supplemento è limitato ad alcune)
function supplementiCorrenti() {
  const p = prodottoCorrente();
  return (p.supplementi || []).filter((s) => !s.varianti || s.varianti.includes($("variante").value));
}

function qtaPredefinita(s) {
  if (s.unita === "ml") return arrotonda((Number($("larghezza").value) || 0) / 100);
  if (s.unita === "mlh") return arrotonda((Number($("altezza").value) || 0) / 100);
  return 1;
}

function etichettaUnita(s) {
  return { pz: "pz", kit: "kit", cp: "coppia", ml: "ml", mlh: "ml", perc: "" }[s.unita] || s.unita;
}

function aggiornaCampi() {
  const p = prodottoCorrente();

  mostra("campo-categoria", usaCategoria(p));
  mostra("campo-categoria2", p.tipo === "doppia");
  mostra("campo-variante", p.tipo === "mq");
  mostra("campo-altezza", usaAltezza(p));
  $("l-categoria").textContent = p.tipo === "doppia" ? "Tessuto telo 1" : "Tessuto";

  if (usaCategoria(p)) {
    riempiTessuti($("tessuto1"), p);
    riempiTessuti($("tessuto2"), p);
  }
  if (p.tipo === "mq") {
    $("l-variante").textContent = p.etichettaVariante || "Variante";
    riempiSelect($("variante"), p.varianti.map((v) => [v.id, `${v.nome} — ${euro(v.prezzo)}/m²`]), $("variante").value);
  }

  const motori = (p.motori || []).map((id) => window.MOTORI.find((m) => m.id === id));
  mostra("campo-motore", motori.length > 0);
  riempiSelect($("motore"), [["", "Nessuno (azionamento a catena)"]].concat(motori.map((m) => [m.id, `${m.nome} — ${euro(m.prezzo)}`])), $("motore").value);

  aggiornaSupplementi();
}

function aggiornaSupplementi() {
  const box = $("supplementi");
  box.innerHTML = "";
  const elenco = supplementiCorrenti();
  mostra("campo-supplementi", elenco.length > 0);
  elenco.forEach((s, i) => {
    const riga = document.createElement("label");
    riga.className = "supp";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.i = i;
    const nome = document.createElement("span");
    nome.textContent = s.nome;
    riga.append(cb, nome);
    if (s.unita !== "perc") {
      const qta = document.createElement("input");
      qta.type = "number";
      qta.className = "qta";
      qta.dataset.qta = i;
      qta.min = "0";
      qta.step = s.unita === "ml" || s.unita === "mlh" ? "0.01" : "1";
      qta.value = 1;
      qta.disabled = true;
      qta.title = s.unita === "ml" || s.unita === "mlh" ? "metri lineari" : "quantità per tenda";
      qta.addEventListener("input", calcola);
      riga.appendChild(qta);
    }
    const prezzo = document.createElement("span");
    prezzo.className = "prezzo";
    prezzo.textContent = s.unita === "perc" ? `+${s.prezzo}%` : `${euro(s.prezzo)}/${etichettaUnita(s)}`;
    riga.appendChild(prezzo);
    cb.addEventListener("change", () => {
      const qta = box.querySelector(`[data-qta="${i}"]`);
      if (qta) {
        qta.disabled = !cb.checked;
        if (cb.checked) qta.value = qtaPredefinita(s);
      }
      calcola();
    });
    box.appendChild(riga);
  });
}

// aggiorna i metri lineari dei supplementi "a metro" già selezionati quando cambiano le misure
function aggiornaMetri() {
  const elenco = supplementiCorrenti();
  $("supplementi").querySelectorAll("input[type=checkbox]:checked").forEach((cb) => {
    const s = elenco[cb.dataset.i];
    if (s.unita === "ml" || s.unita === "mlh") $("supplementi").querySelector(`[data-qta="${cb.dataset.i}"]`).value = qtaPredefinita(s);
  });
}

// Calcola la riga in base ai campi del configuratore. Restituisce la riga o null.
function calcola() {
  const esito = $("esito");
  const btn = $("btn-aggiungi");
  btn.disabled = true;
  esito.className = "esito";

  const p = prodottoCorrente();
  const t1 = usaCategoria(p) ? tessutoScelto($("tessuto1"), p) : {};
  const t2 = p.tipo === "doppia" ? tessutoScelto($("tessuto2"), p) : {};
  const scelte = {
    larghezza: Number($("larghezza").value),
    altezza: usaAltezza(p) ? Number($("altezza").value) : 0,
    categoria: t1.categoria,
    categoria2: t2.categoria,
    tessuto1: t1.tessuto,
    tessuto2: t2.tessuto,
    variante: $("variante").value
  };
  const quantita = Math.max(1, Math.floor(Number($("quantita").value) || 1));

  if (!scelte.larghezza || (usaAltezza(p) && !scelte.altezza)) {
    esito.textContent = usaAltezza(p) ? "Inserisci larghezza e altezza in centimetri." : "Inserisci la larghezza in centimetri.";
    return null;
  }
  const base = prezzoBase(p, scelte);
  if (base.errore) {
    esito.classList.add("errore");
    esito.textContent = base.errore;
    return null;
  }

  const extra = [];
  const avvisi = base.avvisi.slice();
  const motore = window.MOTORI.find((m) => m.id === $("motore").value && (p.motori || []).includes(m.id));
  if (motore) {
    extra.push({ nome: motore.nome, qta: 1, unita: "kit", prezzo: motore.prezzo, totale: motore.prezzo });
    if (motore.max && (scelte.larghezza > motore.max[0] || scelte.altezza > motore.max[1])) {
      avvisi.push(`il motore ${motore.id} è indicato fino a ${motore.max[0]}×${motore.max[1]} cm`);
    }
  }
  const elenco = supplementiCorrenti();
  $("supplementi").querySelectorAll("input[type=checkbox]:checked").forEach((cb) => {
    const s = elenco[cb.dataset.i];
    if (s.unita === "perc") {
      extra.push({ nome: s.nome, perc: s.prezzo, unita: "perc", totale: arrotonda(base.prezzo * s.prezzo / 100) });
      return;
    }
    const qta = Number($("supplementi").querySelector(`[data-qta="${cb.dataset.i}"]`).value) || 0;
    if (qta > 0) extra.push({ nome: s.nome, qta, unita: s.unita, prezzo: s.prezzo, totale: arrotonda(s.prezzo * qta) });
  });

  for (const t of [scelte.tessuto1, scelte.tessuto2]) {
    const a = t && avvisoLarghezza(t, scelte.larghezza);
    if (a) avvisi.push(a);
  }
  if (usaCategoria(p) && ["C", "D"].includes(scelte.categoria) && /^fuji/.test(p.id)) {
    avvisi.push("categoria disponibile solo con profilo di premontaggio");
  }
  if (p.max && (scelte.larghezza > p.max[0] || scelte.altezza > p.max[1])) {
    avvisi.push(`misura oltre le dimensioni massime indicate dal listino (${p.max[0]} × ${p.max[1]} cm)`);
  }

  const totExtra = extra.reduce((t, e) => t + e.totale, 0);
  const unitario = arrotonda(base.prezzo + totExtra);
  const tessuto = $("tessuto").value.trim();
  const riga = {
    prodotto: p.nome,
    titolo: titoloRiga(p, scelte, tessuto),
    riferimento: $("riferimento").value.trim(),
    larghezza: scelte.larghezza,
    altezza: scelte.altezza,
    dettagli: base.dettagli,
    prezzoBase: base.prezzo,
    extra,
    quantita,
    unitario
  };

  esito.classList.add("ok");
  esito.innerHTML = "";
  const titolo = document.createElement("strong");
  titolo.textContent = `Prezzo: ${euro(unitario)}` + (quantita > 1 ? ` × ${quantita} = ${euro(unitario * quantita)}` : "");
  esito.appendChild(titolo);
  const dett = document.createElement("span");
  dett.className = "dett";
  let testo = base.dettagli.join(" · ");
  if (totExtra) testo += ` · motore/supplementi ${euro(totExtra)}`;
  if (avvisi.length) testo += `. Attenzione: ${avvisi.join("; ")}.`;
  dett.textContent = testo;
  esito.appendChild(dett);

  btn.disabled = false;
  return riga;
}

function titoloRiga(p, scelte, tessuto) {
  let t = p.nome;
  if (p.tipo === "griglia") t += ` — ${scelte.tessuto1.nome} (cat. ${scelte.categoria})`;
  if (p.tipo === "doppia") t += ` — teli ${scelte.tessuto1.nome} (cat. ${scelte.categoria}) + ${scelte.tessuto2.nome} (cat. ${scelte.categoria2})`;
  if (p.tipo === "mq") t += ` — ${p.varianti.find((v) => v.id === scelte.variante).nome}`;
  if (tessuto) t += ` (${tessuto})`;
  return t;
}

function aggiungiRiga() {
  const riga = calcola();
  if (!riga) return;
  preventivo.righe.push(riga);
  disegnaRighe();
  $("larghezza").value = "";
  $("altezza").value = "";
  $("riferimento").value = "";
  $("tessuto").value = "";
  $("quantita").value = 1;
  calcola();
  $("larghezza").focus();
}

// ---------- Tabella e totali ----------
function descrizione(r) {
  // righe salvate con la prima versione dell'app (solo Fuji)
  if (!r.titolo) {
    r = Object.assign({}, r, {
      titolo: `${r.prodotto} — tessuto cat. ${r.categoria}${r.tessuto ? " (" + r.tessuto + ")" : ""}`,
      dettagli: [`listino ${r.lTab} × ${r.hTab}${r.tubo ? ", " + r.tubo : ""}`]
    });
  }
  const misura = r.altezza ? `Misura ${r.larghezza} × ${r.altezza} cm` : `Larghezza ${r.larghezza} cm`;
  const dettagli = [misura].concat(r.dettagli);
  for (const e of r.extra) {
    let q;
    if (e.unita === "perc") q = `+${e.perc}% = ${euro(e.totale)}`;
    else if (e.unita === "ml" || e.unita === "mlh") q = `${num(e.qta)} ml × ${euro(e.prezzo)}`;
    else q = e.qta !== 1 ? `${num(e.qta)} × ${euro(e.prezzo)}` : euro(e.prezzo);
    dettagli.push(`${e.nome}: ${q}`);
  }
  return { titolo: (r.riferimento ? r.riferimento + " — " : "") + r.titolo, dettagli };
}

function disegnaRighe() {
  const tbody = $("righe");
  tbody.innerHTML = "";
  preventivo.righe.forEach((r, i) => {
    const d = descrizione(r);
    const tr = document.createElement("tr");
    const celle = [
      String(i + 1),
      null,
      String(r.quantita),
      euro(r.unitario),
      euro(r.unitario * r.quantita)
    ];
    celle.forEach((c, j) => {
      const td = document.createElement("td");
      if (j >= 2) td.className = "num";
      if (j === 1) {
        const t = document.createElement("div");
        t.textContent = d.titolo;
        const det = document.createElement("div");
        det.className = "det";
        det.textContent = d.dettagli.join(" · ");
        td.append(t, det);
      } else {
        td.textContent = c;
      }
      tr.appendChild(td);
    });
    const tdDel = document.createElement("td");
    tdDel.className = "no-print";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "link";
    del.textContent = "Elimina";
    del.addEventListener("click", () => {
      preventivo.righe.splice(i, 1);
      disegnaRighe();
    });
    tdDel.appendChild(del);
    tr.appendChild(tdDel);
    tbody.appendChild(tr);
  });
  $("vuoto").style.display = preventivo.righe.length ? "none" : "";
  aggiornaTotali();
}

function aggiornaTotali() {
  // il campo "variazione" contiene lo sconto in percentuale (valore positivo)
  const sconto = Math.min(100, Math.abs(Number($("variazione").value) || 0));
  const iva = Number(impostazioni.iva) || 0;
  const listino = arrotonda(preventivo.righe.reduce((t, r) => t + r.unitario * r.quantita, 0));
  const delta = -arrotonda(listino * sconto / 100);
  const imponibile = arrotonda(listino + delta);
  const impIva = arrotonda(imponibile * iva / 100);

  $("t-listino").textContent = euro(listino);
  $("r-variazione").style.display = sconto ? "" : "none";
  $("l-variazione").textContent = `Sconto ${sconto}%`;
  $("t-variazione").textContent = euro(delta);
  $("t-imponibile").textContent = euro(imponibile);
  $("l-iva").textContent = iva;
  $("t-iva").textContent = euro(impIva);
  $("t-totale").textContent = euro(imponibile + impIva);
}

// ---------- Archivio ----------
function salva() {
  leggiDalModulo();
  const archivio = leggi("archivio", []);
  const i = archivio.findIndex((p) => p.id === preventivo.id);
  if (i >= 0) {
    archivio[i] = preventivo;
  } else {
    archivio.unshift(preventivo);
    // avanza il contatore se il numero è quello proposto automaticamente
    const m = /^(\d+)\/(\d{4})$/.exec(preventivo.numero);
    if (m) {
      const contatori = leggi("contatori", {});
      contatori[m[2]] = Math.max(contatori[m[2]] || 0, Number(m[1]));
      scrivi("contatori", contatori);
    }
  }
  if (scrivi("archivio", archivio)) {
    alert(`Preventivo ${preventivo.numero} salvato in questo browser.`);
  } else {
    alert("Impossibile salvare: il browser blocca la memoria locale.");
  }
}

function apriArchivio() {
  const lista = $("lista-archivio");
  lista.innerHTML = "";
  const archivio = leggi("archivio", []);
  if (!archivio.length) {
    const li = document.createElement("li");
    li.textContent = "Nessun preventivo salvato.";
    lista.appendChild(li);
  }
  archivio.forEach((p, i) => {
    const li = document.createElement("li");
    const s = document.createElement("span");
    s.textContent = `n. ${p.numero} — ${p.cliente.nome || "senza cliente"} — ${p.data}`;
    const apri = document.createElement("button");
    apri.textContent = "Apri";
    apri.addEventListener("click", () => {
      preventivo = p;
      caricaInModulo();
      $("dlg-archivio").close();
    });
    const del = document.createElement("button");
    del.className = "link";
    del.textContent = "Elimina";
    del.addEventListener("click", () => {
      if (!confirm(`Eliminare il preventivo n. ${p.numero}?`)) return;
      archivio.splice(i, 1);
      scrivi("archivio", archivio);
      apriArchivio();
    });
    li.append(s, apri, del);
    lista.appendChild(li);
  });
  if (!$("dlg-archivio").open) $("dlg-archivio").showModal();
}

// ---------- Impostazioni ----------
function apriImpostazioni() {
  const f = $("form-impostazioni");
  for (const el of f.elements) if (el.name) el.value = impostazioni[el.name] ?? "";
  $("dlg-impostazioni").showModal();
}

$("dlg-impostazioni").addEventListener("close", () => {
  if ($("dlg-impostazioni").returnValue !== "salva") return;
  const f = $("form-impostazioni");
  for (const el of f.elements) if (el.name) impostazioni[el.name] = el.value;
  scrivi("impostazioni", impostazioni);
  mostraAzienda();
  aggiornaTotali();
});

// ---------- Avvio ----------
riempiProdotti();
aggiornaCampi();
mostraAzienda();
nuovoPreventivo();
calcola();

$("prodotto").addEventListener("change", () => { aggiornaCampi(); calcola(); });
$("variante").addEventListener("change", () => { aggiornaSupplementi(); calcola(); });
["tessuto1", "tessuto2", "quantita", "motore"].forEach((id) => $(id).addEventListener("input", calcola));
["larghezza", "altezza"].forEach((id) => $(id).addEventListener("input", () => { aggiornaMetri(); calcola(); }));
["larghezza", "altezza", "quantita"].forEach((id) => $(id).addEventListener("keydown", (e) => {
  if (e.key === "Enter") aggiungiRiga();
}));
$("btn-aggiungi").addEventListener("click", aggiungiRiga);
$("variazione").addEventListener("input", aggiornaTotali);
$("btn-stampa").addEventListener("click", () => { leggiDalModulo(); window.print(); });
$("btn-salva").addEventListener("click", salva);
$("btn-nuovo").addEventListener("click", () => {
  if (preventivo.righe.length && !confirm("Iniziare un nuovo preventivo? Le modifiche non salvate andranno perse.")) return;
  nuovoPreventivo();
});
$("btn-archivio").addEventListener("click", apriArchivio);
$("btn-impostazioni").addEventListener("click", apriImpostazioni);
