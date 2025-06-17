#!/bin/bash
# Script para configurar DuckDNS en la instancia EC2 frontend

echo "Actualizando repositorios e instalando cron y curl..."
sudo apt-get update
sudo apt-get install -y cron curl

echo "Creando directorio y script de DuckDNS..."
mkdir -p /home/ubuntu/duckdns
cat > /home/ubuntu/duckdns/duck.sh << 'EOF'
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=<DOMINIO>&token=<TOKEN>&ip=" | curl -k -o ~/duckdns/duck.log -K -
EOF


echo "Estableciendo permisos en el script..."
chmod 700 /home/ubuntu/duckdns/duck.sh


echo "Ejecutando script de DuckDNS..."
~/duckdns/duck.sh

echo "Resultado de la actualización:"
cat /home/ubuntu/duckdns/duck.log

echo "Configurando cron para actualizar cada 5 minutos..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/duckdns/duck.sh >/dev/null 2>&1") | crontab -

echo "Verificando que cron está configurado correctamente:"
crontab -l

echo "¡Configuración completa! DuckDNS actualizará la IP cada 5 minutos."
echo "Tu dominio: panaderiapp.duckdns.org"
echo "Puedes verificar el estado en ~/duckdns/duck.log"