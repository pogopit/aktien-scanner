# 🖥️ Installation auf Synology NAS - Schritt für Schritt

Diese Anleitung führt dich durch die Installation des Day Trading Scanners auf deinem Synology NAS.

## 📋 Voraussetzungen

- ✅ Synology NAS (DS218+, DS920+, DS1821+ oder ähnlich)
- ✅ Docker-Paket installiert (über Package Center)
- ✅ SSH-Zugriff aktiviert (Systemsteuerung → Terminal & SNMP)
- ✅ Mindestens 2GB freier Speicher
- ✅ Port 3000 verfügbar (oder einen anderen Port wählen)

## 🚀 Installation - 5 Schritte

### Schritt 1: SSH-Verbindung zum NAS herstellen

**Windows (PowerShell):**
```powershell
ssh admin@192.168.1.XXX
```

**Mac/Linux (Terminal):**
```bash
ssh admin@192.168.1.XXX
```

Ersetze `192.168.1.XXX` mit der IP-Adresse deines NAS.

**Passwort eingeben:** Gib dein NAS-Admin-Passwort ein.

### Schritt 2: Projekt-Verzeichnis erstellen und Dateien kopieren

```bash
# Navigiere zu einem geeigneten Verzeichnis
cd /volume1/docker

# Erstelle ein neues Verzeichnis für den Scanner
mkdir -p day-trading-scanner
cd day-trading-scanner

# Kopiere alle Projektdateien hierher
# Option A: Mit Git (falls installiert)
git clone <repository-url> .

# Option B: Manuell hochladen
# Lade alle Dateien über SCP oder SFTP hoch
```

**Wichtige Dateien, die vorhanden sein müssen:**
```
day-trading-scanner/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── app/
├── components/
├── lib/
├── public/
└── .dockerignore
```

### Schritt 3: Docker Image bauen

```bash
# Stelle sicher, dass du im Projektverzeichnis bist
pwd  # Sollte /volume1/docker/day-trading-scanner zeigen

# Baue das Docker Image
docker build -t day-trading-scanner:latest .

# Das kann 5-10 Minuten dauern - Geduld!
# Du siehst Ausgaben wie:
# Step 1/15 : FROM node:20-alpine
# Step 2/15 : WORKDIR /app
# ...
# Successfully tagged day-trading-scanner:latest
```

**Überprüfe, ob das Image erstellt wurde:**
```bash
docker images | grep day-trading-scanner
```

Du solltest eine Zeile sehen:
```
day-trading-scanner   latest   abc123def456   2 minutes ago   450MB
```

### Schritt 4: Container mit docker-compose starten

```bash
# Stelle sicher, dass du im Projektverzeichnis bist
cd /volume1/docker/day-trading-scanner

# Starte den Container
docker-compose up -d

# Überprüfe den Status
docker-compose ps

# Du solltest sehen:
# NAME                    STATUS
# day-trading-scanner     Up 2 seconds
```

**Logs anschauen (um sicherzustellen, dass alles läuft):**
```bash
docker-compose logs -f

# Drücke Ctrl+C um die Logs zu beenden
```

### Schritt 5: Im Browser öffnen

Öffne deinen Browser und navigiere zu:
```
http://192.168.1.XXX:3000
```

Ersetze `192.168.1.XXX` mit der IP-Adresse deines NAS.

**Du solltest sehen:**
- ✅ "Day Trading Scanner" Titel
- ✅ Live-Zeit (aktualisiert sich jede Sekunde)
- ✅ Small Cap Gauge (90%)
- ✅ Tabelle mit 9 Aktien
- ✅ Alle Scan-Kriterien angezeigt

## 🔧 Häufige Probleme & Lösungen

### Problem 1: "docker: command not found"
**Lösung:** Docker ist nicht installiert oder nicht im PATH
```bash
# Überprüfe, ob Docker installiert ist
docker --version

# Falls nicht installiert:
# 1. Öffne Synology DSM
# 2. Gehe zu Package Center
# 3. Suche nach "Docker"
# 4. Installiere das Docker-Paket
# 5. Warte 2-3 Minuten
# 6. Versuche erneut
```

### Problem 2: "Port 3000 already in use"
**Lösung:** Ein anderer Service nutzt Port 3000

**Option A: Anderen Port verwenden**
```bash
# Bearbeite docker-compose.yml
nano docker-compose.yml

# Ändere diese Zeile:
# ports:
#   - "3000:3000"
# zu:
# ports:
#   - "8080:3000"

# Speichern: Ctrl+X, dann Y, dann Enter

# Starte neu
docker-compose down
docker-compose up -d

# Öffne dann: http://192.168.1.XXX:8080
```

**Option B: Finde den Prozess auf Port 3000**
```bash
# Finde den Prozess
lsof -i :3000

# Stoppe ihn (falls nötig)
kill -9 <PID>
```

### Problem 3: Container startet nicht
**Lösung:** Überprüfe die Logs
```bash
# Schaue die Fehler an
docker-compose logs day-trading-scanner

# Häufige Fehler:
# - "out of memory" → NAS hat nicht genug RAM
# - "permission denied" → Berechtigungsproblem
# - "build failed" → Fehler beim Image-Bau
```

### Problem 4: Website lädt nicht
**Lösung:** Überprüfe die Verbindung
```bash
# Überprüfe, ob der Container läuft
docker ps | grep day-trading-scanner

# Überprüfe die Logs
docker-compose logs -f

# Überprüfe die Netzwerk-Verbindung
docker network ls
docker inspect trading-network
```

## 📊 Verwaltung

### Container neu starten
```bash
docker-compose restart
```

### Container stoppen
```bash
docker-compose down
```

### Container löschen (und neu starten)
```bash
docker-compose down
docker-compose up -d
```

### Logs in Echtzeit anschauen
```bash
docker-compose logs -f
```

### Image aktualisieren (nach Code-Änderungen)
```bash
# Stoppe den Container
docker-compose down

# Baue das Image neu
docker build -t day-trading-scanner:latest .

# Starte den Container neu
docker-compose up -d
```

## 🔐 Sicherheit

### Firewall-Regel in Synology DSM

1. Öffne **Synology DSM**
2. Gehe zu **Sicherheit** → **Firewall**
3. Klicke auf **Bearbeiten Regeln**
4. Erstelle eine neue Regel:
   - **Protokoll:** TCP
   - **Port:** 3000 (oder dein gewählter Port)
   - **Aktion:** Erlauben
5. Klicke **OK**

### Reverse Proxy (Optional - für HTTPS)

Für sicheren Zugriff über HTTPS:

1. Öffne **Synology DSM**
2. Gehe zu **Systemsteuerung** → **Anwendungsportal**
3. Klicke auf **Reverse Proxy**
4. Erstelle eine neue Regel:
   - **Beschreibung:** Day Trading Scanner
   - **Protokoll:** HTTPS
   - **Hostname:** dein-nas.com (oder IP)
   - **Port:** 443
   - **Backend-Protokoll:** HTTP
   - **Backend-Hostname:** localhost
   - **Backend-Port:** 3000
5. Klicke **OK**

## 📈 Performance-Tipps

### RAM-Nutzung reduzieren
```bash
# Bearbeite docker-compose.yml
nano docker-compose.yml

# Füge diese Zeilen hinzu:
# environment:
#   - NODE_OPTIONS=--max-old-space-size=512

# Speichern und neu starten
docker-compose down
docker-compose up -d
```

### Automatisches Backup
```bash
# Erstelle ein Backup-Skript
cat > backup.sh << 'BACKUP'
#!/bin/bash
BACKUP_DIR="/volume1/backups/day-trading-scanner"
mkdir -p $BACKUP_DIR
docker-compose down
tar -czf $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz .
docker-compose up -d
BACKUP

# Mache das Skript ausführbar
chmod +x backup.sh

# Führe es aus
./backup.sh
```

## 🔄 Updates

### Website aktualisieren

```bash
# Navigiere zum Projektverzeichnis
cd /volume1/docker/day-trading-scanner

# Hole die neuesten Dateien
git pull origin main

# Baue das Image neu
docker build -t day-trading-scanner:latest .

# Starte den Container neu
docker-compose down
docker-compose up -d

# Überprüfe die Logs
docker-compose logs -f
```

## 📞 Support & Debugging

### Detaillierte Logs speichern
```bash
# Speichere Logs in eine Datei
docker-compose logs > logs.txt

# Überprüfe die Datei
cat logs.txt
```

### System-Informationen sammeln
```bash
# Docker-Version
docker --version

# Docker-Compose-Version
docker-compose --version

# Verfügbarer Speicher
df -h

# RAM-Nutzung
free -h

# Laufende Container
docker ps -a
```

### Netzwerk-Diagnose
```bash
# Überprüfe die Verbindung zum Container
docker exec day-trading-scanner wget -O- http://localhost:3000

# Überprüfe die Netzwerk-Konfiguration
docker network inspect trading-network
```

## ✅ Checkliste für erfolgreiche Installation

- [ ] Docker ist installiert und läuft
- [ ] Projektdateien sind im Verzeichnis `/volume1/docker/day-trading-scanner`
- [ ] Docker Image wurde erfolgreich gebaut
- [ ] Container läuft (`docker ps` zeigt den Container)
- [ ] Website ist unter `http://192.168.1.XXX:3000` erreichbar
- [ ] Alle 9 Aktien werden in der Tabelle angezeigt
- [ ] Small Cap Gauge zeigt 90%
- [ ] Live-Zeit aktualisiert sich jede Sekunde
- [ ] Sortierung funktioniert (klick auf Spalten-Header)

## 🎉 Glückwunsch!

Dein Day Trading Scanner läuft jetzt auf deinem Synology NAS! 

**Nächste Schritte:**
1. Integriere echte Marktdaten (siehe README.md)
2. Richte Benachrichtigungen ein
3. Erstelle ein Backup
4. Teile den Scanner mit deinem Team

---

**Viel Erfolg beim Day Trading! 📈**
