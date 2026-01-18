#!/bin/bash

###############################################################################
# Day Trading Scanner - Proxmox LXC Container Installation Script
# 
# This script installs the Day Trading Scanner in a Proxmox LXC container
# 
# Usage: bash PROXMOX_INSTALL.sh
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Day Trading Scanner - Proxmox LXC Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Install Node.js and npm
echo -e "${YELLOW}[2/8] Installing Node.js and npm...${NC}"
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}npm version: $(npm --version)${NC}"

# Install Git
echo -e "${YELLOW}[3/8] Installing Git...${NC}"
apt-get install -y git

# Create application directory
echo -e "${YELLOW}[4/8] Creating application directory...${NC}"
APP_DIR="/opt/day-trading-scanner"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
echo -e "${YELLOW}[5/8] Cloning repository from GitHub...${NC}"
git clone https://github.com/pogopit/aktien-scanner.git .

# Install dependencies
echo -e "${YELLOW}[6/8] Installing Node.js dependencies...${NC}"
npm install

# Build Next.js application
echo -e "${YELLOW}[7/8] Building Next.js application...${NC}"
npm run build

# Create systemd service file
echo -e "${YELLOW}[8/8] Creating systemd service...${NC}"
cat > /etc/systemd/system/day-trading-scanner.service << 'SYSTEMD'
[Unit]
Description=Day Trading Scanner
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/day-trading-scanner
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_APP_URL=http://localhost:3100"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SYSTEMD

# Enable and start service
systemctl daemon-reload
systemctl enable day-trading-scanner
systemctl start day-trading-scanner

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}✅ Day Trading Scanner is now running!${NC}"
echo ""
echo -e "${YELLOW}Access the application at:${NC}"
echo -e "${GREEN}http://localhost:3100${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${GREEN}systemctl status day-trading-scanner${NC}     - Check status"
echo -e "  ${GREEN}systemctl restart day-trading-scanner${NC}    - Restart service"
echo -e "  ${GREEN}systemctl stop day-trading-scanner${NC}       - Stop service"
echo -e "  ${GREEN}journalctl -u day-trading-scanner -f${NC}    - View logs"
echo ""
echo -e "${YELLOW}Update the application:${NC}"
echo -e "  ${GREEN}cd /opt/day-trading-scanner${NC}"
echo -e "  ${GREEN}git pull origin main${NC}"
echo -e "  ${GREEN}npm install${NC}"
echo -e "  ${GREEN}npm run build${NC}"
echo -e "  ${GREEN}systemctl restart day-trading-scanner${NC}"
echo ""
