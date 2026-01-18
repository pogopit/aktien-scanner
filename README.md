# Day Trading Scanner

Ein professioneller **Real-Time Day Trading Scanner** mit erweiterten Filterkriterien für Small-Cap Aktien. Die Website ist optimiert für die Installation auf einem **Synology NAS**.

## 🎯 Features

### Scan-Kriterien
- ✅ **Preis**: $1.00 - $20.00
- ✅ **Tagesanstieg**: Mindestens +10% (inkl. vorbörslich)
- ✅ **7-Tage-Konsolidierung**: Max ±10% Änderung
- ✅ **Relatives Volumen**: Mindestens 5x höher als Durchschnitt
- ✅ **Tagesvolumen**: Mindestens 100.000 Aktien

### Komponenten
- 📊 **Small Cap Gauge**: Visuelle Darstellung der Scan-Erfolgsquote
- 📈 **Top Gainers Tabelle**: Sortierbare Tabelle mit allen Metriken
- ⚙️ **Scan-Kriterien Display**: Übersicht aller aktiven Filter
- 🕐 **Live-Zeit**: Echtzeit-Uhr mit Datum
- 📱 **Responsive Design**: Optimiert für Desktop, Tablet und Mobile

## 🚀 Installation auf Synology NAS

### Voraussetzungen
- Synology NAS mit Docker-Unterstützung
- Docker-Paket installiert (über Package Center)
- Mindestens 2GB freier Speicher
- Port 3000 verfügbar (oder anpassen)

### Schritt 1: Projekt auf NAS kopieren

```bash
# SSH in dein NAS
ssh admin@192.168.1.XXX

# Navigiere zu einem geeigneten Verzeichnis
cd /volume1/docker

# Klone oder kopiere das Projekt
git clone <repository-url> day-trading-scanner
cd day-trading-scanner
```

### Schritt 2: Docker Image bauen

```bash
# Baue das Docker Image
docker build -t day-trading-scanner:latest .

# Überprüfe, ob das Image erstellt wurde
docker images | grep day-trading-scanner
```

### Schritt 3: Container starten mit docker-compose

```bash
# Starte den Container mit docker-compose
docker-compose up -d

# Überprüfe den Status
docker-compose ps

# Logs anschauen
docker-compose logs -f
```

### Schritt 4: Zugriff auf die Website

Öffne deinen Browser und navigiere zu:
```
http://192.168.1.XXX:3000
```

Ersetze `192.168.1.XXX` mit der IP-Adresse deines NAS.

## 🛠️ Manuelle Docker-Installation (Alternative)

Falls du docker-compose nicht verwenden möchtest:

```bash
# Image bauen
docker build -t day-trading-scanner:latest .

# Container starten
docker run -d \
  --name day-trading-scanner \
  -p 3000:3000 \
  --restart unless-stopped \
  day-trading-scanner:latest

# Status überprüfen
docker ps | grep day-trading-scanner

# Logs anschauen
docker logs -f day-trading-scanner
```

## 📋 Konfiguration

### Umgebungsvariablen

Erstelle eine `.env.local` Datei im Projektverzeichnis:

```bash
# .env.local
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://192.168.1.XXX:3000
```

### Port ändern

Um einen anderen Port zu verwenden, bearbeite `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Externe Port:Interne Port
```

Dann ist die Website unter `http://192.168.1.XXX:8080` erreichbar.

## 🔄 Datenintegration

### Aktuelle Implementierung
- Mock-Daten für Demo-Zwecke
- Alle Daten erfüllen die Scan-Kriterien
- API-Route vorbereitet für echte Daten

### Integration mit echten Marktdaten

Um echte Marktdaten zu integrieren, bearbeite `/lib/mockData.ts`:

```typescript
// Beispiel: Alpha Vantage API Integration
import axios from 'axios'

export async function fetchRealTimeData() {
  const response = await axios.get('https://www.alphavantage.co/query', {
    params: {
      function: 'QUOTE_ENDPOINT',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  })
  
  // Filtere Daten nach Scan-Kriterien
  return filterStocks(response.data, DEFAULT_CRITERIA)
}
```

**Unterstützte APIs:**
- Alpha Vantage (kostenlos, begrenzt)
- Finnhub (kostenlos, empfohlen)
- Polygon.io (kostenpflichtig, zuverlässig)
- IB API (Interactive Brokers)

## 📊 API Endpoints

### GET /api/scan
Gibt gefilterte Aktien basierend auf Scan-Kriterien zurück.

```bash
curl http://localhost:3000/api/scan
```

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "VERO",
      "price": 6.72,
      "dayGain": 369.93,
      "volume": 308900000,
      "avgVolume": 45000000,
      "relativeVolume": 6.86,
      "float": 1.9,
      "sevenDayChange": 8.5,
      "lastHOD": 7.2,
      "preMarketGain": 15.2,
      "timestamp": "2026-01-18T10:46:35Z"
    }
  ],
  "totalMatching": 10,
  "timestamp": "2026-01-18T10:46:35Z",
  "criteria": {
    "minPrice": 1.0,
    "maxPrice": 20.0,
    "minDayGain": 10,
    "maxSevenDayChange": 10,
    "minRelativeVolume": 5,
    "minDayVolume": 100000
  }
}
```

### POST /api/scan
Akzeptiert benutzerdefinierte Scan-Kriterien.

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "minPrice": 2.0,
    "maxPrice": 15.0,
    "minDayGain": 15,
    "maxSevenDayChange": 8,
    "minRelativeVolume": 6,
    "minDayVolume": 150000
  }'
```

## 🔧 Wartung

### Container neu starten
```bash
docker-compose restart
```

### Container stoppen
```bash
docker-compose down
```

### Logs anschauen
```bash
docker-compose logs -f day-trading-scanner
```

### Container aktualisieren
```bash
# Stoppe den Container
docker-compose down

# Baue das Image neu
docker build -t day-trading-scanner:latest .

# Starte den Container neu
docker-compose up -d
```

## 📁 Projektstruktur

```
day-trading-scanner/
├── app/
│   ├── api/
│   │   └── scan/
│   │       └── route.ts          # API-Endpunkte
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Hauptseite
│   └── globals.css               # Globale Styles
├── components/
│   ├── Header.tsx                # Header mit Live-Zeit
│   ├── GaugeChart.tsx            # Small Cap Gauge
│   ├── StocksTable.tsx           # Aktien-Tabelle
│   └── CriteriaDisplay.tsx       # Kriterien-Anzeige
├── lib/
│   ├── types.ts                  # TypeScript Typen
│   └── mockData.ts               # Mock-Daten & Filter
├── public/                       # Statische Assets
├── Dockerfile                    # Docker-Konfiguration
├── docker-compose.yml            # Docker Compose
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript Config
└── README.md                     # Diese Datei
```

## 🛡️ Sicherheit

### Best Practices
- ✅ Non-root User in Docker
- ✅ Health Checks aktiviert
- ✅ Umgebungsvariablen für Secrets
- ✅ CORS-Schutz vorbereitet
- ✅ Input-Validierung in APIs

### Firewall-Regeln (Synology)
1. Öffne Synology DSM
2. Gehe zu **Sicherheit** → **Firewall**
3. Erstelle eine Regel für Port 3000:
   - Protokoll: TCP
   - Port: 3000
   - Aktion: Erlauben

## 🐛 Troubleshooting

### Container startet nicht
```bash
# Logs anschauen
docker-compose logs day-trading-scanner

# Container manuell starten für Fehlerausgabe
docker run -it day-trading-scanner:latest
```

### Port bereits in Verwendung
```bash
# Finde den Prozess auf Port 3000
lsof -i :3000

# Oder ändere den Port in docker-compose.yml
```

### Keine Verbindung zum Container
```bash
# Überprüfe, ob Container läuft
docker ps

# Überprüfe die Netzwerk-Konfiguration
docker network ls
docker inspect trading-network
```

## 📈 Performance-Tipps

1. **Caching aktivieren**: Nutze Redis für häufig abgerufene Daten
2. **Datenbank**: Für größere Datenmengen PostgreSQL verwenden
3. **CDN**: Statische Assets über CDN servieren
4. **Monitoring**: Prometheus + Grafana für Überwachung

## 🔐 Produktions-Deployment

Für Produktions-Umgebungen:

1. **HTTPS aktivieren**: Reverse Proxy (Nginx) mit SSL
2. **Authentifizierung**: API-Keys für Zugriff
3. **Rate Limiting**: Schutz vor Abuse
4. **Backup**: Regelmäßige Backups der Daten
5. **Monitoring**: Uptime-Monitoring und Alerts

## 📝 Lizenz

MIT License - Frei verwendbar für private und kommerzielle Projekte

## 🤝 Support

Bei Fragen oder Problemen:
1. Überprüfe die Logs: `docker-compose logs -f`
2. Konsultiere die Troubleshooting-Sektion
3. Überprüfe die Docker-Dokumentation

## 🚀 Nächste Schritte

1. **Echte Marktdaten integrieren**: Verbinde mit einer Market Data API
2. **Datenbank hinzufügen**: Speichere historische Daten
3. **Benachrichtigungen**: Email/SMS-Alerts bei neuen Scans
4. **Dashboard erweitern**: Weitere Charts und Metriken
5. **Mobile App**: React Native App für unterwegs

---

**Viel Erfolg beim Day Trading! 📈**
