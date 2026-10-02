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
| Fuji S Ø30 | 58-63 | `data/fuji-s.js` |
| Fuji M Ø50 | 58, 64-68 | `data/fuji-m.js` |
| Fuji L Ø65-80 | 58, 69-73 | `data/fuji-l.js` |
| Motori e supplementi Fuji | 58 | `data/accessori.js` |

Per aggiornare un prezzo basta modificare il numero nel file dati corrispondente.
