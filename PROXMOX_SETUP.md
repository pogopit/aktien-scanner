# 🖥️ Day Trading Scanner - Proxmox LXC Container Installation

Diese Anleitung zeigt dir, wie du den Day Trading Scanner in einem **Proxmox LXC Container** installierst.

## 📋 Voraussetzungen

- ✅ Proxmox VE installiert
- ✅ LXC Container erstellt (Ubuntu 22.04 LTS empfohlen)
- ✅ SSH-Zugriff zum Container
- ✅ Mindestens 2GB RAM
- ✅ Mindestens 10GB Speicher

---

## 🚀 Installation - 3 Schritte

### Schritt 1: LXC Container in Proxmox erstellen

1. Öffne **Proxmox Web Interface** (https://your-proxmox-ip:8006)
2. Gehe zu **Datacenter** → **Create CT**
3. Wähle folgende Einstellungen:
   - **Hostname:** day-trading-scanner
   - **OS:** Ubuntu 22.04 LTS
   - **Cores:** 2 (minimum)
   - **RAM:** 2GB (minimum)
   - **Storage:** 10GB (minimum)
4. Klicke **Create**
5. Warte, bis der Container erstellt ist

### Schritt 2: SSH zum Container verbinden

```bash
# Finde die Container ID
pct list

# SSH zum Container (ersetze 100 mit deiner Container ID)
pct enter 100

# Oder via SSH (wenn IP bekannt)
ssh root@container-ip
```

### Schritt 3: Installation Script ausführen

```bash
# Wechsle zum Home-Verzeichnis
cd ~

# Lade das Installation Script herunter
wget https://raw.githubusercontent.com/pogopit/aktien-scanner/main/PROXMOX_INSTALL.sh

# Mache es ausführbar
chmod +x PROXMOX_INSTALL.sh

# Führe das Script aus
bash PROXMOX_INSTALL.sh
```

Das Script wird automatisch:
- ✅ System aktualisieren
- ✅ Node.js 20 installieren
- ✅ Git installieren
- ✅ Repository klonen
- ✅ Dependencies installieren
- ✅ Next.js bauen
- ✅ Systemd Service erstellen
- ✅ Service starten

---

## ✅ Nach der Installation

### Website öffnen

Öffne deinen Browser und navigiere zu:
```
http://container-ip:3100
```

### Service verwalten

```bash
# Status überprüfen
systemctl status day-trading-scanner

# Service neu starten
systemctl restart day-trading-scanner

# Service stoppen
systemctl stop day-trading-scanner

# Service starten
systemctl start day-trading-scanner

# Logs anschauen
journalctl -u day-trading-scanner -f

# Letzte 50 Zeilen der Logs
journalctl -u day-trading-scanner -n 50
```

---

## 🔄 Updates durchführen

```bash
# SSH zum Container
ssh root@container-ip

# Navigiere zum Projektverzeichnis
cd /opt/day-trading-scanner

# Hole die neueste Version
git pull origin main

# Installiere Dependencies
npm install

# Baue die Anwendung neu
npm run build

# Starte den Service neu
systemctl restart day-trading-scanner

# Überprüfe den Status
systemctl status day-trading-scanner
```

---

## 🔧 Konfiguration

### Port ändern

Falls Port 3100 bereits verwendet wird:

```bash
# Bearbeite die Umgebungsvariablen
nano /etc/systemd/system/day-trading-scanner.service

# Ändere diese Zeile:
# Environment="NEXT_PUBLIC_APP_URL=http://localhost:3100"
# zu:
# Environment="NEXT_PUBLIC_APP_URL=http://localhost:3200"

# Speichern: Ctrl+X, dann Y, dann Enter

# Reload systemd
systemctl daemon-reload

# Starte den Service neu
systemctl restart day-trading-scanner
```

### Firewall-Regeln (falls aktiviert)

```bash
# Öffne Port 3100
ufw allow 3100/tcp

# Überprüfe die Regeln
ufw status
```

---

## 📊 Systemressourcen überwachen

```bash
# CPU und RAM Nutzung
top

# Speicherplatz
df -h

# Node.js Prozesse
ps aux | grep node

# Port-Nutzung
netstat -tlnp | grep 3100
```

---

## 🐛 Troubleshooting

### Service startet nicht

```bash
# Überprüfe die Logs
journalctl -u day-trading-scanner -n 100

# Überprüfe die Syntax der Service-Datei
systemctl status day-trading-scanner

# Versuche manuell zu starten
cd /opt/day-trading-scanner
npm start
```

### Port bereits in Verwendung

```bash
# Finde den Prozess auf Port 3100
lsof -i :3100

# Oder mit netstat
netstat -tlnp | grep 3100

# Stoppe den Prozess (ersetze PID)
kill -9 PID
```

### Nicht genug Speicher

```bash
# Überprüfe verfügbaren Speicher
free -h

# Überprüfe Festplattenplatz
df -h

# Lösche npm Cache
npm cache clean --force

# Lösche node_modules und installiere neu
rm -rf node_modules
npm install
```

### Git Pull funktioniert nicht

```bash
# Überprüfe Git Status
cd /opt/day-trading-scanner
git status

# Überprüfe Remote
git remote -v

# Versuche zu pullen
git pull origin main

# Falls Fehler: Stash lokale Änderungen
git stash
git pull origin main
```

---

## 📈 Performance-Tipps

### Node.js Memory Limit erhöhen

```bash
# Bearbeite die Service-Datei
nano /etc/systemd/system/day-trading-scanner.service

# Füge diese Zeile hinzu:
# Environment="NODE_OPTIONS=--max-old-space-size=1024"

# Reload und restart
systemctl daemon-reload
systemctl restart day-trading-scanner
```

### Automatische Backups

```bash
# Erstelle ein Backup-Script
cat > /opt/backup-scanner.sh << 'BACKUP'
#!/bin/bash
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR
cd /opt/day-trading-scanner
tar -czf $BACKUP_DIR/scanner-$(date +%Y%m%d-%H%M%S).tar.gz .
echo "Backup erstellt: $BACKUP_DIR/scanner-$(date +%Y%m%d-%H%M%S).tar.gz"
BACKUP

chmod +x /opt/backup-scanner.sh

# Füge zu Crontab hinzu (täglich um 2 Uhr)
crontab -e
# Füge diese Zeile hinzu:
# 0 2 * * * /opt/backup-scanner.sh
```

---

## 🔐 Sicherheit

### Firewall konfigurieren

```bash
# Installiere UFW (falls nicht vorhanden)
apt-get install -y ufw

# Aktiviere UFW
ufw enable

# Erlaube SSH
ufw allow 22/tcp

# Erlaube Port 3100
ufw allow 3100/tcp

# Überprüfe Regeln
ufw status
```

### SSL/HTTPS mit Reverse Proxy

Falls du HTTPS brauchst, verwende einen Reverse Proxy (z.B. Nginx):

```bash
# Installiere Nginx
apt-get install -y nginx

# Erstelle Nginx Config
cat > /etc/nginx/sites-available/day-trading-scanner << 'NGINX'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# Aktiviere die Config
ln -s /etc/nginx/sites-available/day-trading-scanner /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 📞 Support

Bei Problemen:

1. Überprüfe die Logs: `journalctl -u day-trading-scanner -f`
2. Überprüfe die Systemressourcen: `top`, `df -h`
3. Überprüfe die Netzwerk-Verbindung: `netstat -tlnp`
4. Konsultiere die Troubleshooting-Sektion oben

---

## 🎉 Glückwunsch!

Dein Day Trading Scanner läuft jetzt auf Proxmox! 🚀

**Nächste Schritte:**
1. Öffne die Website: http://container-ip:3100
2. Überprüfe die Funktionalität
3. Integriere echte Marktdaten (optional)
4. Richte Backups ein (empfohlen)

---

**Viel Erfolg beim Day Trading! 📈**
