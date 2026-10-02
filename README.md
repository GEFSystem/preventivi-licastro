# Preventivi Licastro System

Calcolatore di preventivi per tende a rullo basato sul listino Licastro System (marzo 2024).

## Come si usa

Aprire `index.html` nel browser, oppure avviare il server locale:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

e andare su http://localhost:8080.

1. Scegliere prodotto, categoria tessuto e misure (cm). Il prezzo si prende dalla misura di tabella uguale o immediatamente superiore.
2. Aggiungere motore e supplementi, poi "Aggiungi al preventivo".
3. Inserire i dati del cliente, l'eventuale ricarico/sconto, e "Stampa / Salva PDF".

I preventivi salvati restano nel browser in cui sono stati creati.

## Prodotti inclusi

| Prodotto | Pagine listino | File dati |
|---|---|---|
| Fuji S / M / L | 58-73 | `data/fuji-s.js`, `data/fuji-m.js`, `data/fuji-l.js` |
| Etna, Etna Medium, Etna Large | 80-97 | `data/etna.js`, `data/etna-medium.js`, `data/etna-large.js` |
| Ultimate S | 100-105 | `data/ultimate.js` |
| Smart Fix, Easy Fix (tende a vetro) | 108-115 | `data/smart-fix.js`, `data/easy-fix.js` |
| Mantovana M / L | 120-127 | `data/mantovana-m.js`, `data/mantovana-l.js` |
| Tenda doppia, Doppia Box | 126-133 | `data/tenda-doppia.js` |
| Veneziane, verticali, plissé, binari | 136-158 | `data/altri.js` |
| Catalogo motori, supplementi Fuji, ordine prodotti, dati azienda | 58 | `data/accessori.js` |
| Tessuti per categoria con larghezze massime | sotto ogni tabella | `data/tessuti.js` |

### Note sul listino

- Etna Large categorie C e D: le tabelle stampate contengono valori non validi, l'app chiede preventivo.
- Etna Medium categoria E: nel listino è identica alla categoria A.
- Alcune colonne (es. 240 in cat. B di Fuji M/L, Etna Medium, Mantovane, Tende doppie) costano meno della colonna precedente: riportate come stampate.
- Sistema a pannelli SET 2840 (pag. 158): il listino non riporta prezzi.

Per aggiornare un prezzo basta modificare il numero nel file dati corrispondente.
