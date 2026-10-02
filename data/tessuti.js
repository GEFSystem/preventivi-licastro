// Tessuti per categoria, come riportati sotto le tabelle di ogni prodotto (listino marzo 2024).
// Ogni tessuto: [nome, larghezza massima in cm o null, saldabile]
//   saldabile = true  -> oltre la larghezza il telo va capovolto e/o saldato
//   saldabile = false -> la larghezza indicata è il massimo del tessuto
(function () {
  const T = (nome, max = null, saldabile = false) => ({ nome, max, saldabile });

  const A_base = [T("Screen 0,5%"), T("Screen 1%"), T("Screen 6% PVC free"), T("Soft"), T("Special A-Clean"), T("Special A-Viral")];
  const A_lim = [
    T("Screen 0,5%", 295, true), T("Screen 1%", 295, true), T("Screen 6% PVC free", 275), T("Soft", 275),
    T("Special A-Clean", 195, true), T("Special A-Viral", 195, true)
  ];
  const A_mantM = [T("Screen 0,5%"), T("Screen 1%")].concat(A_lim.slice(2));

  const B_base = [T("Screen 3% Ecological"), T("Screen metal 2%"), T("Stripes"), T("Slim BO"), T("Projector"), T("Special clean BO"), T("Special A viral BO")];
  const B_M = B_base.map((t) => (t.nome === "Slim BO" ? T("Slim BO", 220, true) : t));
  const B_L = [
    T("Screen 3% Ecological", 315), T("Screen metal 2% (da 320 di larghezza altezza max 280)", 400), T("Stripes", 295),
    T("Slim BO", 220), T("Projector", 280), T("Special clean BO", 195, true), T("Special A viral BO", 195, true)
  ];

  const C_base = [T("Vedo non vedo Fiam F"), T("Vedo non vedo Tu")];
  const C_L = [T("Vedo non vedo Fiam F", 280), T("Vedo non vedo Tu", 280)];

  const D_base = [T("Vedo non vedo BO"), T("Vedo non vedo Deluxe"), T("Vedo non vedo XL")];
  const D_L = [T("Vedo non vedo BO", 275), T("Vedo non vedo Deluxe", 295), T("Vedo non vedo XL", 295)];

  const E_nomi = ["Berlin fr", "Screen 3%", "Screen 5%", "Screen color 5%", "Screen 10%", "Tago", "Tago fr", "Berlin",
    "Colortext 200", "Colortext 250", "Colortext 300", "Vira", "Shiny", "Natura", "Lines", "Lite 183", "Lite 250", "Lite 305"];
  const E_base = E_nomi.map((n) => T(n));
  const limitiE_M = { "Colortext 200": [195, true], "Colortext 250": [245, true], "Lines": [245, false], "Lite 183": [180, true], "Lite 250": [240, true] };
  const E_M = E_nomi.map((n) => (limitiE_M[n] ? T(n, limitiE_M[n][0], limitiE_M[n][1]) : T(n)));
  const E_L = [
    T("Screen 5%", 295, true), T("Screen color 5%", 295, true), T("Screen 10%", 295, true), T("Tago", 295, true),
    T("Tago fr", 295, true), T("Berlin", 295, true), T("Colortext 300", 295, true), T("Natura", 295, true),
    T("Screen 3%", 315, true), T("Berlin fr", 400), T("Colortext 200", 195, true), T("Colortext 250", 245, true),
    T("Vira", 335), T("Shiny", 275), T("Lines", 245), T("Lite 183", 180, true), T("Lite 250", 240, true), T("Lite 305", 300, true)
  ];

  // Tende a vetro (pag. 109-115)
  const vetro = {
    A: [T("Soft")], B: [T("Slim BO")], C: C_base, D: D_base,
    E: [T("Tago"), T("Tago fr"), T("Colortext 200"), T("Colortext 250"), T("Colortext 300"), T("Natura")]
  };

  const piccole = { A: A_base, B: B_base, C: C_base, D: D_base, E: E_base };
  const medie = { A: A_lim, B: B_M, C: C_base, D: D_base, E: E_M };

  window.TESSUTI = {
    "fuji-s": piccole,
    "etna": piccole,
    "fuji-m": medie,
    "etna-medium": medie,
    "ultimate": medie,
    "fuji-l": { A: A_lim, B: B_L, C: C_L, D: D_L, E: E_L },
    "etna-large": { A: A_lim, B: B_M, C: C_L, D: D_L, E: E_L },
    "smart-fix": vetro,
    "easy-fix": vetro,
    "mantovana-m": { A: A_mantM, B: B_M, E: E_M },
    "mantovana-l": { A: A_lim, B: B_M, E: E_L },
    "tenda-doppia": { A: A_lim, B: B_M, E: E_M },
    "doppia-box": { A: A_lim, B: B_M, E: E_M }
  };
})();
