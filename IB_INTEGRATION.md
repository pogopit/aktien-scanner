# 🔌 Interactive Brokers (IB) Integration Guide

Diese Anleitung zeigt dir, wie du den Day Trading Scanner mit **Interactive Brokers** verbindest, um **echte Marktdaten** zu nutzen.

## 📋 Voraussetzungen

- ✅ Interactive Brokers Account (kostenlos)
- ✅ IB Gateway oder Trader Workstation (TWS) installiert
- ✅ API aktiviert in IB Gateway/TWS
- ✅ Day Trading Scanner installiert

---

## 🚀 Schritt 1: IB Gateway installieren und konfigurieren

### Download IB Gateway

1. Gehe zu: https://www.interactivebrokers.com/en/trading/ib-gateway.php
2. Lade **IB Gateway** herunter (nicht TWS - Gateway ist leichter)
3. Installiere die Anwendung

### IB Gateway konfigurieren

1. Öffne **IB Gateway**
2. Melde dich mit deinen IB-Credentials an
3. Gehe zu **Settings** (Zahnrad-Icon)
4. Navigiere zu **API** → **Settings**
5. Aktiviere diese Optionen:
   - ✅ **Enable ActiveX and Socket Clients**
   - ✅ **Socket Port: 7497** (oder 7496 für Paper Trading)
   - ✅ **Read-Only API: unchecked** (wenn du Orders platzieren möchtest)
6. Klicke **OK** und starte IB Gateway neu

### Überprüfe die Verbindung

```bash
# Teste die Verbindung
curl http://localhost:5000/api/ib/health

# Sollte zurückgeben:
# {
#   "status": "ok",
#   "message": "IB Gateway health check",
#   "timestamp": "2026-01-18T23:03:08.000Z"
# }
```

---

## 🛠️ Schritt 2: IB API Client installieren

### Installiere ib-insync (Python)

Falls du Python nutzen möchtest:

```bash
pip install ib-insync
```

### Oder Node.js Client

```bash
npm install ib-insync
```

---

## 📊 Schritt 3: Marktdaten abrufen

### Einzelne Aktie abrufen

```bash
# Hole Quote für AAPL
curl "http://localhost:3100/api/ib/quote?ticker=AAPL"

# Antwort:
# {
#   "symbol": "AAPL",
#   "price": 150.25,
#   "bid": 150.20,
#   "ask": 150.30,
#   "volume": 50000000,
#   "changePercent": 2.5,
#   ...
# }
```

### Top Gainers abrufen

```bash
# Hole Top Gainers
curl "http://localhost:3100/api/ib/top-gainers"

# Antwort: Array von Aktien mit höchsten Gewinnen
```

---

## 🔄 Schritt 4: Automatisches Scanning

### Aktiviere automatisches Scanning

Die `IBStockMonitor` Klasse scannt automatisch alle 5 Minuten:

```typescript
import { IBStockMonitor } from '@/lib/ibMarketData'

// Erstelle Monitor
const monitor = new IBStockMonitor()

// Starte Scanning (alle 5 Minuten)
monitor.start((stocks) => {
  console.log(`Found ${stocks.length} stocks matching criteria`)
  stocks.forEach((stock) => {
    console.log(`${stock.ticker}: +${stock.dayGain.toFixed(2)}%`)
  })
}, 300000) // 5 Minuten

// Stoppe Scanning
monitor.stop()
```

---

## 📈 Schritt 5: Kill-Filter und Scoring anwenden

Die Marktdaten werden automatisch mit deinen Kill-Filtern und dem Scoring-Modell verarbeitet:

```typescript
import { filterAndScoreStocks } from '@/lib/filterLogic'
import { scanAllStocksFromIB } from '@/lib/ibMarketData'

// Scanne alle Aktien
const stocks = await scanAllStocksFromIB()

// Wende Kill-Filter und Scoring an
const { killed, survivors } = filterAndScoreStocks(stocks)

console.log(`Killed: ${killed.length}`)
console.log(`Survivors: ${survivors.length}`)

// Zeige Top-Kandidaten
survivors.forEach((stock) => {
  console.log(`${stock.emoji} ${stock.ticker}: ${stock.score}/10`)
})
```

---

## 🎯 API Endpoints

### GET /api/ib/health
Überprüft IB Gateway Verbindung

```bash
curl http://localhost:3100/api/ib/health
```

### GET /api/ib/status
Gibt Verbindungsstatus zurück

```bash
curl http://localhost:3100/api/ib/status
```

### GET /api/ib/quote?ticker=AAPL
Holt Quote für einzelne Aktie

```bash
curl "http://localhost:3100/api/ib/quote?ticker=AAPL"
```

### GET /api/ib/top-gainers
Holt Top Gainers

```bash
curl http://localhost:3100/api/ib/top-gainers
```

---

## 🔧 Konfiguration

### Scan-Intervall ändern

In `lib/ibMarketData.ts`:

```typescript
// Standard: 5 Minuten (300000 ms)
monitor.start(onUpdate, 300000)

// Ändern zu 1 Minute:
monitor.start(onUpdate, 60000)

// Oder 10 Minuten:
monitor.start(onUpdate, 600000)
```

### IB Gateway Port ändern

Falls Port 7497 bereits verwendet wird:

1. Öffne IB Gateway Settings
2. Ändere **Socket Port** zu z.B. 7498
3. Aktualisiere in `lib/ibMarketData.ts`:

```typescript
export const IB_CONFIG = {
  port: 7498, // Neuer Port
  // ...
}
```

---

## 🐛 Troubleshooting

### IB Gateway verbindet sich nicht

```bash
# Überprüfe, ob IB Gateway läuft
lsof -i :7497

# Falls nicht, starte IB Gateway neu
# Stelle sicher, dass API aktiviert ist
```

### Keine Marktdaten

```bash
# Überprüfe die Logs
curl http://localhost:3100/api/ib/health

# Falls Fehler: Überprüfe IB Gateway Settings
# - API muss aktiviert sein
# - Socket Port muss korrekt sein
# - Firewall muss Port 7497 erlauben
```

### Zu langsame Updates

```bash
# Reduziere Scan-Intervall
monitor.start(onUpdate, 60000) // 1 Minute statt 5

# Oder erhöhe für weniger Last
monitor.start(onUpdate, 600000) // 10 Minuten
```

---

## 📊 Beispiel: Vollständiger Workflow

```typescript
import { IBStockMonitor, scanAllStocksFromIB } from '@/lib/ibMarketData'
import { filterAndScoreStocks } from '@/lib/filterLogic'

// 1. Erstelle Monitor
const monitor = new IBStockMonitor()

// 2. Definiere Update-Handler
const handleUpdate = (stocks: Stock[]) => {
  // 3. Wende Filter und Scoring an
  const { killed, survivors } = filterAndScoreStocks(stocks)

  console.log(`\n=== SCAN RESULTS ===`)
  console.log(`Total: ${stocks.length}`)
  console.log(`Killed: ${killed.length}`)
  console.log(`Survivors: ${survivors.length}`)

  // 4. Zeige Top-Kandidaten
  console.log(`\n=== TOP CANDIDATES ===`)
  survivors.slice(0, 5).forEach((stock) => {
    console.log(`${stock.emoji} ${stock.ticker}: ${stock.score}/10`)
    console.log(`  Price: $${stock.price.toFixed(2)}`)
    console.log(`  Gain: +${stock.dayGain.toFixed(2)}%`)
    console.log(`  Volume: ${(stock.volume / 1000000).toFixed(1)}M`)
  })

  // 5. Optional: Sende Benachrichtigung
  // sendAlert(survivors)
}

// 6. Starte Scanning
monitor.start(handleUpdate, 300000) // Alle 5 Minuten

// 7. Stoppe nach 1 Stunde
setTimeout(() => {
  monitor.stop()
  console.log('Scanning stopped')
}, 3600000)
```

---

## 🚀 Nächste Schritte

1. ✅ Installiere IB Gateway
2. ✅ Aktiviere API
3. ✅ Teste Verbindung mit `/api/ib/health`
4. ✅ Starte automatisches Scanning
5. ✅ Überwache Top-Kandidaten
6. ✅ Optional: Integriere Benachrichtigungen

---

## 📞 Support

Bei Problemen:

1. Überprüfe IB Gateway Logs
2. Stelle sicher, dass API aktiviert ist
3. Überprüfe Firewall-Einstellungen
4. Teste mit `curl http://localhost:3100/api/ib/health`

---

**Viel Erfolg mit echten Marktdaten! 📈**
