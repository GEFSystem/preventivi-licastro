// Catalogo motori (uguale per tutte le tende a rullo), motori/supplementi Fuji (pag. 58) e ordine dei prodotti.
// Prezzi in € IVA esclusa.
//
// Unità dei supplementi:
//   "pz" / "kit" / "cp" (coppia) -> quantità per tenda (predefinita 1)
//   "ml"   -> metri lineari, predefiniti dalla larghezza
//   "mlh"  -> metri lineari, predefiniti dall'altezza
//   "perc" -> percentuale sul prezzo di listino della tenda
window.MOTORI = [
  { id: "CM-01", nome: "Motore CM-01", prezzo: 231 },
  { id: "CM-02", nome: "Motore CM-02", prezzo: 300 },
  { id: "CM-09-MC", nome: "Motore CM-09-MC", prezzo: 160 },
  { id: "CM-09-C", nome: "Motore CM-09-C", prezzo: 260 },
  { id: "CM-03", nome: "Motore CM-03 (tende M fino a 250×250)", prezzo: 315, max: [250, 250] },
  { id: "CM-05", nome: "Motore CM-05 (tende M fino a 300×300)", prezzo: 388, max: [300, 300] },
  { id: "CM-06", nome: "Motore CM-06 (tende L fino a 350×400)", prezzo: 560, max: [350, 400] },
  { id: "CM-03-E", nome: "Motore CM-03-E (solo dispositivi Apple)", prezzo: 370 },
  { id: "CM-06-E", nome: "Motore CM-06-E (solo dispositivi Apple)", prezzo: 795 }
];

(function () {
  const L = window.LISTINO;
  const comuni = ["CM-01", "CM-02", "CM-09-MC", "CM-09-C"];
  L["fuji-s"].gruppo = L["fuji-m"].gruppo = L["fuji-l"].gruppo = "Tende a rullo Fuji";
  L["fuji-s"].motori = comuni;
  L["fuji-m"].motori = comuni.concat(["CM-03", "CM-05", "CM-03-E"]);
  L["fuji-l"].motori = comuni.concat(["CM-06", "CM-06-E"]);
  L["fuji-l"].tubo = { soglia: 295, sotto: "tubo 65 mm", sopra: "tubo 80 mm" };

  const base = [
    { nome: "Azionamento a molla", prezzo: 63, unita: "pz" },
    { nome: "Cavo guida nylon", prezzo: 44, unita: "pz" },
    { nome: "Catena inox", prezzo: 4, unita: "pz" }
  ];
  L["fuji-s"].supplementi = base.concat([
    { nome: "Profilo di premontaggio", prezzo: 18, unita: "ml" },
    { nome: "Kit acciaio", prezzo: 63, unita: "pz" },
    { nome: "Staffa S plus (coppia)", prezzo: 12, unita: "cp" }
  ]);
  L["fuji-m"].supplementi = base.concat([
    { nome: "Azionamento Twin Pull", prezzo: 90, unita: "pz" },
    { nome: "Profilo di premontaggio", prezzo: 25, unita: "ml" },
    { nome: "Kit acciaio", prezzo: 132, unita: "pz" },
    { nome: "Supporto centrale", prezzo: 25, unita: "ml" },
    { nome: "Staffa M plus (coppia)", prezzo: 20, unita: "cp" }
  ]);
  L["fuji-l"].supplementi = base.concat([
    { nome: "Azionamento ad argano", prezzo: 147, unita: "pz" },
    { nome: "Kit acciaio", prezzo: 182, unita: "pz" },
    { nome: "Supporto centrale", prezzo: 25, unita: "ml" }
  ]);
})();

// Ordine in cui i prodotti compaiono nel menu
window.CATALOGO = [
  "fuji-s", "fuji-m", "fuji-l",
  "etna", "etna-medium", "etna-large", "ultimate",
  "smart-fix", "easy-fix",
  "mantovana-m", "mantovana-l", "tenda-doppia", "doppia-box",
  "veneziane", "verticali", "plisse",
  "euro-2880-strappo", "euro-2880-corda", "sistema-pacchetto", "pacchetto-vetro"
];

window.AZIENDA_DEFAULT = {
  nome: "Licastro System",
  sedeLegale: "Via Piazza Pasubio 23, 04014 Pontinia (LT)",
  sedeOperativa: "S.S. 148 Pontina, 231 - 04100 Latina (LT)",
  piva: "03210370593",
  email: "gefsystem22@gmail.com",
  telefoni: "Vincenzo 389 5598741 · Giulio 329 7818687",
  sito: "www.geflicastrosystem.com"
};
