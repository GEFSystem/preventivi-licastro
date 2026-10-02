// Veneziane, verticali, plissé e binari. Listino marzo 2024, pagine 136-158. Prezzi in € IVA esclusa.
window.LISTINO = window.LISTINO || {};

// ---------- A metro quadro ----------
// tipo "mq": prezzo = prezzo €/mq della variante × superficie (con minimo fatturabile).
// maggiorazioniLarghezza: percentuale applicata se la larghezza è inferiore alla soglia (si applica la più alta).

window.LISTINO["veneziane"] = {
  tipo: "mq",
  nome: "Tende veneziane",
  famiglia: "Veneziane — tenda completa",
  gruppo: "Veneziane, verticali e plissé",
  pagine: "136-137",
  etichettaVariante: "Lamella",
  varianti: [
    { id: "15", nome: "Veneziana 15 mm", prezzo: 70, minimoMq: 1.2 },
    { id: "25", nome: "Veneziana 25 mm", prezzo: 65, minimoMq: 1.2 },
    { id: "35", nome: "Veneziana 35 mm", prezzo: 90, minimoMq: 1.5 },
    { id: "50", nome: "Veneziana 50 mm", prezzo: 80, minimoMq: 1.5 }
  ],
  maggiorazioniLarghezza: [
    { sotto: 16.9, perc: 100 },
    { sotto: 25, perc: 50 },
    { sotto: 40, perc: 30 }
  ],
  supplementi: [
    { nome: "Colori extra: microforati", prezzo: 50, unita: "perc" },
    { nome: "Colori extra: 2 colori", prezzo: 20, unita: "perc" },
    { nome: "Colori extra: 3 colori", prezzo: 30, unita: "perc" },
    { nome: "Terza guidatura", prezzo: 10, unita: "perc" },
    { nome: "Guide laterali Perlon (coppia)", prezzo: 1.5, unita: "cp", varianti: ["15", "25"] },
    { nome: "Guide laterali Perlon (coppia)", prezzo: 2, unita: "cp", varianti: ["35", "50"] },
    { nome: "Supplemento comando a catena", prezzo: 33, unita: "pz", varianti: ["15", "25"] },
    { nome: "Supplemento versione integrale", prezzo: 20, unita: "pz", varianti: ["15", "25"] },
    { nome: "Motore elettronico con trasformatore", prezzo: 250, unita: "pz", varianti: ["15", "25", "50"] },
    { nome: "Telecomando 1 canale", prezzo: 23, unita: "pz", varianti: ["15", "25", "50"] },
    { nome: "Telecomando 5 canali", prezzo: 35, unita: "pz", varianti: ["15", "25", "50"] },
    { nome: "Telecomando 15 canali", prezzo: 58, unita: "pz", varianti: ["15", "25", "50"] },
    { nome: "Motore meccanico", prezzo: 150, unita: "pz", varianti: ["15", "25", "50"] }
  ]
};

window.LISTINO["verticali"] = {
  tipo: "mq",
  nome: "Tende verticali 127 mm",
  famiglia: "Verticali — 127 mm",
  gruppo: "Veneziane, verticali e plissé",
  pagine: "140-141",
  etichettaVariante: "Tessuto",
  // altezza minima conteggiata 200 cm e minimo 2,5 mq
  altezzaMinima: 200,
  varianti: [
    { id: "natura", nome: "Natura — tenda completa", prezzo: 50, minimoMq: 2.5 },
    { id: "vento", nome: "Vento FR — tenda completa", prezzo: 48, minimoMq: 2.5 },
    { id: "miami", nome: "Miami — tenda completa", prezzo: 45, minimoMq: 2.5 },
    { id: "patagonia", nome: "Patagonia — tenda completa", prezzo: 45, minimoMq: 2.5 },
    { id: "patagonia-fr", nome: "Patagonia FR — tenda completa", prezzo: 46, minimoMq: 2.5 },
    { id: "t-natura", nome: "Natura — solo telo saldato con portatelo", prezzo: 6, minimoMq: 2.5 },
    { id: "t-vento", nome: "Vento FR — solo telo saldato con portatelo", prezzo: 5.9, minimoMq: 2.5 },
    { id: "t-miami", nome: "Miami — solo telo saldato con portatelo", prezzo: 4.5, minimoMq: 2.5 },
    { id: "t-patagonia", nome: "Patagonia — solo telo saldato con portatelo", prezzo: 4.5, minimoMq: 2.5 },
    { id: "t-patagonia-fr", nome: "Patagonia FR — solo telo saldato con portatelo", prezzo: 4.5, minimoMq: 2.5 }
  ],
  supplementi: [
    { nome: "Peso in plastica", prezzo: 2.5, unita: "pz" },
    { nome: "Supporto soffitto", prezzo: 2, unita: "pz" },
    { nome: "Supporto parete bianco", prezzo: 4, unita: "pz" },
    { nome: "Binario completo assemblato", prezzo: 75, unita: "ml" }
  ]
};

window.LISTINO["plisse"] = {
  tipo: "mq",
  nome: "Tende plissé",
  famiglia: "Plissé — tenda completa",
  gruppo: "Veneziane, verticali e plissé",
  pagine: "144",
  etichettaVariante: "Tessuto",
  varianti: [
    { id: "vanity-up", nome: "Vanity Up", prezzo: 30, minimoMq: 1.5 },
    { id: "vanity-ui", nome: "Vanity UI FR", prezzo: 35, minimoMq: 1.5 },
    { id: "euroblakaut", nome: "Euroblakaut FR", prezzo: 70, minimoMq: 1.5 },
    { id: "semioscurante", nome: "Semioscurante (solo grigio/argento, argento/argento)", prezzo: 54, minimoMq: 1.5 }
  ],
  supplementi: [
    { nome: "Guide", prezzo: 2.5, unita: "pz" }
  ]
};

// ---------- Binari ----------
// tipo "binario": prezzo dalla tabella in base alla larghezza (misura di tabella uguale o superiore).

window.LISTINO["euro-2880-strappo"] = {
  tipo: "binario",
  nome: "Euro 2880 a strappo",
  famiglia: "Binari per tende a pacchetto",
  gruppo: "Binari",
  pagine: "150",
  minimoCm: 200,
  righe: [
    { cm: 140, supporti: 2, prezzo: 24 }, { cm: 160, supporti: 2, prezzo: 24 },
    { cm: 180, supporti: 2, prezzo: 24 }, { cm: 200, supporti: 2, prezzo: 24 },
    { cm: 220, supporti: 3, prezzo: 26.4 }, { cm: 240, supporti: 3, prezzo: 28.8 },
    { cm: 260, supporti: 3, prezzo: 31.2 }, { cm: 280, supporti: 3, prezzo: 33.6 },
    { cm: 300, supporti: 4, prezzo: 36 }, { cm: 320, supporti: 4, prezzo: 38.4 },
    { cm: 340, supporti: 4, prezzo: 40.8 }, { cm: 360, supporti: 5, prezzo: 43.2 },
    { cm: 380, supporti: 5, prezzo: 45.6 }, { cm: 400, supporti: 5, prezzo: 48 }
  ],
  supplementi: [
    { nome: "Colore satinato argento", prezzo: 10, unita: "pz" },
    { nome: "Sistema wave passo 6/8 cm", prezzo: 5, unita: "ml" }
  ]
};

window.LISTINO["euro-2880-corda"] = {
  tipo: "binario",
  nome: "Euro 2880 a corda",
  famiglia: "Binari per tende a pacchetto",
  gruppo: "Binari",
  pagine: "152",
  minimoCm: 200,
  righe: [
    { cm: 140, supporti: 2, prezzo: 30 }, { cm: 160, supporti: 2, prezzo: 30 },
    { cm: 180, supporti: 2, prezzo: 30 }, { cm: 200, supporti: 2, prezzo: 30 },
    { cm: 220, supporti: 3, prezzo: 33 }, { cm: 240, supporti: 3, prezzo: 36 },
    { cm: 260, supporti: 3, prezzo: 39 }, { cm: 280, supporti: 3, prezzo: 42 },
    { cm: 300, supporti: 4, prezzo: 45 }, { cm: 320, supporti: 4, prezzo: 48 },
    { cm: 340, supporti: 4, prezzo: 51 }, { cm: 360, supporti: 5, prezzo: 54 },
    { cm: 380, supporti: 5, prezzo: 57 }, { cm: 400, supporti: 5, prezzo: 60 }
  ],
  supplementi: [
    { nome: "Colore satinato argento", prezzo: 10, unita: "pz" },
    { nome: "Innesto a parete 4 cm", prezzo: 1.4, unita: "pz" },
    { nome: "Base per innesto a parete 8 cm", prezzo: 5, unita: "pz" },
    { nome: "Sistema wave passo 6/8 cm", prezzo: 5, unita: "ml" }
  ]
};

window.LISTINO["sistema-pacchetto"] = {
  tipo: "binario",
  nome: "Sistema a pacchetto",
  famiglia: "Binari per tende a pacchetto — frizione standard 3,5 kg",
  gruppo: "Binari",
  pagine: "154",
  righe: [
    { cm: 100, cadute: 3, supporti: 2, prezzo: 45 }, { cm: 110, cadute: 3, supporti: 2, prezzo: 50 },
    { cm: 120, cadute: 3, supporti: 2, prezzo: 54 }, { cm: 130, cadute: 3, supporti: 2, prezzo: 58 },
    { cm: 140, cadute: 3, supporti: 2, prezzo: 63 }, { cm: 150, cadute: 4, supporti: 3, prezzo: 67 },
    { cm: 160, cadute: 4, supporti: 3, prezzo: 72 }, { cm: 170, cadute: 4, supporti: 3, prezzo: 76 },
    { cm: 180, cadute: 5, supporti: 3, prezzo: 81 }, { cm: 190, cadute: 5, supporti: 3, prezzo: 85 },
    { cm: 200, cadute: 5, supporti: 3, prezzo: 90 }, { cm: 210, cadute: 5, supporti: 3, prezzo: 95 },
    { cm: 220, cadute: 5, supporti: 3, prezzo: 100 }, { cm: 230, cadute: 6, supporti: 4, prezzo: 103 },
    { cm: 240, cadute: 6, supporti: 4, prezzo: 108 }, { cm: 250, cadute: 6, supporti: 4, prezzo: 112 },
    { cm: 260, cadute: 6, supporti: 4, prezzo: 117 }, { cm: 270, cadute: 6, supporti: 4, prezzo: 122 },
    { cm: 280, cadute: 7, supporti: 5, prezzo: 126 }, { cm: 290, cadute: 7, supporti: 5, prezzo: 130 },
    { cm: 300, cadute: 7, supporti: 5, prezzo: 135 }
  ],
  supplementi: [
    { nome: "Frizione demoltiplicata portata 5 kg", prezzo: 10, unita: "pz" },
    { nome: "Rocchetti aggiuntivi", prezzo: 5, unita: "pz" }
  ]
};

window.LISTINO["pacchetto-vetro"] = {
  tipo: "binario",
  nome: "Sistema pacchetto a vetro",
  famiglia: "Binari per tende a pacchetto a vetro",
  gruppo: "Binari",
  pagine: "156",
  righe: [
    { cm: 40, cadute: 2, supporti: 2, prezzo: 15 }, { cm: 50, cadute: 2, supporti: 2, prezzo: 15 },
    { cm: 60, cadute: 2, supporti: 2, prezzo: 15 }, { cm: 70, cadute: 3, supporti: 3, prezzo: 17 },
    { cm: 80, cadute: 3, supporti: 3, prezzo: 19 }, { cm: 90, cadute: 3, supporti: 3, prezzo: 21 },
    { cm: 100, cadute: 3, supporti: 3, prezzo: 23 }, { cm: 110, cadute: 3, supporti: 3, prezzo: 25 },
    { cm: 120, cadute: 4, supporti: 3, prezzo: 27 }, { cm: 150, cadute: 4, supporti: 4, prezzo: 29 }
  ],
  supplementi: [
    { nome: "Supporto per infissi in alluminio", prezzo: 1.2, unita: "pz" },
    { nome: "Supporto per infissi in PVC e legno", prezzo: 18, unita: "pz" },
    { nome: "Supporto GENIUS per infissi in PVC e legno", prezzo: 18, unita: "pz" }
  ]
};
