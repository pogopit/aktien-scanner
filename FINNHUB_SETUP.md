# 🚀 Finnhub Market Data Integration Guide

Diese Anleitung zeigt dir, wie du den Day Trading Scanner mit **Finnhub** verbindest, um **echte Marktdaten in Echtzeit** zu nutzen.

## 📋 Voraussetzungen

- ✅ Finnhub Account (kostenlos)
- ✅ Finnhub API Key
- ✅ Day Trading Scanner installiert

---

## 🚀 Schritt 1: Finnhub Account erstellen und API Key besorgen

### 1. Gehe zu Finnhub

Navigiere zu: https://finnhub.io

### 2. Registriere dich (kostenlos)

- Klicke auf **Sign Up**
- Gib deine Email ein
- Bestätige deine Email
- Erstelle ein Passwort

### 3. Hole deinen API Key

1. Melde dich an
2. Gehe zu **Dashboard**
3. Kopiere deinen **API Key** (sieht aus wie: `c123abc456def789`)

---

## 🔧 Schritt 2: API Key in deiner Installation konfigurieren

### Auf Proxmox LXC:

```bash
# SSH zum Container
ssh root@container-ip

# Navigiere zum Projektverzeichnis
cd /opt/day-trading-scanner

# Bearbeite .env.local
nano .env.local

# Füge diese Zeile hinzu:
FINNHUB_API_KEY=your_api_key_here

# Speichern: Ctrl+X, dann Y, dann Enter

# Starte den Service neu
systemctl restart day-trading-scanner
```

### Auf Synology NAS (Docker):

```bash
# SSH zum NAS
ssh admin@192.168.1.XXX

# Navigiere zum Projektverzeichnis
cd /volume1/docker/aktien-scanner

# Bearbeite .env.local
nano .env.local

# Füge diese Zeile hinzu:
FINNHUB_API_KEY=your_api_key_here

# Speichern: Ctrl+X, dann Y, dann Enter

# Baue das Docker Image neu
docker build -t day-trading-scanner:latest .

# Starte den Container neu
docker-compose down
docker-compose up -d
```

---

## 📊 Schritt 3: Finnhub API testen

### Überprüfe die Verbindung

```bash
# Teste die Finnhub Verbindung
curl http://localhost:3100/api/finnhub/status

# Sollte zurückgeben:
# {
#   "connected": true,
#   "message": "Connected to Finnhub API",
#   "timestamp": "2026-01-19T23:03:08.000Z"
# }
```

### Hole eine einzelne Quote

```bash
# Hole Quote für AAPL
curl "http://localhost:3100/api/finnhub/quote?ticker=AAPL"

# Antwort:
# {
#   "ticker": "AAPL",
#   "companyName": "Apple Inc",
#   "exchange": "NASDAQ",
#   "price": 150.25,
#   "dayGain": 2.5,
#   "volume": 50000000,
#   ...
# }
```

---

## 🔄 Schritt 4: Automatisches Scanning starten

### Scan mit benutzerdefinierten Tickers

```bash
# Scanne eine Liste von Aktien
curl -X POST http://localhost:3100/api/finnhub/scan \
  -H "Content-Type: application/json" \
  -d '{
    "tickers": ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "META", "NFLX"]
  }'

# Antwort:
# {
#   "stocks": [
#     {
#       "ticker": "NVDA",
#       "companyName": "NVIDIA Corporation",
#       "exchange": "NASDAQ",
#       "price": 875.50,
#       "dayGain": 15.3,
#       ...
#     }
#   ],
#   "totalScanned": 8,
#   "totalMatching": 2,
#   "timestamp": "2026-01-19T23:03:08.000Z"
# }
```

---

## 🎯 API Endpoints

### GET /api/finnhub/status
Überprüft Finnhub API Verbindung

```bash
curl http://localhost:3100/api/finnhub/status
```

**Response:**
```json
{
  "connected": true,
  "message": "Connected to Finnhub API",
  "timestamp": "2026-01-19T23:03:08.000Z"
}
```

### GET /api/finnhub/quote?ticker=AAPL
Holt Quote für einzelne Aktie

```bash
curl "http://localhost:3100/api/finnhub/quote?ticker=AAPL"
```

**Response:**
```json
{
  "ticker": "AAPL",
  "companyName": "Apple Inc",
  "exchange": "NASDAQ",
  "price": 150.25,
  "dayGain": 2.5,
  "volume": 50000000,
  "avgVolume": 45000000,
  "relativeVolume": 1.11,
  "float": 15.5,
  "lastHOD": 151.50,
  "timestamp": "2026-01-19T23:03:08.000Z"
}
```

### POST /api/finnhub/scan
Scannt Stocks mit benutzerdefinierten Tickers

```bash
curl -X POST http://localhost:3100/api/finnhub/scan \
  -H "Content-Type: application/json" \
  -d '{"tickers": ["AAPL", "MSFT", "GOOGL"]}'
```

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "GOOGL",
      "companyName": "Alphabet Inc",
      "exchange": "NASDAQ",
      "price": 140.50,
      "dayGain": 12.3,
      ...
    }
  ],
  "totalScanned": 3,
  "totalMatching": 1,
  "timestamp": "2026-01-19T23:03:08.000Z"
}
```

---

## 📈 Finnhub Pricing & Limits

### Kostenlos (Free Tier)

- ✅ **60 API Calls/Minute** (1 pro Sekunde)
- ✅ **Real-time Quotes** (15 Minuten verzögert)
- ✅ **Company Profile**
- ✅ **Intraday Candles**
- ✅ **News**
- ✅ **Earnings Calendar**

### Premium (kostenpflichtig)

- ✅ **Unlimited API Calls**
- ✅ **Real-time Quotes** (keine Verzögerung)
- ✅ **Alle Features**
- 💰 **$99-$999/Monat**

---

## 🔧 Konfiguration

### Scan-Intervall ändern

In `lib/finnhubMarketData.ts`:

```typescript
// Standard: 5 Minuten (300000 ms)
monitor.start(tickers, onUpdate, 300000)

// Ändern zu 1 Minute:
monitor.start(tickers, onUpdate, 60000)

// Oder 10 Minuten:
monitor.start(tickers, onUpdate, 600000)
```

### Rate Limiting beachten

Finnhub Free Tier: **60 Calls/Minute**

Das Script wartet automatisch 1 Sekunde zwischen Requests:

```typescript
// Rate limiting: 1 Sekunde Verzögerung
await new Promise((resolve) => setTimeout(resolve, 1000))
```

---

## 🐛 Troubleshooting

### API Key nicht gesetzt

```bash
# Überprüfe .env.local
cat .env.local | grep FINNHUB_API_KEY

# Falls nicht vorhanden, füge hinzu:
echo "FINNHUB_API_KEY=your_key_here" >> .env.local

# Starte Service neu
systemctl restart day-trading-scanner
```

### Zu viele API Calls

```
Error: Rate limit exceeded
```

**Lösung:**
- Erhöhe die Verzögerung zwischen Requests
- Reduziere die Anzahl der gescannten Tickers
- Upgrade auf Premium Plan

### Keine Marktdaten

```bash
# Überprüfe die Verbindung
curl http://localhost:3100/api/finnhub/status

# Falls nicht verbunden:
# 1. Überprüfe API Key
# 2. Überprüfe Internet-Verbindung
# 3. Überprüfe Finnhub Status: https://status.finnhub.io
```

---

## 📊 Beispiel: Vollständiger Workflow

```typescript
import { FinnhubStockMonitor, scanStocksFromFinnhub } from '@/lib/finnhubMarketData'
import { filterAndScoreStocks } from '@/lib/filterLogic'

// 1. Definiere Tickers zum Scannen
const tickers = [
  'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX',
  'AMD', 'INTC', 'QCOM', 'AVGO', 'MRVL', 'LRCX', 'ASML'
]

// 2. Erstelle Monitor
const monitor = new FinnhubStockMonitor()

// 3. Definiere Update-Handler
const handleUpdate = async (stocks: Stock[]) => {
  // 4. Wende Filter und Scoring an
  const { killed, survivors } = filterAndScoreStocks(stocks)

  console.log(`\n=== FINNHUB SCAN RESULTS ===`)
  console.log(`Total Scanned: ${stocks.length}`)
  console.log(`Killed: ${killed.length}`)
  console.log(`Survivors: ${survivors.length}`)

  // 5. Zeige Top-Kandidaten
  console.log(`\n=== TOP CANDIDATES ===`)
  survivors.slice(0, 5).forEach((stock) => {
    console.log(`${stock.emoji} ${stock.ticker}: ${stock.score}/10`)
    console.log(`  Company: ${stock.companyName}`)
    console.log(`  Exchange: ${stock.exchange}`)
    console.log(`  Price: $${stock.price.toFixed(2)}`)
    console.log(`  Gain: +${stock.dayGain.toFixed(2)}%`)
    console.log(`  Volume: ${(stock.volume / 1000000).toFixed(1)}M`)
  })

  // 6. Optional: Sende Benachrichtigung
  // sendAlert(survivors)
}

// 7. Starte Scanning (alle 5 Minuten)
monitor.start(tickers, handleUpdate, 300000)

// 8. Stoppe nach 1 Stunde
setTimeout(() => {
  monitor.stop()
  console.log('Scanning stopped')
}, 3600000)
```

---

## 🚀 Nächste Schritte

1. ✅ Erstelle Finnhub Account
2. ✅ Kopiere API Key
3. ✅ Füge API Key zu .env.local hinzu
4. ✅ Starte Service neu
5. ✅ Teste Verbindung mit `/api/finnhub/status`
6. ✅ Starte Scanning mit benutzerdefinierten Tickers
7. ✅ Überwache Top-Kandidaten

---

## 📞 Support

Bei Problemen:

1. Überprüfe API Key in .env.local
2. Teste Verbindung: `curl http://localhost:3100/api/finnhub/status`
3. Überprüfe Finnhub Status: https://status.finnhub.io
4. Überprüfe Rate Limits (60 Calls/Minute)
5. Überprüfe Logs: `journalctl -u day-trading-scanner -f`

---

**Viel Erfolg mit echten Marktdaten von Finnhub! 📈**
