# ⚡ Quick Start - Day Trading Scanner

## 🚀 Installation in 5 Minuten

### Voraussetzungen
- Synology NAS mit Docker
- SSH-Zugriff aktiviert
- Port 3000 verfügbar

### Installation

```bash
# 1. SSH zum NAS
ssh admin@192.168.1.XXX

# 2. Projekt-Verzeichnis
cd /volume1/docker
mkdir -p day-trading-scanner
cd day-trading-scanner

# 3. Dateien kopieren (via Git oder manuell)
git clone <repo-url> .

# 4. Docker Image bauen
docker build -t day-trading-scanner:latest .

# 5. Container starten
docker-compose up -d

# 6. Status überprüfen
docker-compose ps

# 7. Browser öffnen
# http://192.168.1.XXX:3000
```

---

## 🎯 Was du sehen wirst

✅ Live-Zeit (aktualisiert sich jede Sekunde)  
✅ Small Cap Gauge (90%)  
✅ 9 Aktien in der Tabelle  
✅ Alle Scan-Kriterien angezeigt  
✅ Sortierbar nach Spalten  

---

## 🔧 Häufige Befehle

```bash
# Container neu starten
docker-compose restart

# Container stoppen
docker-compose down

# Logs anschauen
docker-compose logs -f

# Container löschen und neu starten
docker-compose down
docker-compose up -d

# Image aktualisieren
docker build -t day-trading-scanner:latest .
docker-compose down
docker-compose up -d
```

---

## 🐛 Troubleshooting

**Port bereits in Verwendung?**
```bash
# Ändere den Port in docker-compose.yml
# ports:
#   - "8080:3000"  # Statt 3000:3000
```

**Container startet nicht?**
```bash
docker-compose logs day-trading-scanner
```

**Keine Verbindung?**
```bash
# Überprüfe Firewall in DSM
# Systemsteuerung → Sicherheit → Firewall
# Füge Port 3000 hinzu
```

---

## 📚 Weitere Dokumentation

- **README.md** - Vollständige Dokumentation
- **SYNOLOGY_INSTALLATION.md** - Detaillierte Anleitung
- **DEPLOYMENT_SUMMARY.md** - Übersicht

---

**Viel Erfolg! 🚀**
