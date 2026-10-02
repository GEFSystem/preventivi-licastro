// Motori e supplementi Fuji — listino marzo 2024, pagina 58. Prezzi in € IVA esclusa.
// unita: "kit" | "pz" | "cp" (coppia) -> quantità 1 per tenda; "ml" -> metri lineari di larghezza.
// sistemi: sistemi Fuji su cui l'accessorio è disponibile.
window.ACCESSORI = {
  motori: [
    { id: "CM-01", nome: "Motore CM-01", prezzo: 231, unita: "kit", sistemi: ["S", "M", "L"] },
    { id: "CM-02", nome: "Motore CM-02", prezzo: 300, unita: "kit", sistemi: ["S", "M", "L"] },
    { id: "CM-09-MC", nome: "Motore CM-09-MC", prezzo: 160, unita: "kit", sistemi: ["S", "M", "L"] },
    { id: "CM-09-C", nome: "Motore CM-09-C", prezzo: 260, unita: "kit", sistemi: ["S", "M", "L"] },
    { id: "CM-03", nome: "Motore CM-03 (tende M fino a 250×250)", prezzo: 315, unita: "kit", sistemi: ["M"], max: [250, 250] },
    { id: "CM-05", nome: "Motore CM-05 (tende M fino a 300×300)", prezzo: 388, unita: "kit", sistemi: ["M"], max: [300, 300] },
    { id: "CM-06", nome: "Motore CM-06 (tende L fino a 350×400)", prezzo: 560, unita: "kit", sistemi: ["L"], max: [350, 400] },
    { id: "CM-03-E", nome: "Motore CM-03-E (solo dispositivi Apple)", prezzo: 370, unita: "kit", sistemi: ["M"] },
    { id: "CM-06-E", nome: "Motore CM-06-E (solo dispositivi Apple)", prezzo: 795, unita: "kit", sistemi: ["L"] }
  ],
  supplementi: [
    { id: "molla", nome: "Azionamento a molla", prezzo: 63, unita: "pz", sistemi: ["S", "M", "L"] },
    { id: "argano", nome: "Azionamento ad argano", prezzo: 147, unita: "pz", sistemi: ["L"] },
    { id: "twinpull", nome: "Azionamento Twin Pull", prezzo: 90, unita: "pz", sistemi: ["M"] },
    { id: "premont-s", nome: "Profilo di premontaggio", prezzo: 18, unita: "ml", sistemi: ["S"] },
    { id: "premont-m", nome: "Profilo di premontaggio", prezzo: 25, unita: "ml", sistemi: ["M"] },
    { id: "acciaio-s", nome: "Kit acciaio", prezzo: 63, unita: "pz", sistemi: ["S"] },
    { id: "acciaio-m", nome: "Kit acciaio", prezzo: 132, unita: "pz", sistemi: ["M"] },
    { id: "acciaio-l", nome: "Kit acciaio", prezzo: 182, unita: "pz", sistemi: ["L"] },
    { id: "cavo-nylon", nome: "Cavo guida nylon", prezzo: 44, unita: "pz", sistemi: ["S", "M", "L"] },
    { id: "supp-centr", nome: "Supporto centrale", prezzo: 25, unita: "ml", sistemi: ["M", "L"] },
    { id: "catena-inox", nome: "Catena inox", prezzo: 4, unita: "pz", sistemi: ["S", "M", "L"] },
    { id: "staffa-s-plus", nome: "Staffa S plus", prezzo: 12, unita: "cp", sistemi: ["S"] },
    { id: "staffa-m-plus", nome: "Staffa M plus", prezzo: 20, unita: "cp", sistemi: ["M"] }
  ]
};

window.AZIENDA_DEFAULT = {
  nome: "Licastro System",
  sedeLegale: "Via Piazza Pasubio 23, 04014 Pontinia (LT)",
  sedeOperativa: "S.S. 148 Pontina, 231 - 04100 Latina (LT)",
  piva: "03210370593",
  email: "gefsystem22@gmail.com",
  telefoni: "Vincenzo 389 5598741 · Giulio 329 7818687",
  sito: "www.geflicastrosystem.com"
};
