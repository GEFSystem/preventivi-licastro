"use strict";

// ---------- Utilità ----------
const $ = (id) => document.getElementById(id);
const euro = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const arrotonda = (n) => Math.round(n * 100) / 100;

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
const PRODOTTI = ["fuji-s", "fuji-m", "fuji-l"].map((id) => ({ id, ...window.LISTINO[id] }));
const prodottoCorrente = () => PRODOTTI.find((p) => p.id === $("prodotto").value);

/**
 * Trova il prezzo di listino: si usa la misura di tabella uguale o immediatamente superiore.
 * Restituisce { prezzo, lTab, hTab } oppure { errore }.
 */
function cercaPrezzo(prodotto, categoria, larghezza, altezza) {
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
  return { prezzo: prodotto.griglie[categoria][iH][iL], lTab: larghezze[iL], hTab: altezze[iH] };
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
    variazione: Number(impostazioni.variazione) || 0,
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
  $("variazione").value = preventivo.variazione;
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
  preventivo.variazione = Number($("variazione").value) || 0;
  preventivo.note = $("note").value;
}

// ---------- Configuratore ----------
function riempiProdotti() {
  for (const p of PRODOTTI) {
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.nome;
    $("prodotto").appendChild(o);
  }
}

function aggiornaAccessori() {
  const sistema = prodottoCorrente().sistema;
  const motoreSel = $("motore");
  const precedente = motoreSel.value;
  motoreSel.innerHTML = '<option value="">Nessuno (azionamento a catena)</option>';
  for (const m of window.ACCESSORI.motori.filter((m) => m.sistemi.includes(sistema))) {
    const o = document.createElement("option");
    o.value = m.id;
    o.textContent = `${m.nome} — ${euro(m.prezzo)}`;
    motoreSel.appendChild(o);
  }
  if ([...motoreSel.options].some((o) => o.value === precedente)) motoreSel.value = precedente;

  const box = $("supplementi");
  box.innerHTML = "";
  for (const s of window.ACCESSORI.supplementi.filter((s) => s.sistemi.includes(sistema))) {
    const riga = document.createElement("label");
    riga.className = "supp";
    riga.innerHTML = `
      <input type="checkbox" data-id="${s.id}">
      <span>${s.nome}</span>
      <input type="number" class="qta" data-qta="${s.id}" min="0" step="${s.unita === "ml" ? "0.01" : "1"}" value="1" disabled
        title="${s.unita === "ml" ? "metri lineari" : "quantità per tenda"}">
      <span class="prezzo">${euro(s.prezzo)}/${s.unita}</span>`;
    box.appendChild(riga);
  }
  box.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const qta = box.querySelector(`[data-qta="${cb.dataset.id}"]`);
      qta.disabled = !cb.checked;
      const s = window.ACCESSORI.supplementi.find((x) => x.id === cb.dataset.id);
      if (cb.checked && s.unita === "ml") qta.value = arrotonda((Number($("larghezza").value) || 0) / 100);
      calcola();
    });
  });
  box.querySelectorAll(".qta").forEach((q) => q.addEventListener("input", calcola));
}

// Calcola la riga in base ai campi del configuratore. Restituisce la riga o null.
function calcola() {
  const esito = $("esito");
  const btn = $("btn-aggiungi");
  btn.disabled = true;
  esito.className = "esito";

  const prodotto = prodottoCorrente();
  const categoria = $("categoria").value;
  const larghezza = Number($("larghezza").value);
  const altezza = Number($("altezza").value);
  const quantita = Math.max(1, Math.floor(Number($("quantita").value) || 1));

  if (!larghezza || !altezza) {
    esito.textContent = "Inserisci larghezza e altezza in centimetri.";
    return null;
  }
  const r = cercaPrezzo(prodotto, categoria, larghezza, altezza);
  if (r.errore) {
    esito.classList.add("errore");
    esito.textContent = r.errore;
    return null;
  }

  const extra = [];
  const motore = window.ACCESSORI.motori.find((m) => m.id === $("motore").value);
  if (motore) extra.push({ nome: motore.nome, qta: 1, unita: "kit", prezzo: motore.prezzo });
  $("supplementi").querySelectorAll("input[type=checkbox]:checked").forEach((cb) => {
    const s = window.ACCESSORI.supplementi.find((x) => x.id === cb.dataset.id);
    const qta = Number($("supplementi").querySelector(`[data-qta="${s.id}"]`).value) || 0;
    if (qta > 0) extra.push({ nome: s.nome, qta, unita: s.unita, prezzo: s.prezzo });
  });

  const totExtra = extra.reduce((t, e) => t + e.prezzo * e.qta, 0);
  const unitario = arrotonda(r.prezzo + totExtra);
  const riga = {
    prodotto: prodotto.nome,
    categoria,
    tessuto: $("tessuto").value.trim(),
    riferimento: $("riferimento").value.trim(),
    larghezza, altezza,
    lTab: r.lTab, hTab: r.hTab,
    tubo: prodotto.tubo ? prodotto.tubo(r.lTab) : "",
    prezzoBase: r.prezzo,
    extra,
    quantita,
    unitario
  };

  esito.classList.add("ok");
  esito.innerHTML = "";
  const titolo = document.createElement("strong");
  titolo.textContent = `Prezzo tenda: ${euro(unitario)}` + (quantita > 1 ? ` × ${quantita} = ${euro(unitario * quantita)}` : "");
  esito.appendChild(titolo);
  const dett = document.createElement("span");
  dett.className = "dett";
  let testo = `Listino ${prodotto.nome} cat. ${categoria}, misura di tabella ${r.lTab} × ${r.hTab} cm: ${euro(r.prezzo)}`;
  if (riga.tubo) testo += ` (${riga.tubo})`;
  if (totExtra) testo += ` + motore/supplementi ${euro(totExtra)}`;
  const nota = prodotto.note && prodotto.note[categoria];
  if (nota) testo += `. Attenzione: ${nota}.`;
  if (motore && motore.max && (larghezza > motore.max[0] || altezza > motore.max[1])) {
    testo += ` Attenzione: il motore ${motore.id} è indicato fino a ${motore.max[0]}×${motore.max[1]} cm.`;
  }
  dett.textContent = testo;
  esito.appendChild(dett);

  btn.disabled = false;
  return riga;
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
  const parti = [`${r.prodotto} — tessuto cat. ${r.categoria}${r.tessuto ? " (" + r.tessuto + ")" : ""}`];
  let misura = `Misura ${r.larghezza} × ${r.altezza} cm`;
  if (r.lTab !== r.larghezza || r.hTab !== r.altezza) misura += ` (listino ${r.lTab} × ${r.hTab})`;
  if (r.tubo) misura += `, ${r.tubo}`;
  const dettagli = [misura, `Tenda ${euro(r.prezzoBase)}`];
  for (const e of r.extra) {
    const q = e.unita === "ml" ? `${e.qta.toLocaleString("it-IT")} ml × ${euro(e.prezzo)}` : (e.qta !== 1 ? `${e.qta} × ${euro(e.prezzo)}` : euro(e.prezzo));
    dettagli.push(`${e.nome}: ${q}`);
  }
  return { titolo: (r.riferimento ? r.riferimento + " — " : "") + parti[0], dettagli };
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
  const variazione = Number($("variazione").value) || 0;
  const iva = Number(impostazioni.iva) || 0;
  const listino = arrotonda(preventivo.righe.reduce((t, r) => t + r.unitario * r.quantita, 0));
  const delta = arrotonda(listino * variazione / 100);
  const imponibile = arrotonda(listino + delta);
  const impIva = arrotonda(imponibile * iva / 100);

  $("t-listino").textContent = euro(listino);
  $("r-variazione").style.display = variazione ? "" : "none";
  $("l-variazione").textContent = variazione > 0 ? `Ricarico ${variazione}%` : `Sconto ${-variazione}%`;
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
aggiornaAccessori();
mostraAzienda();
nuovoPreventivo();
calcola();

$("prodotto").addEventListener("change", () => { aggiornaAccessori(); calcola(); });
["categoria", "larghezza", "altezza", "quantita", "motore"].forEach((id) => $(id).addEventListener("input", calcola));
$("larghezza").addEventListener("input", () => {
  // aggiorna i metri lineari dei supplementi "a metro" già selezionati
  $("supplementi").querySelectorAll("input[type=checkbox]:checked").forEach((cb) => {
    const s = window.ACCESSORI.supplementi.find((x) => x.id === cb.dataset.id);
    if (s.unita === "ml") $("supplementi").querySelector(`[data-qta="${s.id}"]`).value = arrotonda((Number($("larghezza").value) || 0) / 100);
  });
  calcola();
});
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
